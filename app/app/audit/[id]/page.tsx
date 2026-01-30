'use client'

import { useEffect, useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { OfflineStorage, type AuditResponseLocal } from '@/lib/offline-storage'
import { ArrowLeft, Save, UploadCloud, Check, Camera, Image as ImageIcon, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

// Types
import { Database } from '@/lib/supabase/types'
type Theme = Database['public']['Tables']['themes']['Row'] & {
    criteres: (Database['public']['Tables']['criteres']['Row'] & {
        response?: AuditResponseLocal
    })[]
}

export default function AuditFormPage({ params }: { params: { id: string } }) {
    const { id: auditId } = params
    const [themes, setThemes] = useState<Theme[]>([])
    const [activeThemeIndex, setActiveThemeIndex] = useState(0)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [lastSaved, setLastSaved] = useState<Date | null>(null)

    // UI State
    const [showPhotoModal, setShowPhotoModal] = useState<string | null>(null) // critere_id

    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        loadData()
    }, [auditId])

    async function loadData() {
        try {
            // 1. Load Themes & Criteria (Reference Data)
            // Ideally we cache this too, but for V1 we fetch
            const { data: themesData, error: themesError } = await supabase
                .from('themes')
                .select(`
                    id, code, nom, couleur, ordre_affichage,
                    sous_themes (
                        id, nom, ordre_affichage,
                        criteres (
                            id, code, texte, priorite, ordre_affichage
                        )
                    )
                `)
                .order('ordre_affichage')

            if (themesError) throw themesError

            // 2. Load Existing Responses (Server)
            const { data: responsesData } = await supabase
                .from('audit_reponses')
                .select('*')
                .eq('audit_id', auditId)

            // 3. Load Local Responses (Offline)
            const localAudit = OfflineStorage.getAudit(auditId)
            const localResponses = localAudit?.responses || {}

            // Transform structure to be flat
            // Force cast to any to avoid complex TS mapping issues with Supabase nested types
            const processedThemes = (themesData as any[])?.map((theme: any) => {
                const allCriteres = theme.sous_themes
                    .sort((a: any, b: any) => (a.ordre_affichage || 0) - (b.ordre_affichage || 0))
                    .flatMap((st: any) =>
                        st.criteres.map((c: any) => {
                            // Find response: Local > Server > None
                            // Force cast responsesData to any[] because it might be null or inferred as never[]
                            const serverResp = (responsesData as any[])?.find((r: any) => r.critere_id === c.id)
                            const localResp = localResponses[c.id]

                            const response = localResp || (serverResp ? {
                                critere_id: c.id,
                                statut: serverResp.statut,
                                commentaire: serverResp.commentaire,
                                synced: true
                            } : undefined)

                            return { ...c, response }
                        })
                    )

                return { ...theme, criteres: allCriteres }
            })

            setThemes(processedThemes || [])
        } catch (e) {
            console.error(e)
            alert('Erreur chargement données')
        } finally {
            setLoading(false)
        }
    }

    const handleResponseChange = (critereId: string, field: keyof AuditResponseLocal, value: any) => {
        const themeIndex = themes.findIndex(t => t.criteres.some(c => c.id === critereId))
        if (themeIndex === -1) return

        const newThemes = [...themes]
        const critere = newThemes[themeIndex].criteres.find(c => c.id === critereId)
        if (!critere) return

        // Update local state
        const currentResponse = critere.response || {
            critere_id: critereId,
            statut: 'na',
            synced: false
        }

        const newResponse = { ...currentResponse, [field]: value, synced: false }
        critere.response = newResponse as any
        setThemes(newThemes)

        // Save to offline storage
        OfflineStorage.saveResponse(auditId, newResponse as any)
    }

    const syncData = async () => {
        setSaving(true)
        try {
            const localAudit = OfflineStorage.getAudit(auditId)
            if (!localAudit || !localAudit.responses) return

            const unsynced = Object.values(localAudit.responses).filter(r => !r.synced)

            for (const resp of unsynced) {
                // Upsert to Supabase
                const { error } = await supabase
                    .from('audit_reponses')
                    .upsert({
                        audit_id: auditId,
                        critere_id: resp.critere_id,
                        statut: resp.statut,
                        commentaire: resp.commentaire,
                        saisi_le: new Date().toISOString()
                    } as any, { onConflict: 'audit_id, critere_id' })

                if (!error) {
                    // Mark as synced locally
                    OfflineStorage.saveResponse(auditId, { ...resp, synced: true })
                }
            }

            setLastSaved(new Date())
            // Reload to refresh state
            // loadData() 
        } catch (e) {
            console.error('Sync failed', e)
        } finally {
            setSaving(false)
        }
    }

    if (loading) return <div className="p-8 text-center">Chargement de l'audit...</div>

    const activeTheme = themes[activeThemeIndex]

    return (
        <div className="flex flex-col h-screen bg-[#FDFCF9]">
            {/* Header */}
            <header className="bg-white border-b border-[#E8E2D5] px-4 py-3 flex items-center justify-between sticky top-0 z-10">
                <Link href="/audit" className="p-2 -ml-2 text-gray-600">
                    <ArrowLeft size={24} />
                </Link>

                <div className="flex-1 text-center font-display font-semibold text-[#1E4D2B]">
                    {activeTheme?.nom}
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={syncData}
                        disabled={saving}
                        className={`p-2 rounded-full ${saving ? 'animate-spin' : ''}`}
                    >
                        {saving ? <UploadCloud size={24} className="text-[#D4845F]" /> : <Save size={24} className="text-[#1E4D2B]" />}
                    </button>
                </div>
            </header>

            {/* Theme Navigation (Tabs) */}
            <div className="bg-[#1E4D2B] text-white overflow-x-auto whitespace-nowrap">
                <div className="flex px-2 py-2 gap-2">
                    {themes.map((theme, idx) => {
                        const progress = Math.round(
                            (theme.criteres.filter(c => c.response && c.response.statut !== 'na').length / theme.criteres.length) * 100
                        ) || 0

                        return (
                            <button
                                key={theme.id}
                                onClick={() => setActiveThemeIndex(idx)}
                                className={`
                                    px-3 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center gap-2
                                    ${idx === activeThemeIndex ? 'bg-white text-[#1E4D2B]' : 'bg-[#153820] text-gray-300'}
                                `}
                            >
                                {theme.code}
                                <span className={`text-[10px] px-1.5 rounded-full ${idx === activeThemeIndex ? 'bg-[#1E4D2B] text-white' : 'bg-[#1E4D2B] text-white'}`}>
                                    {progress}%
                                </span>
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* Criteria List */}
            <main className="flex-1 overflow-y-auto p-4 space-y-6">
                {activeTheme?.criteres.map(critere => (
                    <div key={critere.id} className="bg-white rounded-xl border border-[#E8E2D5] overflow-hidden shadow-sm">
                        {/* Header Critère */}
                        <div className="p-4 bg-[#F5F0E6] border-b border-[#E8E2D5] flex justify-between items-start">
                            <p className="font-medium text-[#2D2D2D] text-sm">{critere.texte}</p>
                            {critere.priorite === 'P0' && (
                                <span className="text-[10px] font-bold text-white bg-[#B85450] px-2 py-0.5 rounded ml-2">P0</span>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="p-4">
                            <div className="flex gap-2 mb-4">
                                {['conforme', 'en_cours', 'non_conforme', 'na'].map((status) => {
                                    const isSelected = critere.response?.statut === status
                                    const colors = {
                                        conforme: isSelected ? 'bg-[#4A7C59] text-white' : 'bg-[#E8F0EC] text-[#4A7C59]',
                                        en_cours: isSelected ? 'bg-[#D4845F] text-white' : 'bg-[#FDF6F2] text-[#D4845F]',
                                        non_conforme: isSelected ? 'bg-[#B85450] text-white' : 'bg-[#FDF2F2] text-[#B85450]',
                                        na: isSelected ? 'bg-gray-500 text-white' : 'bg-gray-100 text-gray-500'
                                    }
                                    const labels = { conforme: 'Conforme', en_cours: 'En cours', non_conforme: 'Non Conforme', na: 'N/A' }

                                    return (
                                        <button
                                            key={status}
                                            onClick={() => handleResponseChange(critere.id, 'statut', status)}
                                            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors ${(colors as any)[status]}`}
                                        >
                                            {(labels as any)[status]}
                                        </button>
                                    )
                                })}
                            </div>

                            <textarea
                                placeholder="Commentaire..."
                                className="w-full text-sm p-3 border border-[#E8E2D5] rounded-lg bg-[#FAFAFA] focus:outline-none focus:border-[#D4845F]"
                                rows={2}
                                value={critere.response?.commentaire || ''}
                                onChange={(e) => handleResponseChange(critere.id, 'commentaire', e.target.value)}
                            />
                        </div>
                    </div>
                ))}

                {activeTheme?.criteres.length === 0 && (
                    <div className="text-center text-gray-500">Aucun critère pour ce thème.</div>
                )}
            </main>
        </div>
    )
}
