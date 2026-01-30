
import json
import sys
from datetime import datetime

# 1. CHARGEMENT DES DONNÉES
try:
    with open('synthese_data_complete.json', 'r') as f:
        raw_data = json.load(f)
    with open('analyse_risques.json', 'r') as f:
        risk_data = json.load(f)
except Exception as e:
    print(f"❌ Erreur de chargement: {e}")
    sys.exit(1)

# Extraction des données agrégées
stats_themes = risk_data.get('stats_themes', {})
classement = risk_data.get('classement_sites', [])
top_risques = risk_data.get('top_risques', [])
global_matrix = risk_data.get('matrice_risque', {})

# Dictionnaire des noms de thèmes (hardcoded pour la propreté)
THEME_NAMES = {
    "AFF": "Communication & Affichage",
    "EXP": "Expérience Client",
    "IMA": "Image de Marque",
    "QUA": "Qualité & Propreté",
    "RES": "Gestion Résidents",
    "RH": "Ressources Humaines",
    "SEC": "Sécurité & Réglementation",
    "SLO": "Concept Slow Village"
}

# Calculs globaux pour le header
total_sites = len(classement)
avg_score = sum(s['score_global'] for s in classement) / total_sites if total_sites else 0
avg_conformity = sum(s['taux_conformite_pondere'] for s in classement) / total_sites if total_sites else 0
total_p1_nc = sum(s['p1_non_conformes'] for s in classement)

# Date pour le rapport
report_date = datetime.now().strftime('%B %Y')

# 2. GÉNÉRATION HTML
html = f"""<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Rapport Stratégique Qualité - Slow Village</title>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Lato:wght@300;400;700&display=swap" rel="stylesheet">
    <style>
        @page {{ size: A4; margin: 0; }}
        :root {{
            --primary: #0A1929;
            --accent: #E63946; /* Rouge sécurité/urgence */
            --secondary: #457B9D;
            --bg-light: #F8F9FA;
            --text-dark: #212529;
            --text-light: #6C757D;
            --border: #DEE2E6;
            --success: #2A9D8F;
            --warning: #E9C46A;
        }}
        body {{
            font-family: 'Lato', sans-serif;
            color: var(--text-dark);
            margin: 0;
            background: white;
            font-size: 11px;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
        }}
        .page {{
            width: 210mm;
            height: 296mm; /* A4 pur - margins handled inside */
            padding: 15mm 15mm;
            position: relative;
            box-sizing: border-box;
            page-break-after: always;
            overflow: hidden;
            display: flex;
            flex-direction: column;
        }}
        
        /* TYPOGRAPHY */
        h1, h2, h3, h4 {{ font-family: 'Playfair Display', serif; color: var(--primary); margin: 0; }}
        h1 {{ font-size: 36px; line-height: 1.1; margin-bottom: 20px; }}
        h2 {{ font-size: 24px; margin-bottom: 15px; border-bottom: 2px solid var(--primary); padding-bottom: 5px; }}
        h3 {{ font-size: 14px; text-transform: uppercase; letter-spacing: 1px; color: var(--text-light); margin-bottom: 10px; font-weight: 700; }}
        
        /* MODULES GENERAL */
        .section {{ margin-bottom: 25px; }}
        .row {{ display: flex; gap: 20px; }}
        .col {{ flex: 1; }}
        .col-2 {{ flex: 2; }}
        
        /* COVER PAGE */
        .cover {{ 
            background: var(--primary); 
            color: white; 
            justify-content: center; 
            padding-left: 30mm;
        }}
        .cover h1 {{ color: white; font-size: 48px; border-left: 4px solid var(--accent); padding-left: 20px; }}
        .cover h2 {{ color: #A8DADC; border: none; font-size: 18px; font-weight: 300; font-family: 'Lato'; margin-top: 10px; padding-left: 24px; }}
        .cover-footer {{ position: absolute; bottom: 20mm; left: 30mm; font-size: 12px; color: rgba(255,255,255,0.6); text-transform: uppercase; letter-spacing: 2px; }}

        /* KPI HEADER */
        .kpi-grid {{ display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-bottom: 30px; }}
        .kpi-card {{ background: var(--bg-light); padding: 15px; border-top: 3px solid var(--secondary); }}
        .kpi-val {{ font-size: 28px; font-weight: 700; color: var(--primary); display: block; }}
        .kpi-label {{ font-size: 9px; text-transform: uppercase; color: var(--text-light); letter-spacing: 0.5px; font-weight: 700; }}
        
        /* TABLES */
        table {{ width: 100%; border-collapse: collapse; font-size: 10px; }}
        th {{ text-align: left; color: var(--text-light); text-transform: uppercase; font-size: 8px; border-bottom: 1px solid var(--primary); padding: 5px; }}
        td {{ padding: 6px 5px; border-bottom: 1px solid #eee; }}
        tr:last-child td {{ border-bottom: none; }}
        .rank-badge {{ display: inline-block; width: 16px; height: 16px; background: var(--primary); color: white; text-align: center; line-height: 16px; border-radius: 50%; font-size: 8px; }}
        .score-bar {{ height: 4px; background: #eee; width: 60px; display: inline-block; vertical-align: middle; margin-right: 5px; border-radius: 2px; }}
        .score-fill {{ height: 100%; background: var(--secondary); border-radius: 2px; }}
        
        /* RISK MATRIX */
        .matrix-grid {{ display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }}
        .matrix-cell {{ background: white; border: 1px solid var(--border); padding: 10px; text-align: center; }}
        .matrix-title {{ font-size: 9px; color: var(--text-light); display: block; margin-bottom: 5px; }}
        .matrix-val {{ font-size: 18px; font-weight: 700; color: var(--primary); }}
        .matrix-p1 {{ border-top: 3px solid var(--accent); }}
        
        /* ALERTS */
        .alert-item {{ display: flex; align-items: baseline; margin-bottom: 8px; padding-bottom: 8px; border-bottom: 1px solid #eee; }}
        .alert-code {{ font-weight: 700; color: var(--accent); width: 60px; font-size: 9px; }}
        .alert-desc {{ flex: 1; font-size: 10px; }}
        .alert-sites {{ color: var(--text-light); font-size: 9px; text-align: right; width: 120px; font-style: italic; }}

        /* FOOTER */
        .page-footer {{ position: absolute; bottom: 10mm; left: 15mm; right: 15mm; border-top: 1px solid var(--border); padding-top: 10px; display: flex; justify-content: space-between; font-size: 8px; color: var(--text-light); text-transform: uppercase; }}
    </style>
</head>
<body>

    <!-- PAGE 1: EXECUTIVE SUMMARY -->
    <div class="page cover">
        <div>
            <h1>AUDIT QUALITÉ<br>STRATÉGIQUE</h1>
            <h2>SYNTHÈSE DU RÉSEAU SLOW VILLAGE<br>ANALYSE & RECOMMANDATIONS</h2>
        </div>
        <div class="cover-footer">
            CONFIDENTIEL • DIRECTION GÉNÉRALE • {report_date}
        </div>
    </div>

    <!-- PAGE 2: DASHBOARD -->
    <div class="page">
        <h2>Performance du Réseau</h2>
        
        <!-- KPIs -->
        <div class="kpi-grid">
            <div class="kpi-card">
                <span class="kpi-val">{total_sites}</span>
                <span class="kpi-label">Sites Audités</span>
            </div>
            <div class="kpi-card" style="border-color: var(--accent);">
                <span class="kpi-val" style="color: var(--accent);">{total_p1_nc}</span>
                <span class="kpi-label">Non-Conformités Critiques (P1)</span>
            </div>
            <div class="kpi-card">
                <span class="kpi-val">{avg_conformity:.1f}%</span>
                <span class="kpi-label">Conformité Moyenne</span>
            </div>
            <div class="kpi-card">
                <span class="kpi-val">{avg_score:.1f}/100</span>
                <span class="kpi-label">Score Global (Pondéré)</span>
            </div>
        </div>

        <div class="row">
            <!-- CLASSEMENT -->
            <div class="col-2">
                <h3>Classement Général</h3>
                <table>
                    <thead>
                        <tr>
                            <th style="width: 30px">Rang</th>
                            <th>Établissement</th>
                            <th style="text-align:right">Score Global</th>
                            <th style="text-align:right">Conformité</th>
                            <th style="text-align:right">Risque (P1)</th>
                        </tr>
                    </thead>
                    <tbody>
"""

