'use client';

import { useEffect, useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { 
  Building2, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp, 
  Clock,
  MapPin,
  ArrowUpRight
} from 'lucide-react';

// Types
interface Site {
  id: string;
  nom: string;
  code: string;
  score_conformite: number;
  nb_bloquants: number;
  nb_nc?: number;
  nb_ec?: number;
}

// Mock data basé sur les vraies données extraites
const MOCK_SITES: Site[] = [
  { id: '1', nom: "L'Orée de l'Océan", code: 'ORE', score_conformite: 72.6, nb_bloquants: 15, nb_nc: 325, nb_ec: 799 },
  { id: '2', nom: 'Saint Cybranet', code: 'CYB', score_conformite: 89.4, nb_bloquants: 3, nb_nc: 555, nb_ec: 800 },
  { id: '3', nom: 'Anduze', code: 'AND', score_conformite: 66.2, nb_bloquants: 15, nb_nc: 379, nb_ec: 800 },
  { id: '4', nom: 'Saint Martin de Ré 2026', code: 'SMR2', score_conformite: 60.8, nb_bloquants: 33, nb_nc: 337, nb_ec: 989 },
  { id: '5', nom: 'La Roque sur Cèze', code: 'ROQ', score_conformite: 56.9, nb_bloquants: 20, nb_nc: 296, nb_ec: 905 },
  { id: '6', nom: 'Saint Martin de Ré', code: 'SMR', score_conformite: 54.9, nb_bloquants: 33, nb_nc: 306, nb_ec: 1058 },
  { id: '7', nom: 'Biscarrosse Lac', code: 'BIS', score_conformite: 37.0, nb_bloquants: 24, nb_nc: 216, nb_ec: 1139 },
  { id: '8', nom: 'Séveilles', code: 'SEV', score_conformite: 30.1, nb_bloquants: 29, nb_nc: 143, nb_ec: 806 },
  { id: '9', nom: 'Marennes Oléron', code: 'MAR', score_conformite: 27.6, nb_bloquants: 13, nb_nc: 138, nb_ec: 1262 },
  { id: '10', nom: 'Pornic 2026', code: 'POR', score_conformite: 27.6, nb_bloquants: 30, nb_nc: 170, nb_ec: 1267 },
  { id: '11', nom: 'Les Ponts de Cé', code: 'PON', score_conformite: 14.9, nb_bloquants: 35, nb_nc: 82, nb_ec: 1366 },
];

const THEME_COLORS = {
  excellent: '#10B981',
  good: '#3B82F6',
  warning: '#F59E0B',
  danger: '#EF4444',
};

function getScoreColor(score: number): string {
  if (score >= 70) return THEME_COLORS.excellent;
  if (score >= 50) return THEME_COLORS.good;
  if (score >= 30) return THEME_COLORS.warning;
  return THEME_COLORS.danger;
}

// KPI Card Component
function KPICard({ 
  title, 
  value, 
  subtext, 
  icon: Icon, 
  trend,
  color = 'blue'
}: { 
  title: string; 
  value: string; 
  subtext?: string;
  icon: React.ElementType;
  trend?: string;
  color?: 'blue' | 'green' | 'red' | 'orange';
}) {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 text-blue-900',
    green: 'bg-emerald-50 border-emerald-200 text-emerald-900',
    red: 'bg-red-50 border-red-200 text-red-900',
    orange: 'bg-amber-50 border-amber-200 text-amber-900',
  };

  return (
    <div className={`p-6 rounded-lg border ${colorClasses[color]}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium opacity-70 uppercase tracking-wider">{title}</p>
          <p className="text-3xl font-light mt-2">{value}</p>
          {subtext && <p className="text-sm mt-1 opacity-60">{subtext}</p>}
          {trend && (
            <p className="text-sm mt-2 flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              {trend}
            </p>
          )}
        </div>
        <Icon className="w-8 h-8 opacity-50" />
      </div>
    </div>
  );
}

// Site Card Component
function SiteCard({ site, rank }: { site: Site; rank: number }) {
  const scoreColor = getScoreColor(site.score_conformite);
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
            style={{ backgroundColor: scoreColor }}
          >
            {rank}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{site.nom}</h3>
            <p className="text-sm text-gray-500 flex items-center gap-1">
              <MapPin className="w-3 h-3" /> {site.code}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-light" style={{ color: scoreColor }}>
            {site.score_conformite}%
          </p>
          <p className="text-xs text-gray-500">conformité</p>
        </div>
      </div>
      
      <div className="mt-4 flex items-center gap-4 text-sm">
        <div className="flex items-center gap-1 text-red-600">
          <AlertTriangle className="w-4 h-4" />
          <span className="font-medium">{site.nb_bloquants}</span>
          <span className="text-gray-500">bloquants</span>
        </div>
        <div className="flex items-center gap-1 text-amber-600">
          <Clock className="w-4 h-4" />
          <span className="font-medium">{site.nb_ec?.toLocaleString()}</span>
          <span className="text-gray-500">en cours</span>
        </div>
      </div>

      <div className="mt-3 w-full bg-gray-100 rounded-full h-2">
        <div 
          className="h-2 rounded-full transition-all"
          style={{ 
            width: `${Math.min(site.score_conformite, 100)}%`,
            backgroundColor: scoreColor 
          }}
        />
      </div>
    </div>
  );
}

// Main Dashboard
export default function DashboardCEO() {
  const [mounted, setMounted] = useState(false);
  const [selectedView, setSelectedView] = useState<'overview' | 'ranking' | 'alerts'>('overview');

  useEffect(() => {
    setMounted(true);
  }, []);

  // Calculs globaux
  const totalSites = MOCK_SITES.length;
  const avgScore = (MOCK_SITES.reduce((acc, s) => acc + s.score_conformite, 0) / totalSites).toFixed(1);
  const totalBloquants = MOCK_SITES.reduce((acc, s) => acc + s.nb_bloquants, 0);
  const sitesAvecAlerte = MOCK_SITES.filter(s => s.nb_bloquants > 20).length;

  // Sites triés par score
  const sortedSites = [...MOCK_SITES].sort((a, b) => b.score_conformite - a.score_conformite);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Building2 className="w-8 h-8 text-blue-400" />
              <div>
                <h1 className="text-lg font-semibold">Slow Village</h1>
                <p className="text-xs text-gray-400">Qualité & Conformité</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-400">CEO Dashboard</span>
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                CEO
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-6">
            {[
              { id: 'overview', label: 'Vue ensemble', icon: TrendingUp },
              { id: 'ranking', label: 'Classement', icon: Building2 },
              { id: 'alerts', label: 'Alertes', icon: AlertTriangle },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setSelectedView(item.id as any)}
                className={`flex items-center gap-2 py-4 text-sm font-medium border-b-2 transition-colors ${
                  selectedView === item.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <KPICard
            title="Sites"
            value={totalSites.toString()}
            subtext="Campings audités"
            icon={Building2}
            color="blue"
          />
          <KPICard
            title="Conformité Moyenne"
            value={`${avgScore}%`}
            subtext="Taux pondéré groupe"
            icon={CheckCircle2}
            trend="+2.3% vs 2024"
            color="green"
          />
          <KPICard
            title="Bloquants"
            value={totalBloquants.toString()}
            subtext="Critères bloquants"
            icon={AlertTriangle}
            color="red"
          />
          <KPICard
            title="Sites à Risque"
            value={sitesAvecAlerte.toString()}
            subtext=">20 bloquants"
            icon={Clock}
            color="orange"
          />
        </div>

        {/* Content based on selected view */}
        {selectedView === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Chart */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h2 className="text-lg font-semibold mb-6">Performance par Site</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={sortedSites}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" domain={[0, 100]} />
                    <YAxis 
                      dataKey="nom" 
                      type="category" 
                      width={120}
                      tick={{ fontSize: 11 }}
                    />
                    <Tooltip 
                      formatter={(value: number) => [`${value}%`, 'Conformité']}
                    />
                    <Bar dataKey="score_conformite" radius={[0, 4, 4, 0]}>
                      {sortedSites.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={getScoreColor(entry.score_conformite)} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Top & Flop */}
            <div className="space-y-6">
              {/* Top 3 */}
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <span className="text-2xl">🏆</span> Top 3
                </h2>
                <div className="space-y-3">
                  {sortedSites.slice(0, 3).map((site, idx) => (
                    <div key={site.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{['🥇', '🥈', '🥉'][idx]}</span>
                        <span className="font-medium">{site.nom}</span>
                      </div>
                      <span className="font-bold text-emerald-600">{site.score_conformite}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Attention requise */}
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <span className="text-2xl">⚠️</span> Attention Requise
                </h2>
                <div className="space-y-3">
                  {sortedSites.slice(-3).reverse().map((site) => (
                    <div key={site.id} className="flex items-center justify-between p-3 bg-red-50 rounded border border-red-100">
                      <span className="font-medium">{site.nom}</span>
                      <div className="text-right">
                        <span className="font-bold text-red-600">{site.score_conformite}%</span>
                        <span className="text-xs text-red-500 block">{site.nb_bloquants} bloquants</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedView === 'ranking' && (
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold">Classement Complet</h2>
              <p className="text-sm text-gray-500">11 sites classés par taux de conformité</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
              {sortedSites.map((site, idx) => (
                <SiteCard key={site.id} site={site} rank={idx + 1} />
              ))}
            </div>
          </div>
        )}

        {selectedView === 'alerts' && (
          <div className="space-y-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-red-900 mb-2">🚨 Alertes Critiques</h2>
              <p className="text-red-700">
                {totalBloquants} critères bloquants identifiés sur le groupe, nécessitant une action immédiate.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {MOCK_SITES
                .filter(s => s.nb_bloquants > 20)
                .sort((a, b) => b.nb_bloquants - a.nb_bloquants)
                .map(site => (
                  <div key={site.id} className="bg-white p-6 rounded-lg border-l-4 border-red-500 shadow-sm">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{site.nom}</h3>
                        <p className="text-gray-500">{site.nb_bloquants} critères bloquants</p>
                      </div>
                      <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                        Urgent
                      </span>
                    </div>
                    <div className="mt-4 flex items-center gap-4">
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1">
                        Voir le détail <ArrowUpRight className="w-4 h-4" />
                      </button>
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                        Contacter le directeur
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
