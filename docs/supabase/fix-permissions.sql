-- =====================================================
-- SLOW VILLAGE - Correction des permissions
-- A EXECUTER DANS SUPABASE SQL EDITOR
-- =====================================================
--
-- PROBLEME: Le schema original donne INSERT/UPDATE/DELETE
-- uniquement à 'authenticated', mais l'app utilise 'anon'.
--
-- SOLUTION: Donner les permissions d'écriture à 'anon'
-- pour les tables audits et audit_details.
--
-- =====================================================

-- 1. Donner les droits INSERT/UPDATE/DELETE à anon sur audits
GRANT INSERT, UPDATE, DELETE ON audits TO anon;

-- 2. Donner les droits INSERT/UPDATE/DELETE à anon sur audit_details
GRANT INSERT, UPDATE, DELETE ON audit_details TO anon;

-- 3. Donner les droits sur les séquences (pour les auto-increment)
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon;

-- 4. Vérifier que les critères ont bien un ID numérique auto-généré
-- (nécessaire pour les foreign keys)
GRANT SELECT ON criteres TO anon;
GRANT SELECT ON themes TO anon;

-- =====================================================
-- VERIFICATION
-- =====================================================
-- Après exécution, teste dans la console Supabase:
--
-- INSERT INTO audits (site_id, periode, statut)
-- VALUES (1, '2026-02', 'brouillon');
--
-- Si ça marche = permissions OK
-- =====================================================
