'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { isAdminLoggedIn } from '@/lib/auth'

export default function HomePage() {
    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        const checkAuth = async () => {
            // Check admin session first (localStorage)
            if (isAdminLoggedIn()) {
                router.push('/dashboard')
                return
            }

            // Check Supabase auth
            const { data: { user } } = await supabase.auth.getUser()
            
            if (user) {
                router.push('/dashboard')
            } else {
                router.push('/login')
            }
        }

        checkAuth()
    }, [router, supabase])

    // Loading state
    return (
        <div style={{ 
            minHeight: '100vh', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            background: 'var(--sv-beige-100)'
        }}>
            <div style={{ textAlign: 'center' }}>
                <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    border: '3px solid var(--sv-beige-300)',
                    borderTopColor: 'var(--sv-green-500)',
                    animation: 'spin 1s linear infinite',
                    margin: '0 auto 1rem'
                }} />
                <p style={{ color: 'var(--sv-gray-600)' }}>Chargement...</p>
            </div>
            <style jsx>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    )
}
