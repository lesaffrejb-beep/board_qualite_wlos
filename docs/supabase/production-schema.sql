-- ============================================
-- SLOW VILLAGE QUALITÉ - SCHEMA PRODUCTION V2
-- Base de données complète pour gestion d'audits qualité
-- Date: Janvier 2026
-- ============================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_cron";

-- ============================================
-- TABLES PRINCIPALES
-- ============================================

-- Sites (11 campings Slow Village)
CREATE TABLE IF NOT EXISTS sites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nom VARCHAR(100) NOT NULL,
    code VARCHAR(20) UNIQUE NOT NULL,
    region VARCHAR(50),
    directeur_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    date_ouverture DATE,
    date_fermeture DATE,
    statut VARCHAR(20) DEFAULT 'actif' CHECK (statut IN ('actif', 'fermeture', 'travaux')),
    score_conformite DECIMAL(5,2) DEFAULT 0,
    nb_bloquants INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Thèmes d'audit (8 thèmes fixes)
CREATE TABLE IF NOT EXISTS themes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(3) UNIQUE NOT NULL,
    nom VARCHAR(100) NOT NULL,
    description TEXT,
    ordre_affichage INTEGER DEFAULT 0,
    couleur VARCHAR(7) DEFAULT '#0077C8'
);

-- Sous-thèmes
CREATE TABLE IF NOT EXISTS sous_themes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    theme_id UUID REFERENCES themes(id) ON DELETE CASCADE,
    nom VARCHAR(200) NOT NULL,
    lot VARCHAR(100),
    ordre_affichage INTEGER DEFAULT 0
);

