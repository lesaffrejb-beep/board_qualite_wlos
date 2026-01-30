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

// Données des critères par thème pour le formulaire de saisie
const CRITERES_DATA = {
    SEC: [
        { code: "SEC-1", text: "Le document unique d'évaluation des risques professionnels est disponible.", priorite: "P1", poids: 2 },
        { code: "SEC-2", text: "Le registre des accidents du travail est à jour et accessible.", priorite: "P1", poids: 2 },
        { code: "SEC-3", text: "Le plan d'évacuation est affiché dans les locaux.", priorite: "P1", poids: 2 },
        { code: "SEC-4", text: "Les issues de secours sont dégagées et signalées.", priorite: "P1", poids: 3 },
        { code: "SEC-5", text: "L'éclairage de sécurité est fonctionnel.", priorite: "P1", poids: 3 },
        { code: "SEC-6", text: "Le contrôle des installations électriques est à jour.", priorite: "P1", poids: 2 },
        { code: "SEC-7", text: "Le contrôle obligatoire est programmé avant ouverture.", priorite: "P1", poids: 3 },
        { code: "SEC-8", text: "Les réserves sont levées.", priorite: "P1", poids: 3 },
        { code: "SEC-9", text: "Le registre de sécurité est émargé (signature + tampon + date).", priorite: "P1", poids: 3 },
        { code: "SEC-10", text: "La vérification des extincteurs est à jour.", priorite: "P1", poids: 2 },
        { code: "SEC-11", text: "Les extincteurs sont en nombre suffisant.", priorite: "P1", poids: 3 },
        { code: "SEC-12", text: "Les extincteurs sont conformes et vérifiés.", priorite: "P1", poids: 2 },
        { code: "SEC-13", text: "Les extincteurs sont tous accessibles et dégagés.", priorite: "P1", poids: 3 },
        { code: "SEC-14", text: "La signalétique de sécurité est visible et lisible.", priorite: "P2", poids: 1 },
        { code: "SEC-15", text: "Les consignes de sécurité sont affichées.", priorite: "P2", poids: 1 },
        { code: "SEC-16", text: "Les formations sécurité du personnel sont à jour.", priorite: "P2", poids: 2 },
        { code: "SEC-17", text: "Les équipements de protection individuelle sont disponibles.", priorite: "P2", poids: 1 },
        { code: "SEC-18", text: "Le local technique est sécurisé et propre.", priorite: "P2", poids: 1 },
        { code: "SEC-19", text: "Les produits dangereux sont stockés correctement.", priorite: "P2", poids: 2 },
        { code: "SEC-20", text: "Les fiches de sécurité des produits sont disponibles.", priorite: "P2", poids: 1 },
        { code: "SEC-21", text: "La formation aux gestes de premiers secours est à jour.", priorite: "P2", poids: 1 },
        { code: "SEC-22", text: "La trousse de secours est complète et accessible.", priorite: "P2", poids: 1 },
        { code: "SEC-23", text: "Le défibrillateur est présent et fonctionnel.", priorite: "P2", poids: 1 },
        { code: "SEC-24", text: "Les checklists de sécurité sont remplies.", priorite: "P3", poids: 1 },
        { code: "SEC-25", text: "Les portes coupe-feu sont en bon état.", priorite: "P3", poids: 1 },
        { code: "SEC-26", text: "Les détecteurs de fumée sont fonctionnels.", priorite: "P2", poids: 2 },
        { code: "SEC-27", text: "Les issues de secours sont identifiables.", priorite: "P1", poids: 2 },
        { code: "SEC-28", text: "Les formations incendie sont à jour.", priorite: "P2", poids: 1 },
        { code: "SEC-29", text: "Les équipiers de sécurité sont identifiés.", priorite: "P2", poids: 1 },
        { code: "SEC-30", text: "Le document unique est mis à jour annuellement.", priorite: "P2", poids: 1 },
        { code: "SEC-31", text: "Les consignes d'évacuation sont connues du personnel.", priorite: "P1", poids: 2 },
        { code: "SEC-32", text: "Les exercices d'évacuation sont réalisés.", priorite: "P2", poids: 1 },
        { code: "SEC-33", text: "Le registre de sécurité est complet.", priorite: "P1", poids: 2 }
    ],
    AFF: [
        { code: "AFF-1", text: "Le logo Slow Village est visible à l'entrée.", priorite: "P1", poids: 2 },
        { code: "AFF-2", text: "La charte graphique est respectée.", priorite: "P1", poids: 2 },
        { code: "AFF-3", text: "Les horaires d'ouverture sont affichés.", priorite: "P1", poids: 2 },
        { code: "AFF-4", text: "Les tarifs sont clairement communiqués.", priorite: "P1", poids: 2 },
        { code: "AFF-5", text: "Les informations sur les services sont disponibles.", priorite: "P2", poids: 1 },
        { code: "AFF-6", text: "Les panneaux d'information sont lisibles.", priorite: "P2", poids: 1 },
        { code: "AFF-7", text: "La signalétique est cohérente.", priorite: "P2", poids: 1 },
        { code: "AFF-8", text: "Les menus sont affichés et à jour.", priorite: "P2", poids: 1 },
        { code: "AFF-9", text: "Les allergènes sont indiqués.", priorite: "P1", poids: 3 },
        { code: "AFF-10", text: "Les informations sur les activités sont disponibles.", priorite: "P2", poids: 1 },
        { code: "AFF-11", text: "Les règles intérieures sont affichées.", priorite: "P2", poids: 1 },
        { code: "AFF-12", text: "La politique de confidentialité est accessible.", priorite: "P2", poids: 1 },
        { code: "AFF-13", text: "Les mentions légales sont présentes.", priorite: "P2", poids: 1 },
        { code: "AFF-14", text: "Les numéros d'urgence sont affichés.", priorite: "P1", poids: 2 },
        { code: "AFF-15", text: "Les informations COVID sont à jour.", priorite: "P3", poids: 0 },
        { code: "AFF-16", text: "Les avis clients sont valorisés.", priorite: "P3", poids: 1 },
        { code: "AFF-17", text: "Les supports de communication sont en bon état.", priorite: "P2", poids: 1 },
        { code: "AFF-18", text: "La brochure des services est disponible.", priorite: "P2", poids: 1 },
        { code: "AFF-19", text: "Le plan du site est affiché.", priorite: "P2", poids: 1 },
        { code: "AFF-20", text: "Les consignes de tri sont visibles.", priorite: "P2", poids: 1 },
        { code: "AFF-21", text: "Les informations sur la réglementation locale sont affichées.", priorite: "P3", poids: 0 },
        { code: "AFF-22", text: "Registre sécurité incendie.", priorite: "P1", poids: 3 },
        { code: "AFF-23", text: "Les procédures d'urgence sont affichées.", priorite: "P1", poids: 2 },
        { code: "AFF-24", text: "Les contacts utiles sont disponibles.", priorite: "P2", poids: 1 },
        { code: "AFF-25", text: "La signalétique extérieure est visible.", priorite: "P2", poids: 1 },
        { code: "AFF-26", text: "Registre sécurité incendie.", priorite: "P1", poids: 3 }
    ],
    EXP: [
        { code: "EXP-1", text: "L'accueil est chaleureux et personnalisé.", priorite: "P1", poids: 3 },
        { code: "EXP-2", text: "Les délais d'attente sont raisonnables.", priorite: "P1", poids: 2 },
        { code: "EXP-3", text: "Le personnel est identifiable.", priorite: "P1", poids: 2 },
        { code: "EXP-4", text: "Les tenues sont conformes.", priorite: "P2", poids: 1 },
        { code: "EXP-5", text: "Le langage utilisé est adapté.", priorite: "P2", poids: 1 },
        { code: "EXP-6", text: "Les demandes des clients sont traitées rapidement.", priorite: "P1", poids: 2 },
        { code: "EXP-7", text: "Les réclamations sont gérées efficacement.", priorite: "P1", poids: 2 },
        { code: "EXP-8", text: "Les espaces communs sont confortables.", priorite: "P2", poids: 1 },
        { code: "EXP-9", text: "La propreté est irréprochable.", priorite: "P1", poids: 3 },
        { code: "EXP-10", text: "Les équipements sont fonctionnels.", priorite: "P1", poids: 2 },
        { code: "EXP-11", text: "La décoration est en lien avec l'identité Slow Village.", priorite: "P2", poids: 1 },
        { code: "EXP-12", text: "L'ambiance sonore est adaptée.", priorite: "P3", poids: 1 },
        { code: "EXP-13", text: "Les espaces sont bien éclairés.", priorite: "P2", poids: 1 },
        { code: "EXP-14", text: "La température est confortable.", priorite: "P2", poids: 1 },
        { code: "EXP-15", text: "Les odeurs sont agréables.", priorite: "P2", poids: 1 },
        { code: "EXP-16", text: "Les clients sont salués à leur arrivée.", priorite: "P1", poids: 2 },
        { code: "EXP-17", text: "Les clients sont remerciés au départ.", priorite: "P1", poids: 2 },
        { code: "EXP-18", text: "Les attentes des clients sont anticipées.", priorite: "P2", poids: 1 },
        { code: "EXP-19", text: "Les services sont proposés de manière proactive.", priorite: "P2", poids: 1 },
        { code: "EXP-20", text: "La relation client est personnalisée.", priorite: "P1", poids: 2 },
        { code: "EXP-21", text: "Les réservations sont gérées efficacement.", priorite: "P1", poids: 2 },
        { code: "EXP-22", text: "Les départs sont fluides.", priorite: "P1", poids: 2 }
    ],
    QUA: [
        { code: "QUA-1", text: "Les procédures d'ouverture sont respectées.", priorite: "P1", poids: 2 },
        {code: "QUA-2", text: "Les procédures de fermeture sont respectées.", priorite: "P1", poids: 2 },
        { code: "QUA-3", text: "Les standards de propreté sont atteints.", priorite: "P1", poids: 3 },
        { code: "QUA-4", text: "Les checklists sont remplies.", priorite: "P1", poids: 2 },
        { code: "QUA-5", text: "Les stocks sont gérés correctement.", priorite: "P2", poids: 1 },
        { code: "QUA-6", text: "La rotation des produits est respectée.", priorite: "P2", poids: 1 },
        { code: "QUA-7", text: "Les produits sont de qualité.", priorite: "P1", poids: 2 },
        { code: "QUA-8", text: "Les fournisseurs sont conformes.", priorite: "P2", poids: 1 },
        { code: "QUA-9", text: "La traçabilité des produits est assurée.", priorite: "P1", poids: 2 },
        { code: "QUA-10", text: "Les températures de conservation sont respectées.", priorite: "P1", poids: 3 },
        { code: "QUA-11", text: "Les équipements sont entretenus.", priorite: "P2", poids: 1 },
        { code: "QUA-12", text: "La maintenance préventive est réalisée.", priorite: "P2", poids: 1 },
        { code: "QUA-13", text: "Les pannes sont traitées rapidement.", priorite: "P1", poids: 2 },
        { code: "QUA-14", text: "Les espaces sont fonctionnels.", priorite: "P2", poids: 1 },
        { code: "QUA-15", text: "Les normes d'hygiène sont respectées.", priorite: "P1", poids: 3 },
        { code: "QUA-16", text: "Le personnel est formé aux bonnes pratiques.", priorite: "P1", poids: 2 },
        { code: "QUA-17", text: "Les produits d'entretien sont adaptés.", priorite: "P2", poids: 1 },
        { code: "QUA-18", text: "Les protocoles sont documentés.", priorite: "P2", poids: 1 },
        { code: "QUA-19", text: "Les contrôles qualité sont effectués.", priorite: "P2", poids: 1 },
        { code: "QUA-20", text: "Les écarts sont traités.", priorite: "P1", poids: 2 },
        { code: "QUA-21", text: "Le TPE est présent et en état de fonctionnement.", priorite: "P1", poids: 3 },
        { code: "QUA-22", text: "Les caisses sont équilibrées.", priorite: "P1", poids: 2 },
        { code: "QUA-23", text: "Les procédures de sécurité cash sont respectées.", priorite: "P1", poids: 2 },
        { code: "QUA-24", text: "Les inventaires sont réguliers.", priorite: "P2", poids: 1 },
        { code: "QUA-25", text: "Les écarts d'inventaire sont justifiés.", priorite: "P2", poids: 1 },
        { code: "QUA-26", text: "Les commandes sont optimisées.", priorite: "P3", poids: 0 },
        { code: "QUA-27", text: "Les coûts sont maîtrisés.", priorite: "P3", poids: 0 },
        { code: "QUA-28", text: "Les pertes sont minimisées.", priorite: "P2", poids: 1 },
        { code: "QUA-29", text: "Les fournisseurs alternatifs sont identifiés.", priorite: "P3", poids: 0 },
        { code: "QUA-30", text: "Les négociations sont menées.", priorite: "P3", poids: 0 },
        { code: "QUA-31", text: "Les contrats sont respectés.", priorite: "P2", poids: 1 },
        { code: "QUA-32", text: "Les relances sont effectuées.", priorite: "P2", poids: 1 },
        { code: "QUA-33", text: "La qualité est monitorée.", priorite: "P2", poids: 1 }
    ],
    IMA: [
        { code: "IMA-1", text: "L'identité visuelle est respectée.", priorite: "P1", poids: 2 },
        { code: "IMA-2", text: "Les couleurs de la marque sont utilisées.", priorite: "P1", poids: 2 },
        { code: "IMA-3", text: "La typographie est conforme.", priorite: "P2", poids: 1 },
        { code: "IMA-4", text: "Les photos sont de qualité.", priorite: "P2", poids: 1 },
        { code: "IMA-5", text: "Les messages sont cohérents.", priorite: "P2", poids: 1 },
        { code: "IMA-6", text: "La présence digitale est active.", priorite: "P2", poids: 1 },
        { code: "IMA-7", text: "Les avis en ligne sont gérés.", priorite: "P2", poids: 1 },
        { code: "IMA-8", text: "Le site web est à jour.", priorite: "P2", poids: 1 },
        { code: "IMA-9", text: "Les réseaux sociaux sont animés.", priorite: "P3", poids: 0 },
        { code: "IMA-10", text: "La newsletter est envoyée régulièrement.", priorite: "P3", poids: 0 },
        { code: "IMA-11", text: "Les campagnes sont cohérentes.", priorite: "P2", poids: 1 },
        { code: "IMA-12", text: "Les partenariats sont valorisés.", priorite: "P3", poids: 0 },
        { code: "IMA-13", text: "L'environnement est préservé.", priorite: "P2", poids: 1 },
        { code: "IMA-14", text: "Les espaces verts sont entretenus.", priorite: "P2", poids: 1 },
        { code: "IMA-15", text: "La propreté extérieure est assurée.", priorite: "P1", poids: 2 },
        { code: "IMA-16", text: "L'éclairage extérieur est fonctionnel.", priorite: "P2", poids: 1 },
        { code: "IMA-17", text: "Les parkings sont bien signalés.", priorite: "P2", poids: 1 },
        { code: "IMA-18", text: "L'accessibilité est assurée.", priorite: "P1", poids: 2 },
        { code: "IMA-19", text: "Les PMR sont accompagnés.", priorite: "P1", poids: 2 },
        { code: "IMA-20", text: "Les animaux sont acceptés selon règlement.", priorite: "P2", poids: 1 },
        { code: "IMA-21", text: "La tranquillité des clients est respectée.", priorite: "P1", poids: 2 },
        { code: "IMA-22", text: "Les nuisances sont limitées.", priorite: "P2", poids: 1 }
    ],
    RES: [
        { code: "RES-1", text: "La politique environnementale est affichée.", priorite: "P2", poids: 1 },
        { code: "RES-2", text: "Les objectifs éco-responsables sont définis.", priorite: "P3", poids: 0 },
        { code: "RES-3", text: "Les consommations d'énergie sont suivies.", priorite: "P2", poids: 1 },
        { code: "RES-4", text: "Les économies d'énergie sont mises en œuvre.", priorite: "P2", poids: 1 },
        { code: "RES-5", text: "Le tri sélectif est respecté.", priorite: "P2", poids: 1 },
        { code: "RES-6", text: "Le compostage est mis en place.", priorite: "P3", poids: 0 },
        { code: "RES-7", text: "Les produits locaux sont privilégiés.", priorite: "P2", poids: 1 },
        { code: "RES-8", text: "Les produits bio sont proposés.", priorite: "P3", poids: 0 },
        { code: "RES-9", text: "La gestion des déchets est optimisée.", priorite: "P2", poids: 1 },
        { code: "RES-10", text: "La réduction des emballages est encouragée.", priorite: "P3", poids: 0 },
        { code: "RES-11", text: "Les fournisseurs éco-responsables sont privilégiés.", priorite: "P3", poids: 0 },
        { code: "RES-12", text: "La sensibilisation du personnel est réalisée.", priorite: "P3", poids: 0 }
    ],
    RH: [
        { code: "RH-1", text: "Les contrats de travail sont conformes.", priorite: "P1", poids: 2 },
        { code: "RH-2", text: "Les fiches de poste sont à jour.", priorite: "P2", poids: 1 },
        { code: "RH-3", text: "Les plannings sont établis.", priorite: "P1", poids: 2 },
        { code: "RH-4", text: "Les heures sont respectées.", priorite: "P1", poids: 2 },
        { code: "RH-5", text: "Les pauses sont accordées.", priorite: "P1", poids: 2 },
        { code: "RH-6", text: "Les congés sont planifiés.", priorite: "P2", poids: 1 },
        { code: "RH-7", text: "Les remplacements sont assurés.", priorite: "P1", poids: 2 },
        { code: "RH-8", text: "Les formations sont planifiées.", priorite: "P2", poids: 1 },
        { code: "RH-9", text: "Les évaluations sont réalisées.", priorite: "P2", poids: 1 },
        { code: "RH-10", text: "Les entretiens annuels sont menés.", priorite: "P2", poids: 1 },
        { code: "RH-11", text: "La politique salariale est appliquée.", priorite: "P2", poids: 1 },
        { code: "RH-12", text: "Les avantages sont communiqués.", priorite: "P3", poids: 0 },
        { code: "RH-13", text: "L'ambiance de travail est saine.", priorite: "P1", poids: 2 },
        { code: "RH-14", text: "Les conflits sont gérés.", priorite: "P1", poids: 2 },
        { code: "RH-15", text: "La communication interne est fluide.", priorite: "P2", poids: 1 },
        { code: "RH-16", text: "Les réunions d'équipe sont régulières.", priorite: "P2", poids: 1 },
        { code: "RH-17", text: "Les informations sont partagées.", priorite: "P2", poids: 1 },
        { code: "RH-18", text: "Le personnel est motivé.", priorite: "P2", poids: 1 },
        { code: "RH-19", text: "Le turn-over est maîtrisé.", priorite: "P2", poids: 1 },
        { code: "RH-20", text: "Les recrutements sont anticipés.", priorite: "P2", poids: 1 },
        { code: "RH-21", text: "Les intégrations sont structurées.", priorite: "P2", poids: 1 },
        { code: "RH-22", text: "Les départs sont gérés.", priorite: "P2", poids: 1 }
    ],
    SLO: [
        { code: "SLO-1", text: "L'esprit Slow Village est incarné.", priorite: "P1", poids: 3 },
        { code: "SLO-2", text: "La philosophie est comprise par le personnel.", priorite: "P1", poids: 2 },
        { code: "SLO-3", text: "Les valeurs sont partagées.", priorite: "P1", poids: 2 },
        { code: "SLO-4", text: "La déconnexion est encouragée.", priorite: "P2", poids: 1 },
        { code: "SLO-5", text: "Le rythme est respectueux.", priorite: "P1", poids: 2 },
        { code: "SLO-6", text: "La nature est mise en valeur.", priorite: "P2", poids: 1 },
        { code: "SLO-7", text: "Les activités slow sont proposées.", priorite: "P2", poids: 1 },
        { code: "SLO-8", text: "La gastronomie locale est privilégiée.", priorite: "P2", poids: 1 },
        { code: "SLO-9", text: "Les produits du terroir sont mis en avant.", priorite: "P2", poids: 1 },
        { code: "SLO-10", text: "Les artisans locaux sont valorisés.", priorite: "P3", poids: 0 },
        { code: "SLO-11", text: "Les partenariats locaux sont développés.", priorite: "P3", poids: 0 },
        { code: "SLO-12", text: "L'authenticité est préservée.", priorite: "P1", poids: 2 },
        { code: "SLO-13", text: "Les traditions sont respectées.", priorite: "P2", poids: 1 },
        { code: "SLO-14", text: "Le lien social est favorisé.", priorite: "P2", poids: 1 },
        { code: "SLO-15", text: "La convivialité est encouragée.", priorite: "P1", poids: 2 },
        { code: "SLO-16", text: "Les espaces de partage sont aménagés.", priorite: "P2", poids: 1 },
        { code: "SLO-17", text: "Les animations sont proposées.", priorite: "P2", poids: 1 },
        { code: "SLO-18", text: "La bienveillance est de mise.", priorite: "P1", poids: 2 },
        { code: "SLO-19", text: "L'écoute est privilégiée.", priorite: "P1", poids: 2 },
        { code: "SLO-20", text: "La simplicité est recherchée.", priorite: "P2", poids: 1 }
    ]
};

// Statuts possibles pour un critère
const CRITERIA_STATUS = {
    C: { label: 'Conforme', class: 'c' },
    NC: { label: 'Non conforme', class: 'nc' },
    EC: { label: 'En cours', class: 'ec' },
    NA: { label: 'N/A', class: 'na' }
};

// Export pour utilisation dans app.js
window.SlowVillageData = {
    global: GLOBAL_STATS,
    sites: SITES_DATA,
    matrice: MATRICE_RISQUE,
    themes: THEMES_DATA,
    risques: TOP_RISQUES,
    criteres: CRITERES_DATA,
    status: CRITERIA_STATUS,
    supabaseConfig: SUPABASE_CONFIG
};
