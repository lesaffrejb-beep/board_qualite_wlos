#!/usr/bin/env python3
"""
Analyse des risques et matrice de criticité
Marie-Claude Fortier - Expert Audit Qualité
Formules: Risque = Priorité × Impact × Probabilité
"""

import json
from pathlib import Path
from collections import defaultdict
import math

AUDIT_DIR = Path("/Users/jb/Documents/SYNTHESE_AUDIT_QUALITE")

def load_data():
    """Charge les données extraites"""
    with open(AUDIT_DIR / "synthese_data_complete.json", 'r', encoding='utf-8') as f:
        return json.load(f)

def calculer_indice_risque(site_data):
    """
    Calcule l'indice de risque d'un site
    Formule: IR = (P1_NC × 3 + P1_EC × 2 + P2_NC × 1.5 + Obligatoires_NC × 2) / Total_P1_P2_Obligatoires
    """
    p1 = site_data['priorites_globales']['P1']
    p2 = site_data['priorites_globales']['P2']
    oblig = site_data['obligatoires_globaux']
    
    numerateur = (
        p1['non_conforme'] * 3 +
        p1['en_cours'] * 2 +
        p2['non_conforme'] * 1.5 +
        oblig['non_conforme'] * 2
    )
    
    denominateur = (
        sum(p1.values()) +
        sum(p2.values()) +
        oblig['total']
    )
    
    if denominateur == 0:
        return 0
    
    return round((numerateur / denominateur) * 100, 2)

def calculer_score_maturite(site_data):
    """
    Score de maturité qualité (0-100)
    Formule: M = (Conforme × 1 + En_Cours × 0.5 + NA × 0.3) / Total × 100
    Les NC comptent pour 0
    """
    stats = site_data['global_stats']
    total = stats['total']
    
    if total == 0:
        return 0
    
    score = (
        stats['conforme'] * 1.0 +
        stats['en_cours'] * 0.5 +
        stats['na'] * 0.3
    ) / total * 100
    
    return round(score, 2)

def calculer_coefficient_dispersion(site_data):
    """
    Coefficient de variation (dispersion des thèmes)
    CV = Écart-type / Moyenne
    Indique l'homogénéité du site (proche de 0 = homogène)
    """
    scores = [s['pourcentage'] for s in site_data['scores_par_theme'].values() if s['possible'] > 0]
    
    if len(scores) < 2:
        return 0
    
    moyenne = sum(scores) / len(scores)
    if moyenne == 0:
        return 0
    
    variance = sum((x - moyenne) ** 2 for x in scores) / len(scores)
    ecart_type = math.sqrt(variance)
    
    return round(ecart_type / moyenne, 3)

def identifier_top_risques(data, top_n=20):
    """Identifie les critères les plus problématiques (nombre de sites NC)"""
    compteur_nc = defaultdict(lambda: {'count': 0, 'sites': [], 'theme': '', 'priorite': ''})
    
    for site in data:
        for theme_code, theme_data in site['themes'].items():
            for crit in theme_data['criteres']:
                if crit['statut'] == 'non_conforme' and crit['priorite'] in ['P0', 'P1']:
                    key = crit['code']
                    compteur_nc[key]['count'] += 1
                    compteur_nc[key]['sites'].append(site['site'])
                    compteur_nc[key]['theme'] = theme_code
                    compteur_nc[key]['priorite'] = crit['priorite']
                    compteur_nc[key]['critere'] = crit['critere']
    
    # Trier par nombre de sites
    top_risques = sorted(compteur_nc.items(), key=lambda x: x[1]['count'], reverse=True)[:top_n]
    
    return top_risques

def calculer_matrice_risque_groupe(data):
    """
    Matrice de risque groupe : croisement Priorité × Statut
    """
    matrice = {
        'P0': {'conforme': 0, 'non_conforme': 0, 'en_cours': 0, 'na': 0},
        'P1': {'conforme': 0, 'non_conforme': 0, 'en_cours': 0, 'na': 0},
        'P2': {'conforme': 0, 'non_conforme': 0, 'en_cours': 0, 'na': 0},
        'P3': {'conforme': 0, 'non_conforme': 0, 'en_cours': 0, 'na': 0}
    }
    
    for site in data:
        for prio in ['P0', 'P1', 'P2', 'P3']:
            for statut in ['conforme', 'non_conforme', 'en_cours', 'na']:
                matrice[prio][statut] += site['priorites_globales'][prio][statut]
    
    return matrice

