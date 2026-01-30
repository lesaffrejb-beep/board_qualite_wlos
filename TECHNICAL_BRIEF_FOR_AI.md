# BRIEF TECHNIQUE - Slow Village Board Qualité

> **Document de transmission pour développeuse Full Stack Senior**
> **Contexte** : Projet en cours, passage de relais pour finalisation et solidification
> **Date** : Janvier 2026
> **Stack** : Vanilla JS + Supabase + Vercel

---

## 1. CONTEXTE & RAISON D'ÊTRE

### 1.1 Le Client
**Slow Village** - Réseau de 11 campings haut de gamme en France (capitale de Cé, Biscarrosse, etc.)

### 1.2 Problématique Business
Les audits qualité étaient faits sur **11 fichiers Excel** envoyés par email :
- 17 083 critères analysés manuellement
- Aucune visibilité temps réel pour la direction
- Aucun historique centralisé
- Processus lourd pour les directeurs de site

### 1.3 Objectif du Projet
Créer une **application web Awwwards-quality** permettant :
1. **Aux directeurs** : Saisir leurs audits qualité via un formulaire UI-friendly (remplace Excel)
2. **À la direction** : Visualiser en temps réel l'état qualité de tous les sites via un dashboard

**Mot d'ordre** : "Pour des CEO pressés qui doivent vite comprendre et rendre actionnable ces retours terrains"

---

## 2. ARCHITECTURE GÉNÉRALE

### 2.1 Diagramme de Flux

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Directeur     │────▶│   Auth Modal    │────▶│  Formulaire     │
│   (Site N)      │     │   (Vert/Site)   │     │  Saisie Critères│
└─────────────────┘     └─────────────────┘     └────────┬────────┘
                                                         │
                                                         ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Dashboard     │◀────│   Auth Modal    │◀────│   Supabase      │
│   (CEO/Direction)│     │  (Terracotta)   │     │   PostgreSQL    │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

### 2.2 Structure des Écrans

| Écran | Destinataire | Protection | Contenu |
|-------|-------------|------------|---------|
| **Home** | Tous | Aucune | Grid des 11 sites, sélection |
| **Modal Audit** | Directeurs | Mdp par site | Auth avant formulaire |
| **Formulaire** | Directeurs | Session | 8 thèmes, 186 critères |
| **Modal Board** | CEO/Direction | Mdp admin | Auth avant dashboard |
| **Dashboard** | CEO/Direction | Session | KPIs, graphes, matrice |

---

## 3. STACK TECHNIQUE

### 3.1 Frontend
- **HTML5** sémantique
- **CSS3** avec variables CSS (Design Tokens)
- **Vanilla JavaScript** (ES6+, modules)
- **Aucun framework** (volonté de simplicité et perf)

**Fonts** : 
- Cormorant Garamond (display/titres)
- Inter (body/UI)

### 3.2 Backend
- **Supabase** (PostgreSQL + Realtime)
- **Row Level Security (RLS)** activé
- **Auth** : Custom (pas Supabase Auth) avec sessionStorage

### 3.3 Hébergement
- **Vercel** (déploiement continu depuis GitHub)
- **Variables d'environnement** : VITE_* pour build

---

## 4. DESIGN SYSTEM - SLOW VILLAGE

### 4.1 Couleurs (Design Tokens)
```css
--sv-beige-100: #FDFCF9;    /* Background principal */
--sv-beige-200: #F5F0E6;    /* Cards secondaires */
--sv-green-500: #1E4D2B;    /* Primary (nature) */
--sv-green-600: #153820;    /* Hover */
--sv-terracotta-500: #D4845F; /* Accent/Action */
--sv-terracotta-600: #B86A4A; /* Hover action */
--sv-success: #4A7C59;
--sv-danger: #B85450;
```

### 4.2 Principes UI
- **Awwwards-inspired** : micro-animations, hover effects
- **Mobile-first** mais desktop-optimized (usage interne)
- **Dark mode** : Non (brand beige/nature)
- **Accessibility** : Contraste WCAG AA minimum

---

## 5. SCHÉMA BASE DE DONNÉES (SUPABASE)

### 5.1 Tables Principales

#### `sites` (11 campings)
```sql
id SERIAL PK
nom VARCHAR(100)        -- "L'Orée de l'Océan"
code VARCHAR(10)        -- "ORE", "AND"...
region VARCHAR(50)
password_hash VARCHAR   -- Default: 'admin'
actif BOOLEAN
```

#### `themes` (8 catégories)
```sql
id SERIAL PK
code VARCHAR(3) UNIQUE  -- SEC, AFF, EXP, QUA, IMA, RH, RES, SLO
nom VARCHAR(100)
description TEXT
ordre_affichage INTEGER
```

