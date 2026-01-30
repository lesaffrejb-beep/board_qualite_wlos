# 🎨 DESIGN TOKENS - Slow Village
## Référence exacte basée sur slow-village.com

---

## 🎯 IDENTITÉ VISUELLE

### Logo
- **Type** : Goutte d'eau stylisée avec feuille
- **Couleurs** : Vert forêt (#1E4D2B) + Terre cuite (#D4845F)
- **Usage** : Toujours avec le texte "SLOW VILLAGE" en dessous

---

## 🌈 COULEURS

### Couleurs Principales (Primary)
```css
--sv-beige-100: #FDFCF9;    /* Fond très clair */
--sv-beige-200: #F5F0E6;    /* Fond principal */
--sv-beige-300: #E8E2D5;    /* Bordures, séparations */
--sv-beige-400: #D4CDBF;    /* Éléments secondaires */
```

### Couleurs d'Action (Accent)
```css
--sv-terracotta-500: #D4845F;  /* Boutons principaux */
--sv-terracotta-400: #E8A17D;  /* Hover boutons */
--sv-terracotta-600: #B86A4A;  /* Pressed */
--sv-terracotta-50: #FDF6F2;   /* Fonds légers */
```

### Couleurs Nature (Secondary)
```css
--sv-green-500: #1E4D2B;   /* Titres, logo */
--sv-green-400: #2D6B3D;   /* Hover liens */
--sv-green-600: #153820;   /* Texte foncé */
--sv-green-50: #E8F0EC;    /* Fonds verts légers */
```

### Couleurs de Statut (Feedback)
```css
--sv-success: #4A7C59;     /* Validé, conforme */
--sv-warning: #D4845F;     /* Attention, en cours */
--sv-danger: #B85450;      /* Non conforme, bloquant */
--sv-info: #5B8BA0;        /* Information */
```

### Couleurs Neutres
```css
--sv-dark: #2D2D2D;        /* Texte principal */
--sv-gray-600: #6B6B6B;    /* Texte secondaire */
--sv-gray-400: #9A9A9A;    /* Placeholder, disabled */
--sv-gray-200: #E5E5E5;    /* Bordures légères */
--sv-white: #FFFFFF;       /* Fond blanc */
```

---

## ✍️ TYPOGRAPHIE

### Font Families
```css
/* Titres - Élégant, premium */
--font-display: 'Cormorant Garamond', Georgia, serif;

/* Corps de texte - Lisible, moderne */
--font-body: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
```

### Hierarchy (Tailles)
```css
/* Hero / Cover title */
--text-hero: 36pt;        /* Titre couverture */
--text-hero-line-height: 1.15;

/* H1 - Titres de section */
--text-h1: 22pt;
--text-h1-line-height: 1.2;

/* H2 - Sous-titres */
--text-h2: 14pt;
--text-h2-line-height: 1.3;

/* H3 - Petit titres */
--text-h3: 11pt;
--text-h3-line-height: 1.4;

/* Body - Texte courant */
--text-body: 10pt;
--text-body-line-height: 1.5;

/* Small - Légendes, méta */
--text-small: 9pt;
--text-small-line-height: 1.4;

/* Tiny - Labels */
--text-tiny: 8pt;
--text-tiny-line-height: 1.3;
```

### Weights
```css
--font-light: 300;
--font-regular: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

---

## 📐 ESPACEMENTS (Spacing)

### Rayons de Bordure (Border Radius)
```css
--radius-sm: 4px;     /* Tags, badges */
--radius-md: 8px;     /* Cartes petites */
--radius-lg: 12px;    /* Cartes principales, boutons */
--radius-xl: 16px;    /* Modales, grands blocs */
--radius-full: 9999px; /* Pills, avatars */
```

### Espacements
```css
--space-1: 2mm;   /* Très petit */
--space-2: 3mm;   /* Petit (labels) */
--space-3: 4mm;   /* Moyen (cartes) */
--space-4: 5mm;   /* Standard padding cartes */
--space-5: 6mm;   /* Entre sections */
--space-6: 8mm;   /* Grand */
--space-8: 10mm;  /* Très grand */
```

---

## 🧩 COMPOSANTS

### Boutons

#### Bouton Principal (Primary)
```css
background: var(--sv-terracotta-500);
color: white;
border-radius: var(--radius-full);  /* Pill shape */
padding: 8px 20px;
font-family: var(--font-body);
font-weight: var(--font-medium);
font-size: 10pt;
border: none;

/* Hover */
background: var(--sv-terracotta-400);

/* Pressed */
background: var(--sv-terracotta-600);
```

#### Bouton Secondaire (Secondary)
```css
background: transparent;
color: var(--sv-dark);
border: 1px solid var(--sv-beige-300);
border-radius: var(--radius-full);
padding: 8px 20px;
```

#### Bouton Menu (Menu Button)
```css
background: var(--sv-terracotta-500);
color: white;
border-radius: var(--radius-full);
padding: 12px 24px;
display: flex;
align-items: center;
gap: 8px;
```

### Cartes (Cards)

#### Carte Standard
```css
background: white;
border: 1px solid var(--sv-beige-300);
border-radius: var(--radius-lg);
padding: var(--space-4);
```

#### Carte avec Accent (KPI)
```css
background: var(--sv-beige-200);
border-radius: var(--radius-lg);
padding: var(--space-4);
text-align: center;
```

#### Carte Alerte - Danger
```css
background: #FDF2F2;
border-left: 4px solid var(--sv-danger);
border-radius: 0 var(--radius-lg) var(--radius-lg) 0;
padding: var(--space-4);
```

#### Carte Alerte - Warning
```css
background: #FDF6F2;
border-left: 4px solid var(--sv-warning);
border-radius: 0 var(--radius-lg) var(--radius-lg) 0;
padding: var(--space-4);
```

### Badges (Priority)

#### Badge P0 (Critique)
```css
background: #FDF2F2;
color: var(--sv-danger);
padding: 1.5mm 3mm;
border-radius: var(--radius-full);
font-size: 7pt;
font-weight: var(--font-semibold);
text-transform: uppercase;
letter-spacing: 0.5px;
```

#### Badge P1 (Important)
```css
background: #FDF6F2;
color: var(--sv-warning);
/* Même padding et radius */
```

### Tableaux

#### Tableau de Données
```css
width: 100%;
border-collapse: collapse;
font-size: 9pt;

/* Header */
th {
  background: var(--sv-beige-200);
  padding: 3mm 2mm;
  text-align: left;
  font-weight: var(--font-semibold);
  border-bottom: 2px solid var(--sv-beige-300);
}

/* Cellules */
td {
  padding: 2.5mm 2mm;
  border-bottom: 1px solid var(--sv-beige-200);
}
```

### Graphiques (Charts)

#### Barre de Progression
```css
/* Fond */
.chart-bar-bg {
  background: var(--sv-beige-200);
  border-radius: 3px;
  height: 5mm;
  overflow: hidden;
}

/* Barre colorée */
.chart-bar {
  height: 100%;
  border-radius: 3px;
}

/* Couleurs selon score */
.chart-bar.excellent { background: var(--sv-success); }
.chart-bar.good { background: var(--sv-green-500); }
.chart-bar.warning { background: var(--sv-warning); }
.chart-bar.danger { background: var(--sv-danger); }
```

---

## 🎭 ÉTATS (States)

### Hover
```css
/* Liens */
color: var(--sv-green-400);
transition: color 0.2s ease;

/* Boutons */
opacity: 0.9;
transform: translateY(-1px);
```

### Focus
```css
outline: 2px solid var(--sv-terracotta-400);
outline-offset: 2px;
```

### Disabled
```css
opacity: 0.5;
cursor: not-allowed;
```

---

## 📱 LAYOUT A4

### Dimensions Page
```css
--page-width: 210mm;
--page-height: 297mm;
--page-margin: 20mm;
--content-width: 170mm;  /* 210 - 40mm marges */
```

### Grille
```css
/* 4 colonnes pour KPIs */
grid-template-columns: repeat(4, 1fr);
gap: 4mm;

/* 2 colonnes pour contenu */
grid-template-columns: 1fr 1fr;
gap: 6mm;

/* 3 colonnes pour objectifs */
grid-template-columns: repeat(3, 1fr);
gap: 4mm;
```

---

## 🖼️ ICÔNES ET GRAPHISMES

### Logo SVG (Simplifié)
```svg
<svg viewBox="0 0 48 48" fill="none">
  <!-- Cercle extérieur -->
  <circle cx="24" cy="24" r="23" stroke="#1E4D2B" stroke-width="2"/>
  
  <!-- Goutte verte -->
  <path d="M24 8C24 8 14 18 14 28C14 35 18 40 24 40C30 40 34 35 34 28C34 18 24 8 24 8Z" 
        fill="#1E4D2B"/>
  
  <!-- Cœur terre cuite -->
  <path d="M24 14C24 14 18 22 18 28C18 32 21 36 24 36C27 36 30 32 30 28C30 22 24 14 24 14Z" 
        fill="#D4845F"/>
</svg>
```

### Icônes Recommandées
Utiliser **Lucide Icons** (style line, épuré) :
- `building-2` pour sites
- `alert-triangle` pour alertes
- `check-circle` pour conforme
- `trending-up` pour progression
- `map-pin` pour localisation

---

## 📋 EXEMPLE D'USAGE

### Carte KPI Complète
```html
<div class="kpi-card">
  <span class="kpi-value">89.4%</span>
  <span class="kpi-label">Conformité</span>
</div>
```

```css
.kpi-card {
  background: var(--sv-beige-200);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  text-align: center;
}

.kpi-value {
  font-family: var(--font-display);
  font-size: 24pt;
  font-weight: var(--font-bold);
  color: var(--sv-green-500);
  display: block;
  margin-bottom: var(--space-2);
}

.kpi-label {
  font-size: var(--text-tiny);
  color: var(--sv-gray-600);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
```

---

## 🔗 RESSOURCES

### Fonts (Google Fonts)
```html
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
```

### Icons
```html
<!-- Lucide React -->
npm install lucide-react

<!-- Ou CDN -->
<script src="https://unpkg.com/lucide@latest"></script>
```

---

*Design System extrait de slow-village.com - Janvier 2026*
