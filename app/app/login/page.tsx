'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Building2 } from 'lucide-react'

export default function LoginPage() {
    const [email, setEmail] = useState('')
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

                {/* Form */}
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
                    Connexion sécurisée par email • Sans mot de passe
                </p>
            </div>
        </div>
    )
}
