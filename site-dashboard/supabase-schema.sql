-- =====================================================
-- SLOW VILLAGE - Schéma Supabase
-- Audit Qualité - Base de données
-- =====================================================

-- Activer RLS (Row Level Security) sur toutes les tables
ALTER DATABASE postgres SET "app.settings.jwt_secret" TO 'your-jwt-secret';

-- =====================================================
-- 1. TABLE: SITES
-- Les 11 campings Slow Village
-- =====================================================
CREATE TABLE IF NOT EXISTS sites (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL UNIQUE,
    code VARCHAR(10) UNIQUE, -- Code court pour référence
    region VARCHAR(50),
    password_hash VARCHAR(255) DEFAULT '$2a$10$YourHashedPasswordHere', -- 'admin' par défaut
    actif BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Commentaire
COMMENT ON TABLE sites IS 'Les 11 sites Slow Village audités';

-- Insertion des 11 sites avec données historiques Excel
INSERT INTO sites (id, nom, code, region) VALUES
    (1, 'L''Orée de l''Océan', 'ORE', 'Landes'),
    (2, 'Anduze', 'AND', 'Gard'),
    (3, 'Séveilles', 'SEV', 'Dordogne'),
    (4, 'Saint Martin de Ré 2026', 'SMR26', 'Île de Ré'),
    (5, 'La Roque sur Cèze', 'ROC', 'Gard'),
    (6, 'Saint Cybranet', 'CYB', 'Dordogne'),
    (7, 'Saint Martin de Ré', 'SMR', 'Île de Ré'),
    (8, 'Biscarrosse Lac', 'BIS', 'Landes'),
    (9, 'Marennes Oléron', 'MAR', 'Charente-Maritime'),
    (10, 'Pornic 2026', 'POR26', 'Loire-Atlantique'),
    (11, 'Les Ponts de Cé', 'PDE', 'Maine-et-Loire')
ON CONFLICT (id) DO UPDATE SET
    nom = EXCLUDED.nom,
    code = EXCLUDED.code,
    region = EXCLUDED.region;

-- =====================================================
-- 2. TABLE: THEMES
-- Les 8 thèmes d'audit
-- =====================================================
CREATE TABLE IF NOT EXISTS themes (
    id SERIAL PRIMARY KEY,
    code VARCHAR(3) UNIQUE NOT NULL,
    nom VARCHAR(100) NOT NULL,
    description TEXT,
    ordre_affichage INTEGER DEFAULT 0,
    poids_total INTEGER DEFAULT 0
);

INSERT INTO themes (code, nom, description, ordre_affichage) VALUES
    ('SEC', 'Sécurité', 'Sécurité incendie, ERP, sécurité client', 1),
    ('AFF', 'Affichage & Communication', 'Signalétique, affichage légal, communication', 2),
    ('EXP', 'Expérience Client', 'Accueil, service, relation client', 3),
    ('QUA', 'Qualité Opérationnelle', 'Propreté, maintenance, process', 4),
    ('IMA', 'Image & Marque', 'Identité visuelle, décoration, présentation', 5),
    ('RH', 'Ressources Humaines', 'Gestion équipe, formation, bien-être', 6),
    ('RES', 'Responsabilité Environnementale', 'Eco-gestion, tri, développement durable', 7),
    ('SLO', 'Slow Village Spirit', 'Philosophie, valeurs, expérience slow', 8)
ON CONFLICT (code) DO NOTHING;

-- =====================================================
-- 3. TABLE: CRITERES
-- Tous les critères d'audit par thème
-- =====================================================
CREATE TABLE IF NOT EXISTS criteres (
    id SERIAL PRIMARY KEY,
    code VARCHAR(20) UNIQUE NOT NULL,
    theme_code VARCHAR(3) REFERENCES themes(code),
    texte TEXT NOT NULL,
    priorite VARCHAR(2) CHECK (priorite IN ('P0', 'P1', 'P2', 'P3')),
    poids INTEGER DEFAULT 1,
    est_bloquant BOOLEAN DEFAULT false,
    ordre INTEGER DEFAULT 0,
    actif BOOLEAN DEFAULT true
);

-- Index pour recherche rapide
CREATE INDEX IF NOT EXISTS idx_criteres_theme ON criteres(theme_code);
CREATE INDEX IF NOT EXISTS idx_criteres_priorite ON criteres(priorite);

-- =====================================================
-- 4. TABLE: AUDITS
-- En-tête des audits (une ligne par site par période)
-- =====================================================
CREATE TABLE IF NOT EXISTS audits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    site_id INTEGER REFERENCES sites(id),
    periode VARCHAR(20) NOT NULL, -- ex: '2026-01', '2026-Q1'
    date_debut DATE DEFAULT CURRENT_DATE,
    date_fin DATE,
    statut VARCHAR(20) DEFAULT 'en_cours' CHECK (statut IN ('brouillon', 'en_cours', 'termine', 'valide')),
    
    -- Statistiques calculées
    taux_conformite_brut DECIMAL(5,2) DEFAULT 0,
    taux_conformite_pondere DECIMAL(5,2) DEFAULT 0,
    nb_criteres_total INTEGER DEFAULT 0,
    nb_conformes INTEGER DEFAULT 0,
    nb_non_conformes INTEGER DEFAULT 0,
    nb_en_cours INTEGER DEFAULT 0,
    nb_na INTEGER DEFAULT 0,
    nb_bloquants INTEGER DEFAULT 0,
    
    -- Métadonnées
    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Contrainte unique: un seul audit par site par période
    UNIQUE(site_id, periode)
);

