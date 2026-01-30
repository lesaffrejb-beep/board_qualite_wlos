'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Calendar, ChevronRight, CheckCircle2, AlertCircle, Clock } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface AuditSummary {
    id: string
    periode_debut: string
    statut: 'brouillon' | 'en_cours' | 'valide' | 'cloture'
    taux_conformite: number | null
    nb_bloquants: number
    score_total: number | null
}

export default function AuditListPage() {
    const [audits, setAudits] = useState<AuditSummary[]>([])
    const [loading, setLoading] = useState(true)
    const [siteName, setSiteName] = useState('')
    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        loadAudits()
    }, [])

    async function loadAudits() {
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            // Get user's site
            // Note: In a real app, we'd fetch the site connected to the user
            // For now, we'll fetch the first site available to them via RLS or metadata
            let siteId = user.user_metadata.site_id

            if (!siteId) {
                // Fallback: try to find a site where they are director
                const { data: site } = await supabase
                    .from('sites')
                    .select('id, nom')
                    .eq('directeur_id', user.id)
                    .single()

                if (site) {
                    siteId = (site as any).id
                    setSiteName((site as any).nom)
                } else {
                    // Debug/Demo mode: if no site assigned, pick the first one just to show UI
                    const { data: firstSite } = await supabase.from('sites').select('id, nom').limit(1).single()
                    if (firstSite) {
                        siteId = (firstSite as any).id
                        setSiteName((firstSite as any).nom)
                    }
                }
            }

            if (!siteId) return

            const { data, error } = await supabase
                .from('audits')
                .select('*')
                .eq('site_id', siteId)
                .order('periode_debut', { ascending: false })

            if (error) throw error
            setAudits(data || [])
        } catch (error) {
            console.error('Error loading audits:', error)
        } finally {
            setLoading(false)
        }
    }

    async function createNewAudit() {
        // Logic to create a new audit
        // For demo: create a new draft audit for the current month
        try {
            setLoading(true)
            const { data: { user } } = await supabase.auth.getUser()

            // Find site again (should be refactored to context/hook)
            const { data: site } = await supabase.from('sites').select('id').limit(1).single()

            if (!site || !user) throw new Error("Site ou user non trouvé")

            const { data, error } = await supabase
                .from('audits')
                .insert({
                    site_id: (site as any).id,
                    auditeur_id: user.id,
                    periode_debut: new Date().toISOString(),
                    statut: 'brouillon'
                } as any)
                .select()
                .single()

            if (error) throw error
            router.push(`/audit/${(data as any).id}`)
        } catch (e) {
            console.error(e)
            alert("Erreur lors de la création de l'audit")
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FDFCF9]">
                <div className="animate-pulse text-[#1E4D2B] font-display text-xl">Chargement...</div>
            </div>
        )
    }

    return (
        <div className="min-h-screen pb-20 bg-[#FDFCF9]">
            {/* Header Mobile */}
            <header className="bg-[#1E4D2B] text-white p-4 sticky top-0 z-10 shadow-md">
                <div className="flex justify-between items-center mb-2">
                    <h1 className="font-display text-xl font-semibold">Audits</h1>
                    <div className="text-sm opacity-80">{siteName || 'Slow Village'}</div>
                </div>
                <p className="text-xs opacity-70">Gérez vos contrôles qualité</p>
            </header>

            <main className="p-4 space-y-6">
                {/* Action Principale */}
                <button
                    onClick={createNewAudit}
                    className="w-full bg-[#D4845F] text-white p-4 rounded-xl shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-transform"
                >
                    <Plus size={24} />
                    <span className="font-medium text-lg">Nouvel Audit</span>
                </button>

                {/* Liste des audits */}
                <div className="space-y-4">
                    <h2 className="font-display text-lg text-[#1E4D2B]">Historique</h2>

                    {audits.length === 0 ? (
                        <div className="text-center py-10 text-gray-500 bg-white rounded-xl border border-[#E8E2D5]">
                            <Calendar size={40} className="mx-auto mb-2 opacity-50" />
                            <p>Aucun audit pour le moment</p>
                        </div>
                    ) : (
                        audits.map(audit => (
                            <Link href={`/audit/${audit.id}`} key={audit.id} className="block">
                                <div className="bg-white p-4 rounded-xl border border-[#E8E2D5] shadow-sm active:bg-[#F5F0E6] transition-colors">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Calendar size={14} />
                                            {new Date(audit.periode_debut).toLocaleDateString()}
                                        </div>
                                        <StatusBadge status={audit.statut} />
                                    </div>

                                    <div className="flex justify-between items-end">
                                        <div>
                                            {audit.statut === 'valide' ? (
                                                <div className="text-2xl font-display font-bold text-[#1E4D2B]">
                                                    {audit.taux_conformite}%
                                                    <span className="text-xs font-sans font-normal text-gray-500 ml-1">conformité</span>
                                                </div>
                                            ) : (
                                                <div className="text-sm font-medium text-gray-500 italic">En cours de saisie</div>
                                            )}
                                        </div>
                                        <ChevronRight size={20} className="text-gray-400" />
                                    </div>
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            </main>
        </div>
    )
}

function StatusBadge({ status }: { status: string }) {
    const styles = {
        brouillon: "bg-gray-100 text-gray-600",
        en_cours: "bg-blue-50 text-blue-600",
        valide: "bg-green-50 text-green-600",
        cloture: "bg-gray-100 text-gray-800",
    }

    const labels = {
        brouillon: "Brouillon",
        en_cours: "En cours",
        valide: "Validé",
        cloture: "Clôturé",
    }

    return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${(styles as any)[status] || styles.brouillon}`}>
            {(labels as any)[status] || status}
        </span>
    )
}
