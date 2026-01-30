# Slow Village - Dashboard Qualité

Tableau de bord interactif pour le suivi des audits qualité des sites Slow Village.

## Fonctionnalités

### 3 Écrans principaux

1. **Écran Sélection** (`#screen-form`)
   - Sélection du site à consulter
   - Affichage des scores de conformité par site
   - Accès au tableau de bord ou au formulaire de saisie

2. **Écran Saisie Audit** (`#screen-input`) - **NOUVEAU**
   - Formulaire de saisie des critères par thème
   - 8 thèmes : SEC, AFF, EXP, QUA, IMA, RH, RES, SLO
   - Navigation par onglets entre les thèmes
   - Progression en temps réel
   - Sauvegarde automatique dans localStorage
   - Statuts possibles : Conforme, Non conforme, En cours, N/A

3. **Écran Dashboard** (`#screen-dashboard`)
   - Vue d'ensemble avec KPIs
   - Protection par mot de passe (admin)
   - Graphiques de conformité
   - Classement des sites
   - Matrice de risque
   - Points critiques

## Structure du projet

```
site-dashboard/
├── index.html          # Application complète (3 écrans)
├── css/
│   └── style.css       # Styles Awwwards + formulaire saisie
├── js/
│   ├── data.js         # Données des 11 sites + critères
│   └── app.js          # Logique application
└── README.md           # Ce fichier
```

## Utilisation

### Lancer l'application

```bash
cd site-dashboard
python3 -m http.server 8080
```

Ouvrir : http://localhost:8080

### Workflow

1. **Consulter le dashboard**
   - Sélectionnez un site (ou "Tous les sites")
   - Cliquez sur "Accéder au tableau de bord"
   - Entrez le mot de passe : `admin`
   - Explorez les données

2. **Saisir un nouvel audit**
   - Sélectionnez un site spécifique
   - Cliquez sur "Nouvel audit"
   - Remplissez les critères par thème
   - La progression est sauvegardée automatiquement
   - Revenez plus tard, vos données sont conservées

## Données

### Sites (11)
1. L'Orée de l'Océan (Rank #1)
2. Anduze
3. Séveilles
4. Saint Martin de Ré 2026
5. La Roque sur Cèze
6. Saint Cybranet
7. Saint Martin de Ré
8. Biscarrosse Lac
9. Marennes Oléron
10. Pornic 2026
11. Les Ponts de Cé

### Thèmes (8)
- **SEC** : Sécurité (33 critères, P1 critique)
- **AFF** : Affichage & Communication
- **EXP** : Expérience Client
- **QUA** : Qualité Opérationnelle
- **IMA** : Image & Marque
- **RH** : Ressources Humaines
- **RES** : Responsabilité Environnementale
- **SLO** : Slow Village Spirit

### Statuts de critères
- **C** : Conforme (vert)
- **NC** : Non conforme (rouge)
- **EC** : En cours (orange)
- **NA** : Non applicable (gris)

## Design System

### Couleurs
- Beige 100: `#FDFCF9`
- Vert forêt: `#1E4D2B`
- Terre cuite: `#D4845F`
- Succès: `#4A7C59`
- Danger: `#B85450`

### Typographie
- Display: Cormorant Garamond
- Body: Inter

## Migration vers Supabase

Pour connecter à Supabase, modifiez `js/data.js` :

```javascript
const SUPABASE_CONFIG = {
    url: 'YOUR_SUPABASE_URL',
    anonKey: 'YOUR_SUPABASE_ANON_KEY',
    enabled: true
};
```

Puis remplacez les appels aux données locales par des appels API Supabase.

## Stockage local

Les données de saisie sont stockées dans le `localStorage` du navigateur sous la clé `slowVillageAuditData`.

Pour réinitialiser :
```javascript
localStorage.removeItem('slowVillageAuditData');
```

---

**Version** : 1.1.0  
**Date** : Janvier 2026
