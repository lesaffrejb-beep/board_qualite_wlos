# 🚀 ROADMAP V2 - Slow Village Qualité App
## Guide pour non-développeur : Que faire soi-même ? Quand faire appel à un dev ?

---

## 📱 RAPPEL DU PROJET

**Objectif** : Transformer vos audits Excel en une app web où :
- Les **directeurs** de site cochent les critères sur leur téléphone
- Le **CEO** voit tout en temps réel sur un dashboard
- La **responsable qualité** pilote et valide

**Budget cible** : Entre 0€ (phase 1) et 15 000€ (app complète)

---

## 🎯 LES 3 PHASES EXPLIQUÉES

### PHASE 1 : "DÉMARRAGE" (2-3 mois) — Budget : 0€
**Ce que vous faites VOUS-MÊME** (sans développeur)

#### Outils utilisés :
- **Airtable** (comme Excel mais en ligne) — Gratuit
- **Softr** (pour créer un site web facilement) — Gratuit jusqu'à 10 users
- **Make** (pour automatiser) — Gratuit

#### Ce que ça donne :
1. **Tableau Airtable** avec vos 1 553 critères
2. **Site simple** où les directeurs se connectent
3. **Formulaire** pour cocher "Conforme / Non conforme / En cours"
4. **Dashboard** basique avec les scores

#### Étape par étape :
```
Semaine 1-2 : Créer la base Airtable
   → Copier vos critères Excel dans Airtable
   → Créer une table "Sites" (Anduze, Biscarrosse...)
   → Créer une table "Critères" (AFF-1, AFF-2...)
   → Créer une table "Réponses" (coché par qui, quand)

Semaine 3-4 : Connecter Softr
   → Créer un compte sur softr.io
   → Choisir un template "Client Portal"
   → Connecter votre Airtable
   → Créer 3 pages :
     • Page de connexion (login)
     • Page pour cocher les critères (formulaire)
     • Page dashboard (graphiques simples)

Semaine 5-8 : Tester et ajuster
   → Faire tester par 2-3 directeurs
   → Corriger les bugs
   → Améliorer le design
```

