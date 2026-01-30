#!/bin/bash
# dev.sh pour board_qualite_wlos

echo "🚀 Lancement de Board Qualité..."
# Charger les variables locales si le fichier existe
if [ -f .env.local ]; then
  export $(cat .env.local | xargs)
fi

# Forcer le port 3001 pour éviter le conflit avec Valo-Syndic (souvent sur 3000)
PORT=3001 npm run dev
