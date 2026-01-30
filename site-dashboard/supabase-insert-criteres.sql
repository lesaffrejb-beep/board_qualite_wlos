-- =====================================================
-- INSERTION DES CRITÈRES
-- Données extraites des Excel d'audit
-- =====================================================

-- Critères SECURITE (33 critères)
INSERT INTO criteres (code, theme_code, texte, priorite, poids, est_bloquant, ordre) VALUES
('SEC-1', 'SEC', 'Le document unique d''évaluation des risques professionnels est disponible et à jour.', 'P1', 2, false, 1),
('SEC-2', 'SEC', 'Le registre des accidents du travail est à jour et accessible.', 'P1', 2, false, 2),
('SEC-3', 'SEC', 'Le plan d''évacuation est affiché dans les locaux.', 'P1', 2, false, 3),
('SEC-4', 'SEC', 'Les issues de secours sont dégagées et signalées.', 'P1', 3, true, 4),
('SEC-5', 'SEC', 'L''éclairage de sécurité est fonctionnel.', 'P1', 3, true, 5),
('SEC-6', 'SEC', 'Le contrôle des installations électriques est à jour.', 'P1', 2, false, 6),
('SEC-7', 'SEC', 'Le contrôle obligatoire est programmé avant ouverture.', 'P1', 3, true, 7),
('SEC-8', 'SEC', 'Les réserves sont levées.', 'P1', 3, true, 8),
('SEC-9', 'SEC', 'Le registre de sécurité est émargé (signature + tampon + date).', 'P1', 3, true, 9),
('SEC-10', 'SEC', 'La vérification des extincteurs est à jour.', 'P1', 2, false, 10),
('SEC-11', 'SEC', 'Les extincteurs sont en nombre suffisant.', 'P1', 3, true, 11),
('SEC-12', 'SEC', 'Les extincteurs sont conformes et vérifiés.', 'P1', 2, false, 12),
('SEC-13', 'SEC', 'Les extincteurs sont tous accessibles et dégagés.', 'P1', 3, true, 13),
('SEC-14', 'SEC', 'La signalétique de sécurité est visible et lisible.', 'P2', 1, false, 14),
('SEC-15', 'SEC', 'Les consignes de sécurité sont affichées.', 'P2', 1, false, 15),
('SEC-16', 'SEC', 'Les formations sécurité du personnel sont à jour.', 'P2', 2, false, 16),
('SEC-17', 'SEC', 'Les équipements de protection individuelle sont disponibles.', 'P2', 1, false, 17),
('SEC-18', 'SEC', 'Le local technique est sécurisé et propre.', 'P2', 1, false, 18),
('SEC-19', 'SEC', 'Les produits dangereux sont stockés correctement.', 'P2', 2, false, 19),
('SEC-20', 'SEC', 'Les fiches de sécurité des produits sont disponibles.', 'P2', 1, false, 20),
('SEC-21', 'SEC', 'La formation aux gestes de premiers secours est à jour.', 'P2', 1, false, 21),
('SEC-22', 'SEC', 'La trousse de secours est complète et accessible.', 'P2', 1, false, 22),
('SEC-23', 'SEC', 'Le défibrillateur est présent et fonctionnel.', 'P2', 1, false, 23),
('SEC-24', 'SEC', 'Les checklists de sécurité sont remplies.', 'P3', 1, false, 24),
('SEC-25', 'SEC', 'Les portes coupe-feu sont en bon état.', 'P3', 1, false, 25),
('SEC-26', 'SEC', 'Les détecteurs de fumée sont fonctionnels.', 'P2', 2, false, 26),
('SEC-27', 'SEC', 'Les issues de secours sont identifiables.', 'P1', 2, false, 27),
('SEC-28', 'SEC', 'Les formations incendie sont à jour.', 'P2', 1, false, 28),
('SEC-29', 'SEC', 'Les équipiers de sécurité sont identifiés.', 'P2', 1, false, 29),
('SEC-30', 'SEC', 'Le document unique est mis à jour annuellement.', 'P2', 1, false, 30),
('SEC-31', 'SEC', 'Les consignes d''évacuation sont connues du personnel.', 'P1', 2, false, 31),
('SEC-32', 'SEC', 'Les exercices d''évacuation sont réalisés.', 'P2', 1, false, 32),
('SEC-33', 'SEC', 'Le registre de sécurité est complet.', 'P1', 2, false, 33)
ON CONFLICT (code) DO UPDATE SET
    texte = EXCLUDED.texte,
    priorite = EXCLUDED.priorite,
    poids = EXCLUDED.poids;

