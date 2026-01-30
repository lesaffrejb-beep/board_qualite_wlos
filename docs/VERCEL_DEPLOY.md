# Déploiement Vercel

## Étapes

### 1. Configurer les variables d'environnement sur Vercel

Dans l'interface Vercel, allez dans **Settings > Environment Variables** et ajoutez :

```
VITE_SUPABASE_URL=https://ydfgueqasslzhdbvermu.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlkZmd1ZXFhc3NsemhkYnZlcm11Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk3NTI1NzEsImV4cCI6MjA4NTMyODU3MX0.qYN8aV1JYq0C2kVDKq9DbABvDGBqfCgciBVtk99u0e4
VITE_ADMIN_PASSWORD=admin
VITE_SITE_PASSWORD=admin
```

### 2. Configuration du build

Le projet utilise une approche vanilla JS sans bundler pour la version statique.
Pour Vercel, vous pouvez simplement déployer le dossier `site-dashboard`.

**vercel.json** (à créer si besoin):
```json
{
  "version": 2,
  "public": true,
  "github": {
    "enabled": false
  }
}
```

### 3. Schéma Supabase

Exécutez les fichiers SQL dans l'ordre :

1. `supabase-schema.sql` - Crée les tables et l'historique
2. `supabase-insert-criteres.sql` - Insère tous les critères

### 4. Sécurité

- Les credentials sont cachés du git via `.gitignore`
- Les variables d'environnement sont sur Vercel
- Le mode fallback localStorage fonctionne si Supabase est indisponible

### 5. Accès

- **Directeurs de site** : Mot de passe = `admin` (par défaut)
- **Admin/CEO** : Mot de passe board = `admin`

Chaque site a sa propre session d'authentification (sessionStorage).

## URLs importantes

- **Production** : https://votre-projet.vercel.app
- **Supabase** : https://ydfgueqasslzhdbvermu.supabase.co
- **GitHub** : https://github.com/lesaffrejb-beep/board_qualite_wlos
