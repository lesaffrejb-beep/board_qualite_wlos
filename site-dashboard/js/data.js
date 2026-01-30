/**
 * SLOW VILLAGE - Données d'audit
 * Extraites des fichiers Excel - Janvier 2026
 *
 * Ce fichier contient les données structurées prêtes pour Supabase
 * Pour migrer vers Supabase, remplacer ces constantes par des appels API
 */

// Configuration Supabase (pour migration future)
const SUPABASE_CONFIG = {
    url: 'YOUR_SUPABASE_URL',
    anonKey: 'YOUR_SUPABASE_ANON_KEY',
    // Activer quand prêt
    enabled: false
};

// Données globales du groupe
const GLOBAL_STATS = {
    total_sites: 11,
    total_criteres: 17083,
    taux_conformite_brut: 8.2,
    taux_conformite_pondere: 48.2,
    total_bloquants: 250,
    p1_non_conformes: 278,
    p2_non_conformes: 1913,
    en_cours: 11191,
    na: 1548,
    date_audit: "Janvier 2026"
};

// Classement des sites (données extraites des Excel)
const SITES_DATA = [
    {
        id: 1,
        nom: "L'Orée de l'Océan",
        taux_conformite_brut: 8.69,
        taux_conformite_pondere: 72.57,
        taux_nc: 20.93,
        indice_risque: 84.03,
        score_maturite: 40.1,
        coefficient_dispersion: 0.173,
        nb_bloquants: 15,
        p1_non_conformes: 38,
        score_global: 52.52,
        rang: 1
    },
    {
        id: 2,
        nom: "Anduze",
        taux_conformite_brut: 15.78,
        taux_conformite_pondere: 66.19,
        taux_nc: 24.4,
        indice_risque: 92.5,
        score_maturite: 44.02,
        coefficient_dispersion: 0.502,
        nb_bloquants: 15,
        p1_non_conformes: 34,
        score_global: 46.16,
        rang: 2
    },
    {
        id: 3,
        nom: "Séveilles",
        taux_conformite_brut: 30.33,
        taux_conformite_pondere: 30.11,
        taux_nc: 9.21,
        indice_risque: 32.99,
        score_maturite: 58.85,
        coefficient_dispersion: 0.85,
        nb_bloquants: 29,
        p1_non_conformes: 13,
        score_global: 44.6,
        rang: 3
    },
    {
        id: 4,
        nom: "Saint Martin de Ré 2026",
        taux_conformite_brut: 3.09,
        taux_conformite_pondere: 60.8,
        taux_nc: 21.7,
        indice_risque: 85.0,
        score_maturite: 38.39,
        coefficient_dispersion: 0.465,
        nb_bloquants: 33,
        p1_non_conformes: 21,
        score_global: 44.19,
        rang: 4
    },
    {
        id: 5,
        nom: "La Roque sur Cèze",
        taux_conformite_brut: 13.01,
        taux_conformite_pondere: 56.87,
        taux_nc: 19.06,
        indice_risque: 71.53,
        score_maturite: 45.04,
        coefficient_dispersion: 0.818,
        nb_bloquants: 20,
        p1_non_conformes: 27,
        score_global: 43.77,
        rang: 5
    },
    {
        id: 6,
        nom: "Saint Cybranet",
        taux_conformite_brut: 5.47,
        taux_conformite_pondere: 89.37,
        taux_nc: 35.74,
        indice_risque: 132.99,
        score_maturite: 33.41,
        coefficient_dispersion: 0.59,
        nb_bloquants: 3,
        p1_non_conformes: 39,
        score_global: 43.27,
        rang: 6
    },
    {
        id: 7,
        nom: "Saint Martin de Ré",
        taux_conformite_brut: 1.55,
        taux_conformite_pondere: 54.87,
        taux_nc: 19.7,
        indice_risque: 78.82,
        score_maturite: 38.8,
        coefficient_dispersion: 0.489,
        nb_bloquants: 33,
        p1_non_conformes: 23,
        score_global: 42.93,
        rang: 7
    },
    {
        id: 8,
        nom: "Biscarrosse Lac",
        taux_conformite_brut: 6.12,
        taux_conformite_pondere: 37.0,
        taux_nc: 13.91,
        indice_risque: 61.53,
        score_maturite: 44.78,
        coefficient_dispersion: 0.528,
        nb_bloquants: 24,
        p1_non_conformes: 33,
        score_global: 40.65,
        rang: 8
    },
    {
        id: 9,
        nom: "Marennes Oléron",
        taux_conformite_brut: 3.03,
        taux_conformite_pondere: 27.62,
        taux_nc: 8.89,
        indice_risque: 37.22,
        score_maturite: 45.71,
        coefficient_dispersion: 0.843,
        nb_bloquants: 13,
        p1_non_conformes: 25,
        score_global: 38.89,
        rang: 9
    },
    {
        id: 10,
        nom: "Pornic 2026",
        taux_conformite_brut: 1.16,
        taux_conformite_pondere: 27.58,
        taux_nc: 10.95,
        indice_risque: 43.75,
        score_maturite: 43.84,
        coefficient_dispersion: 0.798,
        nb_bloquants: 30,
        p1_non_conformes: 13,
        score_global: 37.45,
        rang: 10
    },
    {
        id: 11,
        nom: "Les Ponts de Cé",
        taux_conformite_brut: 1.74,
        taux_conformite_pondere: 14.86,
        taux_nc: 5.28,
        indice_risque: 29.86,
        score_maturite: 47.22,
        coefficient_dispersion: 1.043,
        nb_bloquants: 35,
        p1_non_conformes: 12,
        score_global: 34.14,
        rang: 11
    }
];