-- Critères AFFICHAGE (22 critères)
INSERT INTO criteres (code, theme_code, texte, priorite, poids, est_bloquant, ordre) VALUES
('AFF-1', 'AFF', 'Le logo Slow Village est visible à l''entrée.', 'P1', 2, false, 1),
('AFF-2', 'AFF', 'La charte graphique est respectée.', 'P1', 2, false, 2),
('AFF-3', 'AFF', 'Les horaires d''ouverture sont affichés.', 'P1', 2, false, 3),
('AFF-4', 'AFF', 'Les tarifs sont clairement communiqués.', 'P1', 2, false, 4),
('AFF-5', 'AFF', 'Les informations sur les services sont disponibles.', 'P2', 1, false, 5),
('AFF-6', 'AFF', 'Les panneaux d''information sont lisibles.', 'P2', 1, false, 6),
('AFF-7', 'AFF', 'La signalétique est cohérente.', 'P2', 1, false, 7),
('AFF-8', 'AFF', 'Les menus sont affichés et à jour.', 'P2', 1, false, 8),
('AFF-9', 'AFF', 'Les allergènes sont indiqués.', 'P1', 3, true, 9),
('AFF-10', 'AFF', 'Les informations sur les activités sont disponibles.', 'P2', 1, false, 10),
('AFF-11', 'AFF', 'Les règles intérieures sont affichées.', 'P2', 1, false, 11),
('AFF-12', 'AFF', 'La politique de confidentialité est accessible.', 'P2', 1, false, 12),
('AFF-13', 'AFF', 'Les mentions légales sont présentes.', 'P2', 1, false, 13),
('AFF-14', 'AFF', 'Les numéros d''urgence sont affichés.', 'P1', 2, false, 14),
('AFF-15', 'AFF', 'Les informations COVID sont à jour.', 'P3', 0, false, 15),
('AFF-16', 'AFF', 'Les avis clients sont valorisés.', 'P3', 1, false, 16),
('AFF-17', 'AFF', 'Les supports de communication sont en bon état.', 'P2', 1, false, 17),
('AFF-18', 'AFF', 'La brochure des services est disponible.', 'P2', 1, false, 18),
('AFF-19', 'AFF', 'Le plan du site est affiché.', 'P2', 1, false, 19),
('AFF-20', 'AFF', 'Les consignes de tri sont visibles.', 'P2', 1, false, 20),
('AFF-21', 'AFF', 'Les informations sur la réglementation locale sont affichées.', 'P3', 0, false, 21),
('AFF-22', 'AFF', 'Registre sécurité incendie.', 'P1', 3, true, 22)
ON CONFLICT (code) DO UPDATE SET
    texte = EXCLUDED.texte,
    priorite = EXCLUDED.priorite,
    poids = EXCLUDED.poids;

