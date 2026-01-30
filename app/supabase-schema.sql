-- ============================================
-- V2 PROTOTYPE - SCHEMA SIMPLIFIÉ
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Sites (11 sites Slow Village)
CREATE TABLE sites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nom VARCHAR(100) NOT NULL,
    code VARCHAR(20) UNIQUE NOT NULL,
    region VARCHAR(50),
    score_conformite DECIMAL(5,2) DEFAULT 0,
    nb_bloquants INT DEFAULT 0,
    statut VARCHAR(20) DEFAULT 'actif',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Thèmes (8 thèmes)
CREATE TABLE themes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(3) UNIQUE NOT NULL,
    nom VARCHAR(100) NOT NULL,
    couleur VARCHAR(7) DEFAULT '#0077C8',
    ordre INT DEFAULT 0
);

-- Critères simplifiés
CREATE TABLE criteres (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(20) UNIQUE NOT NULL,
    theme_code VARCHAR(3) REFERENCES themes(code),
    texte TEXT NOT NULL,
    priorite VARCHAR(2) NOT NULL CHECK (priorite IN ('P0', 'P1', 'P2', 'P3')),
    obligatoire BOOLEAN DEFAULT FALSE
);

-- Audits
CREATE TABLE audits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_id UUID REFERENCES sites(id),
    periode VARCHAR(50),
    statut VARCHAR(20) DEFAULT 'en_cours',
    taux_conformite DECIMAL(5,2) DEFAULT 0,
    nb_bloquants INT DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Réponses
CREATE TABLE audit_reponses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    audit_id UUID REFERENCES audits(id),
    critere_code VARCHAR(20) REFERENCES criteres(code),
    statut VARCHAR(20) NOT NULL CHECK (statut IN ('conforme', 'non_conforme', 'en_cours', 'na')),
    commentaire TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(audit_id, critere_code)
);

-- Seed data: Sites
INSERT INTO sites (nom, code, score_conformite, nb_bloquants) VALUES
    ('Anduze', 'AND', 66.2, 15),
    ('Biscarrosse Lac', 'BIS', 37.0, 24),
    ('L''Orée de l''Océan', 'ORE', 72.6, 15),
    ('La Roque sur Cèze', 'ROQ', 56.9, 20),
    ('Les Ponts de Cé', 'PON', 14.9, 35),
    ('Marennes Oléron', 'MAR', 27.6, 13),
    ('Pornic 2026', 'POR', 27.6, 30),
    ('Saint Cybranet', 'CYB', 89.4, 3),
    ('Saint Martin de Ré 2026', 'SMR2', 60.8, 33),
    ('Saint Martin de Ré', 'SMR', 54.9, 33),
    ('Séveilles', 'SEV', 30.1, 29);

-- Seed data: Themes
INSERT INTO themes (code, nom, couleur, ordre) VALUES
    ('AFF', 'Affichage & Communication', '#2196F3', 1),
    ('EXP', 'Expérience Client', '#4CAF50', 2),
    ('IMA', 'Image & Esthétique', '#9C27B0', 3),
    ('QUA', 'Qualité & Propreté', '#FF9800', 4),
    ('RES', 'Résidents & Propriétaires', '#00BCD4', 5),
    ('RH', 'Ressources Humaines', '#E91E63', 6),
    ('SEC', 'Sécurité & Réglementation', '#F44336', 7),
    ('SLO', 'Slow Village Identité', '#795548', 8);

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE audit_reponses;

-- View pour dashboard
CREATE VIEW vue_scores_sites AS
SELECT 
    s.id,
    s.nom,
    s.code,
    s.score_conformite,
    s.nb_bloquants,
    COUNT(CASE WHEN ar.statut = 'non_conforme' THEN 1 END) as nb_nc,
    COUNT(CASE WHEN ar.statut = 'en_cours' THEN 1 END) as nb_ec
FROM sites s
LEFT JOIN audits a ON a.site_id = s.id
LEFT JOIN audit_reponses ar ON ar.audit_id = a.id
GROUP BY s.id, s.nom, s.code, s.score_conformite, s.nb_bloquants;
