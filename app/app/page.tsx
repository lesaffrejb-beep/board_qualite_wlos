import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function HomePage() {
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