def calculer_stats_par_theme(data):
    """Statistiques agrégées par thème avec pondération"""
    theme_stats = {}
    
    for site in data:
        for theme_code, theme_data in site['themes'].items():
            if theme_code not in theme_stats:
                theme_stats[theme_code] = {
                    'conforme': 0, 'non_conforme': 0, 'en_cours': 0, 'na': 0, 'total': 0,
                    'obtenu': 0, 'possible': 0,
                    'p1_nc': 0, 'p1_total': 0,
                    'sites_concernes': set()
                }
            
            ts = theme_stats[theme_code]
            stats = theme_data['stats']
            
            for key in ['conforme', 'non_conforme', 'en_cours', 'na', 'total']:
                ts[key] += stats[key]
            
            ts['obtenu'] += site['scores_par_theme'].get(theme_code, {}).get('obtenu', 0)
            ts['p1_nc'] += theme_data['priorites']['P1']['non_conforme']
            ts['p1_total'] += sum(theme_data['priorites']['P1'].values())
            
            if stats['total'] > 0:
                ts['sites_concernes'].add(site['site'])
    
    # Conversion des sets en count
    for ts in theme_stats.values():
        ts['nb_sites'] = len(ts['sites_concernes'])
        del ts['sites_concernes']
    
    return theme_stats

def generer_classement_sites(data):
    """Classement multicritère des sites"""
    classement = []
    
    for site in data:
        stats = site['global_stats']
        total = stats['total']
        
        # Taux bruts
        taux_conf = (stats['conforme'] / total * 100) if total > 0 else 0
        taux_nc = (stats['non_conforme'] / total * 100) if total > 0 else 0
        
        # Indice de risque
        indice_risque = calculer_indice_risque(site)
        
        # Score de maturité
        score_maturite = calculer_score_maturite(site)
        
        # Coefficient de dispersion
        cv = calculer_coefficient_dispersion(site)
        
        # Score global composite (0-100)
        # 40% taux conformité pondéré + 30% maturité + 20% (100 - risque) + 10% homogénéité
        taux_pondere = site['global_stats_ponderees']['taux']
        homogeneite = max(0, 1 - cv) * 100  # CV faible = bon
        
        score_global = (
            taux_pondere * 0.40 +
            score_maturite * 0.30 +
            (100 - indice_risque) * 0.20 +
            homogeneite * 0.10
        )
        
        classement.append({
            'site': site['site'],
            'taux_conformite_brut': round(taux_conf, 2),
            'taux_conformite_pondere': taux_pondere,
            'taux_nc': round(taux_nc, 2),
            'indice_risque': indice_risque,
            'score_maturite': score_maturite,
            'coefficient_dispersion': cv,
            'nb_bloquants': site['nb_bloquants'],
            'p1_non_conformes': site['priorites_globales']['P1']['non_conforme'],
            'score_global': round(score_global, 2)
        })
    
    # Trier par score global décroissant
    classement.sort(key=lambda x: x['score_global'], reverse=True)
    
    # Ajouter les rangs
    for i, item in enumerate(classement, 1):
        item['rang'] = i
    
    return classement

