# AUDIT TECHNIQUE - SLOW VILLAGE QUALITÉ

**Date:** 30 Janvier 2026
**Auditeur:** Jules (Senior Full-Stack Architect)
**Version:** 2.0
**Statut:** 🔴 REFONTE OBLIGATOIRE

---

## 1. ARCHITECTURE & SCALABILITÉ

**Synthèse :**
L'architecture est un monolithe frontend "bricolé" en Vanilla JS sans framework moderne, couplé fortement à Supabase. Le code mélange vue, logique métier et accès aux données dans un fichier unique géant (`app.js`), rendant la maintenance impossible et la scalabilité nulle.

**Problèmes critiques :**
- **Spaghetti Code :** `js/app.js` (600+ lignes) gère tout : routing, appels API, UI, Auth. Impossible à maintenir.
- **Gestion d'état :** Variable globale `state` mutable, source de régressions infinies.

**Problèmes majeurs :**
- **Couplage fort :** Pas de séparation Front/Back réelle (le front tape directement la DB sans couche API intermédiaire sécurisée).
- **Point de congestion :** Le "polling" ou les requêtes non optimisées vers Supabase risquent d'exploser les quotas.

**Quick wins :**
- Extraire la logique API de `app.js` vers un `services/api.js`.
- Extraire la logique Auth vers `services/auth.js`.

**Refactoring long terme :**
- Migrer vers Next.js ou React + Vite.
- Implémenter une vraie architecture en couches (UI / State / Service).

**Note : 2/10**

---

## 2. CODE MORT & DETTE TECHNIQUE

**Synthèse :**
Le dépôt contient de nombreux scripts Python d'ETL obsolètes et des fichiers de données statiques massifs qui n'ont rien à faire dans le code source de l'application. La configuration `package.json` est trompeuse car non utilisée en production.

**Problèmes critiques :**
- **Dépendances locales hardcodées :** Scripts Python avec chemins absolus (`/Users/jb/...`).
- **Fichiers de données :** `js/data.js` contient tout l'historique en dur, alourdissant le chargement.

**Problèmes majeurs :**
- **Code inactif :** `package.json` présent mais projet servi comme fichiers statiques bruts.
- **Complexité :** Fonctions de rendu HTML concaténées (`renderCriteriaForm`) illisibles.

**Quick wins :**
- Supprimer les scripts Python ou les déplacer dans `scripts/legacy/`.
- Supprimer `package.json` s'il n'est pas utilisé, ou configurer un vrai build.

**Refactoring long terme :**
- Migrer les données de `js/data.js` vers la base de données Supabase.
- Mettre en place un vrai pipeline de build.

**Note : 1/10**

---

## 3. SÉCURITÉ (OWASP TOP 10)

**Synthèse :**
La sécurité est inexistante et catastrophique. Le projet repose sur la sécurité par l'obscurité avec des mots de passe admin en clair dans le code client, permettant à n'importe qui de prendre le contrôle total.

**Problèmes critiques :**
- **Hardcoded Secrets :** Mots de passe `admin` en clair dans `js/app.js` et `README.md`.
- **Broken Auth :** Authentification purement client-side (contournable en 2 secondes via la console DevTools).
- **Broken Access Control :** Clé `anon` Supabase probablement utilisée avec des droits d'écriture excessifs (RLS manquantes).

**Problèmes majeurs :**
- **XSS :** Usage massif de `innerHTML` sans sanitization des données affichées.
- **Manque de validation :** Aucune validation des entrées utilisateur côté "serveur" (Supabase).

**Quick wins :**
- Supprimer immédiatement les mots de passe du code source.
- Activer le Row Level Security (RLS) sur Supabase pour interdire l'écriture publique.

**Refactoring long terme :**
- Implémenter Supabase Auth (Email/Password) avec JWT.
- Sécuriser toutes les tables avec des politiques RLS strictes.

**Gravité : CRITIQUE**

---

## 4. PERFORMANCE FRONT-END

**Synthèse :**
L'application est légère par accident (peu d'assets), mais l'architecture de rendu via `innerHTML` est désastreuse pour l'expérience utilisateur (clignotements, perte de focus). Le chargement synchrone des données bloque le rendu initial.

**Problèmes critiques :**
- **Blocking JS :** Chargement synchrone de `js/data.js` (gros fichier) au démarrage.

**Problèmes majeurs :**
- **Re-renders complets :** Modification du DOM brut via `innerHTML` à chaque interaction.
- **Pas de cache :** Re-téléchargement des données à chaque rechargement de page.

**Quick wins :**
- Minifier les fichiers JS/CSS.
- Ajouter `defer` aux scripts dans `index.html`.

**Refactoring long terme :**
- Utiliser une librairie de Virtual DOM (React/Preact) pour des mises à jour ciblées.
- Implémenter du Code Splitting par route.

**Note : 4/10**

---

## 5. PERFORMANCE BACK-END & DATABASE

**Synthèse :**
Le client effectue des requêtes inefficaces (N+1) et charge trop de données inutiles. L'absence de cache et de pagination rendra l'application inutilisable dès que le volume de données augmentera.

