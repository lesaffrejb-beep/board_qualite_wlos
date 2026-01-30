# 🚀 V2 - SLOW VILLAGE QUALITÉ PLATFORM
## Architecture Technique & Vision Produit

---

## 📋 VISION PRODUIT

### Objectif
Transformer l'audit qualité Excel statique en une **plateforme temps réel** connectant :
- 🏕️ **Directeurs de site** (saisie mobile sur le terrain)
- 👔 **CEO/Direction** (dashboard temps réel)
- 👩‍💼 **Responsable Qualité** (pilote et validation)

### Promise Value
> "De l'Excel statique au contrôle qualité temps réel - Zero papier, 100% visibilité"

---

## 🏗️ ARCHITECTURE TECHNIQUE

### Stack Recommandé

```
┌─────────────────────────────────────────────────────────────────┐
│                     FRONTEND (Next.js 14)                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │  App Mobile  │  │  Admin CEO   │  │  Dashboard Directeur │  │
│  │  (PWA)       │  │  (Web)       │  │  (Web/Mobile)        │  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼ HTTPS/WSS
┌─────────────────────────────────────────────────────────────────┐
│                    SUPABASE (Backend)                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │  PostgreSQL  │  │  Realtime    │  │  Auth (JWT)          │  │
│  │  (Data)      │  │  (WebSocket) │  │  (RLS Policies)      │  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
│  ┌──────────────┐  ┌──────────────┐                              │
│  │  Storage     │  │  Edge Func   │                              │
│  │  (Photos)    │  │  (Compute)   │                              │
│  └──────────────┘  └──────────────┘                              │
└─────────────────────────────────────────────────────────────────┘
```

### Pourquoi Supabase ?

| Critère | Supabase | Alternative (Firebase) |
|---------|----------|------------------------|
| Base de données | PostgreSQL relationnel | Firestore NoSQL |
| Requêtes complexes | ✅ SQL natif | ❌ Limité |
| Realtime | ✅ Built-in | ⚠️ Add-on |
| Self-hosting | ✅ Possible | ❌ Non |
| Coût données | ✅ $0.00325/Go | ⚠️ $0.108/Go |
| RGPD | ✅ UE (Frankfurt) | ⚠️ USA |

---

## 📊 SCHÉMA DE DONNÉES (PostgreSQL)

