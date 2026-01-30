# 🗄️ Supabase Database Setup

## Instructions d'installation

### 1. Créer le projet Supabase

1. Aller sur [supabase.com](https://supabase.com)
2. Créer un nouveau projet
3. Noter les credentials: `SUPABASE_URL` et `SUPABASE_ANON_KEY`

### 2. Exécuter le schéma SQL

Deux options:

**Option A: Via Dashboard**
1. Aller dans SQL Editor
2. Copier le contenu de `production-schema.sql`
3. Exécuter

**Option B: Via CLI**
```bash
# Installer Supabase CLI
npm install -g supabase

# Login
supabase login

# Appliquer le schéma
supabase db push
```

### 3. Configurer l'authentification

1. Aller dans Authentication > Providers
2. Activer **Email (Magic Link)**
3. Configurer email templates (optionnel)

### 4. Configurer les variables d'environnement

Copier les credentials dans `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 5. Vérifier les tables

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
```

Vous devriez voir:
- `sites`
- `themes`
- `sous_themes`
- `criteres`
- `audits`
- `audit_reponses`
- `actions_correctives`
- `notifications`

### 6. Vérifier RLS (Row Level Security)

```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
```

Toutes les tables sensibles doivent avoir `rowsecurity = true`.

### 7. Tester l'authentification

1. Créer un utilisateur test:
   - Email: `ceo@slow-village.com`
   - Metadata: `{ "role": "ceo" }`

2. Dans SQL Editor:
```sql
-- Ajouter metadata role
UPDATE auth.users
SET raw_user_meta_data = raw_user_meta_data || '{"role": "ceo"}'::jsonb
WHERE email = 'ceo@slow-village.com';
```

### 8. Seed data - Import sites

```sql
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
```

### 9. Test de connexion depuis l'app

```bash
cd app
npm run dev
```

Naviguer vers `http://localhost:3000/login

` et tester l'authentification magic link.

---

## Commandes SQL utiles

### Voir les audits par site
```sql
SELECT 
    s.nom,
    COUNT(a.id) as nb_audits,
    AVG(a.taux_conformite) as avg_conformite
FROM sites s
LEFT JOIN audits a ON a.site_id = s.id
GROUP BY s.id, s.nom
ORDER BY avg_conformite DESC;
```

### Voir les critères bloquants
```sql
SELECT 
    s.nom as site,
    COUNT(*) as nb_bloquants
FROM sites s
JOIN audits a ON a.site_id = s.id
JOIN audit_reponses ar ON ar.audit_id = a.id
JOIN criteres c ON c.id = ar.critere_id
WHERE ar.statut = 'non_conforme'
    AND c.priorite = 'P0'
GROUP BY s.id, s.nom
ORDER BY nb_bloquants DESC;
```

### Rafraîchir la vue matérialisée
```sql
REFRESH MATERIALIZED VIEW CONCURRENTLY mv_scores_sites;
```

---

## Troubleshooting

### Erreur: "permission denied for table sites"
→ Vérifier que RLS est bien configuré et que l'utilisateur a un rôle dans `raw_user_meta_data`

### Pas de données dans dashboard
→ Vérifier que les sites sont bien insérés et que `statut = 'actif'`

### Magic link non reçu
→ Vérifier la configuration SMTP dans Supabase > Project Settings > Auth > Email Provider