# Insertion du classement
for site in classement:
    html += f"""
                        <tr>
                            <td><span class="rank-badge">{site['rang']}</span></td>
                            <td style="font-weight: 700;">{site['site']}</td>
                            <td style="text-align:right; font-weight:bold;">{site['score_global']:.1f}</td>
                            <td style="text-align:right">
                                <div class="score-bar"><div class="score-fill" style="width: {site['taux_conformite_pondere']}%;"></div></div>
                                {site['taux_conformite_pondere']:.0f}%
                            </td>
                            <td style="text-align:right; color: var(--accent); font-weight:bold;">{site['p1_non_conformes']}</td>
                        </tr>
    """

html += """
                    </tbody>
                </table>
            </div>

            <!-- THEMATIC & RISK -->
            <div class="col">
                <div class="section">
                    <h3>Matrice de Risque (Global)</h3>
                    <div class="matrix-grid">
                        <div class="matrix-cell matrix-p1">
                            <span class="matrix-title">P1 - CRITIQUE</span>
                            <span class="matrix-val" style="color: var(--accent)">{0}</span>
                            <span style="font-size: 8px; display:block; color: #666">Non-Conformes</span>
                        </div>
                        <div class="matrix-cell">
                            <span class="matrix-title">P2 - MAJEUR</span>
                            <span class="matrix-val">{1}</span>
                        </div>
                        <div class="matrix-cell">
                            <span class="matrix-title">P3 - MINEUR</span>
                            <span class="matrix-val">{2}</span>
                        </div>
                         <div class="matrix-cell">
                            <span class="matrix-title">EN COURS</span>
                            <span class="matrix-val" style="color: var(--warning)">{3}</span>
                        </div>
                    </div>
                </div>

                <div class="section">
                    <h3>Performance par Thème</h3>
                    <table>
                        <thead>
                           <tr><th>Thème</th><th style="text-align:right">Score</th></tr> 
                        </thead>
                        <tbody>
""".format(
    global_matrix.get('P1', {}).get('non_conforme', 0),
    global_matrix.get('P2', {}).get('non_conforme', 0),
    global_matrix.get('P3', {}).get('non_conforme', 0),
    sum(s.get('en_cours', 0) for s in global_matrix.values())
)