```sql
-- ============================================
-- SLOW VILLAGE QUALITÉ - SCHEMA v2.0
-- ============================================

-- Sites (Campings)
CREATE TABLE sites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nom VARCHAR(100) NOT NULL,
    code VARCHAR(20) UNIQUE NOT NULL, -- ex: "CYB" pour Saint Cybranet
    region VARCHAR(50),
    directeur_id UUID REFERENCES auth.users(id),
    date_ouverture DATE,
    date_fermeture DATE,
    statut VARCHAR(20) DEFAULT 'actif', -- actif, fermeture, travaux
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Thèmes d'audit (8 thèmes fixes)
CREATE TABLE themes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(3) UNIQUE NOT NULL, -- AFF, EXP, IMA, QUA, RES, RH, SEC, SLO
    nom VARCHAR(100) NOT NULL,
    description TEXT,
    ordre_affichage INT DEFAULT 0,
    couleur VARCHAR(7) DEFAULT '#0077C8'
);

-- Sous-thèmes
CREATE TABLE sous_themes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    theme_id UUID REFERENCES themes(id) ON DELETE CASCADE,
    nom VARCHAR(200) NOT NULL,
    lot VARCHAR(100),
    ordre_affichage INT DEFAULT 0
);

-- Critères de qualité (référentiel)
CREATE TABLE criteres (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(20) UNIQUE NOT NULL, -- ex: "AFF-10"
    sous_theme_id UUID REFERENCES sous_themes(id),
    texte TEXT NOT NULL,
    priorite VARCHAR(2) NOT NULL CHECK (priorite IN ('P0', 'P1', 'P2', 'P3')),
    obligatoire BOOLEAN DEFAULT FALSE,
    poids DECIMAL(3,2) DEFAULT 1.00, -- Pondération pour scoring
    preuve_photo BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audits (instances d'audit)
CREATE TABLE audits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_id UUID REFERENCES sites(id) ON DELETE CASCADE,
    auditeur_id UUID REFERENCES auth.users(id),
    periode_debut DATE NOT NULL,
    periode_fin DATE,
    statut VARCHAR(20) DEFAULT 'en_cours', -- en_cours, valide, cloture
    score_total DECIMAL(5,2),
    score_max DECIMAL(5,2),
    taux_conformite DECIMAL(5,2),
    nb_bloquants INT DEFAULT 0,
    commentaire_general TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Réponses aux critères (cœur du système)
CREATE TABLE audit_reponses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    audit_id UUID REFERENCES audits(id) ON DELETE CASCADE,
    critere_id UUID REFERENCES criteres(id),
    
    -- Statut
    statut VARCHAR(20) NOT NULL CHECK (statut IN (
        'conforme', 'non_conforme', 'en_cours', 'na'
    )),
    
    -- Scoring
    score_obtenu DECIMAL(4,1) DEFAULT 0,
    score_possible DECIMAL(4,1) DEFAULT 0,
    
    -- Métadonnées
    commentaire TEXT,
    photos UUID[] DEFAULT '{}', -- Références storage
    
    -- Traçabilité
    saisi_par UUID REFERENCES auth.users(id),
    saisi_le TIMESTAMPTZ DEFAULT NOW(),
    modifie_par UUID REFERENCES auth.users(id),
    modifie_le TIMESTAMPTZ,
    
    -- Contrainte unique: un critère par audit
    UNIQUE(audit_id, critere_id)
);

-- Actions correctives (pour non-conformités)
CREATE TABLE actions_correctives (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reponse_id UUID REFERENCES audit_reponses(id) ON DELETE CASCADE,
    
    description TEXT NOT NULL,
    priorite VARCHAR(10) DEFAULT 'normale', -- urgente, haute, normale, basse
    
    assigne_a UUID REFERENCES auth.users(id),
    date_echeance DATE,
    
    statut VARCHAR(20) DEFAULT 'a_faire', -- a_faire, en_cours, faite, validee
    
    preuve_photo UUID,
    faite_par UUID REFERENCES auth.users(id),
    faite_le TIMESTAMPTZ,
    
    validee_par UUID REFERENCES auth.users(id),
    validee_le TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications temps réel
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- nouveau_audit, action_assignee, echeance_proche
    titre VARCHAR(200) NOT NULL,
    message TEXT,
    data JSONB DEFAULT '{}',
    lue BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEX POUR PERFORMANCE
-- ============================================

CREATE INDEX idx_reponses_audit ON audit_reponses(audit_id);
CREATE INDEX idx_reponses_critere ON audit_reponses(critere_id);
CREATE INDEX idx_reponses_statut ON audit_reponses(statut);
CREATE INDEX idx_audits_site ON audits(site_id);
CREATE INDEX idx_audits_statut ON audits(statut);
CREATE INDEX idx_actions_assigne ON actions_correctives(assigne_a);
CREATE INDEX idx_actions_statut ON actions_correctives(statut);
CREATE INDEX idx_notifications_user ON notifications(user_id, lue);

-- ============================================
-- VUES MATÉRIALISÉES (Dashboard)
-- ============================================

CREATE MATERIALIZED VIEW mv_scores_sites AS
SELECT 
    s.id as site_id,
    s.nom as site_nom,
    a.id as audit_id,
    a.periode_debut,
    a.taux_conformite,
    a.nb_bloquants,
    COUNT(CASE WHEN ar.statut = 'non_conforme' AND c.priorite = 'P1' THEN 1 END) as p1_nc,
    COUNT(CASE WHEN ar.statut = 'non_conforme' AND c.priorite = 'P2' THEN 1 END) as p2_nc,
    COUNT(CASE WHEN ar.statut = 'en_cours' THEN 1 END) as en_cours,
    NOW() as calcule_le
FROM sites s
LEFT JOIN audits a ON a.site_id = s.id AND a.statut = 'valide'
LEFT JOIN audit_reponses ar ON ar.audit_id = a.id
LEFT JOIN criteres c ON c.id = ar.critere_id
GROUP BY s.id, s.nom, a.id, a.periode_debut, a.taux_conformite, a.nb_bloquants;

-- Rafraîchissement automatique toutes les 5 minutes
SELECT cron.schedule('refresh-scores', '*/5 * * * *', 
    'REFRESH MATERIALIZED VIEW CONCURRENTLY mv_scores_sites');

-- ============================================
-- ROW LEVEL SECURITY (Multi-tenant)
-- ============================================

ALTER TABLE sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_reponses ENABLE ROW LEVEL SECURITY;
ALTER TABLE actions_correctives ENABLE ROW LEVEL SECURITY;

-- Politique: CEO voit tout
CREATE POLICY ceo_all_sites ON sites
    FOR ALL TO authenticated
    USING (auth.jwt() ->> 'role' = 'ceo');

-- Politique: Directeur ne voit que son site
CREATE POLICY director_own_site ON sites
    FOR ALL TO authenticated
    USING (
        auth.jwt() ->> 'role' = 'directeur' 
        AND directeur_id = auth.uid()
    );

-- Politique: Qualité voit tout (lecture seule)
CREATE POLICY qualite_read_all ON sites
    FOR SELECT TO authenticated
    USING (auth.jwt() ->> 'role' = 'qualite');
```

