import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function HomePage() {
    // Check if Supabase is configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        return (
            <div style={{ padding: '2rem', fontFamily: 'system-ui' }}>
                <h1>⚠️ Configuration Error</h1>
                <p>Supabase environment variables are not configured.</p>
                <p>Please set:</p>
                <ul>
                    <li><code>NEXT_PUBLIC_SUPABASE_URL</code></li>
                    <li><code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code></li>
                </ul>
                <p style={{ marginTop: '1rem', padding: '1rem', background: '#fff3cd', borderRadius: '4px' }}>
                    <strong>Note:</strong> Make sure you&apos;re using <code>NEXT_PUBLIC_</code> prefix, not <code>VITE_</code>
                </p>
            </div>
        )
    }

    const supabase = createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
        // User is authenticated, redirect to dashboard
        redirect('/dashboard')
    } else {
        // Not authenticated, redirect to login
        redirect('/login')
    }
}
