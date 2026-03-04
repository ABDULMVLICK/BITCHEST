# 🚀 Projet BitChest - Guide Complet

> **Plateforme d'échange de crypto-monnaies** | Framework Symfony | Méthodologie SCRUM

---

## 📋 Table des matières

1. [Vue d'ensemble](#vue-densemble)
2. [Charte graphique](#charte-graphique)
3. [Organisation & Méthodologie](#organisation--méthodologie)
4. [Phase 1 : Conception UML](#phase-1--conception-uml)
5. [Phase 2 : Développement Back-end](#phase-2--développement-back-end)
6. [Phase 3 : Tests & Mise en ligne](#phase-3--tests--mise-en-ligne)
7. [Livrables finaux](#livrables-finaux)
8. [Ressources & Outils](#ressources--outils)

---

## 🎯 Vue d'ensemble

### Contexte du projet

**BitChest** est une startup développant une plateforme permettant l'achat et vente de crypto-monnaies (Bitcoin, Ethereum, etc.) destinée à être vendue en marque blanche à des entreprises financières.

### Équipe

- **Jérôme** : Directeur
- **Lisa** : Commercial
- **Vous** : Développeur Fullstack (équipe de 3 personnes)

### Contraintes techniques

- ✅ Framework : **Symfony**
- ✅ Base de données : **MySQL**
- ✅ Langue de l'application : **Anglais**
- ✅ Méthodologie : **SCRUM**

### Libertés

- Librairies CSS au choix (Bootstrap, Tailwind, etc.)
- Framework JavaScript optionnel (Vue.js, React, Alpine.js)

---

## 🎨 Charte graphique

### Typographie

**Police principale** : Celias

### Palette de couleurs

| Couleur | Code HEX | Usage suggéré |
|---------|----------|---------------|
| Vert fluo | `#01FF19` | Succès, validation, boutons positifs |
| Rouge/Rose | `#FF5964` | Erreurs, alertes, ventes |
| Blanc | `#FFFFFF` | Fond, textes sur foncé |
| Bleu foncé | `#38618C` | Fond principal, navigation |
| Bleu clair | `#35A7FF` | Liens, éléments interactifs, achats |

🔗 [Voir la palette sur Coolors](https://coolors.co/01ff19-ff5964-ffffff-38618c-35a7ff)

---

## 👥 Organisation & Méthodologie

### Rôles SCRUM

- **Product Owner** : Formateur (définit les priorités)
- **Scrum Master** : Rotation dans l'équipe (facilite les rituels)
- **Développeurs** : Équipe de 3 personnes

### Artefacts SCRUM à maintenir

- [ ] **Product Backlog** : Liste priorisée de toutes les fonctionnalités
- [ ] **Sprint Backlog** : Tâches du sprint en cours
- [ ] **Sprint Board** : Tableau Kanban (To Do / In Progress / Done)
- [ ] **Burndown Chart** : Suivi de la vélocité

### Rituels SCRUM

| Rituel | Fréquence | Durée | Responsable | Livrable |
|--------|-----------|-------|-------------|----------|
| **Sprint Planning** | Début de sprint | 2h | Scrum Master | Sprint Backlog |
| **Daily Standup** | Quotidien | 15min | Scrum Master | - |
| **Sprint Review** | Fin de sprint | 1h | Scrum Master | Démo + CR |
| **Sprint Retrospective** | Fin de sprint | 45min | Scrum Master | CR d'amélioration |

> 📝 **Important** : Le Scrum Master doit produire un compte-rendu pour les Sprint Review et Retrospective à intégrer dans le Journal de développement.

---

## 📐 Phase 1 : Conception UML

> **Période** : Module "Conception logicielle avec UML"

### ✅ Checklist Phase 1

#### 🛠️ 1. Mise en place du projet

- [ ] Créer le repository Git/GitHub
- [ ] Configurer les accès pour tous les membres
- [ ] Définir la structure des branches (main, develop, feature/*)
- [ ] Créer le fichier `.gitignore`
- [ ] Initialiser le projet Symfony
- [ ] Configurer l'environnement de développement local

#### 🤝 2. Outils collaboratifs

- [ ] Choisir l'outil de gestion de projet (Trello, Jira, GitHub Projects)
- [ ] Créer le Sprint Board
- [ ] Mettre en place la communication (Discord, Slack)
- [ ] Configurer Figma pour les maquettes
- [ ] Définir les conventions de code
- [ ] Créer le document de journal de développement

#### 📊 3. Conception UML

##### Diagrammes à réaliser

- [ ] **Diagramme de cas d'utilisation**
  - Identifier tous les acteurs (Client, Admin, Système)
  - Lister tous les cas d'utilisation
  - Définir les relations (include, extend)

- [ ] **Diagramme de classes**
  - Entités principales (User, Wallet, Transaction, Cryptocurrency, etc.)
  - Attributs et méthodes
  - Relations et cardinalités
  - Héritage et interfaces

- [ ] **Diagramme de séquence**
  - Inscription utilisateur
  - Connexion
  - Achat de crypto-monnaie
  - Vente de crypto-monnaie
  - Consultation du portefeuille

- [ ] **Diagramme d'activité**
  - Processus d'achat complet
  - Processus de vente complet

- [ ] **Diagramme entité-relation (MCD)**
  - Modèle conceptuel de données
  - Tables et relations

#### 📝 4. Liste fonctionnelle

##### Fonctionnalités utilisateur (CLIENT)

- [ ] **Authentification**
  - Inscription (email, password, validation)
  - Connexion
  - Déconnexion
  - Mot de passe oublié
  - Profil utilisateur

- [ ] **Portefeuille (Wallet)**
  - Voir le solde total (en €)
  - Voir les crypto-monnaies possédées
  - Historique des transactions
  - Créditer le compte (simulation)

- [ ] **Trading**
  - Liste des crypto-monnaies disponibles
  - Voir le cours actuel en temps réel
  - Graphique d'évolution des cours
  - Acheter des crypto-monnaies
  - Vendre des crypto-monnaies
  - Calculateur de conversion

- [ ] **Transactions**
  - Historique complet
  - Filtres (date, type, crypto)
  - Détails d'une transaction
  - Export CSV

##### Fonctionnalités admin (ADMIN)

- [ ] **Dashboard**
  - Statistiques générales
  - Nombre d'utilisateurs
  - Volume de transactions
  - Revenus générés

- [ ] **Gestion utilisateurs**
  - Liste des utilisateurs
  - Voir détails utilisateur
  - Activer/Désactiver un compte
  - Voir le portefeuille d'un user

- [ ] **Gestion crypto-monnaies**
  - Ajouter une crypto
  - Modifier les informations
  - Activer/Désactiver
  - Gérer les cotations

- [ ] **Transactions**
  - Voir toutes les transactions
  - Statistiques
  - Export des données

#### 🖼️ 5. Zoning et Wireframes

##### Pages à wireframer

**Pages publiques**
- [ ] Page d'accueil (Landing page)
- [ ] Page de connexion
- [ ] Page d'inscription
- [ ] Page mot de passe oublié

**Pages utilisateur**
- [ ] Dashboard utilisateur
- [ ] Mon portefeuille
- [ ] Liste des crypto-monnaies
- [ ] Page détail d'une crypto
- [ ] Page d'achat
- [ ] Page de vente
- [ ] Historique des transactions
- [ ] Mon profil

**Pages admin**
- [ ] Dashboard admin
- [ ] Liste des utilisateurs
- [ ] Détail utilisateur
- [ ] Gestion des crypto-monnaies
- [ ] Liste des transactions

##### Éléments communs
- [ ] Header/Navigation
- [ ] Footer
- [ ] Menu latéral
- [ ] Composants (cards, modals, forms)

#### 🎨 6. Maquettes Figma

- [ ] Créer le projet Figma
- [ ] Définir les composants réutilisables
- [ ] Appliquer la charte graphique
- [ ] Créer les maquettes desktop
- [ ] Créer les maquettes mobile (responsive)
- [ ] Définir les interactions et transitions
- [ ] Valider avec le Product Owner
- [ ] Exporter les assets

---

## 💻 Phase 2 : Développement Back-end

> **Période** : Module "Développer la partie back-end avec Symfony"

### ✅ Checklist Phase 2

#### 🎨 1. Intégration Front-end

- [ ] Installer et configurer Webpack Encore
- [ ] Intégrer la typographie Celias
- [ ] Créer le système de design (variables CSS)
- [ ] Intégrer Bootstrap/Tailwind (si choisi)
- [ ] Créer les templates Twig de base
- [ ] Implémenter le layout principal
- [ ] Créer les composants réutilisables
- [ ] Rendre responsive toutes les pages
- [ ] Tester sur différents navigateurs

#### 🗄️ 2. Mise en place de la BDD

##### Configuration Symfony

- [ ] Configurer `.env` avec les paramètres MySQL
- [ ] Créer la base de données
- [ ] Installer Doctrine ORM
- [ ] Configurer les fixtures (données de test)

##### Entités à créer

- [ ] **User**
  - id, email, password (hashé), roles, firstName, lastName
  - createdAt, updatedAt, isActive

- [ ] **Wallet**
  - id, user (relation), balance (€)
  - createdAt, updatedAt

- [ ] **Cryptocurrency**
  - id, name, symbol, currentPrice
  - description, logoUrl
  - isActive, createdAt, updatedAt

- [ ] **Transaction**
  - id, user (relation), cryptocurrency (relation)
  - type (BUY/SELL), amount, priceAtTransaction
  - total, fees, status
  - createdAt

- [ ] **WalletCrypto** (table pivot)
  - id, wallet (relation), cryptocurrency (relation)
  - quantity

- [ ] **PriceHistory**
  - id, cryptocurrency (relation)
  - price, recordedAt

##### Migrations

- [ ] Générer les migrations
- [ ] Vérifier les migrations
- [ ] Exécuter les migrations
- [ ] Créer les fixtures (utilisateurs de test, cryptos)
- [ ] Charger les fixtures

#### ⚙️ 3. Développement Back-end

##### Sécurité & Authentification

- [ ] Installer Security Bundle
- [ ] Configurer le firewall
- [ ] Créer le système d'inscription
- [ ] Implémenter la connexion
- [ ] Gérer les rôles (ROLE_USER, ROLE_ADMIN)
- [ ] Protéger les routes
- [ ] Implémenter "Se souvenir de moi"
- [ ] Mot de passe oublié (optionnel)

##### Controllers

**PublicController**
- [ ] Route `/` (homepage)
- [ ] Route `/login`
- [ ] Route `/register`

**DashboardController** (ROLE_USER)
- [ ] Route `/dashboard`
- [ ] Afficher le portefeuille
- [ ] Afficher les dernières transactions

**CryptocurrencyController** (ROLE_USER)
- [ ] Route `/cryptocurrencies` (liste)
- [ ] Route `/cryptocurrencies/{id}` (détail)
- [ ] Afficher les cours en temps réel

**TransactionController** (ROLE_USER)
- [ ] Route `/buy/{crypto_id}` (formulaire achat)
- [ ] Route `/sell/{crypto_id}` (formulaire vente)
- [ ] Route `/transactions` (historique)
- [ ] Route `/transactions/{id}` (détail)

**WalletController** (ROLE_USER)
- [ ] Route `/wallet` (mon portefeuille)
- [ ] Route `/wallet/deposit` (créditer - simulation)

**AdminController** (ROLE_ADMIN)
- [ ] Route `/admin/dashboard`
- [ ] Route `/admin/users` (liste)
- [ ] Route `/admin/users/{id}` (détail)
- [ ] Route `/admin/users/{id}/toggle` (activer/désactiver)
- [ ] Route `/admin/cryptocurrencies` (CRUD)
- [ ] Route `/admin/transactions` (liste)

##### Services

- [ ] **CryptocurrencyService**
  - Récupérer les cours depuis une API externe
  - Mettre à jour les prix (commande Symfony)
  - Calculer les variations

- [ ] **TransactionService**
  - Logique métier pour l'achat
  - Logique métier pour la vente
  - Vérifier le solde
  - Calculer les frais
  - Enregistrer la transaction

- [ ] **WalletService**
  - Calculer le solde total
  - Gérer les crypto-monnaies du portefeuille
  - Historique

- [ ] **ChartService** (optionnel)
  - Générer les données pour les graphiques

##### Formulaires

- [ ] RegistrationFormType
- [ ] LoginFormType
- [ ] BuyCryptoFormType
- [ ] SellCryptoFormType
- [ ] DepositFormType
- [ ] CryptocurrencyFormType (admin)

##### Validation

- [ ] Valider les montants (positifs, suffisants)
- [ ] Valider les quantités
- [ ] Valider les emails
- [ ] Messages d'erreur en anglais

##### API externe (optionnel mais recommandé)

- [ ] S'inscrire sur CoinGecko ou CoinMarketCap API
- [ ] Créer un service pour consommer l'API
- [ ] Mettre en cache les résultats (5-10 minutes)
- [ ] Créer une commande pour mettre à jour les prix

##### Commandes Symfony

- [ ] `app:crypto:update-prices` (mise à jour des cours)
- [ ] Planifier avec Cron (optionnel)

##### Tests manuels

- [ ] Tester l'inscription
- [ ] Tester la connexion
- [ ] Tester l'achat de crypto
- [ ] Tester la vente de crypto
- [ ] Tester le portefeuille
- [ ] Tester l'historique
- [ ] Tester l'interface admin

#### 📖 4. Journal de développement

##### Structure du journal

```markdown
# Journal de Développement BitChest

## Sprint 1 (dates)

### Objectifs du sprint
- ...

### Réalisations
- [Date] [Nom] : Description de la tâche

### Difficultés rencontrées
- ...

### Solutions apportées
- ...

### Sprint Review - CR
- ...

### Sprint Retrospective - CR
- Points positifs :
- Points à améliorer :
- Actions pour le prochain sprint :

---

## Sprint 2 (dates)
...
```

- [ ] Créer la structure du journal
- [ ] Remplir au fur et à mesure (daily)
- [ ] Documenter les décisions techniques
- [ ] Ajouter les CR de Sprint Review
- [ ] Ajouter les CR de Retrospective
- [ ] Ajouter les captures d'écran importantes

---

## 🧪 Phase 3 : Tests & Mise en ligne

> **Période** : Module "Les tests logiciels assistés par l'IA"

### ✅ Checklist Phase 3

#### 📋 1. Plan de test

##### Document de plan de test

- [ ] Objectifs des tests
- [ ] Périmètre (fonctionnalités à tester)
- [ ] Types de tests (unitaires, fonctionnels)
- [ ] Environnement de test
- [ ] Outils utilisés (PHPUnit, Symfony Panther)
- [ ] Critères d'acceptation
- [ ] Planning des tests

##### Scénarios de test à documenter

**Tests fonctionnels**
- [ ] Scénario : Inscription utilisateur
- [ ] Scénario : Connexion utilisateur
- [ ] Scénario : Achat de crypto-monnaie
- [ ] Scénario : Vente de crypto-monnaie
- [ ] Scénario : Consultation du portefeuille
- [ ] Scénario : Accès admin au dashboard
- [ ] Scénario : Gestion utilisateur par admin

**Tests de sécurité**
- [ ] Accès non autorisé aux pages admin
- [ ] Injection SQL
- [ ] XSS (Cross-Site Scripting)
- [ ] CSRF (Cross-Site Request Forgery)

**Tests de performance** (optionnel)
- [ ] Temps de chargement des pages
- [ ] Nombre de requêtes SQL

#### 🧪 2. Tests unitaires

##### Configuration

- [ ] Installer PHPUnit
- [ ] Configurer `phpunit.xml.dist`
- [ ] Créer la base de données de test
- [ ] Configurer les fixtures pour les tests

##### Tests des Services

**CryptocurrencyService**
- [ ] Test : Récupération des prix API
- [ ] Test : Calcul des variations
- [ ] Test : Gestion du cache

**TransactionService**
- [ ] Test : Achat avec solde suffisant
- [ ] Test : Achat avec solde insuffisant
- [ ] Test : Vente avec quantité suffisante
- [ ] Test : Vente avec quantité insuffisante
- [ ] Test : Calcul des frais
- [ ] Test : Mise à jour du wallet

**WalletService**
- [ ] Test : Calcul du solde total
- [ ] Test : Ajout de fonds
- [ ] Test : Historique des transactions

##### Tests des Entités

- [ ] Test User : Validation email
- [ ] Test User : Hash du password
- [ ] Test Transaction : Calcul du total
- [ ] Test Wallet : Relations

##### Tests des Formulaires

- [ ] Test RegistrationForm : Validation
- [ ] Test BuyCryptoForm : Montants valides
- [ ] Test SellCryptoForm : Quantités valides

##### Tests Fonctionnels (avec WebTestCase)

- [ ] Test : Page d'accueil accessible
- [ ] Test : Inscription complète
- [ ] Test : Connexion avec bons identifiants
- [ ] Test : Connexion avec mauvais identifiants
- [ ] Test : Accès dashboard nécessite authentification
- [ ] Test : Processus d'achat complet
- [ ] Test : Admin peut voir tous les users

##### Exécution des tests

- [ ] Lancer tous les tests : `php bin/phpunit`
- [ ] Vérifier la couverture de code
- [ ] Corriger les tests échouants
- [ ] Atteindre minimum 70% de couverture

#### 🚀 3. Mise en ligne

##### Préparation du déploiement

- [ ] Choisir l'hébergeur (Heroku, DigitalOcean, AWS, etc.)
- [ ] Configurer l'environnement de production
- [ ] Créer `.env.prod` avec les bonnes variables
- [ ] Configurer la base de données de production

##### Déploiement

- [ ] Installer les dépendances (`composer install --no-dev`)
- [ ] Vider le cache (`php bin/console cache:clear --env=prod`)
- [ ] Exécuter les migrations
- [ ] Charger les fixtures (cryptos initiales)
- [ ] Configurer le serveur web (Apache/Nginx)
- [ ] Configurer HTTPS (Let's Encrypt)

##### Configuration serveur

- [ ] Installer PHP 8.1+
- [ ] Installer MySQL
- [ ] Installer Composer
- [ ] Configurer le Virtual Host
- [ ] Activer les modules nécessaires

##### Vérifications post-déploiement

- [ ] Vérifier que le site est accessible
- [ ] Tester l'inscription
- [ ] Tester la connexion
- [ ] Tester les fonctionnalités principales
- [ ] Vérifier les logs d'erreur
- [ ] Tester la sécurité (HTTPS)

##### Monitoring (optionnel)

- [ ] Mettre en place un système de logs
- [ ] Configurer les alertes
- [ ] Surveiller les performances

#### 📚 4. Finalisation des documents

##### Documents à finaliser

- [ ] **Journal de développement**
  - Compléter tous les sprints
  - Ajouter les CR finaux
  - Relecture et correction

- [ ] **Documentation technique**
  - Architecture de l'application
  - Schéma de base de données
  - API endpoints (si API REST)
  - Guide d'installation

- [ ] **Documentation utilisateur**
  - Guide utilisateur (client)
  - Guide administrateur

- [ ] **Diagrammes UML finaux**
  - Vérifier la cohérence avec le code
  - Mettre à jour si nécessaire

- [ ] **Plan de test**
  - Résultats des tests
  - Taux de couverture
  - Bugs connus et corrections

- [ ] **README.md du projet**
  - Description du projet
  - Technologies utilisées
  - Instructions d'installation
  - Credentials de démo
  - Screenshots

##### Préparation de la soutenance

- [ ] Créer la présentation PowerPoint/Slides
- [ ] Préparer la démo
- [ ] Préparer les comptes de démo (user + admin)
- [ ] Lister les points forts du projet
- [ ] Lister les difficultés et solutions
- [ ] Préparer les réponses aux questions probables
- [ ] Répéter la présentation

---

## 📦 Livrables finaux

### Documents obligatoires

- [ ] **Diagrammes UML**
  - Diagramme de cas d'utilisation
  - Diagramme de classes
  - Diagramme de séquence
  - Diagramme d'activité
  - Diagramme entité-relation

- [ ] **Wireframes et maquettes**
  - Wireframes basse fidélité
  - Maquettes Figma haute fidélité
  - Export des assets

- [ ] **Code source**
  - Repository Git avec historique complet
  - Code commenté et propre
  - Respect des standards Symfony

- [ ] **Base de données**
  - Script SQL de création
  - Schéma de la base
  - Fixtures

- [ ] **Journal de développement**
  - Complet avec tous les sprints
  - CR des Sprint Review
  - CR des Sprint Retrospective

- [ ] **Plan de test**
  - Scénarios de test
  - Résultats des tests
  - Couverture de code

- [ ] **Tests unitaires**
  - Tests PHPUnit
  - Rapport de couverture

- [ ] **Application en ligne**
  - URL de production
  - Comptes de démonstration

- [ ] **Documentation**
  - README.md
  - Guide d'installation
  - Guide utilisateur
  - Guide administrateur

### Éléments de présentation

- [ ] Support de présentation (slides)
- [ ] Démo fonctionnelle
- [ ] Screenshots de l'application
- [ ] Vidéo de démonstration (optionnel)

---

## 🛠️ Ressources & Outils

### Technologies recommandées

#### Back-end
- **Symfony 6/7** - Framework PHP
- **Doctrine ORM** - Gestion BDD
- **Twig** - Moteur de templates
- **Security Bundle** - Authentification
- **Mailer** - Envoi d'emails (optionnel)

#### Front-end
- **Bootstrap 5** ou **Tailwind CSS** - Framework CSS
- **Alpine.js** ou **Stimulus** - JavaScript léger
- **Chart.js** - Graphiques
- **Font Awesome** - Icônes

#### Outils de développement
- **Git/GitHub** - Versioning
- **Composer** - Gestionnaire de dépendances PHP
- **npm/Yarn** - Gestionnaire de dépendances JS
- **Webpack Encore** - Bundler assets
- **PHPUnit** - Tests
- **Xdebug** - Débogage

#### Outils collaboratifs
- **Trello/Jira** - Gestion de projet
- **Figma** - Design
- **Discord/Slack** - Communication
- **Notion** - Documentation

### APIs utiles

- **CoinGecko API** (gratuite) : https://www.coingecko.com/en/api
- **CoinMarketCap API** : https://coinmarketcap.com/api/
- **Binance API** : https://binance-docs.github.io/apidocs/

### Ressources d'apprentissage

#### Symfony
- Documentation officielle : https://symfony.com/doc
- SymfonyCasts : https://symfonycasts.com/
- Grafikart (FR) : https://grafikart.fr/formations/symfony

#### SCRUM
- Scrum Guide : https://scrumguides.org/
- Atlassian SCRUM : https://www.atlassian.com/agile/scrum

#### UML
- Lucidchart : https://www.lucidchart.com/
- Draw.io : https://draw.io/
- PlantUML : https://plantuml.com/

### Hébergeurs

- **Heroku** - Facile, gratuit pour débuter
- **DigitalOcean** - VPS économique
- **OVH** - Hébergeur français
- **Railway** - Alternative moderne à Heroku
- **Render** - Gratuit avec limitations

---

## ✅ Checklist Finale

### Avant la soutenance

- [ ] Application déployée et fonctionnelle
- [ ] Tous les documents finalisés
- [ ] Repository Git nettoyé et organisé
- [ ] README.md complet
- [ ] Comptes de démo créés et testés
- [ ] Présentation préparée
- [ ] Démo répétée

### Critères de qualité

- [ ] Code propre et commenté
- [ ] Respect des conventions Symfony
- [ ] Sécurité : Protection CSRF, XSS, Injection SQL
- [ ] Responsive design
- [ ] Charte graphique respectée
- [ ] Application en anglais
- [ ] Tests unitaires > 70% de couverture
- [ ] Pas de bugs bloquants
- [ ] Performance acceptable

### Comptes de démonstration

**Utilisateur classique**
- Email : `user@bitchest.com`
- Password : `User1234!`

**Administrateur**
- Email : `admin@bitchest.com`
- Password : `Admin1234!`

---

## 🎓 Conseils & Bonnes pratiques

### Organisation

1. **Communiquez régulièrement** - Daily standup même à distance
2. **Committez souvent** - Petits commits avec messages clairs
3. **Documentez au fur et à mesure** - Ne laissez pas pour la fin
4. **Testez régulièrement** - Ne pas accumuler les bugs
5. **Respectez les deadlines** - Planifiez avec des marges

### Développement

1. **Suivez les standards Symfony** - PSR-12, best practices
2. **Séparez la logique métier** - Services pour la logique complexe
3. **Validez côté serveur** - Ne jamais faire confiance au client
4. **Gérez les erreurs** - Try/catch, messages d'erreur clairs
5. **Optimisez les requêtes** - Évitez le N+1 problem

### SCRUM

1. **Sprint de 1-2 semaines** - Durée fixe
2. **Définissez bien la Definition of Done**
3. **Priorisez le Product Backlog** - MVP d'abord
4. **Estimez en points** - Poker planning
5. **Rétrospectives honnêtes** - Amélioration continue

---

## 📞 Contact & Support

### Product Owner (Formateur)
- Pour les questions sur les fonctionnalités
- Validation des sprints
- Clarifications sur le cahier des charges

### Équipe de développement
- Entraide technique
- Revue de code
- Pair programming

---

**Dernière mise à jour** : [Date]

**Version** : 1.0

**Auteurs** : Équipe BitChest

---

> 💡 **Astuce** : Cochez les cases au fur et à mesure dans Notion pour suivre votre progression !

> 🚀 **Objectif** : Livrer une application fonctionnelle, sécurisée et professionnelle !

> 🎯 **N'oubliez pas** : La méthodologie SCRUM et la documentation sont aussi importantes que le code !