---

## 📱 INTERFACES UTILISATEUR

### 1. App Mobile Directeur (PWA)

```
┌─────────────────┐
│  🏕️ Slow Audit  │
├─────────────────┤
│                 │
│  📋 Mon Audit   │
│     67%         │
│                 │
│  [Continuer]    │
│                 │
├─────────────────┤
│  ⚠️ 3 Urgences  │
│  🔄 12 En cours │
│  ✅ 45 Validés  │
├─────────────────┤
│  [📷] [🎤] [💬] │
└─────────────────┘

-- Navigation par thème --
┌─────────────────┐
│  🔒 Sécurité    │ 78%
│  👁️ Image       │ 65%
│  ✨ Qualité     │ 82%
│  👥 RH          │ 45% ⚠️
└─────────────────┘

-- Détail critère --
┌─────────────────┐
│ SEC-15          │
│ Extincteurs     │
├─────────────────┤
│ Les extincteurs │
│ sont plombés... │
├─────────────────┤
│ [📷 Photo]      │
│                 │
│ [✅ Conforme]   │
│ [❌ Non conf.]  │
│ [🔄 En cours]   │
│ [⚪ N/A]        │
├─────────────────┤
│ 📝 Commentaire  │
└─────────────────┘
```

### 2. Dashboard CEO (Web)