#### `criteres` (186 critères d'audit)
```sql
id SERIAL PK
code VARCHAR(20) UNIQUE -- SEC-1, AFF-22...
theme_code FK
texte TEXT              -- "Le registre de sécurité est émargé..."
priorite VARCHAR(2)     -- P0, P1, P2, P3
poids INTEGER           -- 0-3
est_bloquant BOOLEAN
ordre INTEGER
actif BOOLEAN
```

#### `audits` (en-tête par site/période)
```sql
id UUID PK
site_id FK
periode VARCHAR(20)     -- "2026-01"
date_debut DATE
statut VARCHAR          -- brouillon, en_cours, termine
taux_conformite_brut DECIMAL
taux_conformite_pondere DECIMAL
nb_criteres_total INTEGER
nb_conformes INTEGER
nb_non_conformes INTEGER
nb_en_cours INTEGER
nb_bloquants INTEGER
```

#### `audit_details` (réponses ligne par ligne)
```sql
id UUID PK
audit_id FK
critere_id FK
statut VARCHAR(10)      -- C, NC, EC, NA
commentaire TEXT
photo_url TEXT
updated_by VARCHAR
```

#### `historique_scores` (données Excel importées)
```sql
id UUID PK
site_id FK
periode VARCHAR(20)
taux_conformite_brut DECIMAL
taux_conformite_pondere DECIMAL
score_global DECIMAL
rang INTEGER
nb_bloquants INTEGER
-- + autres métriques
```

### 5.2 Vues SQL (pour Dashboard)
- `vue_synthese_globale` : Agrégation par période
- `vue_classement` : Ranking des sites
- `vue_matrice_risque` : Répartition P1/P2/P3

---

## 6. FONCTIONNALITÉS IMPLÉMENTÉES

### 6.1 Frontend ✅

#### Page d'Accueil
- [x] Grid des 11 sites avec scores
- [x] Carte "Vue Direction" (tous sites)
- [x] Hover effects sur cards
- [x] Sélection site → affichage stats

#### Modal Auth Site (Audit)
- [x] Design vert (thème site)
- [x] Input mdp avec icône
- [x] Validation mdp (admin ou site)
- [x] Animation shake si erreur
- [x] Focus auto

#### Modal Auth Admin (Dashboard)
- [x] Design terracotta (thème admin)
- [x] Contexte dynamique (site ou "Vue Direction")
- [x] Même UX que modal site

#### Formulaire Saisie
- [x] Navigation 8 onglets thématiques
- [x] Progress bar globale
- [x] Progress par thème
- [x] Boutons statut : Conforme / NC / En cours / N/A
- [x] Sauvegarde auto Supabase
- [x] Fallback localStorage offline
- [x] Navigation Précédent/Suivant
- [x] Toast notifications

#### Dashboard
- [x] Layout sidebar + content
- [x] 4 KPI Cards (conformité, bloquants, sites, critères)
- [x] Graphique conformité par site
- [x] Classement sites (top 3 / bottom 3)
- [x] Performance par thème (8 cards)
- [x] Points critiques (risques P1)
- [x] Matrice de risque (tableau P1/P2/P3)
- [x] Overlay flouté avant auth

### 6.2 Backend ✅
- [x] Connexion Supabase
- [x] RLS policies basiques
- [x] Tables créées
- [x] 186 critères insérés
- [x] Historique Excel importé (11 sites)
- [x] Triggers updated_at

---

## 7. FICHIERS CLÉS

```
/
├── index.html              # App shell + 5 écrans + 2 modals
├── css/
│   ├── style.css          # Design system + layout (1300+ lignes)
│   └── auth.css           # Modals + animations (300+ lignes)
├── js/
│   ├── env-config.js      # Variables d'environnement
│   ├── data.js            # Fallback données locales + critères
│   └── app.js             # Logique métier (800+ lignes)
├── docs/
│   └── supabase/
│       ├── supabase-schema.sql      # Structure BDD
│       └── supabase-insert-criteres.sql # Données
└── .env.example           # Template config
```

---

## 8. CE QUI A ÉTÉ DEMANDÉ vs PROPOSÉ

### 8.1 Demandes Initiales (User)
1. "2 pages : formulaire pour users + dashboard admin"
2. "Pense UI friendly"
3. "Popup mot de passe quand clique"
4. "Basé sur les données Excel"
5. "Prêt pour Supabase"
6. "Design Awwwards"
7. "Pour CEO pressés"

