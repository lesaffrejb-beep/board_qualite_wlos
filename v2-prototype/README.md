# 🚀 V2 Prototype - Slow Village Qualité Platform

Prototype fonctionnel du futur dashboard temps réel pour les audits qualité Slow Village.

## 📊 Données utilisées

Ce prototype utilise les **vraies données extraites** des 11 sites :
- 17,083 critères audités
- Scores de conformité pondérés
- Nombre de bloquants par site

## 🏃 Lancer le prototype

```bash
cd v2-prototype
npm install
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000)

## ✨ Fonctionnalités démontrées

### Dashboard CEO
- **Vue d'ensemble** : KPIs groupe + graphique performance
- **Classement** : Cards interactives des 11 sites
- **Alertes** : Sites avec >20 bloquants

### Design System
- Inspiration McKinsey (navy blue, minimaliste)
- Tailwind CSS
- Responsive
- Animations subtiles

## 🏗️ Prochaines étapes pour V2 complète

1. **Connecter Supabase** (schema SQL fourni)
2. **Authentification** (CEO/Directeurs/Qualité)
3. **Realtime** (WebSocket pour updates live)
4. **App mobile** (PWA pour saisie terrain)
5. **Photos** (Storage Supabase)

## 📁 Structure

```
v2-prototype/
├── app/
│   ├── page.tsx          # Dashboard CEO
│   ├── layout.tsx        # Root layout
│   └── globals.css       # Styles
├── supabase-schema.sql   # Schema DB
├── package.json          # Dépendances
└── README.md            # Ce fichier
```

---

*Prototype généré pour démonstration de faisabilité*
