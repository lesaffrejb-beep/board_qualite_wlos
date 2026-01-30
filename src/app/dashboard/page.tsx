'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Site } from '@/lib/supabase/types'
import {
    Building2,
    AlertTriangle,
    CheckCircle2,
    TrendingUp,
    Clock,
    LogOut,
    LayoutDashboard,
    Trophy,
    Activity,
    ArrowUpRight,
    MoreHorizontal,
    MapPin
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts'
import { isAdminLoggedIn, logoutAdmin } from '@/lib/auth'

/* ==============================================
   TYPES
   ============================================== */
interface SiteStats extends Site {
    nb_nc?: number // Non-conformités
    nb_ec?: number // En cours
}

/* ==============================================
   DASHBOARD COMPONENT
   ============================================== */
export default function DashboardPage() {
    const [sites, setSites] = useState<SiteStats[]>([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState<'overview' | 'ranking' | 'map'>('overview')
    const router = useRouter()
    const supabase = createClient()

    // -- Auth Check & Data Fetching --
    useEffect(() => {
        // Check auth
        const checkAuth = async () => {
            const adminLoggedIn = isAdminLoggedIn()
            if (adminLoggedIn) {
                // Admin is logged in, continue loading data
                loadSites()
                return
            }
            
            // Check Supabase auth
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                router.push('/login')
                return
            }
            
            loadSites()
        }
        
        checkAuth()

        // Realtime subscription
        const channel = supabase
            .channel('dashboard_changes')
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'audit_reponses'
            }, () => {
                loadSites()
            })
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [])

    async function loadSites() {
        try {
            const { data, error } = await supabase
                .from('sites')
                .select('*')
                .eq('statut', 'actif')
                .order('score_conformite', { ascending: false })

            if (error) throw error
            setSites(data || [])
        } catch (error) {
            console.error('Error loading sites:', error)
        } finally {
            setLoading(false)
        }
    }

    async function handleSignOut() {
        // Check if admin first
        if (isAdminLoggedIn()) {
            logoutAdmin()
            router.push('/login')
            return
        }
        // Otherwise sign out from Supabase
        await supabase.auth.signOut()
        router.push('/login')
    }

    // -- Computed Stats --
    const totalSites = sites.length
    const avgScore = sites.length > 0
        ? (sites.reduce((acc, s) => acc + (s.score_conformite || 0), 0) / totalSites).toFixed(1)
        : '0.0'
    const totalBloquants = sites.reduce((acc, s) => acc + (s.nb_bloquants || 0), 0)

    // Data for Charts
    const chartData = sites.slice(0, 5).map(s => ({
        name: s.code,
        score: s.score_conformite
    }))

    const pieData = [
        { name: 'Conforme', value: 75, color: 'var(--sv-success)' },
        { name: 'À améliorer', value: 15, color: 'var(--sv-warning)' },
        { name: 'Non conforme', value: 10, color: 'var(--sv-danger)' },
    ] // Mock data for global distribution until real data aggregation

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FDFCF9]">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1E4D2B]"></div>
                    <div className="font-display text-[#1E4D2B] text-xl">Slow Village...</div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#F8F9FA] text-[#2D2D2D] font-sans">

            {/* -- SIDEBAR (Left) -- */}
            <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-100 z-20 flex-col hidden md:flex">
                <div className="p-6 flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#1E4D2B] rounded-xl flex items-center justify-center text-white shadow-lg shadow-green-900/10">
                        <Building2 size={20} />
                    </div>
                    <div>
                        <h1 className="font-display font-bold text-lg leading-tight tracking-tight">Slow Village</h1>
                        <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Qualité</span>
                    </div>
                </div>

                <nav className="flex-1 px-4 space-y-2 mt-4">
                    <NavItem
                        icon={LayoutDashboard}
                        label="Vue d'ensemble"
                        active={activeTab === 'overview'}
                        onClick={() => setActiveTab('overview')}
                    />
                    <NavItem
                        icon={Trophy}
                        label="Classement"
                        active={activeTab === 'ranking'}
                        onClick={() => setActiveTab('ranking')}
                    />
                    <NavItem
                        icon={AlertTriangle}
                        label="Alertes & Risques"
                        active={false}
                        badge={totalBloquants > 0 ? totalBloquants.toString() : undefined}
                    />
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <button
                        onClick={handleSignOut}
                        className="flex items-center gap-3 text-sm text-gray-500 hover:text-[#B85450] transition-colors p-3 w-full rounded-lg hover:bg-red-50"
                    >
                        <LogOut size={18} />
                        <span>Déconnexion</span>
                    </button>
                </div>
            </aside>

            {/* -- MAIN CONTENT (Right) -- */}
            <main className="md:ml-64 p-8">

                {/* Header Section */}
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h2 className="text-2xl font-display font-bold text-[#1E3A2B] mb-1">
                            Tableau de bord
                        </h2>
                        <p className="text-gray-500 text-sm">
                            Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <button className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium shadow-sm hover:bg-gray-50 transition-colors">
                            Exporter PDF
                        </button>
                        <button className="bg-[#1E4D2B] text-white px-4 py-2 rounded-lg text-sm font-medium shadow-lg shadow-green-900/20 hover:bg-[#153820] transition-colors flex items-center gap-2">
                            <Activity size={16} />
                            Lancer un audit
                        </button>
                    </div>
                </div>

                {activeTab === 'overview' && (
                    <div className="space-y-8">

                        {/* KPI ROW */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <KpiCard
                                title="Score Global"
                                value={`${avgScore}%`}
                                trend="+2.4%"
                                icon={TrendingUp}
                                color="text-[#1E4D2B]"
                                bg="bg-green-50"
                            />
                            <KpiCard
                                title="Sites Audités"
                                value={totalSites.toString()}
                                icon={Building2}
                                color="text-[#D4845F]"
                                bg="bg-orange-50"
                            />
                            <KpiCard
                                title="Critères Bloquants"
                                value={totalBloquants.toString()}
                                trend="Action requise"
                                trendColor="text-red-500"
                                icon={AlertTriangle}
                                color="text-[#B85450]"
                                bg="bg-red-50"
                            />
                            <KpiCard
                                title="Audits en cours"
                                value="3"
                                icon={Clock}
                                color="text-[#5B8BA0]"
                                bg="bg-blue-50"
                            />
                        </div>

                        {/* CHARTS ROW */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                            {/* Site Performance Bar Chart */}
                            <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="font-display font-semibold text-lg text-[#1E3A2B]">Top Performance</h3>
                                    <button className="text-sm text-[#D4845F] font-medium hover:underline">Voir tout</button>
                                </div>
                                <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={chartData}>
                                            <XAxis
                                                dataKey="name"
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{ fill: '#9CA3AF', fontSize: 12 }}
                                                dy={10}
                                            />
                                            <YAxis hide />
                                            <Tooltip
                                                cursor={{ fill: '#F3F4F6' }}
                                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                            />
                                            <Bar
                                                dataKey="score"
                                                fill="#1E4D2B"
                                                radius={[6, 6, 0, 0]}
                                                barSize={40}
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Distribution Pie Chart */}
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                <h3 className="font-display font-semibold text-lg text-[#1E3A2B] mb-6">Répartition Conformité</h3>
                                <div className="h-48 relative">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={pieData}
                                                innerRadius={60}
                                                outerRadius={80}
                                                paddingAngle={5}
                                                dataKey="value"
                                            >
                                                {pieData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                                ))}
                                            </Pie>
                                        </PieChart>
                                    </ResponsiveContainer>
                                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                                        <span className="text-2xl font-bold text-[#1E3A2B]">75%</span>
                                        <span className="text-xs text-gray-400">Conforme</span>
                                    </div>
                                </div>
                                <div className="flex justify-center gap-4 mt-4">
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                        <div className="w-2 h-2 rounded-full bg-[#1E4D2B]"></div> Conforme
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                        <div className="w-2 h-2 rounded-full bg-[#D4845F]"></div> Moyen
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                        <div className="w-2 h-2 rounded-full bg-[#B85450]"></div> Non
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* DATA TABLE */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                                <h3 className="font-display font-semibold text-lg text-[#1E3A2B]">Sites & Résultats</h3>
                                <div className="flex gap-2">
                                    {/* Filters could go here */}
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-gray-50/50 text-xs uppercase tracking-wider text-gray-500 font-medium">
                                            <th className="px-6 py-4">Nom du site</th>
                                            <th className="px-6 py-4">Directeur</th>
                                            <th className="px-6 py-4">Conformité</th>
                                            <th className="px-6 py-4">Bloquants</th>
                                            <th className="px-6 py-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {sites.map((site) => (
                                            <tr key={site.id} className="hover:bg-gray-50/80 transition-colors group">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold
                                       ${site.score_conformite >= 70 ? 'bg-green-100 text-green-700' :
                                                                site.score_conformite >= 50 ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'}
                                    `}>
                                                            {site.code}
                                                        </div>
                                                        <span className="font-medium text-gray-900">{site.nom}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500">
                                                    {/* Placeholder for director name until join */}
                                                    Jean Dupont
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <span className={`font-bold text-sm
                                       ${site.score_conformite >= 70 ? 'text-[#1E4D2B]' :
                                                                site.score_conformite >= 50 ? 'text-[#D4845F]' : 'text-[#B85450]'}
                                    `}>
                                                            {site.score_conformite}%
                                                        </span>
                                                        <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                            <div
                                                                className={`h-full rounded-full ${site.score_conformite >= 70 ? 'bg-[#1E4D2B]' :
                                                                    site.score_conformite >= 50 ? 'bg-[#D4845F]' : 'bg-[#B85450]'
                                                                    }`}
                                                                style={{ width: `${site.score_conformite}%` }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {site.nb_bloquants > 0 ? (
                                                        <span className="inline-flex items-center gap-1.5 bg-red-50 text-red-600 px-2.5 py-1 rounded-full text-xs font-medium">
                                                            <AlertTriangle size={12} />
                                                            {site.nb_bloquants}
                                                        </span>
                                                    ) : (
                                                        <span className="text-gray-400 text-sm">-</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button className="text-gray-400 hover:text-[#1E4D2B] transition-colors p-1">
                                                        <MoreHorizontal size={20} />
                                                    </button>
                                                    <button className="ml-2 text-xs font-medium text-[#1E4D2B] opacity-0 group-hover:opacity-100 transition-opacity">
                                                        Détails &rarr;
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                    </div>
                )}

            </main>
        </div>
    )
}

/* ==============================================
   SUB-COMPONENTS
   ============================================== */

function NavItem({ icon: Icon, label, active, onClick, badge }: any) {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all text-sm font-medium
         ${active
                    ? 'bg-[#1E4D2B]/10 text-[#1E4D2B]'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
      `}
        >
            <div className="flex items-center gap-3">
                <Icon size={18} className={active ? 'text-[#1E4D2B]' : 'text-gray-400'} />
                <span>{label}</span>
            </div>
            {badge && (
                <span className="bg-[#B85450] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                    {badge}
                </span>
            )}
        </button>
    )
}

function KpiCard({ title, value, trend, trendColor, icon: Icon, color, bg }: any) {
    return (
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-start justify-between hover:shadow-md transition-shadow">
            <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">{title}</p>
                <h4 className="text-2xl font-bold text-gray-900 mb-2">{value}</h4>
                {trend && (
                    <div className={`flex items-center gap-1 text-xs font-medium ${trendColor || 'text-green-600'}`}>
                        {trend.includes('+') ? <TrendingUp size={12} /> : null}
                        {trend}
                    </div>
                )}
            </div>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${bg || 'bg-gray-50'} ${color || 'text-gray-600'}`}>
                <Icon size={20} />
            </div>
        </div>
    )
}