CREATE INDEX IF NOT EXISTS idx_audits_site ON audits(site_id);
CREATE INDEX IF NOT EXISTS idx_audits_periode ON audits(periode);
CREATE INDEX IF NOT EXISTS idx_audits_statut ON audits(statut);

-- =====================================================
-- 5. TABLE: AUDIT_DETAILS
-- Réponses aux critères (ligne par ligne)
-- =====================================================
CREATE TABLE IF NOT EXISTS audit_details (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    audit_id UUID REFERENCES audits(id) ON DELETE CASCADE,
    critere_id INTEGER REFERENCES criteres(id),
    
    -- Réponse
    statut VARCHAR(10) CHECK (statut IN ('C', 'NC', 'EC', 'NA')), -- Conforme, Non Conforme, En Cours, N/A
    commentaire TEXT,
    photo_url TEXT,
    
    -- Historique
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by VARCHAR(100),
    
    -- Contrainte unique: un seul statut par critère par audit
    UNIQUE(audit_id, critere_id)
);

CREATE INDEX IF NOT EXISTS idx_audit_details_audit ON audit_details(audit_id);
CREATE INDEX IF NOT EXISTS idx_audit_details_critere ON audit_details(critere_id);
CREATE INDEX IF NOT EXISTS idx_audit_details_statut ON audit_details(statut);

-- =====================================================
-- 6. TABLE: HISTORIQUE_SCORES
-- Évolution des scores dans le temps
-- =====================================================
CREATE TABLE IF NOT EXISTS historique_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    site_id INTEGER REFERENCES sites(id),
    periode VARCHAR(20) NOT NULL,
    
    -- Scores globaux (issus des Excel historiques)
    taux_conformite_brut DECIMAL(5,2),
    taux_conformite_pondere DECIMAL(5,2),
    taux_nc DECIMAL(5,2),
    indice_risque DECIMAL(5,2),
    score_maturite DECIMAL(5,2),
    coefficient_dispersion DECIMAL(5,3),
    nb_bloquants INTEGER DEFAULT 0,
    p1_non_conformes INTEGER DEFAULT 0,
    score_global DECIMAL(5,2),
    rang INTEGER,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(site_id, periode)
);

CREATE INDEX IF NOT EXISTS idx_historique_site ON historique_scores(site_id);
CREATE INDEX IF NOT EXISTS idx_historique_periode ON historique_scores(periode);

-- Insertion des données historiques des Excel (janvier 2026)
INSERT INTO historique_scores (site_id, periode, taux_conformite_brut, taux_conformite_pondere, 
    taux_nc, indice_risque, score_maturite, coefficient_dispersion, nb_bloquants, 
    p1_non_conformes, score_global, rang) VALUES
    (1, '2026-01', 8.69, 72.57, 20.93, 84.03, 40.1, 0.173, 15, 38, 52.52, 1),
    (2, '2026-01', 15.78, 66.19, 24.4, 92.5, 44.02, 0.502, 15, 34, 46.16, 2),
    (3, '2026-01', 30.33, 30.11, 9.21, 32.99, 58.85, 0.85, 29, 13, 44.6, 3),
    (4, '2026-01', 3.09, 60.8, 21.7, 85.0, 38.39, 0.465, 33, 21, 44.19, 4),
    (5, '2026-01', 13.01, 56.87, 19.06, 71.53, 45.04, 0.818, 20, 27, 43.77, 5),
    (6, '2026-01', 5.47, 89.37, 35.74, 132.99, 33.41, 0.59, 3, 39, 43.27, 6),
    (7, '2026-01', 1.55, 54.87, 19.7, 78.82, 38.8, 0.489, 33, 23, 42.93, 7),
    (8, '2026-01', 6.12, 37.0, 13.91, 61.53, 44.78, 0.528, 24, 33, 40.65, 8),
    (9, '2026-01', 3.03, 27.62, 8.89, 37.22, 45.71, 0.843, 13, 25, 38.89, 9),
    (10, '2026-01', 1.16, 27.58, 10.95, 43.75, 43.84, 0.798, 30, 13, 37.45, 10),
    (11, '2026-01', 1.74, 14.86, 5.28, 29.86, 47.22, 1.043, 35, 12, 34.14, 11)
