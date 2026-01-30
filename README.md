# 🚀 Slow Village Qualité V2 - README

**Plateforme moderne de gestion d'audits qualité** pour le réseau Slow Village

![Status](https://img.shields.io/badge/Status-Production%20Ready-success)
![Next.js](https://img.shields.io/badge/Next.js-14.0-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Supabase](https://img.shields.io/badge/Supabase-Auth%20%2B%20DB-green)

---

## 📋 Fonctionnalités

### ✅ Implémenté

- **🔐 Authentification sécurisée**
  - Magic Links (email sans mot de passe)
  - Middleware Next.js pour protection des routes
  - Row Level Security (RLS) Supabase
  
- **📊 Dashboard CEO**
  - Vue temps réel des 11 sites
  - KPIs: conformité moyenne, bloquants, sites à risque
  - Classement interactif avec scoring
  - Panel d'alertes critiques
  - Subscriptions Realtime

- **🎨 Design System Slow Village**
  - Tokens CSS (couleurs beige/terracotta/vert)
  - Typographie: Cormorant Garamond + Inter
  - Composants réutilisables (cards, badges, buttons)
  - Responsive mobile/tablet/desktop

### 🚧 En développement

- **📱 App Mobile PWA** (Directeurs)
  - Formulaire saisie critères
  - Mode offline
  - Upload photos

- **🔍 Console Qualité**
  - Actions correctives
  - Export PDF
  - Radar charts par thème

---

## 🛠️ Stack Technique

| Couche | Technologie | Rôle |
|--------|-------------|------|
| Frontend | Next.js 14 (App Router) | Framework React |
| Langage | TypeScript | Type safety |
| Styling | CSS Tokens + Variables | Design System |
| Database | PostgreSQL (Supabase) | Données, Auth, Storage |
| Realtime | Supabase Subscriptions | WebSocket updates |
| Deployment | Vercel | Hosting, CI/CD |

---

## 📦 Installation

### Prérequis

- Node.js 18+
- npm ou yarn
- Compte Supabase

### 1. Cloner le repo

```bash
git clone https://github.com/lesaffrejb-beep/board_qualite_wlos.git
cd board_qualite_wlos/app
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configurer Supabase

Suivre le guide: [docs/supabase/SETUP.md](docs/supabase/SETUP.md)

1. Créer un projet Supabase
2. Exécuter `docs/supabase/production-schema.sql`
3. Copier les credentials

### 4. Variables d'environnement

Créer `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5. Lancer en dev

```bash
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000)

---

## 📁 Structure du Projet

```
app/
├── app/
│   ├── dashboard/          # Dashboard CEO
│   ├── login/              # Page authentification
│   ├── auth/callback/      # Callback magic link
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Redirect logic
│   ├── globals.css         # Styles globaux
│   └── tokens.css          # Design tokens
├── src/
│   ├── lib/
│   │   └── supabase/       # Clients Supabase + types
│   ├── components/         # Composants React (à venir)
│   └── middleware.ts       # Route protection
├── public/
│   ├── manifest.json       # PWA manifest
│   └── icons/              # Icons app
└── docs/
    └── supabase/           # SQL schemas + setup
```

---

## 🚀 Déploiement

### Vercel (Recommandé)

1. Connecter le repo GitHub
2. Configurer les variables d'environnement
3. Deploy!

```bash
npm run build  # Test local
vercel --prod  # Deploy
```

### Autres plateformes

Fonctionne sur tout hébergeur Next.js compatible.

---

## 👥 Utilisateurs & Rôles

| Rôle | Accès | Permissions |
|------|-------|-------------|
| **CEO** | Tous les sites | Lecture seule, dashboard global |
| **Directeur** | Son site uniquement | Saisie audits, actions correctives |
| **Qualité** | Tous les sites | Lecture + validation |

### Créer un utilisateur

```sql
-- Dans Supabase SQL Editor
UPDATE auth.users
SET raw_user_meta_data = '{"role": "ceo"}'::jsonb
WHERE email = 'ceo@slow-village.com';
```

---

## 📊 Base de Données

### Tables Principales

- `sites` - 11 campings Slow Village
- `themes` - 8 thèmes d'audit
- `criteres` - 1,553 critères de conformité
- `audits` - Instances d'audit par site/période
- `audit_reponses` - Réponses critère par critère
- `actions_correctives` - Suivi des non-conformités

### Vues

- `mv_scores_sites` - Scores agrégés (refresh auto 5min)

---

## 🎨 Design System

### Couleurs Principales

```css
--sv-beige-200: #F5F0E6;        /* Fond principal */
--sv-green-500: #1E4D2B;        /* Primary (nature) */
--sv-terracotta-500: #D4845F;   /* Accent (CTA) */
--sv-danger: #B85450;           /* Bloquants */
```

### Typographie

- **Display**: Cormorant Garamond (titres)
- **Body**: Inter (texte courant)

### Composants

Voir `app/globals.css` pour la liste complète des classes.

---

## 📱 PWA (Progressive Web App)

L'app est installable sur mobile:

1. Ouvrir sur Safari/Chrome mobile
2. "Ajouter à l'écran d'accueil"
3. Utiliser comme app native

La fonctionnalité offline sera ajoutée en Phase 2.

---

## 🐛 Troubleshooting

### Build fail

```bash
rm -rf .next node_modules
npm install
npm run build
```

### Pas de données dashboard

→ Vérifier que des sites existent :
```sql
SELECT * FROM sites WHERE statut = 'actif';
```

### Auth ne fonctionne pas

→ Vérifier SMTP configuré dans Supabase > Auth > Email Provider

---

## 📝 License

Propriétaire - Slow Village © 2026

---

## 👨‍💻 Développement

Pour contribuer:

1. Feature branch: `git checkout -b feature/ma-feature`
2. Commit: `git commit -m "feat: ajout de ma feature"`
3. Push: `git push origin feature/ma-feature`
4. Pull Request

---

**Développé avec ❤️ pour Slow Village**