-- Critères de qualité (1,553 critères)
CREATE TABLE IF NOT EXISTS criteres (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(20) UNIQUE NOT NULL,
    sous_theme_id UUID REFERENCES sous_themes(id) ON DELETE SET NULL,
    texte TEXT NOT NULL,
    priorite VARCHAR(2) NOT NULL CHECK (priorite IN ('P0', 'P1', 'P2', 'P3')),
    obligatoire BOOLEAN DEFAULT FALSE,
    poids DECIMAL(3,2) DEFAULT 1.00,
    preuve_photo BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audits (instances d'audit)
CREATE TABLE IF NOT EXISTS audits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_id UUID REFERENCES sites(id) ON DELETE CASCADE,
    auditeur_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    periode_debut DATE NOT NULL,
    periode_fin DATE,
    statut VARCHAR(20) DEFAULT 'en_cours' CHECK (statut IN ('brouillon', 'en_cours', 'valide', 'cloture')),
    score_total DECIMAL(5,2),
    score_max DECIMAL(5,2),
    taux_conformite DECIMAL(5,2),
    nb_bloquants INTEGER DEFAULT 0,
    commentaire_general TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Réponses aux critères (cœur du système)
CREATE TABLE IF NOT EXISTS audit_reponses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    audit_id UUID REFERENCES audits(id) ON DELETE CASCADE,
    critere_id UUID REFERENCES criteres(id) ON DELETE CASCADE,
    
    -- Statut
    statut VARCHAR(20) NOT NULL CHECK (statut IN ('conforme', 'non_conforme', 'en_cours', 'na')),
    
    -- Scoring
    score_obtenu DECIMAL(4,1) DEFAULT 0,
    score_possible DECIMAL(4,1) DEFAULT 0,
    
    -- Métadonnées
    commentaire TEXT,
    photos TEXT[] DEFAULT '{}',
    
    -- Traçabilité
    saisi_par UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    saisi_le TIMESTAMPTZ DEFAULT NOW(),
    modifie_par UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    modifie_le TIMESTAMPTZ,
    
    -- Contrainte unique: un critère par audit
    UNIQUE(audit_id, critere_id)
);

-- Actions correctives (pour non-conformités)
CREATE TABLE IF NOT EXISTS actions_correctives (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reponse_id UUID REFERENCES audit_reponses(id) ON DELETE CASCADE,
    
    description TEXT NOT NULL,
    priorite VARCHAR(10) DEFAULT 'normale' CHECK (priorite IN ('urgente', 'haute', 'normale', 'basse')),
    
    assigne_a UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    date_echeance DATE,
    
    statut VARCHAR(20) DEFAULT 'a_faire' CHECK (statut IN ('a_faire', 'en_cours', 'faite', 'validee')),
    
    preuve_photo TEXT,
    faite_par UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    faite_le TIMESTAMPTZ,
    
    validee_par UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    validee_le TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications temps réel
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    titre VARCHAR(200) NOT NULL,
    message TEXT,
    data JSONB DEFAULT '{}',
    lue BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEX POUR PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS idx_reponses_audit ON audit_reponses(audit_id);
CREATE INDEX IF NOT EXISTS idx_reponses_critere ON audit_reponses(critere_id);
CREATE INDEX IF NOT EXISTS idx_reponses_statut ON audit_reponses(statut);
CREATE INDEX IF NOT EXISTS idx_audits_site ON audits(site_id);
CREATE INDEX IF NOT EXISTS idx_audits_statut ON audits(statut);
CREATE INDEX IF NOT EXISTS idx_audits_periode ON audits(periode_debut);
CREATE INDEX IF NOT EXISTS idx_actions_assigne ON actions_correctives(assigne_a);
CREATE INDEX IF NOT EXISTS idx_actions_statut ON actions_correctives(statut);
CREATE INDEX IF NOT EXISTS idx_actions_echeance ON actions_correctives(date_echeance);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, lue);

-- ============================================
-- TRIGGERS
-- ============================================

-- Trigger auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_sites_updated_at
    BEFORE UPDATE ON sites
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_audits_updated_at
    BEFORE UPDATE ON audits
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger pour recalculer le score du site après modification de réponse
CREATE OR REPLACE FUNCTION calculate_site_score()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE sites s
    SET 
        score_conformite = (
            SELECT COALESCE(AVG(
                CASE 
                    WHEN ar.statut = 'conforme' THEN 100
                    WHEN ar.statut = 'non_conforme' THEN 0
                    WHEN ar.statut = 'en_cours' THEN 50
                    ELSE NULL
                END
            ), 0)
            FROM audits a
            JOIN audit_reponses ar ON ar.audit_id = a.id
            WHERE a.site_id = s.id
                AND a.statut = 'valide'
        ),
        nb_bloquants = (
            SELECT COUNT(*)
            FROM audits a
            JOIN audit_reponses ar ON ar.audit_id = a.id
            JOIN criteres c ON c.id = ar.critere_id
            WHERE a.site_id = s.id
                AND a.statut = 'valide'
                AND ar.statut = 'non_conforme'
                AND c.priorite = 'P0'
        )
    WHERE s.id = (
        SELECT a.site_id 
        FROM audits a 
        WHERE a.id = NEW.audit_id
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_calculate_site_score
    AFTER INSERT OR UPDATE ON audit_reponses
    FOR EACH ROW
    EXECUTE FUNCTION calculate_site_score();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_reponses ENABLE ROW LEVEL SECURITY;
ALTER TABLE actions_correctives ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Politique: CEO voit tout
CREATE POLICY ceo_all_sites ON sites
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE id = auth.uid()
            AND raw_user_meta_data->>'role' = 'ceo'
        )
    );

CREATE POLICY ceo_all_audits ON audits
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE id = auth.uid()
            AND raw_user_meta_data->>'role' = 'ceo'
        )
    );

-- Politique: Directeur ne voit que son site
CREATE POLICY director_own_site ON sites
    FOR ALL TO authenticated
    USING (
        directeur_id = auth.uid()
        OR
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE id = auth.uid()
            AND raw_user_meta_data->>'role' = 'directeur'
            AND raw_user_meta_data->>'site_id' = sites.id::text
        )
    );

CREATE POLICY director_own_audits ON audits
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM sites s
            WHERE s.id = audits.site_id
            AND (
                s.directeur_id = auth.uid()
                OR
                EXISTS (
                    SELECT 1 FROM auth.users
                    WHERE id = auth.uid()
                    AND raw_user_meta_data->>'site_id' = s.id::text
                )
            )
        )
    );

-- Politique: Qualité voit tout en lecture
CREATE POLICY qualite_read_all_sites ON sites
    FOR SELECT TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE id = auth.uid()
            AND raw_user_meta_data->>'role' = 'qualite'
        )
    );