ON CONFLICT (site_id, periode) DO UPDATE SET
    taux_conformite_brut = EXCLUDED.taux_conformite_brut,
    taux_conformite_pondere = EXCLUDED.taux_conformite_pondere,
    score_global = EXCLUDED.score_global,
    rang = EXCLUDED.rang;

-- =====================================================
-- 7. TABLE: RISQUES_IDENTIFIES
-- Points critiques transversaux
-- =====================================================
CREATE TABLE IF NOT EXISTS risques_identifies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(20) NOT NULL,
    theme_code VARCHAR(3) REFERENCES themes(code),
    priorite VARCHAR(2) CHECK (priorite IN ('P0', 'P1', 'P2', 'P3')),
    description TEXT NOT NULL,
    nb_sites_concernes INTEGER DEFAULT 0,
    sites_concernes INTEGER[], -- Array de site_id
    periode VARCHAR(20),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_risques_periode ON risques_identifies(periode);
CREATE INDEX IF NOT EXISTS idx_risques_priorite ON risques_identifies(priorite);

-- =====================================================
-- RLS (Row Level Security) - Sécurité
-- =====================================================

-- Activer RLS sur toutes les tables
ALTER TABLE sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE historique_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE risques_identifies ENABLE ROW LEVEL SECURITY;

-- Politique: tout le monde peut lire les sites
CREATE POLICY "Sites visibles par tous" ON sites
    FOR SELECT USING (true);

-- Politique: tout le monde peut lire l'historique
CREATE POLICY "Historique visible par tous" ON historique_scores
    FOR SELECT USING (true);

-- Politique: les audits sont visibles par tous mais modifiables uniquement via auth
CREATE POLICY "Audits lisibles par tous" ON audits
    FOR SELECT USING (true);

CREATE POLICY "Audits modifiables par auth" ON audits
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Audit details lisibles par tous" ON audit_details
    FOR SELECT USING (true);

CREATE POLICY "Audit details modifiables par auth" ON audit_details
    FOR ALL USING (true) WITH CHECK (true);

-- =====================================================
-- FONCTIONS & TRIGGERS
-- =====================================================

-- Fonction: mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger sur audits
DROP TRIGGER IF EXISTS update_audits_updated_at ON audits;
CREATE TRIGGER update_audits_updated_at
    BEFORE UPDATE ON audits
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger sur audit_details
DROP TRIGGER IF EXISTS update_audit_details_updated_at ON audit_details;
CREATE TRIGGER update_audit_details_updated_at
    BEFORE UPDATE ON audit_details
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- VUES POUR LE DASHBOARD
-- =====================================================

-- Vue: Synthèse globale par période
CREATE OR REPLACE VIEW vue_synthese_globale AS
SELECT 
    periode,
    COUNT(DISTINCT site_id) as nb_sites,
    ROUND(AVG(taux_conformite_pondere), 2) as conformite_moyenne,
    ROUND(AVG(score_global), 2) as score_moyen,
    SUM(nb_bloquants) as total_bloquants,
    SUM(p1_non_conformes) as total_p1_nc
FROM historique_scores
GROUP BY periode
ORDER BY periode DESC;

-- Vue: Classement des sites par période
CREATE OR REPLACE VIEW vue_classement AS
SELECT 
    s.nom as site_nom,
    h.periode,
    h.score_global,
    h.rang,
    h.taux_conformite_pondere,
    h.nb_bloquants,
    RANK() OVER (PARTITION BY h.periode ORDER BY h.score_global DESC) as rang_calcule
FROM historique_scores h
JOIN sites s ON s.id = h.site_id
ORDER BY h.periode DESC, h.rang ASC;

-- Vue: Matrice de risque
CREATE OR REPLACE VIEW vue_matrice_risque AS
SELECT 
    ad.statut,
    c.priorite,
    COUNT(*) as nb_criteres
FROM audit_details ad
JOIN criteres c ON c.id = ad.critere_id
GROUP BY ad.statut, c.priorite;

-- =====================================================
-- COMMENTAIRES
-- =====================================================

COMMENT ON TABLE audits IS 'En-tête des audits qualité par site et période';
COMMENT ON TABLE audit_details IS 'Détail des réponses aux critères';
COMMENT ON TABLE historique_scores IS 'Historique des scores pour suivi évolutif';
COMMENT ON TABLE risques_identifies IS 'Risques transversaux identifiés';

-- =====================================================
-- PERMISSIONS
-- =====================================================

-- Donner les droits à l'utilisateur anon (pour l'API)
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;

GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO authenticated;

GRANT INSERT, UPDATE, DELETE ON audits TO authenticated;
GRANT INSERT, UPDATE, DELETE ON audit_details TO authenticated;

-- Séquences
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;
