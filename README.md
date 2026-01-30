# Slow Village - Board Qualité

Dashboard qualité Awwwards pour le réseau Slow Village.

## 🚀 Déploiement

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/lesaffrejb-beep/board_qualite_wlos)

### Variables d'environnement requises

```
VITE_SUPABASE_URL=https://ydfgueqasslzhdbvermu.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlkZmd1ZXFhc3NsemhkYnZlcm11Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk3NTI1NzEsImV4cCI6MjA4NTMyODU3MX0.qYN8aV1JYq0C2kVDKq9DbABvDGBqfCgciBVtk99u0e4
VITE_ADMIN_PASSWORD=admin
VITE_SITE_PASSWORD=admin
```

### Setup Supabase

1. Créer un projet sur [Supabase](https://supabase.com)
2. Exécuter `docs/supabase/supabase-schema.sql`
3. Exécuter `docs/supabase/supabase-insert-criteres.sql`

## 📁 Structure

```
├── index.html              # App principale
├── css/                    # Styles Awwwards
├── js/                     # Logique app
├── docs/
│   ├── VERCEL_DEPLOY.md   # Guide déploiement
│   └── supabase/          # Schémas SQL
├── .env.example           # Template config
└── vercel.json           # Config Vercel
```

## 🏗️ Stack

- **Frontend** : Vanilla JS (ES6+)
- **Backend** : Supabase (PostgreSQL)
- **Hébergement** : Vercel
- **Design** : Awwwards-inspired, Design Tokens Slow Village

## 👥 Accès

| Profil | URL | Mot de passe |
|--------|-----|--------------|
| Directeurs de site | `/` → Choisir son site | `admin` |
| CEO/Direction | `/` → "Vue Direction" | `admin` |

## 📊 Fonctionnalités

- **11 sites** audités
- **186 critères** répartis sur **8 thèmes**
- Saisie temps réel avec sauvegarde Supabase
- Mode offline (fallback localStorage)
- Dashboard protégé avec analytics

## 📝 License

Propriétaire - Slow Village
