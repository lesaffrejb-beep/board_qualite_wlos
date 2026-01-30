-- ============================================
-- SCRIPT DE NETTOYAGE ET D'INSTALLATION COMPLET
-- SLOW VILLAGE QUALITÉ V2
-- À COPIER-COLLER DANS SUPABASE SQL EDITOR
-- ============================================

-- ⚠️ ATTENTION : CE SCRIPT SUPPRIME ET RECRÉE TOUTES LES TABLES DE L'APP
-- FAITES UN BACKUP SI NÉCESSAIRE AVANT D'EXÉCUTER

BEGIN;

-- 1. Nettoyage (Drop old tables)
DROP TABLE IF EXISTS "notifications" CASCADE;
DROP TABLE IF EXISTS "actions_correctives" CASCADE;
DROP TABLE IF EXISTS "audit_reponses" CASCADE;
DROP TABLE IF EXISTS "audits" CASCADE;
DROP TABLE IF EXISTS "criteres" CASCADE;
DROP TABLE IF EXISTS "sous_themes" CASCADE;
DROP TABLE IF EXISTS "themes" CASCADE;
DROP TABLE IF EXISTS "sites" CASCADE;

DROP VIEW IF EXISTS "mv_scores_sites" CASCADE;
DROP MATERIALIZED VIEW IF EXISTS "mv_scores_sites" CASCADE;

-- 2. Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_cron";

-- 3. Création des Tables (Tout en UUID)

-- Sites
CREATE TABLE sites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nom VARCHAR(100) NOT NULL,
    code VARCHAR(20) UNIQUE NOT NULL,
    region VARCHAR(50),
    directeur_id UUID, -- Link to auth.users if needed later
    date_ouverture DATE,
    date_fermeture DATE,
    statut VARCHAR(20) DEFAULT 'actif' CHECK (statut IN ('actif', 'fermeture', 'travaux')),
    score_conformite DECIMAL(5,2) DEFAULT 0,
    nb_bloquants INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Thèmes
CREATE TABLE themes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(3) UNIQUE NOT NULL,
    nom VARCHAR(100) NOT NULL,
    description TEXT,
    ordre_affichage INTEGER DEFAULT 0,
    couleur VARCHAR(7) DEFAULT '#0077C8'
);

-- Sous-thèmes
CREATE TABLE sous_themes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    theme_id UUID REFERENCES themes(id) ON DELETE CASCADE,
    nom VARCHAR(200) NOT NULL,
    lot VARCHAR(100),
    ordre_affichage INTEGER DEFAULT 0
);

-- Critères
CREATE TABLE criteres (
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

-- Audits
CREATE TABLE audits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_id UUID REFERENCES sites(id) ON DELETE CASCADE,
    auditeur_id UUID, -- Link to auth.users
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

-- Réponses
CREATE TABLE audit_reponses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    audit_id UUID REFERENCES audits(id) ON DELETE CASCADE,
    critere_id UUID REFERENCES criteres(id) ON DELETE CASCADE,
    statut VARCHAR(20) NOT NULL CHECK (statut IN ('conforme', 'non_conforme', 'en_cours', 'na')),
    score_obtenu DECIMAL(4,1) DEFAULT 0,
    score_possible DECIMAL(4,1) DEFAULT 0,
    commentaire TEXT,
    photos TEXT[] DEFAULT '{}',
    saisi_par UUID,
    saisi_le TIMESTAMPTZ DEFAULT NOW(),
    modifie_par UUID,
    modifie_le TIMESTAMPTZ,
    UNIQUE(audit_id, critere_id)
);

-- Actions Correctives
CREATE TABLE actions_correctives (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reponse_id UUID REFERENCES audit_reponses(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    priorite VARCHAR(10) DEFAULT 'normale' CHECK (priorite IN ('urgente', 'haute', 'normale', 'basse')),
    assigne_a UUID,
    date_echeance DATE,
    statut VARCHAR(20) DEFAULT 'a_faire' CHECK (statut IN ('a_faire', 'en_cours', 'faite', 'validee')),
    preuve_photo TEXT,
    faite_par UUID,
    faite_le TIMESTAMPTZ,
    validee_par UUID,
    validee_le TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL, -- auth.users
    type VARCHAR(50) NOT NULL,
    titre VARCHAR(200) NOT NULL,
    message TEXT,
    data JSONB DEFAULT '{}',
    lue BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Enable RLS (Security)
ALTER TABLE sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE themes ENABLE ROW LEVEL SECURITY;
ALTER TABLE sous_themes ENABLE ROW LEVEL SECURITY;
ALTER TABLE criteres ENABLE ROW LEVEL SECURITY;
ALTER TABLE audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_reponses ENABLE ROW LEVEL SECURITY;
ALTER TABLE actions_correctives ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Policies (Simple Version for Dev - Open Access for Authenticated)
CREATE POLICY "Enable read access for all users" ON sites FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Enable read access for all users" ON themes FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Enable read access for all users" ON sous_themes FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Enable read access for all users" ON criteres FOR SELECT USING (auth.role() = 'authenticated');

-- Policies Audit (CRUD for authenticated for now, refine later)
CREATE POLICY "Enable all access for users" ON audits FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Enable all access for users" ON audit_reponses FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Enable all access for users" ON notifications FOR ALL USING (auth.role() = 'authenticated');

-- 5. Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE audit_reponses;
ALTER PUBLICATION supabase_realtime ADD TABLE audits;
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;

-- 6. Insert Seed Data (Sites & Thèmes)
INSERT INTO themes (code, nom, couleur, ordre_affichage) VALUES
('AFF', 'Affichage & Communication', '#2196F3', 1),
('EXP', 'Expérience Client', '#4CAF50', 2),
('IMA', 'Image & Esthétique', '#9C27B0', 3),
('QUA', 'Qualité & Propreté', '#FF9800', 4),
('RES', 'Résidents & Propriétaires', '#00BCD4', 5),
('RH', 'Ressources Humaines', '#E91E63', 6),
('SEC', 'Sécurité & Réglementation', '#F44336', 7),
('SLO', 'Slow Village Identité', '#795548', 8)
ON CONFLICT DO NOTHING;

INSERT INTO sites (nom, code, region, score_conformite, nb_bloquants) VALUES
('Anduze', 'AND', 'Occitanie', 66.2, 15),
('Biscarrosse Lac', 'BIS', 'Nouvelle-Aquitaine', 37.0, 24),
('L''Orée de l''Océan', 'ORE', 'Pays de la Loire', 72.6, 15),
('La Roque sur Cèze', 'ROQ', 'Occitanie', 56.9, 20),
('Les Ponts de Cé', 'PON', 'Pays de la Loire', 14.9, 35),
('Marennes Oléron', 'MAR', 'Nouvelle-Aquitaine', 27.6, 13),
('Pornic 2026', 'POR', 'Pays de la Loire', 27.6, 30),
('Saint Cybranet', 'CYB', 'Nouvelle-Aquitaine', 89.4, 3),
('Saint Martin de Ré 2026', 'SMR2', 'Nouvelle-Aquitaine', 60.8, 33),
('Saint Martin de Ré', 'SMR', 'Nouvelle-Aquitaine', 54.9, 33),
('Séveilles', 'SEV', 'Pays de la Loire', 30.1, 29);

COMMIT;