### 8.2 Ce qui a été Proposé & Implémenté
| Demande | Implémentation | Notes |
|---------|---------------|-------|
| 2 pages | 5 écrans + 2 modals | Plus granulaire pour UX |
| Formulaire | 8 onglets thématiques | Navigation plus claire |
| Popup mdp | 2 modaux distincts | Vert (site) vs Terracotta (admin) |
| Données Excel | Import historique + nouveau schéma | Conservation historique |
| Supabase | Backend complet + fallback local | Offline-first |
| Awwwards | Design tokens + micro-animations | Typo Cormorant Garamond |

### 8.3 Évolutions durant le développement
- **Ajout** : Modal auth séparé pour admin (pas juste le floutage)
- **Ajout** : Session par site (pas juste global)
- **Ajout** : Fallback localStorage (robustesse)
- **Ajout** : Progression temps réel par thème

---

## 9. POINTS TECHNIQUES IMPORTANTS

### 9.1 Authentification (Custom)
**PAS Supabase Auth** - Système custom pour simplicité :
- Mdp unique par défaut : `"admin"`
- Stockage session : `sessionStorage` (pas localStorage pour sécurité)
- Clé session : `auth_site_${siteId}`
- Session admin : `auth_admin`

### 9.2 Sync Données
**Stratégie offline-first** :
1. Toute saisie → localStorage immédiat
2. Envoi Supabase en background (async)
3. Si erreur réseau → retry silencieux
4. Au rechargement : charge d'abord local, puis sync Supabase

### 9.3 Variables d'Environnement
```javascript
VITE_SUPABASE_URL=https://ydfgueqasslzhdbvermu.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_ADMIN_PASSWORD=admin
VITE_SITE_PASSWORD=admin
```

**⚠️ Security** : `VITE_*` variables sont publiques (build client-side). La sécurité vient des RLS Supabase, pas de la clé.

---

## 10. BUGS CONNUS & LIMITATIONS

### 10.1 À corriger
- [ ] **Responsive mobile** : Formulaire de saisie pas optimisé mobile (priorité desktop)
- [ ] **Validation formulaire** : Pas de validation "tous critères remplis" avant submit
- [ ] **Upload photos** : Feature prévue (champ photo_url) mais non implémentée
- [ ] **Export PDF** : Demande implicite mais non développée

### 10.2 Améliorations suggérées
- [ ] **Realtime** : Utiliser Supabase Realtime pour voir les saisies en live
- [ ] **Commentaires** : Champ commentaire par critère (BD prête, UI à faire)
- [ ] **Photos** : Upload Cloudinary/S3 + affichage gallery
- [ ] **Notifications** : Email quand audit terminé
- [ ] **Comparaison** : Voir évolution mois par mois (graphiques trends)

---

## 11. POUR L'IA SUIVANTE

### 11.1 Mission
1. **Solidifier le backend** : Vérifier sécurité RLS, ajouter validations
2. **Améliorer le frontend** : 
   - Responsive mobile du formulaire
   - Accessibilité (ARIA labels)
   - Optimisations perf (lazy loading)
3. **Feature completeness** :
   - Upload photos
   - Export PDF/Excel
   - Mode hors-ligne complet (Service Worker)

### 11.2 Contraintes à respecter
- **Garder le vanilla JS** (pas de React/Vue sauf si vraiment nécessaire)
- **Garder le Design System** (couleurs Slow Village)
- **Ne pas casser la compatibilité** Supabase existante
- **Maintenir la simplicité** (pas d'over-engineering)

### 11.3 Questions ouvertes
1. Faut-il ajouter un vrai système de rôles (directeur ne voit que son site) ?
2. Faut-il des notifications email ?
3. Export PDF des audits - priorité ?
4. Version mobile native (PWA) nécessaire ?

---

## 12. RESSOURCES

### 12.1 URLs
- **Repo** : https://github.com/lesaffrejb-beep/board_qualite_wlos
- **Supabase** : https://ydfgueqasslzhdbvermu.supabase.co
- **Prod** : https://board-qualite-wlos.vercel.app (quand fixé)

### 12.2 Identifiants Test
- **Mdp admin** : `admin`
- **Mdp site** : `admin`
- **Site test** : Anduze (id: 2)

### 12.3 Fichiers SQL
- `/docs/supabase/supabase-schema.sql`
- `/docs/supabase/supabase-insert-criteres.sql`

---

## 13. PHILOSOPHIE PROJET

> "Pas de coaching, juste mise en valeur des points critiques"
> "Show, don't tell" - Dashboard visuel, pas de textes explicatifs
> "Pour des gens pressés" - 1 clic = action, pas de friction
> "Awwwards quality" - Design premium, animations soignées

---

**Document rédigé pour transmission de connaissances complète.**
**Toute question métier = demander au client (CEO Slow Village)**
**Toute question tech = ce document + code source**
