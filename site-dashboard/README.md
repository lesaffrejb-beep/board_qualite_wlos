# Slow Village - Dashboard Qualité

Tableau de bord interactif pour le suivi des audits qualité des sites Slow Village.

## Structure du projet

```
site-dashboard/
├── index.html          # Page principale avec 2 écrans
├── css/
│   └── style.css       # Styles Awwwards (Design Tokens Slow Village)
├── js/
│   ├── data.js         # Données extraites des Excel (prêt pour Supabase)
│   └── app.js          # Application JavaScript
├── assets/             # Images et ressources
└── README.md           # Ce fichier
```

## Fonctionnalités

### Écran 1 : Sélection du site
- Grille de sélection des 11 sites + option "Tous les sites"
- Aperçu des métriques clés du site sélectionné
- Design card avec score de conformité et classement

### Écran 2 : Dashboard
- **Protégé par mot de passe** : `admin`
- Dashboard flouté par défaut
- Popup de connexion élégante
- Accès complet après authentification

### Composants du Dashboard
- **KPIs** : Conformité, Bloquants, Sites, Critères
- **Graphique** : Conformité par site (barres horizontales)
- **Classement** : Top 11 des sites avec score global
- **Thèmes** : Performance par thème (8 thèmes)
- **Alertes** : Points critiques P1 majeurs
- **Matrice de risque** : Répartition P1/P2/P3 par statut

## Démarrage rapide

### Option 1 : Serveur Python
```bash
cd site-dashboard
python3 -m http.server 8080
```
Ouvrir http://localhost:8080

### Option 2 : Ouverture directe
Double-cliquer sur `index.html` (certaines fonctionnalités peuvent être limitées)

## Migration vers Supabase

Les données sont actuellement en JavaScript statique (`js/data.js`). Pour migrer vers Supabase :

1. Configurer les variables dans `data.js` :
```javascript
const SUPABASE_CONFIG = {
    url: 'YOUR_SUPABASE_URL',
    anonKey: 'YOUR_SUPABASE_ANON_KEY',
    enabled: true
};
```

2. Le schéma SQL est disponible dans `../v2-prototype/supabase-schema.sql`

3. Remplacer les constantes par des appels API Supabase

## Design System

Le design suit les tokens Slow Village :
- **Couleurs** : Beiges, Verts forêt, Terre cuite
- **Typographie** : Cormorant Garamond (titres) + Inter (corps)
- **Composants** : Cards, Badges, Progress bars, Tables

Voir `../DESIGN_TOKENS_SlowVillage.md` pour la référence complète.

## Données

Basé sur 11 fichiers Excel d'audit :
- 17 083 critères analysés
- 8 thèmes d'audit (AFF, EXP, IMA, QUA, RES, RH, SEC, SLO)
- Priorités P0-P3
- Statuts : Conforme, Non conforme, En cours, N/A

---

*Slow Village - Janvier 2026*