// Matrice de risque (données agrégées)
const MATRICE_RISQUE = {
    P0: { conforme: 0, non_conforme: 0, en_cours: 0, na: 0 },
    P1: { conforme: 85, non_conforme: 278, en_cours: 130, na: 134 },
    P2: { conforme: 701, non_conforme: 1913, en_cours: 1418, na: 907 },
    P3: { conforme: 611, non_conforme: 756, en_cours: 9643, na: 507 }
};

// Statistiques par thème
const THEMES_DATA = {
    AFF: {
        code: "AFF",
        nom: "Affichage & Communication",
        conforme: 271,
        non_conforme: 352,
        en_cours: 1624,
        na: 184,
        total: 2431,
        p1_nc: 14,
        p1_total: 22,
        score: 45
    },
    EXP: {
        code: "EXP",
        nom: "Expérience Client",
        conforme: 199,
        non_conforme: 368,
        en_cours: 976,
        na: 371,
        total: 1914,
        p1_nc: 14,
        p1_total: 22,
        score: 38
    },
    IMA: {
        code: "IMA",
        nom: "Image & Marque",
        conforme: 218,
        non_conforme: 735,
        en_cours: 696,
        na: 232,
        total: 1881,
        p1_nc: 10,
        p1_total: 22,
        score: 32
    },
    QUA: {
        code: "QUA",
        nom: "Qualité Opérationnelle",
        conforme: 63,
        non_conforme: 279,
        en_cours: 1489,
        na: 83,
        total: 1914,
        p1_nc: 21,
        p1_total: 33,
        score: 25
    },
    RES: {
        code: "RES",
        nom: "Responsabilité Env.",
        conforme: 2,
        non_conforme: 12,
        en_cours: 1867,
        na: 33,
        total: 1914,
        p1_nc: 0,
        p1_total: 0,
        score: 15
    },
    RH: {
        code: "RH",
        nom: "Ressources Humaines",
        conforme: 126,
        non_conforme: 268,
        en_cours: 1463,
        na: 57,
        total: 1914,
        p1_nc: 0,
        p1_total: 0,
        score: 35
    },
    SEC: {
        code: "SEC",
        nom: "Sécurité",
        conforme: 340,
        non_conforme: 753,
        en_cours: 1636,
        na: 472,
        total: 3201,
        p1_nc: 219,
        p1_total: 528,
        score: 42
    },
    SLO: {
        code: "SLO",
        nom: "Slow Village Spirit",
        conforme: 178,
        non_conforme: 180,
        en_cours: 1440,
        na: 116,
        total: 1914,
        p1_nc: 0,
        p1_total: 0,
        score: 50
    }
};

