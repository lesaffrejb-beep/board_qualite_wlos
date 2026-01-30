/**
 * SLOW VILLAGE - Dashboard Application v2.0
 * Avec Supabase Backend + Auth par site
 * Design: Awwwards Edition pour utilisateurs pressés
 */

(function() {
    'use strict';

    // ==========================================
    // CONFIGURATION
    // ==========================================
    const CONFIG = {
        // Récupérer depuis les variables d'environnement
        SUPABASE_URL: window.ENV?.VITE_SUPABASE_URL || 'https://ydfgueqasslzhdbvermu.supabase.co',
        SUPABASE_KEY: window.ENV?.VITE_SUPABASE_ANON_KEY || '',
        ADMIN_PASSWORD: window.ENV?.VITE_ADMIN_PASSWORD || 'admin',
        SITE_PASSWORD: window.ENV?.VITE_SITE_PASSWORD || 'admin',
        
        // Thèmes dans l'ordre
        THEMES_ORDER: ['SEC', 'AFF', 'EXP', 'QUA', 'IMA', 'RH', 'RES', 'SLO'],
        
        // Période actuelle
        CURRENT_PERIODE: new Date().toISOString().slice(0, 7) // '2026-01'
    };

    // ==========================================
    // SUPABASE CLIENT
    // ==========================================
    let supabase = null;
    
    function initSupabase() {
        if (window.supabase && CONFIG.SUPABASE_KEY) {
            supabase = window.supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);
            console.log('✅ Supabase connecté');
            return true;
        }
        console.warn('⚠️ Supabase non configuré - mode localStorage');
        return false;
    }

    // ==========================================
    // STATE MANAGEMENT
    // ==========================================
    const state = {
        // Navigation
        currentScreen: 'form', // 'form', 'auth-site', 'input', 'dashboard'
        currentTheme: 'SEC',
        
        // Authentification
        isSiteAuthenticated: false,
        isAdminAuthenticated: false,
        currentSite: null, // Site sélectionné pour saisie
        dashboardSite: null, // null = tous les sites
        
        // Données
        sites: [],
        criteres: {},
        auditData: {}, // Données de saisie en cours
        dbAuditId: null, // ID de l'audit dans Supabase
        
        // UI
        isLoading: false
    };

    // ==========================================
    // DOM ELEMENTS
    // ==========================================
    const elements = {
        // Screens
        screens: {
            form: document.getElementById('screen-form'),
            authSite: document.getElementById('screen-auth-site'),
            input: document.getElementById('screen-input'),
            dashboard: document.getElementById('screen-dashboard')
        },
        
        // Form screen
        siteGrid: document.getElementById('site-grid'),
        selectedInfo: document.getElementById('selected-info'),
        selectedSiteName: document.getElementById('selected-site-name'),
        selectedConformite: document.getElementById('selected-conformite'),
        selectedBloquants: document.getElementById('selected-bloquants'),
        selectedRang: document.getElementById('selected-rang'),
        btnViewDashboard: document.getElementById('btn-view-dashboard'),
        btnNewAudit: document.getElementById('btn-new-audit'),
        
        // Auth site modal (pour audit)
        authSiteModal: document.getElementById('auth-site-modal'),
        authSiteName: document.getElementById('auth-site-name'),
        authSitePassword: document.getElementById('auth-site-password'),
        authSiteError: document.getElementById('auth-site-error'),
        btnAuthSiteSubmit: document.getElementById('btn-auth-site-submit'),
        btnAuthSiteCancel: document.getElementById('btn-auth-site-cancel'),
        
        // Auth admin modal (pour dashboard)
        authAdminModal: document.getElementById('auth-admin-modal'),
        authAdminContext: document.getElementById('auth-admin-context'),
        authAdminPassword: document.getElementById('auth-admin-password'),
        authAdminError: document.getElementById('auth-admin-error'),
        btnAuthAdminSubmit: document.getElementById('btn-auth-admin-submit'),
        btnAuthAdminCancel: document.getElementById('btn-auth-admin-cancel'),
        
        // Input screen
        inputSiteName: document.getElementById('input-site-name'),
        btnCloseInput: document.getElementById('btn-close-input'),
        criteriaForm: document.getElementById('criteria-form'),
        themeTabs: document.querySelectorAll('.theme-tab'),
        btnPrevTheme: document.getElementById('btn-prev-theme'),
        btnNextTheme: document.getElementById('btn-next-theme'),
        btnSaveDraft: document.getElementById('btn-save-draft'),
        progressValue: document.getElementById('progress-value'),
        progressFill: document.getElementById('progress-fill'),
        
        // Dashboard
        blurOverlay: document.getElementById('blur-overlay'),
        dashboardWrapper: document.getElementById('dashboard-wrapper'),
        passwordInput: document.getElementById('password-input'),
        passwordError: document.getElementById('password-error'),
        btnUnlock: document.getElementById('btn-unlock'),
        btnBackForm: document.getElementById('btn-back-form'),
        btnChangeSite: document.getElementById('btn-change-site'),
        currentSiteName: document.getElementById('current-site-name'),
        alertsCount: document.getElementById('alerts-count'),
        
        // Charts & Lists
        chartSites: document.getElementById('chart-sites'),
        rankingList: document.getElementById('ranking-list'),
        themesGrid: document.getElementById('themes-grid'),
        alertsList: document.getElementById('alerts-list'),
        matrixBody: document.getElementById('matrix-body'),
        
        // KPIs
        kpiConformite: document.getElementById('kpi-conformite'),
        kpiBloquants: document.getElementById('kpi-bloquants'),
        kpiSites: document.getElementById('kpi-sites'),
        kpiCriteres: document.getElementById('kpi-criteres'),
        
        // Navigation
        navItems: document.querySelectorAll('.nav-item')
    };

    // ==========================================
    // INITIALISATION
    // ==========================================
    async function init() {
        console.log('🚀 Slow Village Qualité - Initialisation');
        
        // Init Supabase
        initSupabase();
        
        // Charger les données locales en fallback
        loadLocalData();
        
        // Charger les sites depuis Supabase ou local
        await loadSites();
        
        // Rendu initial
        renderSiteGrid();
        setupEventListeners();
        
        // Si URL avec paramètre site, ouvrir direct
        const urlParams = new URLSearchParams(window.location.search);
        const siteId = urlParams.get('site');
        if (siteId) {
            const site = state.sites.find(s => s.id == siteId);
            if (site) selectSiteForAudit(site);
        }
    }

    function loadLocalData() {
        const saved = localStorage.getItem('slowVillageAuditData');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                state.auditData = data.auditData || {};
                state.dbAuditId = data.dbAuditId || null;
            } catch (e) {
                console.error('Erreur chargement local:', e);
            }
        }
    }

    async function loadSites() {
        try {
            if (supabase) {
                const { data, error } = await supabase
                    .from('sites')
                    .select('*')
                    .eq('actif', true)
                    .order('id');
                
                if (error) throw error;
                if (data && data.length > 0) {
                    state.sites = data;
                    console.log(`✅ ${data.length} sites chargés depuis Supabase`);
                    return;
                }
            }
        } catch (err) {
            console.warn('⚠️ Erreur Supabase, fallback local:', err.message);
        }
        
        // Fallback sur données locales
        state.sites = window.SlowVillageData?.sites || [];
    }

    // ==========================================
    // RENDU SITE GRID
    // ==========================================
    function renderSiteGrid() {
        const sites = state.sites;
        if (!sites.length) return;

        // Card "Tous les sites" pour le board
        let html = `
            <div class="site-card all-sites" data-action="dashboard" data-site-id="all">
                <span class="site-card-rank">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                    </svg>
                </span>
                <div class="site-card-name">Vue Direction</div>
                <div class="site-card-score">
                    <span class="score-value">Board</span>
                    <span class="score-label">Tous les sites</span>
                </div>
            </div>
        `;

        // Cards par site
        sites.forEach(site => {
            const conformite = site.taux_conformite_pondere || 0;
            const scoreClass = conformite >= 70 ? 'success' : conformite >= 50 ? 'green-400' : conformite >= 30 ? 'warning' : 'danger';
            
            html += `
                <div class="site-card" data-action="select" data-site-id="${site.id}">
                    <span class="site-card-rank">${site.rang || '-'}</span>
                    <div class="site-card-name">${site.nom}</div>
                    <div class="site-card-score">
                        <span class="score-value" style="color: var(--sv-${scoreClass})">${conformite}%</span>
                        <span class="score-label">Conformité</span>
                    </div>
                    <div class="site-card-actions">
                        <button class="btn-card-action view" data-action="dashboard" data-site-id="${site.id}" title="Voir le board">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                                <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
                            </svg>
                        </button>
                        <button class="btn-card-action edit" data-action="audit" data-site-id="${site.id}" title="Faire l'audit">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                            </svg>
                        </button>
                    </div>
                </div>
            `;
        });

        elements.siteGrid.innerHTML = html;

        // Event listeners
        document.querySelectorAll('.site-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const action = e.target.closest('[data-action]')?.dataset.action || card.dataset.action;
                const siteId = e.target.closest('[data-site-id]')?.dataset.siteId || card.dataset.siteId;
                handleSiteAction(action, siteId);
            });
        });
    }

    // ==========================================
    // GESTION ACTIONS
    // ==========================================
    function handleSiteAction(action, siteId) {
        if (siteId === 'all') {
            // Vue direction - tous les sites
            state.dashboardSite = null;
            showScreen('dashboard');
            return;
        }

        const site = state.sites.find(s => s.id == siteId);
        if (!site) return;

        if (action === 'dashboard') {
            // Voir le board du site
            state.dashboardSite = site;
            showScreen('dashboard');
        } else if (action === 'audit' || action === 'select') {
            // Faire/modifier l'audit
            selectSiteForAudit(site);
        }
    }

    function selectSiteForAudit(site) {
        state.currentSite = site;
        
        // Vérifier si déjà authentifié pour ce site
        const authKey = `auth_site_${site.id}`;
        const isAuth = sessionStorage.getItem(authKey) === 'true';
        
        if (isAuth) {
            // Directement ouvrir le formulaire
            openAuditForm(site);
        } else {
            // Montrer modal d'authentification
            showSiteAuthModal(site);
        }
    }

    // ==========================================
    // AUTH MODAL PAR SITE
    // ==========================================
    function showSiteAuthModal(site) {
        elements.authSiteName.textContent = site.nom;
        elements.authSitePassword.value = '';
        elements.authSiteError.textContent = '';
        elements.authSiteModal.classList.add('active');
        elements.authSitePassword.focus();
        
        // Stocker temporairement le site en cours d'auth
        state.pendingSite = site;
    }

    function hideSiteAuthModal() {
        elements.authSiteModal.classList.remove('active');
        state.pendingSite = null;
    }

    // ========== MODAL ADMIN (DASHBOARD) ==========
    
    function showAdminAuthModal() {
        const contextText = state.dashboardSite 
            ? state.dashboardSite.nom 
            : 'Vue Direction - Tous les sites';
        
        elements.authAdminContext.textContent = contextText;
        elements.authAdminPassword.value = '';
        elements.authAdminError.textContent = '';
        elements.authAdminModal.classList.add('active');
        elements.authAdminPassword.focus();
    }

    function hideAdminAuthModal() {
        elements.authAdminModal.classList.remove('active');
    }

    async function authenticateAdmin() {
        const password = elements.authAdminPassword.value;
        
        if (password === CONFIG.ADMIN_PASSWORD || password === CONFIG.SITE_PASSWORD) {
            // Succès
            state.isAdminAuthenticated = true;
            hideAdminAuthModal();
            elements.authAdminPassword.value = '';
            
            // Aller au dashboard
            showScreen('dashboard');
        } else {
            // Erreur
            elements.authAdminError.textContent = 'Mot de passe incorrect';
            elements.authAdminPassword.classList.add('shake');
            setTimeout(() => {
                elements.authAdminPassword.classList.remove('shake');
            }, 500);
        }
    }

    async function authenticateSite() {
        const password = elements.authSitePassword.value;
        const site = state.pendingSite;
        
        if (!site) return;
        
        // Vérification mot de passe (admin ou mot de passe spécifique au site)
        if (password === CONFIG.SITE_PASSWORD || password === CONFIG.ADMIN_PASSWORD) {
            // Succès
            sessionStorage.setItem(`auth_site_${site.id}`, 'true');
            state.isSiteAuthenticated = true;
            hideSiteAuthModal();
            openAuditForm(site);
        } else {
            // Erreur
            elements.authSiteError.textContent = 'Mot de passe incorrect';
            elements.authSitePassword.classList.add('shake');
            setTimeout(() => elements.authSitePassword.classList.remove('shake'), 500);
        }
    }

    // ==========================================
    // FORMULAIRE D'AUDIT
    // ==========================================
    async function openAuditForm(site) {
        state.currentSite = site;
        state.currentTheme = 'SEC';
        
        // Charger les critères
        await loadCriteres();
        
        // Charger l'audit existant ou créer nouveau
        await loadOrCreateAudit(site);
        
        // Mettre à jour l'UI
        elements.inputSiteName.textContent = site.nom;
        
        // Afficher l'écran
        showScreen('input');
        
        // Rendre le formulaire
        switchTheme('SEC');
        updateInputProgress();
        updateThemeTabsProgress();
    }

    async function loadCriteres() {
        try {
            if (supabase) {
                const { data, error } = await supabase
                    .from('criteres')
                    .select('*')
                    .eq('actif', true)
                    .order('ordre');
                
                if (error) throw error;
                if (data) {
                    // Grouper par thème
                    state.criteres = {};
                    CONFIG.THEMES_ORDER.forEach(theme => {
                        state.criteres[theme] = data.filter(c => c.theme_code === theme);
                    });
                    return;
                }
            }
        } catch (err) {
            console.warn('Fallback critères locaux:', err.message);
        }
        
        // Fallback local
        state.criteres = window.SlowVillageData?.criteres || {};
    }

    async function loadOrCreateAudit(site) {
        try {
            if (supabase) {
                // Chercher audit existant pour cette période
                const { data: existing, error: err1 } = await supabase
                    .from('audits')
                    .select('*')
                    .eq('site_id', site.id)
                    .eq('periode', CONFIG.CURRENT_PERIODE)
                    .single();
                
                if (err1 && err1.code !== 'PGRST116') throw err1; // PGRST116 = not found
                
                if (existing) {
                    state.dbAuditId = existing.id;
                    
                    // Charger les réponses
                    const { data: details, error: err2 } = await supabase
                        .from('audit_details')
                        .select('*')
                        .eq('audit_id', existing.id);
                    
                    if (!err2 && details) {
                        // Convertir en format local
                        state.auditData = {};
                        details.forEach(d => {
                            const key = `${site.id}_${d.critere_id}`;
                            state.auditData[key] = d.statut;
                        });
                    }
                    
                    showToast('Audit existant chargé');
                    return;
                }
                
                // Créer nouvel audit
                const { data: created, error: err3 } = await supabase
                    .from('audits')
                    .insert({
                        site_id: site.id,
                        periode: CONFIG.CURRENT_PERIODE,
                        statut: 'brouillon'
                    })
                    .select()
                    .single();
                
                if (err3) throw err3;
                state.dbAuditId = created.id;
                state.auditData = {};
                showToast('Nouvel audit créé');
            }
        } catch (err) {
            console.error('Erreur chargement audit:', err);
            // Mode local
            state.dbAuditId = null;
            const localKey = `audit_${site.id}_${CONFIG.CURRENT_PERIODE}`;
            const saved = localStorage.getItem(localKey);
            state.auditData = saved ? JSON.parse(saved) : {};
        }
    }

    // ==========================================
    // RENDU FORMULAIRE
    // ==========================================
    function switchTheme(theme) {
        state.currentTheme = theme;
        
        // Mettre à jour les onglets
        elements.themeTabs.forEach(tab => {
            tab.classList.toggle('active', tab.dataset.theme === theme);
        });
        
        // Mettre à jour les boutons prev/next
        const currentIndex = CONFIG.THEMES_ORDER.indexOf(theme);
        if (elements.btnPrevTheme) {
            elements.btnPrevTheme.disabled = currentIndex === 0;
        }
        if (elements.btnNextTheme) {
            const isLast = currentIndex === CONFIG.THEMES_ORDER.length - 1;
            elements.btnNextTheme.innerHTML = isLast 
                ? `Terminer <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>`
                : `Suivant <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>`;
        }
        
        renderCriteriaForm();
    }

    function renderCriteriaForm() {
        const criteres = state.criteres[state.currentTheme] || [];
        const themeInfo = window.SlowVillageData?.themes?.[state.currentTheme];
        
        let html = `
            <div class="criteria-header">
                <div>
                    <h2 class="criteria-theme-title">${themeInfo?.nom || state.currentTheme}</h2>
                    <p class="criteria-theme-desc">${themeInfo?.description || ''}</p>
                </div>
                <span class="criteria-count">${criteres.length} critères</span>
            </div>
            <div class="criteria-list">
        `;

        criteres.forEach((crit) => {
            const key = `${state.currentSite.id}_${crit.id}`;
            const savedStatus = state.auditData[key] || null;
            const isBloquant = crit.est_bloquant || crit.priorite === 'P0';
            
            html += `
                <div class="criteria-item priority-${crit.priorite?.toLowerCase() || 'p3'} ${isBloquant ? 'bloquant' : ''}" data-critere-id="${crit.id}">
                    <div class="criteria-priority-badge">
                        <span class="criteria-priority">${crit.priorite}</span>
                        ${isBloquant ? '<span class="badge-bloquant">⚠️ Bloquant</span>' : ''}
                    </div>
                    <div class="criteria-content">
                        <div class="criteria-code">${crit.code}</div>
                        <div class="criteria-text">${crit.texte}</div>
                        ${crit.poids > 0 ? `<div class="criteria-weight">Poids: ${crit.poids}</div>` : ''}
                    </div>
                    <div class="criteria-actions">
                        <button class="criteria-btn ${savedStatus === 'C' ? 'selected' : ''}" 
                                data-status="C" title="Conforme">✓</button>
                        <button class="criteria-btn nc ${savedStatus === 'NC' ? 'selected' : ''}" 
                                data-status="NC" title="Non conforme">✗</button>
                        <button class="criteria-btn ec ${savedStatus === 'EC' ? 'selected' : ''}" 
                                data-status="EC" title="En cours">⟳</button>
                        <button class="criteria-btn ${savedStatus === 'NA' ? 'selected' : ''}" 
                                data-status="NA" title="N/A">—</button>
                    </div>
                </div>
            `;
        });

        html += '</div>';
        elements.criteriaForm.innerHTML = html;

        // Event listeners
        document.querySelectorAll('.criteria-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const critereId = e.target.closest('.criteria-item').dataset.critereId;
                const status = btn.dataset.status;
                await setCriteriaStatus(critereId, status);
                
                // Update UI
                const buttons = btn.parentElement.querySelectorAll('.criteria-btn');
                buttons.forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                
                updateInputProgress();
                updateThemeTabsProgress();
            });
        });
    }

    async function setCriteriaStatus(critereId, status) {
        const key = `${state.currentSite.id}_${critereId}`;
        state.auditData[key] = status;
        
        // Sauvegarde locale immédiate
        saveLocalAudit();
        
        // Sauvegarde Supabase en arrière-plan
        try {
            if (supabase && state.dbAuditId) {
                // Vérifier si existe déjà
                const { data: existing } = await supabase
                    .from('audit_details')
                    .select('id')
                    .eq('audit_id', state.dbAuditId)
                    .eq('critere_id', critereId)
                    .single();
                
                if (existing) {
                    // Update
                    await supabase
                        .from('audit_details')
                        .update({ statut: status, updated_at: new Date() })
                        .eq('id', existing.id);
                } else {
                    // Insert
                    await supabase
                        .from('audit_details')
                        .insert({
                            audit_id: state.dbAuditId,
                            critere_id: critereId,
                            statut: status
                        });
                }
            }
        } catch (err) {
            console.warn('Sauvegarde Supabase différée:', err.message);
        }
    }

    function saveLocalAudit() {
        if (!state.currentSite) return;
        
        const dataToSave = {
            siteId: state.currentSite.id,
            periode: CONFIG.CURRENT_PERIODE,
            auditData: state.auditData,
            dbAuditId: state.dbAuditId,
            lastSave: new Date().toISOString()
        };
        
        localStorage.setItem('slowVillageAuditData', JSON.stringify(dataToSave));
        localStorage.setItem(`audit_${state.currentSite.id}_${CONFIG.CURRENT_PERIODE}`, JSON.stringify(state.auditData));
    }

    // ==========================================
    // PROGRESSION
    // ==========================================
    function updateInputProgress() {
        let total = 0;
        let completed = 0;

        Object.values(state.criteres).flat().forEach(crit => {
            total++;
            const key = `${state.currentSite.id}_${crit.id}`;
            if (state.auditData[key]) completed++;
        });

        const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
        
        if (elements.progressValue) {
            elements.progressValue.textContent = percent + '%';
        }
        if (elements.progressFill) {
            elements.progressFill.style.width = percent + '%';
        }
        
        return { total, completed, percent };
    }

    function updateThemeTabsProgress() {
        elements.themeTabs.forEach(tab => {
            const theme = tab.dataset.theme;
            const criteres = state.criteres[theme] || [];
            let completed = 0;

            criteres.forEach(crit => {
                const key = `${state.currentSite.id}_${crit.id}`;
                if (state.auditData[key]) completed++;
            });

            const progressSpan = tab.querySelector('.tab-progress');
            if (progressSpan) {
                progressSpan.textContent = `${completed}/${criteres.length}`;
            }

            tab.classList.toggle('completed', completed === criteres.length && criteres.length > 0);
        });
    }

    // ==========================================
    // NAVIGATION ÉCRANS
    // ==========================================
    function showScreen(screenName) {
        // Cacher tous les écrans
        Object.values(elements.screens).forEach(screen => {
            if (screen) screen.classList.remove('active');
        });
        
        // Afficher l'écran demandé
        state.currentScreen = screenName;
        if (elements.screens[screenName]) {
            elements.screens[screenName].classList.add('active');
        }
        
        // Actions spécifiques par écran
        if (screenName === 'dashboard') {
            renderDashboard();
            if (!state.isAdminAuthenticated) {
                elements.blurOverlay?.classList.remove('hidden');
                elements.dashboardWrapper?.classList.add('blurred');
                elements.passwordInput?.focus();
            }
        }
        
        // Scroll en haut
        window.scrollTo(0, 0);
    }

    // ==========================================
    // DASHBOARD
    // ==========================================
    async function renderDashboard() {
        const site = state.dashboardSite;
        
        // Charger données historiques
        let historique = null;
        try {
            if (supabase) {
                const { data } = await supabase
                    .from('historique_scores')
                    .select('*')
                    .eq('site_id', site?.id || state.sites.map(s => s.id))
                    .eq('periode', '2026-01')
                    .single();
                if (data) historique = data;
            }
        } catch (e) {
            // Fallback local
        }
        
        // Fallback données locales
        if (!historique && window.SlowVillageData) {
            if (site) {
                historique = window.SlowVillageData.sites.find(s => s.id === site.id);
            } else {
                historique = {
                    taux_conformite_pondere: window.SlowVillageData.global.taux_conformite_pondere,
                    nb_bloquants: window.SlowVillageData.global.total_bloquants
                };
            }
        }
        
        // Mettre à jour KPIs
        if (elements.kpiConformite) {
            elements.kpiConformite.textContent = (historique?.taux_conformite_pondere || 0) + '%';
        }
        if (elements.kpiBloquants) {
            elements.kpiBloquants.textContent = historique?.nb_bloquants || 0;
        }
        if (elements.kpiSites) {
            elements.kpiSites.textContent = site ? '1' : (state.sites.length || 11);
        }
        if (elements.currentSiteName) {
            elements.currentSiteName.textContent = site?.nom || 'Tous les sites';
        }
        
        // Rendre les graphiques
        renderSitesChart();
        renderRanking();
        renderThemes();
        renderAlerts();
        renderMatrix();
    }

    function attemptUnlock() {
        const password = elements.passwordInput?.value;

        if (password === CONFIG.ADMIN_PASSWORD) {
            state.isAdminAuthenticated = true;
            elements.blurOverlay?.classList.add('hidden');
            elements.dashboardWrapper?.classList.remove('blurred');
            elements.passwordError.textContent = '';
            elements.passwordInput.value = '';
        } else {
            elements.passwordError.textContent = 'Mot de passe incorrect';
            elements.passwordInput?.classList.add('shake');
            setTimeout(() => elements.passwordInput?.classList.remove('shake'), 500);
        }
    }

    // ==========================================
    // EVENT LISTENERS
    // ==========================================
    function setupEventListeners() {
        // Boutons principaux
        elements.btnViewDashboard?.addEventListener('click', () => {
            // Afficher le modal admin au lieu d'aller direct au dashboard
            showAdminAuthModal();
        });
        
        elements.btnNewAudit?.addEventListener('click', () => {
            if (!state.currentSite) {
                showToast('Veuillez d\'abord sélectionner un site');
                return;
            }
            showSiteAuthModal(state.currentSite);
        });
        
        // Auth site modal (pour audit)
        elements.btnAuthSiteSubmit?.addEventListener('click', authenticateSite);
        elements.btnAuthSiteCancel?.addEventListener('click', hideSiteAuthModal);
        elements.authSitePassword?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') authenticateSite();
        });
        
        // Auth admin modal (pour dashboard)
        elements.btnAuthAdminSubmit?.addEventListener('click', authenticateAdmin);
        elements.btnAuthAdminCancel?.addEventListener('click', hideAdminAuthModal);
        elements.authAdminPassword?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') authenticateAdmin();
        });
        
        // Input screen
        elements.btnCloseInput?.addEventListener('click', () => showScreen('form'));
        elements.btnSaveDraft?.addEventListener('click', () => {
            saveLocalAudit();
            showToast('Brouillon sauvegardé 💾');
        });
        
        elements.themeTabs?.forEach(tab => {
            tab.addEventListener('click', () => switchTheme(tab.dataset.theme));
        });
        
        elements.btnPrevTheme?.addEventListener('click', () => {
            const idx = CONFIG.THEMES_ORDER.indexOf(state.currentTheme);
            if (idx > 0) switchTheme(CONFIG.THEMES_ORDER[idx - 1]);
        });
        
        elements.btnNextTheme?.addEventListener('click', async () => {
            const idx = CONFIG.THEMES_ORDER.indexOf(state.currentTheme);
            if (idx < CONFIG.THEMES_ORDER.length - 1) {
                switchTheme(CONFIG.THEMES_ORDER[idx + 1]);
            } else {
                // Terminer
                await finalizeAudit();
            }
        });
        
        // Dashboard
        elements.btnUnlock?.addEventListener('click', attemptUnlock);
        elements.passwordInput?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') attemptUnlock();
        });
        elements.btnBackForm?.addEventListener('click', () => showScreen('form'));
        elements.btnChangeSite?.addEventListener('click', () => showScreen('form'));
        
        // Navigation dashboard
        elements.navItems?.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                elements.navItems.forEach(n => n.classList.remove('active'));
                item.classList.add('active');
            });
        });
    }

    async function finalizeAudit() {
        const progress = updateInputProgress();
        
        if (progress.percent < 100) {
            if (!confirm(`Vous n'avez rempli que ${progress.percent}% des critères. Terminer quand même ?`)) {
                return;
            }
        }
        
        // Sauvegarde finale
        saveLocalAudit();
        
        try {
            if (supabase && state.dbAuditId) {
                await supabase
                    .from('audits')
                    .update({ 
                        statut: 'termine',
                        date_fin: new Date().toISOString()
                    })
                    .eq('id', state.dbAuditId);
            }
        } catch (err) {
            console.error('Erreur finalisation:', err);
        }
        
        showToast('Audit terminé ! 🎉');
        
        setTimeout(() => {
            showScreen('form');
        }, 1500);
    }

    // ==========================================
    // UTILITAIRES
    // ==========================================
    function showToast(message) {
        const existing = document.querySelector('.toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `
            <div class="toast-icon">✓</div>
            <span>${message}</span>
        `;
        document.body.appendChild(toast);

        requestAnimationFrame(() => toast.classList.add('show'));
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // Fonctions de rendu dashboard (simplifiées)
    function renderSitesChart() {
        if (!elements.chartSites) return;
        const sites = state.sites.slice(0, 8);
        elements.chartSites.innerHTML = sites.map(site => `
            <div class="chart-bar-item">
                <span class="chart-bar-label">${site.nom.substring(0, 18)}</span>
                <div class="chart-bar-track">
                    <div class="chart-bar-fill primary" style="width: ${site.taux_conformite_pondere || 0}%"></div>
                </div>
                <span class="chart-bar-value">${site.taux_conformite_pondere || 0}%</span>
            </div>
        `).join('');
    }

    function renderRanking() {
        if (!elements.rankingList) return;
        elements.rankingList.innerHTML = state.sites.map((site, idx) => `
            <div class="ranking-item ${idx < 3 ? 'top-3' : idx >= state.sites.length - 3 ? 'bottom-3' : ''}">
                <span class="ranking-position">${site.rang || idx + 1}</span>
                <span class="ranking-name">${site.nom}</span>
                <span class="ranking-score">${site.score_global?.toFixed?.(1) || '-'}</span>
            </div>
        `).join('');
    }

    function renderThemes() {
        if (!elements.themesGrid) return;
        const themes = window.SlowVillageData?.themes || {};
        elements.themesGrid.innerHTML = Object.values(themes).map(theme => `
            <div class="theme-card">
                <div class="theme-header">
                    <span class="theme-code">${theme.code}</span>
                    <span class="theme-score">${theme.score}%</span>
                </div>
                <div class="theme-name">${theme.nom}</div>
                <div class="theme-bar">
                    <div class="theme-bar-fill ${theme.score >= 70 ? 'excellent' : theme.score >= 50 ? 'good' : 'warning'}" 
                         style="width: ${theme.score}%"></div>
                </div>
            </div>
        `).join('');
    }

    function renderAlerts() {
        if (!elements.alertsList) return;
        const risques = window.SlowVillageData?.risques?.slice(0, 6) || [];
        elements.alertsList.innerHTML = risques.map(risque => `
            <div class="alert-item">
                <div class="alert-icon">⚠</div>
                <div class="alert-content">
                    <span class="alert-code">${risque.code} - ${risque.theme}</span>
                    <p class="alert-text">${risque.critere}</p>
                    <span class="alert-meta">${risque.nb_sites} sites concernés</span>
                </div>
            </div>
        `).join('');
    }

    function renderMatrix() {
        if (!elements.matrixBody) return;
        const matrice = window.SlowVillageData?.matrice || {};
        elements.matrixBody.innerHTML = ['P1', 'P2', 'P3'].map(p => {
            const row = matrice[p] || {};
            const total = (row.conforme || 0) + (row.non_conforme || 0) + (row.en_cours || 0) + (row.na || 0);
            return `
                <tr>
                    <td><span class="priority-badge ${p.toLowerCase()}">${p}</span></td>
                    <td class="cell-conforme">${row.conforme || 0}</td>
                    <td class="cell-non-conforme">${row.non_conforme || 0}</td>
                    <td class="cell-en-cours">${row.en_cours || 0}</td>
                    <td class="cell-na">${row.na || 0}</td>
                    <td class="cell-total">${total}</td>
                </tr>
            `;
        }).join('');
    }

    // ==========================================
    // DÉMARRAGE
    // ==========================================
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