#### Limites de cette phase :
- ❌ Pas de notifications push
- ❌ Pas d'app mobile native (c'est un site web)
- ❌ Pas de mode offline (besoin d'internet)
- ❌ Design basique

#### Quand passer à la phase 2 ?
→ Quand vous avez **plus de 10 users** OU que vous voulez **l'app mobile**

---

### PHASE 2 : "PROFESSIONNALISATION" (2-3 mois) — Budget : 3 000€ - 8 000€
**Là il faut un DÉVELOPPEUR** (ou un freelance)

#### Pourquoi faire appel à un dev ?
Parce que vous avez besoin de :
1. **VRAIE app mobile** (pas juste un site web)
2. **Photos** depuis le téléphone
3. **Notifications** (alertes quand un bloquant est créé)
4. **Mode offline** (fonctionne sans internet dans la nature)
5. **Design parfait** (identique à slow-village.com)

#### Technologie utilisée :
- **Supabase** (base de données) — 25€/mois
- **FlutterFlow** ou **React** — Code
- **Vercel** (hébergement) — 20€/mois

#### Ce que le dev va faire :
```
Étape 1 : Architecture (1 semaine)
   → Créer la base de données (PostgreSQL)
   → Définir les rôles (CEO voit tout, Directeur voit son site)

Étape 2 : App Mobile (4 semaines)
   → Écran de connexion
   → Écran "mes critères" (avec photos)
   → Écran "dashboard"
   → Mode offline (sauvegarde locale)

Étape 3 : Dashboard CEO (2 semaines)
   → Graphiques en temps réel
   → Alertes automatiques
   → Export PDF

Étape 4 : Tests (2 semaines)
   → Test sur iPhone et Android
   → Correction des bugs
```

#### Budget détaillé :
| Poste | Coût |
|-------|------|
| Freelance dev (60h × 80€) | 4 800€ |
| Design UI/UX (20h × 60€) | 1 200€ |
| Supabase Pro (1 an) | 300€ |
| Vercel Pro (1 an) | 240€ |
| **TOTAL** | **~6 500€** |

#### Où trouver un dev ?
- **Malt.fr** (freelances français, qualité ✅)
- **Comet.co** (freelances tech vérifiés)
- **Turing.com** (devs moins chers, mais anglais)
- **AskPierre** (agence française, plus cher mais accompagnement)

---

### PHASE 3 : "EXCELLENCE" (3-6 mois) — Budget : 8 000€ - 15 000€
**Pour les features avancées**

#### Ce qui est ajouté :
1. **IA pour analyse photos** (détecte si une photo montre bien le critère)
2. **Rapports automatiques** (PDF généré automatiquement chaque mois)
3. **Intégration avec vos autres outils** (Slack, Notion, etc.)
4. **Prédictions** ("Ce site risque d'avoir des problèmes dans 3 mois")
5. **Multi-langue** (anglais, espagnol pour futurs sites)

#### Budget :
Cette phase nécessite un développeur senior. Comptez :
- **Dev senior** : 100-150€/heure
- **Data scientist** (pour l'IA) : 150-200€/heure
- **Temps** : 80-120 heures

---

## 🔍 DÉTAIL : QUE FAIRE SOI-MÊME ?

### ✅ VOUS POUVEZ FAIRE SEUL (No-code)

| Tâche | Outil | Temps | Difficulté |
|-------|-------|-------|------------|
| Créer la base de données | Airtable | 2j | ⭐ Facile |
| Formulaire de saisie | Tally.so ou Airtable Form | 1j | ⭐ Facile |
| Dashboard basique | Airtable Interface | 2j | ⭐⭐ Moyen |
| Connexion des 2 | Make (ex-Integromat) | 1j | ⭐⭐ Moyen |
| Design simple | Canva pour les images | 1j | ⭐ Facile |

**Compétences nécessaires** : Être à l'aise avec Excel et Internet.

### ❌ IL FAUT UN DÉVELOPPEUR

| Tâche | Pourquoi ? | Coût estimé |
|-------|-----------|-------------|
| App mobile native | Nécessite du code (Swift/Kotlin) | 3 000€ |
| Notifications push | Configuration serveur complexe | 800€ |
| Mode offline | Base de données locale + synchro | 1 500€ |
| Sécurité avancée | Auth JWT, encryption | 1 000€ |
| Upload de photos | Compression, stockage cloud | 800€ |
| Temps réel (WebSocket) | Communication instantanée | 1 200€ |

---

## 💰 COMPARAISON BUDGET

### Option A : Tout seul (Phase 1)
```
Outils no-code (Airtable Pro + Softr) : 40€/mois
Votre temps : 5 jours de travail
TOTAL ANNUEL : ~500€
```
**Parfait pour** : Tester le concept, moins de 10 users

### Option B : Freelance (Phase 2)
```
Développement initial : 6 000€
Hébergement/an : 600€
Maintenance/an (20h) : 1 600€
TOTAL AN 1 : ~8 000€
TOTAL AN 2+ : ~2 200€
```
**Parfait pour** : App professionnelle, 10-100 users

### Option C : Agence (Phase 2+3)
```
Développement : 25 000€ - 50 000€
Maintenance/an : 5 000€ - 10 000€
```
**Parfait pour** : Groupe avec plusieurs projets digitaux

---

## 📅 TIMELINE RECOMMANDÉE

### Si vous débutez (conseillé)
```
MOIS 1 : Phase 1 (No-code)
   → Créer la base Airtable
   → Faire tester par 2 directeurs
   → Vérifier que ça marche bien

MOIS 2-3 : Test et ajustement
   → Corriger les problèmes
   → Ajouter des features simples
   → Former les directeurs

MOIS 4 : Décision
   → Si ça marche : passer à Phase 2 (dev)
   → Si suffisant : rester sur Airtable
```

### Si vous êtes sûr de vous
```
MOIS 1 : Cahier des charges
   → Spécifier exactement ce qu'il faut
   → Choisir freelance ou agence
   → Signer le devis

MOIS 2-4 : Développement
   → Suivi hebdomadaire avec le dev
   → Tests intermédiaires
   → Ajustements

MOIS 5 : Déploiement
   → Formation des directeurs
   → Migration des données Excel
   → Lancement officiel
```

---

## 🎨 DESIGN SYSTEM (À GARDER POUR LE DEV)

Quand vous engagez un développeur, donnez-lui CES ÉLÉMENTS :

### Couleurs Slow Village
```
Beige principal : #F5F0E6
Beige foncé : #E8E2D5
Vert forêt : #1E4D2B
Terre cuite : #D4845F
Terre cuite clair : #E8A17D
Texte : #2D2D2D
Gris : #6B6B6B
```

### Typographie
```
Titres : Cormorant Garamond (serif élégant)
Texte : Inter (sans-serif moderne)
```

### Inspiration UI
→ Voir le fichier `RAPPORT_AUDIT_SLOW_VILLAGE_A4.html` pour le rendu visuel

---

## ✅ CHECKLIST AVANT DE DÉMARRER

### Avant Phase 1 (No-code)
- [ ] Avoir nettoyé vos fichiers Excel (pas de doublons)
- [ ] Savoir qui sont vos 11 directeurs (emails)
- [ ] Avoir 2-3 volontaires pour tester
- [ ] Créer un compte Airtable

### Avant Phase 2 (Dev)
- [ ] Avoir validé que la Phase 1 fonctionne
- [ ] Avoir un budget de 6 000€ minimum
- [ ] Avoir listé EXACTEMENT les features voulues
- [ ] Avoir choisi freelance vs agence
- [ ] Avoir un responsable technique en interne (même junior)

---

## 📞 BESOIN D'AIDE ?

### Pour la Phase 1 (No-code)
- **Tutoriels Airtable** : YouTube "Airtable français"
- **Aide Softr** : softr.io/help
- **Communauté** : Reddit r/nocode

### Pour la Phase 2 (Dev)
- **Cahier des charges** : Faites-le vous-même avec Notion
- **Choix du freelance** : Je peux vous aider à rédiger l'annonce
- **Suivi du projet** : Utilisez Trello ou Notion

---

## 💡 MON CONSEIL

**Commencez par la Phase 1 (No-code)** même si vous avez le budget pour un dev.

Pourquoi ?
1. Vous allez **comprendre** votre besoin réel
2. Vous pourrez **montrer** au dev exactement ce que vous voulez (pas de surprise)
3. Si ça suffit, vous économisez 8 000€
4. Si vous passez à la Phase 2, le dev repartira d'une base saine

**Règle d'or** : Un bon dev avec un mauvais cahier des charges = catastrophe.
Un no-code avec un bon cahier des charges = MVP fonctionnel.

---

*Document créé pour Slow Village - Janvier 2026*
