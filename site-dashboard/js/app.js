/**
 * SLOW VILLAGE - Dashboard Application
 * Tableau de bord qualité - Awwwards Edition
 */

(function() {
    'use strict';

    // Password for admin access
    const ADMIN_PASSWORD = 'admin';

    // State management
    const state = {
        selectedSite: null, // null = tous les sites
        isAuthenticated: false,
        currentSection: 'overview',
        inputMode: false,
        currentTheme: 'SEC',
        auditData: {}, // Stockage des réponses du formulaire
        currentThemeIndex: 0
    };

    // Ordre des thèmes
    const THEMES_ORDER = ['SEC', 'AFF', 'EXP', 'QUA', 'IMA', 'RH', 'RES', 'SLO'];

    // DOM Elements
    const elements = {
        // Screens
        screenForm: document.getElementById('screen-form'),
        screenDashboard: document.getElementById('screen-dashboard'),
        screenInput: document.getElementById('screen-input'),

        // Form elements
        siteGrid: document.getElementById('site-grid'),
        selectedInfo: document.getElementById('selected-info'),
        selectedSiteName: document.getElementById('selected-site-name'),
        selectedConformite: document.getElementById('selected-conformite'),
        selectedBloquants: document.getElementById('selected-bloquants'),
        selectedRang: document.getElementById('selected-rang'),
        btnViewDashboard: document.getElementById('btn-view-dashboard'),
        btnNewAudit: document.getElementById('btn-new-audit'),

        // Input elements
        inputSiteName: document.getElementById('input-site-name'),
        btnCloseInput: document.getElementById('btn-close-input'),
        criteriaForm: document.getElementById('criteria-form'),
        themeTabs: document.querySelectorAll('.theme-tab'),
        btnPrevTheme: document.getElementById('btn-prev-theme'),
        btnNextTheme: document.getElementById('btn-next-theme'),
        btnSaveDraft: document.getElementById('btn-save-draft'),
        progressValue: document.getElementById('progress-value'),
        progressFill: document.getElementById('progress-fill'),

        // Dashboard elements
        blurOverlay: document.getElementById('blur-overlay'),
        dashboardWrapper: document.getElementById('dashboard-wrapper'),
        passwordInput: document.getElementById('password-input'),
        passwordError: document.getElementById('password-error'),
        btnUnlock: document.getElementById('btn-unlock'),
        btnBackForm: document.getElementById('btn-back-form'),
        btnChangeSite: document.getElementById('btn-change-site'),
        currentSiteName: document.getElementById('current-site-name'),
        alertsCount: document.getElementById('alerts-count'),

        // Chart containers
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

    // Data from data.js
    const data = window.SlowVillageData;

    /**
     * Initialize the application
     */
    function init() {
        // Load saved audit data from localStorage
        loadAuditData();
        
        renderSiteGrid();
        setupEventListeners();
        renderDashboard();
        updateInputProgress();
    }

    /**
     * Load audit data from localStorage
     */
    function loadAuditData() {
        const saved = localStorage.getItem('slowVillageAuditData');
        if (saved) {
            try {
                state.auditData = JSON.parse(saved);
            } catch (e) {
                console.error('Error loading audit data:', e);
                state.auditData = {};
            }
        }
    }

    /**
     * Save audit data to localStorage
     */
    function saveAuditData() {
        localStorage.setItem('slowVillageAuditData', JSON.stringify(state.auditData));
    }

    /**
     * Render the site selection grid
     */
    function renderSiteGrid() {
        const sites = data.sites;

        // Add "All sites" card first
        let html = `
            <div class="site-card all-sites selected" data-site-id="all">
                <span class="site-card-rank">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                    </svg>
                </span>
                <div class="site-card-name">Tous les sites</div>
                <div class="site-card-score">
                    <span class="score-value">${data.global.taux_conformite_pondere}%</span>
                    <span class="score-label">Conformité</span>
                </div>
            </div>
        `;

        // Add individual site cards
        sites.forEach(site => {
            const scoreClass = getScoreClass(site.taux_conformite_pondere);
            html += `
                <div class="site-card" data-site-id="${site.id}">
                    <span class="site-card-rank">${site.rang}</span>
                    <div class="site-card-name">${site.nom}</div>
                    <div class="site-card-score">
                        <span class="score-value" style="color: var(--sv-${scoreClass})">${site.taux_conformite_pondere}%</span>
                        <span class="score-label">Conformité</span>
                    </div>
                </div>
            `;
        });

        elements.siteGrid.innerHTML = html;

        // Add click listeners
        document.querySelectorAll('.site-card').forEach(card => {
            card.addEventListener('click', () => selectSite(card));
        });

        // Show selected info for "all sites"
        updateSelectedInfo(null);
    }

    /**
     * Select a site
     */
    function selectSite(card) {
        // Update UI
        document.querySelectorAll('.site-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');

        // Update state
        const siteId = card.dataset.siteId;
        if (siteId === 'all') {
            state.selectedSite = null;
        } else {
            state.selectedSite = data.sites.find(s => s.id === parseInt(siteId));
        }

        // Update info panel
        updateSelectedInfo(state.selectedSite);

        // Enable buttons
        elements.btnViewDashboard.disabled = false;
        if (elements.btnNewAudit) {
            elements.btnNewAudit.disabled = false;
        }
    }

    /**
     * Update selected site info panel
     */
    function updateSelectedInfo(site) {
        elements.selectedInfo.style.display = 'block';

        if (site === null) {
            // All sites
            elements.selectedSiteName.textContent = 'Tous les sites';
            elements.selectedConformite.textContent = data.global.taux_conformite_pondere + '%';
            elements.selectedBloquants.textContent = data.global.total_bloquants;
            elements.selectedRang.textContent = '11 sites';
        } else {
            elements.selectedSiteName.textContent = site.nom;
            elements.selectedConformite.textContent = site.taux_conformite_pondere + '%';
            elements.selectedBloquants.textContent = site.nb_bloquants;
            elements.selectedRang.textContent = '#' + site.rang;
        }
    }

    /**
     * Setup event listeners
     */
    function setupEventListeners() {
        // View dashboard button
        elements.btnViewDashboard.addEventListener('click', () => {
            showDashboard();
        });

        // New audit button
        if (elements.btnNewAudit) {
            elements.btnNewAudit.addEventListener('click', () => {
                showInputScreen();
            });
        }

        // Close input screen
        if (elements.btnCloseInput) {
            elements.btnCloseInput.addEventListener('click', () => {
                showForm();
            });
        }

        // Theme tabs
        elements.themeTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const theme = tab.dataset.theme;
                switchTheme(theme);
            });
        });

        // Prev/Next theme buttons
        if (elements.btnPrevTheme) {
            elements.btnPrevTheme.addEventListener('click', () => {
                const currentIndex = THEMES_ORDER.indexOf(state.currentTheme);
                if (currentIndex > 0) {
                    switchTheme(THEMES_ORDER[currentIndex - 1]);
                }
            });
        }

        if (elements.btnNextTheme) {
            elements.btnNextTheme.addEventListener('click', () => {
                const currentIndex = THEMES_ORDER.indexOf(state.currentTheme);
                if (currentIndex < THEMES_ORDER.length - 1) {
                    switchTheme(THEMES_ORDER[currentIndex + 1]);
                }
            });
        }

        // Save draft
        if (elements.btnSaveDraft) {
            elements.btnSaveDraft.addEventListener('click', () => {
                saveAuditData();
                showToast('Brouillon enregistré');
            });
        }

        // Password unlock
        elements.btnUnlock.addEventListener('click', attemptUnlock);
        elements.passwordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') attemptUnlock();
        });

        // Back to form
        elements.btnBackForm.addEventListener('click', () => {
            showForm();
        });

        // Change site
        elements.btnChangeSite.addEventListener('click', () => {
            showForm();
        });

        // Navigation
        elements.navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const section = item.dataset.section;
                setActiveNav(section);
            });
        });
    }

    /**
     * Show input screen
     */
    function showInputScreen() {
        if (!state.selectedSite) {
            showToast('Veuillez sélectionner un site spécifique pour l\'audit');
            return;
        }

        elements.screenForm.classList.remove('active');
        elements.screenInput.classList.add('active');
        
        // Update site name in input screen
        if (elements.inputSiteName) {
            elements.inputSiteName.textContent = state.selectedSite.nom;
        }

        // Render criteria for current theme
        renderCriteriaForm();
        updateInputProgress();
        updateThemeTabsProgress();
    }

    /**
     * Switch theme in input screen
     */
    function switchTheme(theme) {
        state.currentTheme = theme;
        
        // Update tabs UI
        elements.themeTabs.forEach(tab => {
            tab.classList.toggle('active', tab.dataset.theme === theme);
        });

        // Update prev/next buttons
        const currentIndex = THEMES_ORDER.indexOf(theme);
        if (elements.btnPrevTheme) {
            elements.btnPrevTheme.disabled = currentIndex === 0;
        }
        if (elements.btnNextTheme) {
            elements.btnNextTheme.textContent = currentIndex === THEMES_ORDER.length - 1 
                ? 'Terminer l\'audit' 
                : 'Thème suivant';
        }

        renderCriteriaForm();
    }

    /**
     * Render criteria form for current theme
     */
    function renderCriteriaForm() {
        const criteria = data.criteres[state.currentTheme];
        const siteKey = state.selectedSite ? state.selectedSite.id : 'all';
        
        let html = `
            <div class="criteria-header">
                <h2 class="criteria-theme-title">${data.themes[state.currentTheme].nom}</h2>
                <span class="criteria-count">${criteria.length} critères</span>
            </div>
            <div class="criteria-list">
        `;

        criteria.forEach((crit, index) => {
            const key = `${siteKey}_${state.currentTheme}_${crit.code}`;
            const savedStatus = state.auditData[key] || null;
            
            html += `
                <div class="criteria-item priority-${crit.priorite.toLowerCase()}">
                    <span class="criteria-priority">${crit.priorite}</span>
                    <div class="criteria-content">
                        <div class="criteria-code">${crit.code}</div>
                        <div class="criteria-text">${crit.text}</div>
                        ${crit.poids > 0 ? `<div class="criteria-weight">Poids: ${crit.poids}</div>` : ''}
                    </div>
                    <div class="criteria-actions">
                        <button class="criteria-btn ${savedStatus === 'C' ? 'selected' : ''}" 
                                data-code="${crit.code}" data-status="C">Conforme</button>
                        <button class="criteria-btn nc ${savedStatus === 'NC' ? 'selected' : ''}" 
                                data-code="${crit.code}" data-status="NC">Non conforme</button>
                        <button class="criteria-btn ec ${savedStatus === 'EC' ? 'selected' : ''}" 
                                data-code="${crit.code}" data-status="EC">En cours</button>
                        <button class="criteria-btn ${savedStatus === 'NA' ? 'selected' : ''}" 
                                data-code="${crit.code}" data-status="NA">N/A</button>
                    </div>
                </div>
            `;
        });

        html += '</div>';
        elements.criteriaForm.innerHTML = html;

        // Add click listeners to criteria buttons
        document.querySelectorAll('.criteria-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const code = btn.dataset.code;
                const status = btn.dataset.status;
                setCriteriaStatus(code, status);
                
                // Update UI
                const buttons = btn.parentElement.querySelectorAll('.criteria-btn');
                buttons.forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                
                updateInputProgress();
                updateThemeTabsProgress();
            });
        });
    }

    /**
     * Set criteria status
     */
    function setCriteriaStatus(code, status) {
        const siteKey = state.selectedSite ? state.selectedSite.id : 'all';
        const key = `${siteKey}_${state.currentTheme}_${code}`;
        state.auditData[key] = status;
        
        // Auto-save after each selection
        saveAuditData();
    }

    /**
     * Update input progress
     */
    function updateInputProgress() {
        const siteKey = state.selectedSite ? state.selectedSite.id : 'all';
        let total = 0;
        let completed = 0;

        THEMES_ORDER.forEach(theme => {
            const criteria = data.criteres[theme];
            criteria.forEach(crit => {
                total++;
                const key = `${siteKey}_${theme}_${crit.code}`;
                if (state.auditData[key]) {
                    completed++;
                }
            });
        });

        const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
        
        if (elements.progressValue) {
            elements.progressValue.textContent = percent + '%';
        }
        if (elements.progressFill) {
            elements.progressFill.style.width = percent + '%';
        }
    }

    /**
     * Update theme tabs progress indicators
     */
    function updateThemeTabsProgress() {
        const siteKey = state.selectedSite ? state.selectedSite.id : 'all';

        elements.themeTabs.forEach(tab => {
            const theme = tab.dataset.theme;
            const criteria = data.criteres[theme];
            let completed = 0;

            criteria.forEach(crit => {
                const key = `${siteKey}_${theme}_${crit.code}`;
                if (state.auditData[key]) {
                    completed++;
                }
            });

            const progressSpan = tab.querySelector('.tab-progress');
            if (progressSpan) {
                progressSpan.textContent = `${completed}/${criteria.length}`;
            }

            // Mark as completed if all criteria answered
            if (completed === criteria.length && criteria.length > 0) {
                tab.classList.add('completed');
            } else {
                tab.classList.remove('completed');
            }
        });
    }

    /**
     * Show toast notification
     */
    function showToast(message) {
        // Remove existing toast
        const existing = document.querySelector('.toast');
        if (existing) {
            existing.remove();
        }

        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `
            <div class="toast-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3">
                    <polyline points="20,6 9,17 4,12"/>
                </svg>
            </div>
            <span>${message}</span>
        `;
        document.body.appendChild(toast);

        // Show
        setTimeout(() => toast.classList.add('show'), 10);

        // Hide after 3s
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    /**
     * Show dashboard screen
     */
    function showDashboard() {
        elements.screenForm.classList.remove('active');
        elements.screenInput.classList.remove('active');
        elements.screenDashboard.classList.add('active');

        // Update current site name
        if (state.selectedSite) {
            elements.currentSiteName.textContent = state.selectedSite.nom;
        } else {
            elements.currentSiteName.textContent = 'Tous les sites';
        }

        // Show blur overlay if not authenticated
        if (!state.isAuthenticated) {
            elements.blurOverlay.classList.remove('hidden');
            elements.dashboardWrapper.classList.add('blurred');
            elements.passwordInput.focus();
        }

        // Render dashboard data
        renderDashboard();
    }

    /**
     * Show form screen
     */
    function showForm() {
        elements.screenDashboard.classList.remove('active');
        elements.screenInput.classList.remove('active');
        elements.screenForm.classList.add('active');
    }

    /**
     * Attempt to unlock dashboard
     */
    function attemptUnlock() {
        const password = elements.passwordInput.value;

        if (password === ADMIN_PASSWORD) {
            state.isAuthenticated = true;
            elements.blurOverlay.classList.add('hidden');
            elements.dashboardWrapper.classList.remove('blurred');
            elements.passwordError.textContent = '';
            elements.passwordInput.value = '';
        } else {
            elements.passwordError.textContent = 'Mot de passe incorrect';
            elements.passwordInput.classList.add('shake');
            setTimeout(() => {
                elements.passwordInput.classList.remove('shake');
            }, 500);
        }
    }

    /**
     * Set active navigation item
     */
    function setActiveNav(section) {
        state.currentSection = section;
        elements.navItems.forEach(item => {
            item.classList.toggle('active', item.dataset.section === section);
        });
    }

    /**
     * Render dashboard components
     */
    function renderDashboard() {
        renderKPIs();
        renderSitesChart();
        renderRanking();
        renderThemes();
        renderAlerts();
        renderMatrix();
    }

    /**
     * Render KPI cards
     */
    function renderKPIs() {
        if (state.selectedSite) {
            elements.kpiConformite.textContent = state.selectedSite.taux_conformite_pondere + '%';
            elements.kpiBloquants.textContent = state.selectedSite.nb_bloquants;
            elements.kpiSites.textContent = '1';
            elements.kpiCriteres.textContent = '1 553';
        } else {
            elements.kpiConformite.textContent = data.global.taux_conformite_pondere + '%';
            elements.kpiBloquants.textContent = data.global.total_bloquants;
            elements.kpiSites.textContent = data.global.total_sites;
            elements.kpiCriteres.textContent = formatNumber(data.global.total_criteres);
        }

        // Update alerts count
        elements.alertsCount.textContent = data.risques.length;
    }

    /**
     * Render sites conformity chart
     */
    function renderSitesChart() {
        const sites = data.sites.slice(0, 8); // Top 8

        let html = '';
        sites.forEach(site => {
            const maxWidth = 100;
            const widthPondere = (site.taux_conformite_pondere / maxWidth) * 100;
            const widthBrut = (site.taux_conformite_brut / maxWidth) * 100;

            html += `
                <div class="chart-bar-item">
                    <span class="chart-bar-label" title="${site.nom}">${truncate(site.nom, 18)}</span>
                    <div class="chart-bar-track">
                        <div class="chart-bar-fill secondary" style="width: ${widthBrut}%"></div>
                        <div class="chart-bar-fill primary" style="width: ${widthPondere}%"></div>
                    </div>
                    <span class="chart-bar-value">${site.taux_conformite_pondere}%</span>
                </div>
            `;
        });

        elements.chartSites.innerHTML = html;
    }

    /**
     * Render ranking list
     */
    function renderRanking() {
        const sites = data.sites;

        let html = '';
        sites.forEach((site, index) => {
            const isTop3 = index < 3;
            const isBottom3 = index >= sites.length - 3;
            let className = 'ranking-item';
            if (isTop3) className += ' top-3';
            if (isBottom3) className += ' bottom-3';

            html += `
                <div class="${className}">
                    <span class="ranking-position">${site.rang}</span>
                    <span class="ranking-name">${site.nom}</span>
                    <span class="ranking-score">${site.score_global.toFixed(1)}</span>
                </div>
            `;
        });

        elements.rankingList.innerHTML = html;
    }

    /**
     * Render themes performance
     */
    function renderThemes() {
        const themes = Object.values(data.themes);

        let html = '';
        themes.forEach(theme => {
            const scoreClass = getScoreBarClass(theme.score);

            html += `
                <div class="theme-card">
                    <div class="theme-header">
                        <span class="theme-code">${theme.code}</span>
                        <span class="theme-score">${theme.score}%</span>
                    </div>
                    <div class="theme-name">${theme.nom}</div>
                    <div class="theme-bar">
                        <div class="theme-bar-fill ${scoreClass}" style="width: ${theme.score}%"></div>
                    </div>
                </div>
            `;
        });

        elements.themesGrid.innerHTML = html;
    }

    /**
     * Render alerts list
     */
    function renderAlerts() {
        const risques = data.risques.slice(0, 6);

        let html = '';
        risques.forEach(risque => {
            html += `
                <div class="alert-item">
                    <div class="alert-icon">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                            <line x1="12" y1="9" x2="12" y2="13"/>
                            <line x1="12" y1="17" x2="12.01" y2="17"/>
                        </svg>
                    </div>
                    <div class="alert-content">
                        <span class="alert-code">${risque.code} - ${risque.theme}</span>
                        <p class="alert-text">${risque.critere}</p>
                        <span class="alert-meta">${risque.nb_sites} sites concernés</span>
                    </div>
                </div>
            `;
        });

        elements.alertsList.innerHTML = html;
    }

    /**
     * Render risk matrix
     */
    function renderMatrix() {
        const matrice = data.matrice;
        const priorities = ['P1', 'P2', 'P3'];

        let html = '';
        priorities.forEach(priority => {
            const row = matrice[priority];
            const total = row.conforme + row.non_conforme + row.en_cours + row.na;

            html += `
                <tr>
                    <td><span class="priority-badge ${priority.toLowerCase()}">${priority}</span></td>
                    <td class="cell-conforme">${row.conforme}</td>
                    <td class="cell-non-conforme">${row.non_conforme}</td>
                    <td class="cell-en-cours">${row.en_cours}</td>
                    <td class="cell-na">${row.na}</td>
                    <td class="cell-total">${formatNumber(total)}</td>
                </tr>
            `;
        });

        // Add totals row
        const totals = {
            conforme: priorities.reduce((sum, p) => sum + matrice[p].conforme, 0),
            non_conforme: priorities.reduce((sum, p) => sum + matrice[p].non_conforme, 0),
            en_cours: priorities.reduce((sum, p) => sum + matrice[p].en_cours, 0),
            na: priorities.reduce((sum, p) => sum + matrice[p].na, 0)
        };
        const grandTotal = totals.conforme + totals.non_conforme + totals.en_cours + totals.na;

        html += `
            <tr style="background: var(--sv-beige-100); font-weight: 600;">
                <td>TOTAL</td>
                <td class="cell-conforme">${formatNumber(totals.conforme)}</td>
                <td class="cell-non-conforme">${formatNumber(totals.non_conforme)}</td>
                <td class="cell-en-cours">${formatNumber(totals.en_cours)}</td>
                <td class="cell-na">${formatNumber(totals.na)}</td>
                <td class="cell-total">${formatNumber(grandTotal)}</td>
            </tr>
        `;

        elements.matrixBody.innerHTML = html;
    }

    /**
     * Utility: Get score color class
     */
    function getScoreClass(score) {
        if (score >= 70) return 'success';
        if (score >= 50) return 'green-400';
        if (score >= 30) return 'warning';
        return 'danger';
    }

    /**
     * Utility: Get score bar class
     */
    function getScoreBarClass(score) {
        if (score >= 70) return 'excellent';
        if (score >= 50) return 'good';
        if (score >= 30) return 'warning';
        return 'danger';
    }

    /**
     * Utility: Format number with spaces
     */
    function formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    }

    /**
     * Utility: Truncate text
     */
    function truncate(str, length) {
        if (str.length <= length) return str;
        return str.substring(0, length) + '...';
    }

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