-- Critères EXPERIENCE CLIENT (22 critères)
INSERT INTO criteres (code, theme_code, texte, priorite, poids, est_bloquant, ordre) VALUES
('EXP-1', 'EXP', 'L''accueil est chaleureux et personnalisé.', 'P1', 3, false, 1),
('EXP-2', 'EXP', 'Les délais d''attente sont raisonnables.', 'P1', 2, false, 2),
('EXP-3', 'EXP', 'Le personnel est identifiable.', 'P1', 2, false, 3),
('EXP-4', 'EXP', 'Les tenues sont conformes.', 'P2', 1, false, 4),
('EXP-5', 'EXP', 'Le langage utilisé est adapté.', 'P2', 1, false, 5),
('EXP-6', 'EXP', 'Les demandes des clients sont traitées rapidement.', 'P1', 2, false, 6),
('EXP-7', 'EXP', 'Les réclamations sont gérées efficacement.', 'P1', 2, false, 7),
('EXP-8', 'EXP', 'Les espaces communs sont confortables.', 'P2', 1, false, 8),
('EXP-9', 'EXP', 'La propreté est irréprochable.', 'P1', 3, true, 9),
('EXP-10', 'EXP', 'Les équipements sont fonctionnels.', 'P1', 2, false, 10),
('EXP-11', 'EXP', 'La décoration est en lien avec l''identité Slow Village.', 'P2', 1, false, 11),
('EXP-12', 'EXP', 'L''ambiance sonore est adaptée.', 'P3', 1, false, 12),
('EXP-13', 'EXP', 'Les espaces sont bien éclairés.', 'P2', 1, false, 13),
('EXP-14', 'EXP', 'La température est confortable.', 'P2', 1, false, 14),
('EXP-15', 'EXP', 'Les odeurs sont agréables.', 'P2', 1, false, 15),
('EXP-16', 'EXP', 'Les clients sont salués à leur arrivée.', 'P1', 2, false, 16),
('EXP-17', 'EXP', 'Les clients sont remerciés au départ.', 'P1', 2, false, 17),
('EXP-18', 'EXP', 'Les attentes des clients sont anticipées.', 'P2', 1, false, 18),
('EXP-19', 'EXP', 'Les services sont proposés de manière proactive.', 'P2', 1, false, 19),
('EXP-20', 'EXP', 'La relation client est personnalisée.', 'P1', 2, false, 20),
('EXP-21', 'EXP', 'Les réservations sont gérées efficacement.', 'P1', 2, false, 21),
('EXP-22', 'EXP', 'Les départs sont fluides.', 'P1', 2, false, 22)
ON CONFLICT (code) DO UPDATE SET
    texte = EXCLUDED.texte,
    priorite = EXCLUDED.priorite,
    poids = EXCLUDED.poids;

-- Critères QUALITE (33 critères)
INSERT INTO criteres (code, theme_code, texte, priorite, poids, est_bloquant, ordre) VALUES
('QUA-1', 'QUA', 'Les procédures d''ouverture sont respectées.', 'P1', 2, false, 1),
('QUA-2', 'QUA', 'Les procédures de fermeture sont respectées.', 'P1', 2, false, 2),
('QUA-3', 'QUA', 'Les standards de propreté sont atteints.', 'P1', 3, true, 3),
('QUA-4', 'QUA', 'Les checklists sont remplies.', 'P1', 2, false, 4),
('QUA-5', 'QUA', 'Les stocks sont gérés correctement.', 'P2', 1, false, 5),
('QUA-6', 'QUA', 'La rotation des produits est respectée.', 'P2', 1, false, 6),
('QUA-7', 'QUA', 'Les produits sont de qualité.', 'P1', 2, false, 7),
('QUA-8', 'QUA', 'Les fournisseurs sont conformes.', 'P2', 1, false, 8),
('QUA-9', 'QUA', 'La traçabilité des produits est assurée.', 'P1', 2, false, 9),
('QUA-10', 'QUA', 'Les températures de conservation sont respectées.', 'P1', 3, true, 10),
('QUA-11', 'QUA', 'Les équipements sont entretenus.', 'P2', 1, false, 11),
('QUA-12', 'QUA', 'La maintenance préventive est réalisée.', 'P2', 1, false, 12),
('QUA-13', 'QUA', 'Les pannes sont traitées rapidement.', 'P1', 2, false, 13),
('QUA-14', 'QUA', 'Les espaces sont fonctionnels.', 'P2', 1, false, 14),
('QUA-15', 'QUA', 'Les normes d''hygiène sont respectées.', 'P1', 3, true, 15),
('QUA-16', 'QUA', 'Le personnel est formé aux bonnes pratiques.', 'P1', 2, false, 16),
('QUA-17', 'QUA', 'Les produits d''entretien sont adaptés.', 'P2', 1, false, 17),
('QUA-18', 'QUA', 'Les protocoles sont documentés.', 'P2', 1, false, 18),
('QUA-19', 'QUA', 'Les contrôles qualité sont effectués.', 'P2', 1, false, 19),
('QUA-20', 'QUA', 'Les écarts sont traités.', 'P1', 2, false, 20),
('QUA-21', 'QUA', 'Le TPE est présent et en état de fonctionnement.', 'P1', 3, true, 21),
('QUA-22', 'QUA', 'Les caisses sont équilibrées.', 'P1', 2, false, 22),
('QUA-23', 'QUA', 'Les procédures de sécurité cash sont respectées.', 'P1', 2, false, 23),
('QUA-24', 'QUA', 'Les inventaires sont réguliers.', 'P2', 1, false, 24),
('QUA-25', 'QUA', 'Les écarts d''inventaire sont justifiés.', 'P2', 1, false, 25),
('QUA-26', 'QUA', 'Les commandes sont optimisées.', 'P3', 0, false, 26),
('QUA-27', 'QUA', 'Les coûts sont maîtrisés.', 'P3', 0, false, 27),
('QUA-28', 'QUA', 'Les pertes sont minimisées.', 'P2', 1, false, 28),
('QUA-29', 'QUA', 'Les fournisseurs alternatifs sont identifiés.', 'P3', 0, false, 29),
('QUA-30', 'QUA', 'Les négociations sont menées.', 'P3', 0, false, 30),
('QUA-31', 'QUA', 'Les contrats sont respectés.', 'P2', 1, false, 31),
('QUA-32', 'QUA', 'Les relances sont effectuées.', 'P2', 1, false, 32),
('QUA-33', 'QUA', 'La qualité est monitorée.', 'P2', 1, false, 33)
ON CONFLICT (code) DO UPDATE SET
    texte = EXCLUDED.texte,
    priorite = EXCLUDED.priorite,
    poids = EXCLUDED.poids;

