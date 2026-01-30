#!/usr/bin/env python3
"""
Génération du rapport final enrichi - Slow Village Audit Qualité v2
Données : scores pondérés, matrice risque, classement multicritère
"""

import json
from pathlib import Path
from datetime import datetime

AUDIT_DIR = Path("/Users/jb/Documents/SYNTHESE_AUDIT_QUALITE")

def load_data():
    with open(AUDIT_DIR / "synthese_data_complete.json") as f:
        return json.load(f)

def load_analyse_risques():
    with open(AUDIT_DIR / "analyse_risques.json") as f:
        return json.load(f)

def generer_rapport():
    data = load_data()
    risques = load_analyse_risques()
    
    # Stats globales
    total_criteres = sum(s['global_stats']['total'] for s in data)
    total_conforme = sum(s['global_stats']['conforme'] for s in data)
    total_nc = sum(s['global_stats']['non_conforme'] for s in data)
    total_ec = sum(s['global_stats']['en_cours'] for s in data)
    total_na = sum(s['global_stats']['na'] for s in data)
    
    total_bloquants = sum(s['nb_bloquants'] for s in data)
    
    # Stats pondérées groupe
    total_obtenu_groupe = sum(s['global_stats_ponderees']['obtenu'] for s in data)
    total_possible_groupe = sum(s['global_stats_ponderees']['possible'] for s in data)
    taux_pondere_groupe = (total_obtenu_groupe / total_possible_groupe * 100) if total_possible_groupe > 0 else 0
    
    # Matrice risque
    matrice = risques['matrice_risque']
    p1_nc = matrice['P1']['non_conforme']
    p1_total = sum(matrice['P1'].values())
    
    with open(AUDIT_DIR / "SYNTHESE_AUDIT_QUALITE_SLOW_VILLAGE.md", 'w') as f:
        f.write(f"""# 🎯 SYNTHÈSE AUDIT QUALITÉ GROUPE SLOW VILLAGE

**Établi par** : Marie-Claude Fortier, Senior Audit & Quality Excellence Manager (15 ans d'expérience)  
**Date** : {datetime.now().strftime('%d/%m/%Y')}  
**Périmètre** : {len(data)} sites | {total_criteres:,} critères audités  
**Destinataire** : Agnès, Responsable Exploitation & Qualité Slow Village

---

## 📋 RÉSUMÉ EXÉCUTIF

> **Contexte** : Audit qualité multi-sites du groupe Slow Village portant sur 8 thématiques opérationnelles (Affichage, Exploitation, Image, Qualité, Résidents, RH, Sécurité, Identité Marque).

> **Constat Global** : Sur {total_criteres:,} critères audités :
> - **Taux conformité brut** : {total_conforme/total_criteres*100:.1f}% (comptage simple)
> - **📊 Taux conformité pondéré** : **{taux_pondere_groupe:.1f}%** (avec pondération des scores)
> - **🚨 Critères bloquants** : {total_bloquants} items à traiter immédiatement
> - **⚠️ P1 Non conformes** : {p1_nc} critères prioritaires en écart ({p1_nc/p1_total*100:.1f}% des P1)

> **Approche** : Cette synthèse adopte une posture **bienveillante et orientée solution**. L'objectif n'est pas de pointer les faiblesses d'un site en particulier, mais d'**identifier les patterns récurrents** pour déployer des solutions mutualisées au niveau groupe.

---

# 📊 PARTIE 1 : MÉTA-SYNTHÈSE DATA (Données factuelles)

## 1.1 | Vue d'Ensemble Groupe - Double Lecture

### Comptage brut (nombre de critères)

| Métrique | Valeur | % |
|----------|--------|----|
| Total critères audités | {total_criteres:,} | 100% |
| ✅ Conforme | {total_conforme:,} | **{total_conforme/total_criteres*100:.1f}%** |
| ❌ Non conforme | {total_nc:,} | **{total_nc/total_criteres*100:.1f}%** |
| 🔄 En cours | {total_ec:,} | **{total_ec/total_criteres*100:.1f}%** |
| ⚪ Non applicable (N/A) | {total_na:,} | **{total_na/total_criteres*100:.1f}%** |

### Scoring pondéré (par importance des critères)

| Métrique | Valeur | % |
|----------|--------|----|
| Score total obtenu | {total_obtenu_groupe:.0f} | - |
| Score total possible | {total_possible_groupe:.0f} | - |
| **📊 Taux conformité pondéré** | - | **{taux_pondere_groupe:.1f}%** |
| 🚨 Critères bloquants | {total_bloquants} | - |

### 🎯 Pourquoi deux mesures ?
- **Comptage brut** : Donne le volume d'actions à traiter
- **Scoring pondéré** : Donne la réelle conformité au regard des enjeux (certains critères valent plus que d'autres)

---

## 1.2 | Matrice de Risque (Priorité × Statut)

*Distribution des {total_criteres:,} critères selon leur criticité et leur état*

| Priorité | ✅ Conforme | ❌ Non conforme | 🔄 En cours | ⚪ N/A | **Total** | Risque |
|----------|------------|----------------|------------|--------|-----------|--------|
""")
        
        for prio in ['P0', 'P1', 'P2', 'P3']:
            total_prio = sum(matrice[prio].values())
            pct_nc = (matrice[prio]['non_conforme'] / total_prio * 100) if total_prio > 0 else 0
            risque_icon = "🔴" if prio in ['P0', 'P1'] and pct_nc > 30 else "🟡" if pct_nc > 15 else "🟢"
            f.write(f"| **{prio}** | {matrice[prio]['conforme']:,} | "
                    f"**{matrice[prio]['non_conforme']:,}** | "
                    f"{matrice[prio]['en_cours']:,} | "
                    f"{matrice[prio]['na']:,} | "
                    f"{total_prio:,} | {risque_icon} {pct_nc:.1f}% NC |\n")
        
        f.write(f"""
### 🚨 Lecture de la matrice

- **P1 (Prioritaires)** : {p1_nc} non conformes = risques majeurs à traiter en priorité
- **P2 (Standards)** : {matrice['P2']['non_conforme']:,} non conformes = actions de fond à planifier
- **P3 (Souhaitables)** : {matrice['P3']['non_conforme']:,} non conformes sur {sum(matrice['P3'].values()):,} = faible impact

---

## 1.3 | Classement Multicritère des Sites

*Classement par score composite prenant en compte : taux pondéré (40%), maturité (30%), risque (20%), homogénéité (10%)*

| Rang | Site | Score Global | Taux Brut% | Taux Pondéré% | Indice Risque | Maturité% | CV* | P1-NC | Bloquants |
|------|------|-------------|------------|---------------|---------------|-----------|-----|-------|-----------|
""")
        
        for item in risques['classement_sites']:
            f.write(f"| {item['rang']} | **{item['site']}** | **{item['score_global']:.1f}** | "
                    f"{item['taux_conformite_brut']:.1f} | {item['taux_conformite_pondere']:.1f} | "
                    f"{item['indice_risque']:.1f} | {item['score_maturite']:.1f} | "
                    f"{item['coefficient_dispersion']:.3f} | {item['p1_non_conformes']} | {item['nb_bloquants']} |\n")
        
        f.write("""
*CV = Coefficient de Variation (dispersion entre thèmes). Proche de 0 = site homogène*

### 🏆 Sites Leaders (Score > 50)
""")
        
        leaders = [s for s in risques['classement_sites'] if s['score_global'] > 50]
        if leaders:
            for item in leaders[:3]:
                f.write(f"- **{item['site']}** (Score {item['score_global']:.1f}) : "
                        f"Taux pondéré {item['taux_conformite_pondere']:.1f}%, "
                        f"risque {item['indice_risque']:.1f} - Site référence\n")
        else:
            best = risques['classement_sites'][0]
            f.write(f"- **{best['site']}** (Score {best['score_global']:.1f}) : "
                    f"Meilleur site du groupe, potentiel essaimage\n")
        
        f.write(f"""
### ⚠️ Sites à Accompagner Prioritairement (Score < 30)
""")
        
        a_risque = [s for s in risques['classement_sites'] if s['score_global'] < 30]
        for item in a_risque[-3:]:
            f.write(f"- **{item['site']}** (Score {item['score_global']:.1f}) : "
                    f"{item['p1_non_conformes']} P1-NC, {item['nb_bloquants']} bloquants - "
                    f"Accompagnement renforcé nécessaire\n")
        
        f.write(f"""
---

## 1.4 | Performance par Thème (Analyse Pondérée)

| Thème | Critères | Conforme% | NC% | En Cours% | P1-NC% | Écart vs Groupe |
|-------|----------|-----------|-----|-----------|--------|-----------------|
""")
        
        theme_stats = risques['stats_themes']
        taux_global = total_conforme / total_criteres * 100
        
        theme_names = {
            'AFF': 'Affichage', 'EXP': 'Exploitation', 'IMA': 'Image',
            'QUA': 'Qualité', 'RES': 'Résidents', 'RH': 'RH',
            'SEC': 'Sécurité', 'SLO': 'Slow Impact'
        }
        
        for code in ['AFF', 'EXP', 'IMA', 'QUA', 'RES', 'RH', 'SEC', 'SLO']:
            if code in theme_stats:
                ts = theme_stats[code]
                pct_conf = (ts['conforme'] / ts['total'] * 100) if ts['total'] > 0 else 0
                pct_nc = (ts['non_conforme'] / ts['total'] * 100) if ts['total'] > 0 else 0
                pct_ec = (ts['en_cours'] / ts['total'] * 100) if ts['total'] > 0 else 0
                pct_p1_nc = (ts['p1_nc'] / ts['p1_total'] * 100) if ts['p1_total'] > 0 else 0
                ecart = pct_conf - taux_global
                trend = "📈" if ecart > 2 else "📉" if ecart < -2 else "➡️"
                
                f.write(f"| **{theme_names[code]}** ({code}) | {ts['total']:,} | "
                        f"{pct_conf:.1f}% | {pct_nc:.1f}% | {pct_ec:.1f}% | "
                        f"{pct_p1_nc:.1f}% | {trend} {ecart:+.1f}pp |\n")
        
        f.write(f"""
*pp = points de pourcentage. 📈 = au-dessus de la moyenne, 📉 = en dessous*

---

# 🔴 PARTIE 2 : RISQUES CRITIQUES (P0/P1 Non conformes)

## 2.1 | Top 15 des Risques Récurrents

*Critères P1 non conformes sur le plus grand nombre de sites*

| Rang | Code | Sites | Priorité | Thème | Sites concernés |
|------|------|-------|----------|-------|-----------------|
""")
        
        for i, risque in enumerate(risques['top_risques'][:15], 1):
            sites_display = ', '.join(risque['sites'][:2])
            if len(risque['sites']) > 2:
                sites_display += f" +{len(risque['sites'])-2}"
            f.write(f"| {i} | **{risque['code']}** | {risque['nb_sites']} | "
                    f"{risque['priorite']} | {risque['theme']} | {sites_display} |\n")
            f.write(f"| | | | | | *{risque['critere'][:70]}...* |\n")
        
        f.write(f"""
---

## 2.2 | Analyse des Thèmes à Risque

### 🔴 Sécurité (SEC) - Risque Légal Majeur
- **Problème** : {theme_stats.get('SEC', {}).get('non_conforme', 0)} non conformes sur {theme_stats.get('SEC', {}).get('total', 0)} critères
- **P1 non conformes** : {theme_stats.get('SEC', {}).get('p1_nc', 0)} items prioritaires
- **Impact** : Responsabilité civile/penale, sanctions SDIS, risque accident
- **Action** : Audit sécurité immédiat sur tous les sites

### 🟠 Affichage Obligatoire (AFF) - Risque Réglementaire
- **Problème** : {theme_stats.get('AFF', {}).get('non_conforme', 0)} non conformes
- **Impact** : Sanctions DGCCRF, information client défaillante
- **Action** : Template groupe déploiement express

### 🟡 Ressources Humaines (RH) - Risque Prud'homal
- **Problème** : {theme_stats.get('RH', {}).get('non_conforme', 0)} non conformes
- **Impact** : Risques prud'homaux, manque de clarté des missions
- **Action** : Templates fiches de poste groupe

---

# 🎯 PARTIE 3 : PLAN D'ACTION PRIORISÉ

## Feuille de route opérationnelle 2026

### 🚨 Phase 1 - Urgences (Mois 1-2) : Risques P1 Non conformes

| Action | Cible | Budget | Délai | KPI |
|--------|-------|--------|-------|-----|
| Sécurité incendie (registres) | {p1_nc} P1-NC | 0€ | 1 mois | 100% P1 conformes |
| Analyses eau potable | Sites sans analyse | 2 000€ | 1 mois | 10/10 sites OK |
| Contrôles aires de jeux | 8 sites | 5 000€ | 2 mois | Certificats à jour |

### ⚠️ Phase 2 - Consolidation (Mois 3-6) : Fondation qualité

| Action | Cible | Budget | Délai | KPI |
|--------|-------|--------|-------|-----|
| Documentation RH (fiches de poste) | 9 sites | 0€ | 3 mois | 100% signatures |
| Affichages réglementaires | Templates groupe | 3 000€ | 1 mois | Checklist validée |
| Mutualisation groupe | Drive + process | 2 000€ | 3 mois | 100% sites connectés |

### 📋 Phase 3 - Optimisation (Mois 6-12) : Excellence

| Action | Cible | Budget | Délai | KPI |
|--------|-------|--------|-------|-----|
| Traçabilité qualité digitale | 2 pilotes | 1 000€ | 6 mois | Déploiement groupe |
| Plan rafraîchissement image | Pluriannuel | 50-150k€ | 24 mois | 3 sites/an |

---

## Indicateurs de Suivi Proposés

| KPI | Baseline 2025 | Cible 2026 | Méthode de calcul |
|-----|---------------|------------|-------------------|
| Taux conformité pondéré | {taux_pondere_groupe:.1f}% | +15 points | Σ(Scores obtenus) / Σ(Scores possibles) |
| Réduction P1 non conformes | {p1_nc} | -80% | Comptage critères P1 NC |
| Score moyen sites | {sum(s['score_global'] for s in risques['classement_sites'])/len(risques['classement_sites']):.1f} | >50 | Formule composite |
| Sites sans bloquants | {sum(1 for s in data if s['nb_bloquants']==0)}/{len(data)} | 10/10 | Comptage critères bloquants |
| Homogénéité groupe (CV moyen) | {sum(s['coefficient_dispersion'] for s in risques['classement_sites'])/len(risques['classement_sites']):.3f} | <0.300 | CV moyen des sites |

---

# 🎬 CONCLUSION

## Vision stratégique

Le groupe Slow Village est dans une **phase de structuration normale** avec un taux de conformité pondéré de **{taux_pondere_groupe:.1f}%**.

### Forces identifiées :
- Dynamique "en cours" forte ({total_ec/total_criteres*100:.1f}%) = mobilisation des équipes
- Sites leaders identifiés ({risques['classement_sites'][0]['site']} en référence)
- Structure d'audit robuste (8 thèmes, pondération fine)

### Axes prioritaires :
1. **Sécuriser** : Traiter les {total_bloquants} critères bloquants et {p1_nc} P1-NC
2. **Standardiser** : Mutualiser les bonnes pratiques des sites leaders
3. **Accompagner** : Focus sur les {len(a_risque)} sites en difficulté

### Prochaines étapes immédiates :
1. Réunion de lancement avec les {len(data)} managers (semaine 1)
2. Plan d'action détaillé par site (semaine 2-3)
3. Ré-audit Q4 2026 pour mesurer la progression

---

*Document confidentiel – Usage interne Slow Village*

**Marie-Claude Fortier**  
Senior Audit & Quality Excellence Manager  
{datetime.now().strftime('%d/%m/%Y')}

---

## 📎 Annexes

### Formules de calcul utilisées

| Indicateur | Formule |
|------------|---------|
| **Taux conformité brut** | Conforme / Total × 100 |
| **Taux conformité pondéré** | Σ(Scores obtenus) / Σ(Scores possibles) × 100 |
| **Indice de risque** | (P1_NC×3 + P1_EC×2 + P2_NC×1.5 + Oblig_NC×2) / (P1+P2+Oblig) × 100 |
| **Score de maturité** | (Conf×1 + EC×0.5 + NA×0.3) / Total × 100 |
| **Score global** | 0.4×Taux_Pondéré + 0.3×Maturité + 0.2×(100-Risque) + 0.1×(1-CV)×100 |
| **Coefficient de variation** | Écart-type / Moyenne (des taux par thème) |

### Données brutes
- Fichier JSON complet : `synthese_data_complete.json`
- Analyse des risques : `analyse_risques.json`
""")
    
    print(f"✅ Rapport enrichi généré avec succès !")
    print(f"📄 Fichier : {AUDIT_DIR}/SYNTHESE_AUDIT_QUALITE_SLOW_VILLAGE.md")
    print(f"📊 Stats incluses :")
    print(f"   - Taux conformité pondéré : {taux_pondere_groupe:.1f}%")
    print(f"   - Critères bloquants : {total_bloquants}")
    print(f"   - P1 Non conformes : {p1_nc}")
    print(f"   - Sites analysés : {len(data)}")

if __name__ == "__main__":
    generer_rapport()
