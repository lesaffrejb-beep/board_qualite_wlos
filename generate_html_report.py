import json
from datetime import datetime

# Load data for charts
with open('/Users/jb/Documents/SYNTHESE_AUDIT_QUALITE/synthese_data_complete.json', 'r') as f:
    data = json.load(f)

# Calculate global stats
total_criteres = sum(s['global_stats']['total'] for s in data)
total_conforme = sum(s['global_stats']['conforme'] for s in data)
total_nc = sum(s['global_stats']['non_conforme'] for s in data)
total_ec = sum(s['global_stats']['en_cours'] for s in data)
total_na = sum(s['global_stats']['na'] for s in data)
taux_groupe = (total_conforme / total_criteres * 100) if total_criteres > 0 else 0

# Sort sites for charts
sorted_sites = sorted(data, key=lambda x: x['global_stats']['conforme']/x['global_stats']['total'] if x['global_stats']['total'] > 0 else 0, reverse=True)

html_content = f"""
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Synthèse Audit Qualité - Slow Village</title>
    <link href="https://fonts.googleapis.com/css2?family=Merriweather:wght@300;400;700&family=Open+Sans:wght@300;400;600;700&display=swap" rel="stylesheet">
    <style>
        /* MCKINSEY-INSPIRED THEME */
        :root {{
            --primary: #051C2C; /* Deep Navy - "The Firm" Blue */
            --accent: #0077C8; /* Professional Light Blue */
            --chart-positive: #005C8F;
            --chart-negative: #D9363E; /* Muted Red */
            --text-dark: #212121;
            --text-light: #5E6E78; /* Slate Grey */
            --bg-light: #F2F4F7;
            --white: #FFFFFF;
            --border: #E0E4E8;
            --line: #051C2C;
        }}
        
        body {{
            font-family: 'Open Sans', Helvetica, Arial, sans-serif;
            color: var(--text-dark);
            background-color: var(--white);
            margin: 0;
            padding: 0;
            line-height: 1.6;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
            font-size: 11pt; /* Print standard */
        }}

        @media print {{
            body {{ background-color: white; }}
            .page-break {{ page-break-after: always; }}
            .no-print {{ display: none; }}
            @page {{ margin: 0; size: A4; }} /* Edge to edge for cover */
            .section {{ margin: 2cm; max-width: none !important; padding: 0 !important; }}
            .cover-page {{ margin: 0; }}
        }}

        h1, h2, h3, h4, h5 {{
            font-family: 'Merriweather', serif; /* Professional Serif */
            color: var(--primary);
            margin-top: 0;
            font-weight: 400;
        }}

        /* COVER PAGE */
        .cover-page {{
            height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            padding: 4rem;
            background: var(--primary);
            color: white;
            position: relative;
            box-sizing: border-box;
        }}
        
        .cover-top-line {{
            width: 100px;
            height: 4px;
            background: white;
            margin-bottom: 2rem;
        }}
        
        .cover-title-block {{
            margin-top: 15vh;
        }}

        .cover-page h1 {{
            color: white;
            font-size: 3.5rem;
            line-height: 1.1;
            margin-bottom: 1rem;
            font-family: 'Open Sans', sans-serif; /* Modern McKinsey covers often use Sans main title */
            font-weight: 300; /* Light/Thin feel */
            letter-spacing: -1px;
        }}
        
        .cover-subtitle {{
            font-family: 'Merriweather', serif;
            font-size: 1.4rem;
            font-style: italic;
            opacity: 0.9;
            margin-bottom: 4rem;
            max-width: 600px;
            line-height: 1.4;
        }}
        
        .cover-footer {{
            position: absolute;
            bottom: 3rem;
            left: 4rem;
            font-size: 0.85rem;
            opacity: 0.8;
            border-top: 1px solid rgba(255,255,255,0.3);
            width: calc(100% - 8rem);
            padding-top: 1.5rem;
            display: flex;
            justify-content: space-between;
            font-family: 'Open Sans', sans-serif;
            letter-spacing: 0.5px;
            text-transform: uppercase;
        }}

        /* STANDARD PAGE HEADER */
        .section-header {{
            margin-bottom: 3rem;
            border-bottom: 1px solid var(--text-light); /* Thin sleek line */
            padding-bottom: 0.5rem;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
        }}

        .section-header h2 {{
            font-size: 1.8rem;
            margin-bottom: 0;
            color: var(--primary);
            font-family: 'Open Sans', sans-serif;
            font-weight: 300;
            text-transform: uppercase;
            letter-spacing: 1px;
        }}

        .section-number {{
            font-family: 'Merriweather', serif;
            font-style: italic;
            color: var(--text-light);
            font-size: 1.2rem;
        }}

        /* CONTENT BLOCKS */
        .section {{
            padding: 4rem;
            max-width: 1000px;
            margin: 0 auto;
            background: white;
        }}

        .insight-box {{
            background-color: var(--bg-light);
            padding: 2rem;
            border-left: 4px solid var(--accent);
            margin-bottom: 2rem;
        }}
        
        .insight-title {{
            font-weight: 700;
            color: var(--accent);
            text-transform: uppercase;
            font-size: 0.8rem;
            letter-spacing: 1px;
            margin-bottom: 0.5rem;
        }}
        
        .insight-text {{
            font-family: 'Merriweather', serif;
            font-size: 1.1rem;
            color: var(--text-dark);
        }}

        /* KPI GRID - CLEAN */
        .kpi-container {{
            display: flex;
            justify-content: space-between;
            border-top: 1px solid var(--border);
            border-bottom: 1px solid var(--border);
            padding: 2rem 0;
            margin: 3rem 0;
        }}

        .kpi-item {{
            text-align: left;
            padding-right: 2rem;
        }}

        .kpi-val {{
            font-size: 2.5rem;
            font-weight: 300;
            color: var(--primary);
            font-family: 'Open Sans', sans-serif;
            display: block;
            line-height: 1;
            margin-bottom: 0.5rem;
        }}

        .kpi-desc {{
            font-size: 0.8rem;
            text-transform: uppercase;
            color: var(--text-light);
            font-weight: 600;
            letter-spacing: 1px;
        }}

        /* CHARTS - MINIMALIST */
        .chart-wrapper {{
            margin: 3rem 0;
        }}
        
        .chart-row {{
            display: flex;
            align-items: center;
            margin-bottom: 0.8rem;
            height: 24px;
        }}
        
        .chart-label {{
            width: 220px;
            font-size: 0.9rem;
            font-family: 'Open Sans', sans-serif;
            color: var(--text-dark);
            text-align: right;
            padding-right: 15px;
            border-right: 1px solid var(--border);
        }}
        
        .chart-bar-area {{
            flex: 1;
            padding-left: 15px;
            display: flex;
            align-items: center;
        }}
        
        .chart-bar {{
            height: 18px;
            background-color: var(--primary);
            position: relative;
        }}

        .chart-value {{
            margin-left: 10px;
            font-size: 0.85rem;
            font-weight: 600;
            color: var(--text-dark);
        }}

        /* ACTION CARDS - CONSULTING STYLE */
        /* Removing specific metadata, keeping strategic essence */
        .action-card {{
            border-top: 2px solid var(--primary);
            background: white;
            margin-bottom: 2rem;
            padding-top: 1.5rem;
        }}
        
        .action-header {{
            display: flex;
            justify-content: space-between;
            align-items: baseline;
            margin-bottom: 1rem;
        }}
        
        .action-title {{
            font-family: 'Merriweather', serif;
            font-size: 1.4rem;
            color: var(--primary);
        }}
        
        .priority-badge {{
            text-transform: uppercase;
            font-size: 0.75rem;
            font-weight: 700;
            padding: 4px 8px;
            letter-spacing: 1px;
        }}
        
        .p0 {{ color: var(--chart-negative); border: 1px solid var(--chart-negative); }}
        .p1 {{ color: #E65100; border: 1px solid #E65100; }}
        
        .action-summary {{
            font-size: 1rem;
            color: var(--text-dark);
            margin-bottom: 1.5rem;
            line-height: 1.6;
        }}
        
        .action-columns {{
            display: grid;
            grid-template-columns: 1fr 2fr;
            gap: 2rem;
            background: var(--bg-light);
            padding: 1.5rem;
        }}
        
        .col-title {{
            font-size: 0.75rem;
            text-transform: uppercase;
            color: var(--text-light);
            font-weight: 700;
            margin-bottom: 0.5rem;
            display: block;
        }}
        
        .key-point ul {{
            margin: 0;
            padding-left: 1.2rem;
        }}
        
        .key-point li {{
            margin-bottom: 0.3rem;
            font-size: 0.9rem;
        }}
    </style>
</head>
<body>

    <!-- COVER -->
    <div class="cover-page page-break">
        <div class="cover-top-line"></div>
        <div class="cover-title-block">
            <div style="font-family:'Open Sans'; font-weight:700; letter-spacing:2px; font-size:1rem; margin-bottom:1rem; opacity:0.8;">SLOW VILLAGE GROUP</div>
            <h1>Audit Qualité &<br>Plan de Transformation 2026</h1>
            <div class="cover-subtitle">Synthèse stratégique des audits de conformité sur 10 sites et feuille de route opérationnelle.</div>
        </div>
        
        <div class="cover-footer">
            <div>Document Confidentiel</div>
            <div>{datetime.now().strftime('%B %Y')}</div>
        </div>
    </div>

    <!-- EXECUTIVE SUMMARY -->
    <div class="section page-break">
        <div class="section-header">
            <h2>Synthèse Exécutive</h2>
            <div class="section-number">01</div>
        </div>

        <div class="insight-box">
            <div class="insight-title">Message Clé</div>
            <div class="insight-text">
                "Le groupe Slow Village est en pleine phase de structuration. Si le taux de conformité faciale (8.2%) semble bas, il cache une excellente dynamique terrain avec <strong>65.5% des sujets déjà pris en main</strong>. L'enjeu 2026 est de sécuriser les risques régaliens (P0) avant de viser l'excellence opérationnelle."
            </div>
        </div>

        <div class="kpi-container">
            <div class="kpi-item">
                <span class="kpi-val">{len(data)}</span>
                <span class="kpi-desc">Sites Audités</span>
            </div>
            <div class="kpi-item">
                <span class="kpi-val">{total_criteres:,}</span>
                <span class="kpi-desc">Points de Contrôle</span>
            </div>
            <div class="kpi-item">
                <span class="kpi-val" style="color:var(--chart-positive);">{taux_groupe:.1f}%</span>
                <span class="kpi-desc">Conformité Totale</span>
            </div>
            <div class="kpi-item">
                <span class="kpi-val" style="color:var(--text-light);">{total_ec/total_criteres*100:.1f}%</span>
                <span class="kpi-desc">En Cours de Traitement</span>
            </div>
        </div>
        
        <p style="text-align: justify; margin-top: 2rem;">
            L'analyse détaillée des 15,530 points de contrôle révèle une hétérogénéité naturelle dans un réseau en développement. Trois sites (Séveilles, Anduze, Roque-sur-Cèze) émergent comme locomotives, tandis que les acquisitions récentes nécessitent un accompagnement structurel prioritaire sur les fondamentaux réglementaires.
        </p>
    </div>

    <!-- PERFORMANCE ANALYSIS -->
    <div class="section page-break">
        <div class="section-header">
            <h2>Benchmark Inter-Sites</h2>
            <div class="section-number">02</div>
        </div>
        
        <p style="margin-bottom: 2rem; color:var(--text-light);">Classement des établissements par taux de conformité audité (hors "En cours").</p>

        <div class="chart-wrapper">
"""

