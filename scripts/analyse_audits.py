#!/usr/bin/env python3
"""
Analyse des audits qualité Slow Village
Expert: Marie-Claude Fortier - 15 ans d'expérience audit qualité hôtellerie plein air
"""

import openpyxl
import json
from pathlib import Path
from collections import defaultdict
from typing import Dict, List, Any

# Configuration
AUDIT_DIR = Path("/Users/jb/Downloads/SYNTHESE_AUDIT_QUALITE")
SITES = [
    "Anduze",
    "Biscarrosse Lac",
    "L'Orée de l'Océan",
    "La Roque sur Cèze",
    "Les Ponts de Cé",
    "Marennes Oléron",
    "Pornic 2026",
    "Saint Martin de Ré 2026",
    "Saint Martin de Ré",
    "Séveilles"
]

def parse_audit_file(filepath: Path) -> Dict[str, Any]:
    """Parse un fichier d'audit Excel et extrait la structure"""
    print(f"\n📊 Analyse de {filepath.name}...")
    
    wb = openpyxl.load_workbook(filepath, data_only=True)
    ws = wb.active
    
    # Structure de données
    data = {
        'site': filepath.stem.replace('Grille Audit ', ''),
        'themes': defaultdict(lambda: {
            'criteres': [],
            'conforme': 0,
            'non_conforme': 0,
            'en_cours': 0,
            'na': 0
        })
    }
    
    current_theme = None
    current_sous_theme = None
    
    # Parcourir toutes les lignes
    for i, row in enumerate(ws.iter_rows(min_row=1, values_only=True), 1):
        if not any(row):  # Ligne vide
            continue
            
        # Détecter les thèmes (généralement en gras, première colonne)
        # Adapter selon la structure réelle
        cell_a = row[0]
        cell_b = row[1] if len(row) > 1 else None
        
        # Afficher les 30 premières lignes pour comprendre la structure
        if i <= 30:
            print(f"  Ligne {i}: {row[:5]}")
    
    wb.close()
    return data

def main():
    print("=" * 80)
    print("🎯 SYNTHÈSE AUDIT QUALITÉ GROUPE SLOW VILLAGE")
    print("=" * 80)
    
    all_data = []
    
    # Parser tous les fichiers
    for site in SITES:
        filename = f"Grille Audit {site}.xlsx"
        filepath = AUDIT_DIR / filename
        
        if filepath.exists():
            try:
                data = parse_audit_file(filepath)
                all_data.append(data)
            except Exception as e:
                print(f"❌ Erreur sur {filename}: {e}")
        else:
            print(f"⚠️  Fichier non trouvé: {filename}")
    
    print(f"\n✅ {len(all_data)} fichiers analysés avec succès")
    
    # Sauvegarder les données brutes
    output_file = AUDIT_DIR / "data_extracted.json"
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(all_data, f, ensure_ascii=False, indent=2)
    
    print(f"💾 Données sauvegardées dans: {output_file}")

if __name__ == "__main__":
    main()