**Problèmes critiques :**
- **N+1 Queries :** Boucles de requêtes dans le frontend pour récupérer les détails des audits.

**Problèmes majeurs :**
- **Select * :** Récupération de toutes les colonnes et toutes les lignes sans filtre ni pagination.
- **Absence d'index :** Probable manque d'index sur les colonnes de filtrage (site_id, periode).

**Quick wins :**
- Utiliser `.select('id, nom, ...')` pour ne récupérer que les champs nécessaires.
- Ajouter des index sur `audits(site_id)` et `audits(periode)`.

**Refactoring long terme :**
- Utiliser les JOINs Supabase pour récupérer les données en une seule requête.
- Mettre en place la pagination sur les listes d'audits.

**Gain estimé : -300ms/requête**

---

## 6. QUALITÉ DU CODE

**Synthèse :**
Code amateur sans aucun standard professionnel. L'absence totale de tests et de typage rend toute modification périlleuse. Le style de codage est incohérent et le nommage variable.

**Problèmes critiques :**
- **0% de Tests :** Aucun filet de sécurité. Une refonte casserait tout.
- **Pas de Linting :** Code non formaté, difficile à lire.

**Problèmes majeurs :**
- **Fonctions géantes :** `renderDashboard` fait plus de 100 lignes.
- **Nommage Franglais :** Mélange de `taux_conformite` et `CONFIG`.

**Quick wins :**
- Installer Prettier et formater tout le code.
- Découper les grosses fonctions en sous-fonctions nommées.

**Refactoring long terme :**
- Migrer vers TypeScript pour sécuriser les types.
- Écrire des tests E2E (Playwright) pour couvrir les parcours critiques.

**Note Sonarqube : E**

---

## 7. DEVOPS & PRODUCTION-READINESS

**Synthèse :**
Le projet n'est pas prêt pour la production. Il s'agit d'un prototype hébergé sans pipeline de déploiement, sans monitoring et sans gestion d'environnement sécurisée.

**Problèmes critiques :**
- **Pas de CI/CD :** Déploiement manuel ou magique via Vercel sans checks.
- **Secrets exposés :** Variables d'env dans le code.

**Problèmes majeurs :**
- **Pas de Monitoring :** Aucune remontée d'erreurs JS (Sentry).
- **Pas d'environnements :** Tout semble testé en production.

**Quick wins :**
- Configurer les variables d'environnement dans Vercel et les retirer du code.
- Mettre en place un linter dans un hook pre-commit.

**Refactoring long terme :**
- Mettre en place un pipeline GitHub Actions (Build, Test, Deploy).
- Séparer les environnements Staging / Production.

**Checklist : Incomplète**

---

## 8. TECHNOLOGIES & STACK

**Synthèse :**
La stack Frontend (Vanilla JS) est obsolète pour une application de gestion de cette complexité en 2025. Supabase est un bon choix mais mal utilisé.

**Problèmes critiques :**
- **Vanilla JS :** Trop verbeux et sujet aux erreurs pour une Single Page App complexe.

**Problèmes majeurs :**
- **Dépendances :** `package.json` déclare Vite mais il n'est pas utilisé.

**Quick wins :**
- Nettoyer `package.json`.

**Refactoring long terme :**
- Migration vers React + Vite + TypeScript.
- Standardiser la stack autour de Node.js modernes.

**Recommandation : Migration**

---

## 9. DOCUMENTATION & MAINTENABILITÉ

**Synthèse :**
Documentation minimaliste et dangereuse (secrets exposés). L'onboarding d'un nouveau développeur serait rapide (code simple) mais risqué (pas de garde-fous). Aucune documentation d'architecture ou d'API.

**Problèmes critiques :**
- **Secrets dans README :** Le README contient les mots de passe de production.
- **Pas d'ADR :** Aucune trace des décisions d'architecture.

**Problèmes majeurs :**
- **Commentaires :** Code peu commenté ou commentaires triviaux.
- **API non documentée :** Pas de schéma de la base Supabase ni de types.

**Quick wins :**
- Supprimer les secrets du README.
- Ajouter un schéma relationnel de la base de données (ERD).

**Refactoring long terme :**
- Rédiger un `CONTRIBUTING.md` avec les règles de dev.
- Documenter les règles métier complexes (calcul des scores).

**Note : 3/10**

---

## 10. VERDICT FINAL

**Note Globale : 25/100**

**Verdict : 🔴 REFONTE OBLIGATOIRE (< 50)**

**Estimation :**
- **15 jours** pour une réécriture complète en React/TypeScript avec une vraie sécurité.

**Deal-breakers :**
1.  **SÉCURITÉ :** Mots de passe en clair = accès total public.
2.  **ARCHITECTURE :** Monolithe JS impossible à maintenir.
3.  **TESTS :** Absence totale de tests.

**Conclusion :**
Ce projet est un prototype fonctionnel (POC) qui ne doit **jamais** aller en production en l'état. Il faut le considérer comme une spécification vivante pour la V2 qui doit être réécrite professionnellement.