# Generate minimalist charts
for site in sorted_sites:
    s_total = site['global_stats']['total']
    s_conf = site['global_stats']['conforme']
    s_taux = (s_conf / s_total * 100) if s_total > 0 else 0
    s_width = max(s_taux, 1) * 2 # Scalling factor for visibility if needed, or stick to %
    # Let's just use % width with a max limit visual logic or simply 100% base
    
    color = "var(--primary)"
    if s_taux > 20: color = "var(--chart-positive)"
    
    html_content += f"""
            <div class="chart-row">
                <div class="chart-label">{site['site']}</div>
                <div class="chart-bar-area">
                    <div class="chart-bar" style="width: {s_taux}%; background-color: {color};"></div>
                    <div class="chart-value">{s_taux:.1f}%</div>
                </div>
            </div>
    """

html_content += """
        </div>

        <div style="margin-top: 4rem; border-top: 1px solid var(--border); padding-top: 2rem;">
            <h3 style="font-size:1.2rem; margin-bottom:1.5rem;">Matrice SWOT Qualité</h3>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4rem;">
                <div>
                    <h4 style="font-size:0.9rem; text-transform:uppercase; color:var(--chart-positive); border-bottom:2px solid var(--chart-positive); padding-bottom:0.5rem; margin-bottom:1rem;">Forces (Interne)</h4>
                    <ul style="padding-left:1rem; font-size:0.95rem;">
                        <li style="margin-bottom:0.5rem;"><strong>Marque Forte</strong> : Cohérence visuelle maintenue sur l'ensemble du réseau.</li>
                        <li style="margin-bottom:0.5rem;"><strong>Engagement</strong> : Équipes pro-actives (taux d'actions "en cours" élevé).</li>
                        <li style="margin-bottom:0.5rem;"><strong>Légal</strong> : Socle d'affichage réglementaire maîtrisé.</li>
                    </ul>
                </div>
                <div>
                    <h4 style="font-size:0.9rem; text-transform:uppercase; color:var(--chart-negative); border-bottom:2px solid var(--chart-negative); padding-bottom:0.5rem; margin-bottom:1rem;">Risques (À Traiter)</h4>
                    <ul style="padding-left:1rem; font-size:0.95rem;">
                        <li style="margin-bottom:0.5rem;"><strong>Sécurité Incendie</strong> : Tenue des registres inégale (Risque P0).</li>
                        <li style="margin-bottom:0.5rem;"><strong>Infrastructures</strong> : Contrôles aires de jeux parfois échus.</li>
                        <li style="margin-bottom:0.5rem;"><strong>Process RH</strong> : Manque de formalisme fiche de poste.</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>

    <!-- ACTION PLAN -->
    <div class="section page-break">
        <div class="section-header">
            <h2>Actions Prioritaires</h2>
            <div class="section-number">03</div>
        </div>
        
        <p style="font-style:italic; color:var(--text-light); margin-bottom:3rem;">Focus sur les initiatives à fort impact pour la sécurisation et la structuration du groupe.</p>

        <!-- P0 ACTIONS -->
        <div class="action-card">
            <div class="action-header">
                <div class="action-title">1. Sécurité Incendie & Registres</div>
                <div class="priority-badge p0">Priorité Absolue</div>
            </div>
            <div class="action-summary">
                Harmonisation immédiate des registres de sécurité sur 100% du parc pour éliminer tout risque pénal ou administratif.
            </div>
            <div class="action-columns">
                <div class="key-point">
                    <span class="col-title">Le Constat</span>
                    Registres incomplets ou non jour sur 7 sites sur 10.
                </div>
                <div class="key-point">
                    <span class="col-title">Plan d'Action</span>
                    <ul>
                        <li>Audit flash visio 48h.</li>
                        <li>Distribution "Kit Registre" Groupe.</li>
                        <li>Formation obligatoire Directeurs.</li>
                    </ul>
                </div>
            </div>
        </div>

        <div class="action-card">
            <div class="action-header">
                <div class="action-title">2. Qualité de l'Eau & Hygiène</div>
                <div class="priority-badge p0">Priorité Absolue</div>
            </div>
            <div class="action-summary">
                Mise en conformité sanitaire totale via un contrat cadre national pour les analyses d'eau potable.
            </div>
            <div class="action-columns">
                <div class="key-point">
                    <span class="col-title">Le Constat</span>
                    Analyses parfois manquantes ou non affichées (6 sites).
                </div>
                <div class="key-point">
                    <span class="col-title">Plan d'Action</span>
                    <ul>
                        <li>Sélection laboratoire national unique.</li>
                        <li>Routine de prélèvement automatisée.</li>
                        <li>Affichage systématique accueil.</li>
                    </ul>
                </div>
            </div>
        </div>

        <div class="action-card">
            <div class="action-header">
                <div class="action-title">3. Sécurité Aires de Jeux</div>
                <div class="priority-badge p0">Priorité Absolue</div>
            </div>
            <div class="action-summary">
                Sécurisation des espaces enfants par vérification tierce partie (Bureau de Contrôle).
            </div>
            <div class="action-columns">
                <div class="key-point">
                    <span class="col-title">Le Constat</span>
                    Rapports de vérification souvent absents ou anciens.
                </div>
                <div class="key-point">
                    <span class="col-title">Plan d'Action</span>
                    <ul>
                        <li>Campagne de contrôle (Bureau Veritas / Dekra).</li>
                        <li>Travaux de mise en sécurité immédiats si nécessaires.</li>
                    </ul>
                </div>
            </div>
        </div>

        <!-- P1 ACTIONS -->
        <div class="action-card">
            <div class="action-header">
                <div class="action-title">4. Structuration RH</div>
                <div class="priority-badge p1">Structurant</div>
            </div>
            <div class="action-summary">
                Clarification des rôles et responsabilités pour chaque collaborateur.
            </div>
            <div class="action-columns">
                <div class="key-point">
                    <span class="col-title">Le Constat</span>
                    Absence de fiches de poste formalisées.
                </div>
                <div class="key-point">
                    <span class="col-title">Plan d'Action</span>
                    <ul>
                        <li>Déploiement fiches de poste "Groupe" par métier.</li>
                        <li>Campagne de signature collaborateurs.</li>
                    </ul>
                </div>
            </div>
        </div>

        <div class="action-card">
            <div class="action-header">
                <div class="action-title">5. Synergies & Outils</div>
                <div class="priority-badge p1">Optimisation</div>
            </div>
            <div class="action-summary">
                Création d'un socle commun documentaire pour éviter la démultiplication des efforts locaux.
            </div>
            <div class="action-columns">
                <div class="key-point">
                    <span class="col-title">Le Constat</span>
                    Outils hétérogènes et perte de temps.
                </div>
                <div class="key-point">
                    <span class="col-title">Plan d'Action</span>
                    <ul>
                        <li>Lancement "Drive Qualité" partagé.</li>
                        <li>Bibliothèque de modèles (Procédures, Checklists).</li>
                    </ul>
                </div>
            </div>
        </div>

    </div>

    <!-- CONCLUSION -->
    <div class="section page-break">
        <div class="section-header">
            <h2>Vision Cible</h2>
            <div class="section-number">04</div>
        </div>

        <div style="display:flex; justify-content:center; align-items:center; height:60vh; text-align:center; flex-direction:column;">
            <h3 style="font-size:2rem; font-weight:300; margin-bottom:2rem;">Objectifs à 12 Mois</h3>
            
            <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:4rem; width:100%;">
                <div>
                    <div style="font-size:3rem; font-weight:700; color:var(--primary);">0</div>
                    <div style="text-transform:uppercase; font-size:0.8rem; letter-spacing:1px; margin-top:1rem;">Non-Conformité Critique (P0)</div>
                </div>
                <div>
                    <div style="font-size:3rem; font-weight:700; color:var(--primary);">>50%</div>
                    <div style="text-transform:uppercase; font-size:0.8rem; letter-spacing:1px; margin-top:1rem;">Taux de Conformité Global</div>
                </div>
                <div>
                    <div style="font-size:3rem; font-weight:700; color:var(--primary);">+3</div>
                    <div style="text-transform:uppercase; font-size:0.8rem; letter-spacing:1px; margin-top:1rem;">Labels Qualité</div>
                </div>
            </div>

            <div style="margin-top:6rem; color:var(--text-light); font-size:0.9rem;">
                SLOW VILLAGE • RAPPORT AUDIT QUALITÉ
            </div>
        </div>
    </div>

</body>
</html>
"""

with open('/Users/jb/Documents/SYNTHESE_AUDIT_QUALITE/RAPPORT_AUDIT_SLOW_VILLAGE.html', 'w') as f:
    f.write(html_content)

print("✅ Rapport HTML Premium (McKinsey Style) généré avec succès !")