// Top risques (P1 non conformes les plus répandus)
const TOP_RISQUES = [
    {
        code: "SEC-7",
        nb_sites: 9,
        theme: "SEC",
        priorite: "P1",
        critere: "Le contrôle obligatoire est programmé avant ouverture.",
        sites: ["Anduze", "Biscarrosse Lac", "L'Orée de l'Océan", "La Roque sur Cèze", "Les Ponts de Cé", "Marennes Oléron", "Pornic 2026", "Saint Cybranet", "Séveilles"]
    },
    {
        code: "SEC-8",
        nb_sites: 9,
        theme: "SEC",
        priorite: "P1",
        critere: "Les réserves sont levées.",
        sites: ["Anduze", "Biscarrosse Lac", "L'Orée de l'Océan", "La Roque sur Cèze", "Les Ponts de Cé", "Marennes Oléron", "Pornic 2026", "Saint Cybranet", "Séveilles"]
    },
    {
        code: "SEC-9",
        nb_sites: 9,
        theme: "SEC",
        priorite: "P1",
        critere: "Le registre de sécurité est émargé (signature + tampon + date).",
        sites: ["Anduze", "Biscarrosse Lac", "L'Orée de l'Océan", "La Roque sur Cèze", "Les Ponts de Cé", "Marennes Oléron", "Pornic 2026", "Saint Cybranet", "Séveilles"]
    },
    {
        code: "SEC-11",
        nb_sites: 9,
        theme: "SEC",
        priorite: "P1",
        critere: "Les extincteurs sont en nombre suffisant.",
        sites: ["Anduze", "Biscarrosse Lac", "L'Orée de l'Océan", "Les Ponts de Cé", "Marennes Oléron", "Pornic 2026", "Saint Cybranet", "Saint Martin de Ré 2026", "Séveilles"]
    },
    {
        code: "SEC-13",
        nb_sites: 9,
        theme: "SEC",
        priorite: "P1",
        critere: "Les extincteurs sont tous accessibles et dégagés.",
        sites: ["Anduze", "Biscarrosse Lac", "L'Orée de l'Océan", "La Roque sur Cèze", "Les Ponts de Cé", "Marennes Oléron", "Pornic 2026", "Saint Cybranet", "Séveilles"]
    },
    {
        code: "AFF-26",
        nb_sites: 8,
        theme: "AFF",
        priorite: "P1",
        critere: "Registre sécurité incendie.",
        sites: ["Anduze", "Biscarrosse Lac", "L'Orée de l'Océan", "Les Ponts de Cé", "Marennes Oléron", "Saint Cybranet", "Saint Martin de Ré 2026", "Saint Martin de Ré"]
    },
    {
        code: "QUA-21",
        nb_sites: 8,
        theme: "QUA",
        priorite: "P1",
        critere: "Le TPE est présent et en état de fonctionnement.",
        sites: ["Anduze", "Biscarrosse Lac", "L'Orée de l'Océan", "La Roque sur Cèze", "Marennes Oléron", "Saint Cybranet", "Saint Martin de Ré 2026", "Saint Martin de Ré"]
    },
    {
        code: "SEC-188",
        nb_sites: 8,
        theme: "SEC",
        priorite: "P1",
        critere: "Pas de rallonges en cascade ou prises multiples à risque.",
        sites: ["Anduze", "Biscarrosse Lac", "La Roque sur Cèze", "Marennes Oléron", "Saint Cybranet", "Saint Martin de Ré 2026", "Saint Martin de Ré", "Séveilles"]
    }
];

// Export pour utilisation dans app.js
window.SlowVillageData = {
    global: GLOBAL_STATS,
    sites: SITES_DATA,
    matrice: MATRICE_RISQUE,
    themes: THEMES_DATA,
    risques: TOP_RISQUES,
    supabaseConfig: SUPABASE_CONFIG
};