-- Critères IMAGE (22 critères)
INSERT INTO criteres (code, theme_code, texte, priorite, poids, est_bloquant, ordre) VALUES
('IMA-1', 'IMA', 'L''identité visuelle est respectée.', 'P1', 2, false, 1),
('IMA-2', 'IMA', 'Les couleurs de la marque sont utilisées.', 'P1', 2, false, 2),
('IMA-3', 'IMA', 'La typographie est conforme.', 'P2', 1, false, 3),
('IMA-4', 'IMA', 'Les photos sont de qualité.', 'P2', 1, false, 4),
('IMA-5', 'IMA', 'Les messages sont cohérents.', 'P2', 1, false, 5),
('IMA-6', 'IMA', 'La présence digitale est active.', 'P2', 1, false, 6),
('IMA-7', 'IMA', 'Les avis en ligne sont gérés.', 'P2', 1, false, 7),
('IMA-8', 'IMA', 'Le site web est à jour.', 'P2', 1, false, 8),
('IMA-9', 'IMA', 'Les réseaux sociaux sont animés.', 'P3', 0, false, 9),
('IMA-10', 'IMA', 'La newsletter est envoyée régulièrement.', 'P3', 0, false, 10),
('IMA-11', 'IMA', 'Les campagnes sont cohérentes.', 'P2', 1, false, 11),
('IMA-12', 'IMA', 'Les partenariats sont valorisés.', 'P3', 0, false, 12),
('IMA-13', 'IMA', 'L''environnement est préservé.', 'P2', 1, false, 13),
('IMA-14', 'IMA', 'Les espaces verts sont entretenus.', 'P2', 1, false, 14),
('IMA-15', 'IMA', 'La propreté extérieure est assurée.', 'P1', 2, false, 15),
('IMA-16', 'IMA', 'L''éclairage extérieur est fonctionnel.', 'P2', 1, false, 16),
('IMA-17', 'IMA', 'Les parkings sont bien signalés.', 'P2', 1, false, 17),
('IMA-18', 'IMA', 'L''accessibilité est assurée.', 'P1', 2, false, 18),
('IMA-19', 'IMA', 'Les PMR sont accompagnés.', 'P1', 2, false, 19),
('IMA-20', 'IMA', 'Les animaux sont acceptés selon règlement.', 'P2', 1, false, 20),
('IMA-21', 'IMA', 'La tranquillité des clients est respectée.', 'P1', 2, false, 21),
('IMA-22', 'IMA', 'Les nuisances sont limitées.', 'P2', 1, false, 22)
ON CONFLICT (code) DO UPDATE SET
    texte = EXCLUDED.texte,
    priorite = EXCLUDED.priorite,
    poids = EXCLUDED.poids;