def main():
    print("="*100)
    print("🔍 ANALYSE DES RISQUES - MATRICE DE CRITICITÉ")
    print("="*100)
    
    data = load_data()
    
    # 1. Matrice risque groupe
    print("\n📊 MATRICE RISQUE GROUPE (Priorité × Statut)")
    print("-"*80)
    matrice = calculer_matrice_risque_groupe(data)
    
    print(f"{'Priorité':<10} {'Conforme':>10} {'NC':>10} {'En cours':>10} {'N/A':>10} {'Total':>10}")
    print("-"*80)
    for prio in ['P0', 'P1', 'P2', 'P3']:
        total = sum(matrice[prio].values())
        print(f"{prio:<10} {matrice[prio]['conforme']:>10} {matrice[prio]['non_conforme']:>10} "
              f"{matrice[prio]['en_cours']:>10} {matrice[prio]['na']:>10} {total:>10}")
    
    # 2. Classement des sites
    print("\n🏆 CLASSEMENT MULTICRITÈRE DES SITES")
    print("-"*100)
    classement = generer_classement_sites(data)
    
    print(f"{'Rang':<5} {'Site':<30} {'Score':>8} {'Taux%':>8} {'Pondéré%':>9} "
          f"{'Risque':>8} {'Maturité':>9} {'Disp.':>7} {'P1-NC':>6} {'Bloq.':>5}")
    print("-"*100)
    for item in classement:
        print(f"{item['rang']:<5} {item['site']:<30} {item['score_global']:>8.1f} "
              f"{item['taux_conformite_brut']:>8.1f} {item['taux_conformite_pondere']:>9.1f} "
              f"{item['indice_risque']:>8.1f} {item['score_maturite']:>9.1f} "
              f"{item['coefficient_dispersion']:>7.3f} {item['p1_non_conformes']:>6} "
              f"{item['nb_bloquants']:>5}")
    
    # 3. Stats par thème
    print("\n📈 STATISTIQUES PAR THÈME")
    print("-"*80)
    theme_stats = calculer_stats_par_theme(data)
    
    print(f"{'Thème':<5} {'Total':>8} {'Conf%':>8} {'NC%':>8} {'EC%':>8} "
          f"{'P1-NC%':>8} {'Sites':>6}")
    print("-"*80)
    for code in ['AFF', 'EXP', 'IMA', 'QUA', 'RES', 'RH', 'SEC', 'SLO']:
        if code in theme_stats:
            ts = theme_stats[code]
            pct_conf = (ts['conforme'] / ts['total'] * 100) if ts['total'] > 0 else 0
            pct_nc = (ts['non_conforme'] / ts['total'] * 100) if ts['total'] > 0 else 0
            pct_ec = (ts['en_cours'] / ts['total'] * 100) if ts['total'] > 0 else 0
            pct_p1_nc = (ts['p1_nc'] / ts['p1_total'] * 100) if ts['p1_total'] > 0 else 0
            
            print(f"{code:<5} {ts['total']:>8} {pct_conf:>8.1f} {pct_nc:>8.1f} "
                  f"{pct_ec:>8.1f} {pct_p1_nc:>8.1f} {ts['nb_sites']:>6}")
    
    # 4. Top risques
    print("\n🚨 TOP 15 RISQUES (P0/P1 Non conformes sur le plus de sites)")
    print("-"*100)
    top_risques = identifier_top_risques(data, 15)
    
    for code, info in top_risques:
        sites_str = ', '.join(info['sites'][:3])
        if len(info['sites']) > 3:
            sites_str += f" +{len(info['sites'])-3}"
        print(f"[{info['priorite']}] {code:<10} {info['count']:>2} sites | {info['theme']} | {sites_str}")
        print(f"      {info['critere'][:80]}...")
    
    # Sauvegarde des analyses
    analyse_data = {
        'matrice_risque': matrice,
        'classement_sites': classement,
        'stats_themes': theme_stats,
        'top_risques': [
            {
                'code': code,
                'nb_sites': info['count'],
                'sites': info['sites'],
                'theme': info['theme'],
                'priorite': info['priorite'],
                'critere': info['critere']
            }
            for code, info in top_risques
        ],
        'formules': {
            'indice_risque': '(P1_NC×3 + P1_EC×2 + P2_NC×1.5 + Oblig_NC×2) / Total_P1_P2_Oblig',
            'score_maturite': '(Conf×1 + EC×0.5 + NA×0.3) / Total × 100',
            'score_global': '0.4×Taux_Pondéré + 0.3×Maturité + 0.2×(100-Risque) + 0.1×Homogénéité',
            'coefficient_dispersion': 'Écart-type / Moyenne (thèmes)'
        }
    }
    
    output_file = AUDIT_DIR / "analyse_risques.json"
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(analyse_data, f, ensure_ascii=False, indent=2)
    
    print(f"\n💾 Analyse sauvegardée : {output_file}")
    print("="*100)

if __name__ == "__main__":
    main()