```
┌─────────────────────────────────────────────────────────────┐
│  🏢 SLOW VILLAGE              [🔔 3]    [👤 CEO]    [⚙️]  │
├─────────────────────────────────────────────────────────────┤
│  SYNTHÈSE GROUPE                    Dernière mise à jour    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   📊 TAUX GLOBAL        🚨 BLOQUANTS       ⏱️ EN COURS     │
│      48.2%                 250                65.5%        │
│      ▲ +2.3%               ▼ -12              ▼ -5.2%      │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  CLASSEMENT DES SITES                                       │
├─────────────────────────────────────────────────────────────┤
│  🥇 L'Orée Océan    ████████████████████  89%  [🔴 3]     │
│  🥈 Saint Cybranet  ███████████████████░░░ 89%  [🔴 3]     │
│  🥉 Anduze          █████████████████░░░░░ 66%  [🔴 15]    │
│  4. Roque Cèze      ██████████████░░░░░░░░ 57%  [🔴 20]    │
│  5. St Martin 2026  ███████████████░░░░░░░ 61%  [🔴 33]    │
│     ...                                                     │
│  🔴 Les Ponts de Cé █████░░░░░░░░░░░░░░░░░ 15%  [🔴 35] ⚠️ │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  🚨 ALERTES TEMPS RÉEL                                      │
├─────────────────────────────────────────────────────────────┤
│  🔴 Nouveau bloquant: Biscarrosse - SEC-11 (il y a 5min)   │
│  🟠 Échéance demain: Anduze - Action #234                  │
│  🟢 Audit validé: Séveilles (il y a 1h)                    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 3. Détail Site (Admin)

```
┌─────────────────────────────────────────────────────────────┐
│  ← Retour           🏕️ SAINT CYBRANET                       │
├─────────────────────────────────────────────────────────────┤
│  Score: 89.4%  |  Bloquants: 3  |  Dernier audit: 15/01    │
├─────────────────────────────────────────────────────────────┤
│  [Vue d'ensemble] [🔒 Sécurité] [👁️ Image] [✨ Qualité]... │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  RADAR DES THÈMES                                           │
│                                                             │
│           Image                                             │
│            ▲                                                │
│    Sécu ◄──┼──► Qualité                                     │
│            ▼                                                │
│           RH                                                │
│                                                             │
│  ─────────────────────────────────────────────────────────  │
│                                                             │
│  NON-CONFORMITÉS PRIORITAIRES                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 🔴 SEC-11  Extincteurs          [📷] [✏️] [Assigner] │   │
│  │ 🔴 AFF-26  Affichage sécurité   [📷] [✏️] [Assigner] │   │
│  │ 🟠 QUA-21  TPE                  [📷] [✏️] [Assigner] │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  TENDANCE 6 MOIS                                            │
│  📈 14.9% → 89.4% (+74.5 points)                           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔌 REALTIME (Temps réel)

```javascript
// Exemple: Subscription temps réel côté client (Next.js)
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, 
                              process.env.NEXT_PUBLIC_SUPABASE_KEY)

// Dashboard CEO - Live updates
function useLiveScores() {
  const [scores, setScores] = useState([])
  
  useEffect(() => {
    // Chargement initial
    loadScores()
    
    // Subscription temps réel
    const subscription = supabase
      .channel('audit_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'audit_reponses' },
        (payload) => {
          // Rafraîchir les scores
          loadScores()
          
          // Notification si nouveau bloquant
          if (payload.new.statut === 'non_conforme') {
            toast.warning(`Nouvelle non-conformité détectée!`)
          }
        }
      )
      .subscribe()
    
    return () => subscription.unsubscribe()
  }, [])
  
  return scores
}
```

---

## 📦 ROADMAP DÉPLOIEMENT

### Phase 1: MVP (2-3 mois)
- [ ] Import du référentiel (1,553 critères)
- [ ] Authentification (CEO/Directeurs/Qualité)
- [ ] Saisie mobile basique (statut + commentaire)
- [ ] Dashboard simple (taux + classement)

### Phase 2: Consolidation (1-2 mois)
- [ ] Photos + géolocalisation
- [ ] Actions correctives avec workflow
- [ ] Notifications push
- [ ] Mode offline (PWA)

### Phase 3: Intelligence (2-3 mois)
- [ ] Analytics avancés (tendances, prédictions)
- [ ] Rapports auto générés (PDF McKinsey-style)
- [ ] Benchmarking inter-sites
- [ ] API pour exports

---

## 💰 ESTIMATION BUDGET

| Poste | Coût mensuel | Remarque |
|-------|-------------|----------|
| Supabase Pro | $25 | Jusqu'à 100k users |
| Vercel Pro | $20 | Hosting Next.js |
| Storage photos | ~$10 | Selon volume |
| **Total** | **~$55/mois** | Soit **~€660/an** |

---

## 🔐 SÉCURITÉ & RGPD

- ✅ Données hébergées en UE (Frankfurt)
- ✅ Chiffrement AES-256 au repos
- ✅ TLS 1.3 en transit
- ✅ RLS (Row Level Security) par rôle
- ✅ Audit trail complet (qui, quoi, quand)
- ✅ Suppression données sur demande (RGPD)

---

*Document d'architecture v1.0 - Slow Village Qualité Platform*