-- Critères RESSOURCES HUMAINES (22 critères)
INSERT INTO criteres (code, theme_code, texte, priorite, poids, est_bloquant, ordre) VALUES
('RH-1', 'RH', 'Les contrats de travail sont conformes.', 'P1', 2, false, 1),
('RH-2', 'RH', 'Les fiches de poste sont à jour.', 'P2', 1, false, 2),
('RH-3', 'RH', 'Les plannings sont établis.', 'P1', 2, false, 3),
('RH-4', 'RH', 'Les heures sont respectées.', 'P1', 2, false, 4),
('RH-5', 'RH', 'Les pauses sont accordées.', 'P1', 2, false, 5),
('RH-6', 'RH', 'Les congés sont planifiés.', 'P2', 1, false, 6),
('RH-7', 'RH', 'Les remplacements sont assurés.', 'P1', 2, false, 7),
('RH-8', 'RH', 'Les formations sont planifiées.', 'P2', 1, false, 8),
('RH-9', 'RH', 'Les évaluations sont réalisées.', 'P2', 1, false, 9),
('RH-10', 'RH', 'Les entretiens annuels sont menés.', 'P2', 1, false, 10),
('RH-11', 'RH', 'La politique salariale est appliquée.', 'P2', 1, false, 11),
('RH-12', 'RH', 'Les avantages sont communiqués.', 'P3', 0, false, 12),
('RH-13', 'RH', 'L''ambiance de travail est saine.', 'P1', 2, false, 13),
('RH-14', 'RH', 'Les conflits sont gérés.', 'P1', 2, false, 14),
('RH-15', 'RH', 'La communication interne est fluide.', 'P2', 1, false, 15),
('RH-16', 'RH', 'Les réunions d''équipe sont régulières.', 'P2', 1, false, 16),
('RH-17', 'RH', 'Les informations sont partagées.', 'P2', 1, false, 17),
('RH-18', 'RH', 'Le personnel est motivé.', 'P2', 1, false, 18),
('RH-19', 'RH', 'Le turn-over est maîtrisé.', 'P2', 1, false, 19),
('RH-20', 'RH', 'Les recrutements sont anticipés.', 'P2', 1, false, 20),
('RH-21', 'RH', 'Les intégrations sont structurées.', 'P2', 1, false, 21),
('RH-22', 'RH', 'Les départs sont gérés.', 'P2', 1, false, 22)
ON CONFLICT (code) DO UPDATE SET
    texte = EXCLUDED.texte,
    priorite = EXCLUDED.priorite,
    poids = EXCLUDED.poids;

-- Critères ENVIRONNEMENT (12 critères)
INSERT INTO criteres (code, theme_code, texte, priorite, poids, est_bloquant, ordre) VALUES
('RES-1', 'RES', 'La politique environnementale est affichée.', 'P2', 1, false, 1),
('RES-2', 'RES', 'Les objectifs éco-responsables sont définis.', 'P3', 0, false, 2),
('RES-3', 'RES', 'Les consommations d''énergie sont suivies.', 'P2', 1, false, 3),
('RES-4', 'RES', 'Les économies d''énergie sont mises en œuvre.', 'P2', 1, false, 4),
('RES-5', 'RES', 'Le tri sélectif est respecté.', 'P2', 1, false, 5),
('RES-6', 'RES', 'Le compostage est mis en place.', 'P3', 0, false, 6),
('RES-7', 'RES', 'Les produits locaux sont privilégiés.', 'P2', 1, false, 7),
('RES-8', 'RES', 'Les produits bio sont proposés.', 'P3', 0, false, 8),
('RES-9', 'RES', 'La gestion des déchets est optimisée.', 'P2', 1, false, 9),
('RES-10', 'RES', 'La réduction des emballages est encouragée.', 'P3', 0, false, 10),
('RES-11', 'RES', 'Les fournisseurs éco-responsables sont privilégiés.', 'P3', 0, false, 11),
('RES-12', 'RES', 'La sensibilisation du personnel est réalisée.', 'P3', 0, false, 12)
ON CONFLICT (code) DO UPDATE SET
    texte = EXCLUDED.texte,
    priorite = EXCLUDED.priorite,
    poids = EXCLUDED.poids;