CREATE POLICY qualite_read_all_audits ON audits
    FOR SELECT TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE id = auth.uid()
            AND raw_user_meta_data->>'role' = 'qualite'
        )
    );

-- Politiques pour audit_reponses (héritage des audits)
CREATE POLICY audit_reponses_policy ON audit_reponses
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM audits a
            WHERE a.id = audit_reponses.audit_id
        )
    );

-- Politiques pour actions_correctives
CREATE POLICY actions_policy ON actions_correctives
    FOR ALL TO authenticated
    USING (
        assigne_a = auth.uid()
        OR
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE id = auth.uid()
            AND raw_user_meta_data->>'role' IN ('ceo', 'qualite')
        )
    );

-- Politiques pour notifications
CREATE POLICY notifications_policy ON notifications
    FOR ALL TO authenticated
    USING (user_id = auth.uid());

-- ============================================
-- POLICIES PUBLIQUES (tables de référence)
-- ============================================

-- Permettre à tous les authenticated de lire les tables de référence
ALTER TABLE themes ENABLE ROW LEVEL SECURITY;
ALTER TABLE sous_themes ENABLE ROW LEVEL SECURITY;
ALTER TABLE criteres ENABLE ROW LEVEL SECURITY;

CREATE POLICY themes_read ON themes FOR SELECT TO authenticated USING (true);
CREATE POLICY sous_themes_read ON sous_themes FOR SELECT TO authenticated USING (true);
CREATE POLICY criteres_read ON criteres FOR SELECT TO authenticated USING (true);

-- ============================================
-- VUES MATÉRIALISÉES (Performance)
-- ============================================

CREATE MATERIALIZED VIEW IF NOT EXISTS mv_scores_sites AS
SELECT 
    s.id as site_id,
    s.nom as site_nom,
    a.id as audit_id,
    a.periode_debut,
    a.taux_conformite,
    a.nb_bloquants,
    COUNT(CASE WHEN ar.statut = 'non_conforme' AND c.priorite = 'P1' THEN 1 END) as p1_nc,
    COUNT(CASE WHEN ar.statut = 'non_conforme' AND c.priorite = 'P2' THEN 1 END) as p2_nc,
    COUNT(CASE WHEN ar.statut = 'en_cours' THEN 1 END) as en_cours,
    NOW() as calcule_le
FROM sites s
LEFT JOIN audits a ON a.site_id = s.id AND a.statut = 'valide'
LEFT JOIN audit_reponses ar ON ar.audit_id = a.id
LEFT JOIN criteres c ON c.id = ar.critere_id
GROUP BY s.id, s.nom, a.id, a.periode_debut, a.taux_conformite, a.nb_bloquants;

CREATE UNIQUE INDEX ON mv_scores_sites (site_id, audit_id);

-- Rafraîchissement automatique toutes les 5 minutes (si pg_cron disponible)
-- SELECT cron.schedule('refresh-scores', '*/5 * * * *', 
--     'REFRESH MATERIALIZED VIEW CONCURRENTLY mv_scores_sites');

-- ============================================
-- SEED DATA - Thèmes (8 thèmes Slow Village)
-- ============================================

INSERT INTO themes (code, nom, couleur, ordre_affichage) VALUES
    ('AFF', 'Affichage & Communication', '#2196F3', 1),
    ('EXP', 'Expérience Client', '#4CAF50', 2),
    ('IMA', 'Image &  Esthétique', '#9C27B0', 3),
    ('QUA', 'Qualité & Propreté', '#FF9800', 4),
    ('RES', 'Résidents & Propriétaires', '#00BCD4', 5),
    ('RH', 'Ressources Humaines', '#E91E63', 6),
    ('SEC', 'Sécurité & Réglementation', '#F44336', 7),
    ('SLO', 'Slow Village Identité', '#795548', 8)
ON CONFLICT (code) DO NOTHING;

-- Enable Realtime (Supabase)
ALTER PUBLICATION supabase_realtime ADD TABLE audit_reponses;
ALTER PUBLICATION supabase_realtime ADD TABLE audits;
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;

-- ============================================
-- FIN DU SCHÉMA
-- ============================================