# Insertion Thèmes
for code, stats in stats_themes.items():
    theme_name = THEME_NAMES.get(code, code)
    # Calcul basique score conformité
    total_valid = stats['total'] - stats['na']
    score = (stats['conforme'] / total_valid * 100) if total_valid > 0 else 0
    
    html += f"""
                        <tr>
                            <td>{theme_name}</td>
                            <td style="text-align:right">
                                <div class="score-bar" style="width: 40px"><div class="score-fill" style="width: {score}%;"></div></div>
                                {score:.0f}%
                            </td>
                        </tr>
    """

html += """
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <div class="page-footer">
            <span>Slow Village Audit 2026</span>
            <span>Page 1 / 2</span>
        </div>
    </div>

    <!-- PAGE 3: FOCUS POINTS -->
    <div class="page">
        <h2>Focus Stratégique</h2>

        <div class="section">
            <h3>🚨  Top 5 : Risques Systémiques (Impact Réseau)</h3>
            <p style="font-style: italic; color: #666; margin-bottom: 10px;">Ces points de contrôle critiques (P1) sont défaillants sur une majorité de sites.</p>
"""

# Insertion Top Risques
for risque in top_risques[:8]:
    html += f"""
            <div class="alert-item">
                <span class="alert-code">{risque['code']}</span>
                <span class="alert-desc">{risque['critere']}</span>
                <span class="alert-sites">{risque['nb_sites']} sites concernés</span>
            </div>
    """

html += """
        </div>

        <div class="row" style="margin-top: 30px;">
           <div class="col">
                <h3>✅ Points Forts (Top Conformité)</h3>
                <table>
"""
# On réutilise la logique de l'ancien script pour chopper les tops critères "bruts" si besoin, 
# Mais ici on va se baser sur ce qu'on peut extraire. 
# Comme analyse_risques.json n'a pas le détail critère par critère (juste le top risque), 
# on va re-calculer vite fait les tops success depuis raw_data comme avant.

# --- RE-CALCUL RAPIDE DES TOPS ---
criteria_stats = {}
for site in raw_data:
    for theme_code, theme_data in site['themes'].items():
        for crit in theme_data['criteres']:
            code = crit['code']
            if code not in criteria_stats:
                criteria_stats[code] = {'libelle': crit['critere'], 't': 0, 'c': 0, 'na': 0}
            s = criteria_stats[code]
            s['t'] += 1
            if crit['statut'] == 'conforme': s['c'] += 1
            if crit['statut'] == 'na': s['na'] += 1

clean_criteria = []
for code, s in criteria_stats.items():
    rel = s['t'] - s['na']
    if rel >= 5:
        clean_criteria.append({'code': code, 'lib': s['libelle'], 'taux': s['c']/rel*100})

top_success = sorted(clean_criteria, key=lambda x: x['taux'], reverse=True)[:10]
# ---------------------------------

for item in top_success:
    html += f"""
                    <tr>
                        <td style="color: var(--success); font-weight:bold; width: 40px">{item['taux']:.0f}%</td>
                        <td>{item['lib'][:90]}...</td>
                    </tr>
    """

html += """
                </table>
           </div>
           
           <div class="col">
               <!-- Placeholder or Insight text -->
               <div style="background: var(--bg-light); padding: 20px; border-radius: 4px; height: 100%; box-sizing:border-box;">
                   <h4 style="margin-bottom: 10px;">Note de Synthèse</h4>
                   <p style="text-align: justify; line-height: 1.6;">
                       L'analyse de données révèle une forte hétérogénéité dans la gestion des risques incendie (PRIORITÉ ABSOLUE). 
                       Tandis que l'affichage et l'image de marque sont globalement bien maîtrisés, les processus documentaires (RH, Registres) 
                       souffrent d'un déficit de formalisme constant.
                   </p>
                   <p style="text-align: justify; line-height: 1.6; margin-top: 10px;">
                       <strong>Recommandation :</strong> Lancer une campagne "Zéro P1" sur le T1 2026 focalisée exclusivement sur les items de la colonne de gauche.
                   </p>
               </div>
           </div>
        </div>

        <div class="page-footer">
            <span>Slow Village Audit 2026</span>
            <span>Page 2 / 2</span>
        </div>
    </div>

</body>
</html>
"""

# 3. ÉCRITURE
with open('RAPPORT_AUDIT_SLOW_VILLAGE.html', 'w') as f:
    f.write(html)

print("✅ Rapport HTML McKinsey généré avec succès.")
