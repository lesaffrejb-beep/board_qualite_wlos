/**
 * Configuration des variables d'environnement
 * Charge les vars depuis .env.local ou utilise les valeurs par défaut
 */

// En mode développement, ces valeurs viendront de import.meta.env avec Vite
// En mode production statique, on utilise les valeurs par défaut

window.ENV = {
    VITE_SUPABASE_URL: 'https://ydfgueqasslzhdbvermu.supabase.co',
    VITE_SUPABASE_ANON_KEY: '', // Ne pas committer la vraie clé
    VITE_ADMIN_PASSWORD: 'admin',
    VITE_SITE_PASSWORD: 'admin'
};

// Note: Pour Vercel, configurez ces variables dans l'interface
// Settings > Environment Variables