-- Critères SLOW VILLAGE SPIRIT (20 critères)
INSERT INTO criteres (code, theme_code, texte, priorite, poids, est_bloquant, ordre) VALUES
('SLO-1', 'SLO', 'L''esprit Slow Village est incarné.', 'P1', 3, false, 1),
('SLO-2', 'SLO', 'La philosophie est comprise par le personnel.', 'P1', 2, false, 2),
('SLO-3', 'SLO', 'Les valeurs sont partagées.', 'P1', 2, false, 3),
('SLO-4', 'SLO', 'La déconnexion est encouragée.', 'P2', 1, false, 4),
('SLO-5', 'SLO', 'Le rythme est respectueux.', 'P1', 2, false, 5),
('SLO-6', 'SLO', 'La nature est mise en valeur.', 'P2', 1, false, 6),
('SLO-7', 'SLO', 'Les activités slow sont proposées.', 'P2', 1, false, 7),
('SLO-8', 'SLO', 'La gastronomie locale est privilégiée.', 'P2', 1, false, 8),
('SLO-9', 'SLO', 'Les produits du terroir sont mis en avant.', 'P2', 1, false, 9),
('SLO-10', 'SLO', 'Les artisans locaux sont valorisés.', 'P3', 0, false, 10),
('SLO-11', 'SLO', 'Les partenariats locaux sont développés.', 'P3', 0, false, 11),
('SLO-12', 'SLO', 'L''authenticité est préservée.', 'P1', 2, false, 12),
('SLO-13', 'SLO', 'Les traditions sont respectées.', 'P2', 1, false, 13),
('SLO-14', 'SLO', 'Le lien social est favorisé.', 'P2', 1, false, 14),
('SLO-15', 'SLO', 'La convivialité est encouragée.', 'P1', 2, false, 15),
('SLO-16', 'SLO', 'Les espaces de partage sont aménagés.', 'P2', 1, false, 16),
('SLO-17', 'SLO', 'Les animations sont proposées.', 'P2', 1, false, 17),
('SLO-18', 'SLO', 'La bienveillance est de mise.', 'P1', 2, false, 18),
('SLO-19', 'SLO', 'L''écoute est privilégiée.', 'P1', 2, false, 19),
('SLO-20', 'SLO', 'La simplicité est recherchée.', 'P2', 1, false, 20)
ON CONFLICT (code) DO UPDATE SET
    texte = EXCLUDED.texte,
    priorite = EXCLUDED.priorite,
    poids = EXCLUDED.poids;

-- Mise à jour des poids totaux par thème
UPDATE themes SET 
    poids_total = (SELECT SUM(poids) FROM criteres WHERE theme_code = themes.code),
    description = CASE code
        WHEN 'SEC' THEN '33 critères - 200+ points possibles'
        WHEN 'AFF' THEN '22 critères - 100+ points possibles'
        WHEN 'EXP' THEN '22 critères - 100+ points possibles'
        WHEN 'QUA' THEN '33 critères - 150+ points possibles'
        WHEN 'IMA' THEN '22 critères - 80+ points possibles'
        WHEN 'RH' THEN '22 critères - 60+ points possibles'
        WHEN 'RES' THEN '12 critères - 30+ points possibles'
        WHEN 'SLO' THEN '20 critères - 80+ points possibles'
    END;
