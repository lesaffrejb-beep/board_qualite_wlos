'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Building2, Shield } from 'lucide-react'
import { useRouter } from 'next/navigation'

// 🔐 Admin credentials (hardcoded for testing)
const ADMIN_PASSWORD = 'admin123' // Change this!

export default function LoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [adminPassword, setAdminPassword] = useState('')
    const [showAdmin, setShowAdmin] = useState(false)
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

    const supabase = createClient()

    const handleMagicLink = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setMessage(null)

        try {
            const { error } = await supabase.auth.signInWithOtp({
                email,
                options: {
                    emailRedirectTo: `${window.location.origin}/auth/callback`,
                },
            })

            if (error) throw error

            setMessage({
                type: 'success',
                text: 'Lien de connexion envoyé ! Vérifiez votre boîte email.'
            })
            setEmail('')
        } catch (error: any) {
            setMessage({
                type: 'error',
                text: error.message || 'Une erreur est survenue'
            })
        } finally {
            setLoading(false)
        }
    }

    const handleAdminLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setMessage(null)

        if (adminPassword === ADMIN_PASSWORD) {
            // 🔐 Create admin session
            localStorage.setItem('admin_session', JSON.stringify({
                isAdmin: true,
                email: 'admin@slowvillage.fr',
                timestamp: Date.now()
            }))
            
            setMessage({
                type: 'success',
                text: 'Connexion admin réussie ! Redirection...'
            })
            
            setTimeout(() => {
                router.push('/dashboard')
                router.refresh()
            }, 500)
        } else {
            setMessage({
                type: 'error',
                text: 'Mot de passe admin incorrect'
            })
        }
        
        setLoading(false)
    }

    return (
        <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--sv-beige-100)' }}>
            <div className="card" style={{ maxWidth: '400px', width: '100%', padding: '2rem' }}>
                {/* Logo */}
                <div className="flex items-center justify-center gap-2 mb-6">
                    <div
                        style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: 'var(--radius-full)',
                            background: 'var(--sv-green-500)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white'
                        }}
                    >
                        <Building2 size={28} />
                    </div>
                </div>

                <h1
                    style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '1.5rem',
                        textAlign: 'center',
                        marginBottom: '0.5rem',
                        color: 'var(--sv-green-500)'
                    }}
                >
                    Slow Village
                </h1>
                <p
                    style={{
                        textAlign: 'center',
                        color: 'var(--sv-gray-600)',
                        marginBottom: '2rem',
                        fontSize: '0.875rem'
                    }}
                >
                    Plateforme Qualité & Conformité
                </p>

                {/* Toggle Admin/User */}
                <div style={{ 
                    display: 'flex', 
                    gap: '0.5rem', 
                    marginBottom: '1.5rem',
                    padding: '4px',
                    background: 'var(--sv-beige-200)',
                    borderRadius: 'var(--radius-md)'
                }}>
                    <button
                        type="button"
                        onClick={() => setShowAdmin(false)}
                        style={{
                            flex: 1,
                            padding: '0.5rem',
                            borderRadius: 'var(--radius-sm)',
                            border: 'none',
                            background: !showAdmin ? 'white' : 'transparent',
                            color: !showAdmin ? 'var(--sv-green-500)' : 'var(--sv-gray-600)',
                            fontSize: '0.875rem',
                            cursor: 'pointer',
                            fontWeight: !showAdmin ? 600 : 400
                        }}
                    >
                        Utilisateur
                    </button>
                    <button
                        type="button"
                        onClick={() => setShowAdmin(true)}
                        style={{
                            flex: 1,
                            padding: '0.5rem',
                            borderRadius: 'var(--radius-sm)',
                            border: 'none',
                            background: showAdmin ? 'var(--sv-amber-500)' : 'transparent',
                            color: showAdmin ? 'white' : 'var(--sv-gray-600)',
                            fontSize: '0.875rem',
                            cursor: 'pointer',
                            fontWeight: showAdmin ? 600 : 400
                        }}
                    >
                        <Shield size={14} style={{ display: 'inline', marginRight: '4px' }} />
                        Admin
                    </button>
                </div>

                {/* User Login Form */}
                {!showAdmin && (
                    <form onSubmit={handleMagicLink}>
                        <div style={{ marginBottom: '1rem' }}>
                            <label className="label" htmlFor="email">
                                Email professionnel
                            </label>
                            <input
                                id="email"
                                type="email"
                                className="input"
                                placeholder="votre@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={loading}
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary"
                            style={{ width: '100%' }}
                            disabled={loading}
                        >
                            {loading ? 'Envoi en cours...' : 'Recevoir le lien de connexion'}
                        </button>
                    </form>
                )}

                {/* Admin Login Form */}
                {showAdmin && (
                    <form onSubmit={handleAdminLogin}>
                        <div style={{ 
                            padding: '1rem', 
                            background: 'var(--sv-amber-50)', 
                            borderRadius: 'var(--radius-md)',
                            marginBottom: '1rem',
                            border: '1px solid var(--sv-amber-200)'
                        }}>
                            <div style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '0.5rem',
                                marginBottom: '0.5rem',
                                color: 'var(--sv-amber-700)',
                                fontSize: '0.875rem',
                                fontWeight: 600
                            }}>
                                <Shield size={16} />
                                Accès Administrateur
                            </div>
                            <p style={{ fontSize: '0.75rem', color: 'var(--sv-gray-600)' }}>
                                Mode test uniquement
                            </p>
                        </div>

                        <div style={{ marginBottom: '1rem' }}>
                            <label className="label" htmlFor="admin-password">
                                Mot de passe admin
                            </label>
                            <input
                                id="admin-password"
                                type="password"
                                className="input"
                                placeholder="••••••"
                                value={adminPassword}
                                onChange={(e) => setAdminPassword(e.target.value)}
                                required
                                disabled={loading}
                                autoFocus
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn"
                            style={{ 
                                width: '100%', 
                                background: 'var(--sv-amber-500)', 
                                color: 'white' 
                            }}
                            disabled={loading}
                        >
                            {loading ? 'Connexion...' : 'Connexion Admin'}
                        </button>
                    </form>
                )}

                {/* Message */}
                {message && (
                    <div
                        className={`alert alert-${message.type}`}
                        style={{ marginTop: '1rem', fontSize: '0.875rem' }}
                    >
                        {message.text}
                    </div>
                )}

                <p style={{
                    marginTop: '2rem',
                    textAlign: 'center',
                    fontSize: '0.75rem',
                    color: 'var(--sv-gray-400)'
                }}>
                    {!showAdmin ? 'Connexion sécurisée par email • Sans mot de passe' : 'Mode administrateur • Accès restreint'}
                </p>
            </div>
        </div>
    )
}
