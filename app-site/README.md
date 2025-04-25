# TOOL TRACKING - FRONTEND

Interface web développée avec **React** et **Next.js**
Elle permet de consulter, modifier et importer des données liées aux outils, employés et clients, en lien avec une API backend NestJS.

---

## 🚀 Fonctionnalités principales

- 🔧 Page **Outils** : liste des outils, dernière localisation (à venir)
- 👩‍💼 Page **Employés** : affichage, édition, suppression, import CSV
- 🏢 Page **Clients** : affichage et import CSV
- 🌐 Connexion dynamique avec le backend via API REST
- 📦 Architecture modulaire avec composants réutilisables

---

## 🗂️ Structure du projet

- `pages/` : pages principales du site
- `components/` : composants visuels réutilisables
- `models/` : interfaces TypeScript (`Tool`, `Employee`, `Customer`, etc.)
- `providers/` : logique de gestion des données
- `utils/config.ts` : contient l’URL de base du backend

---

## ⚙️ Configuration du frontend

Dans le fichier `utils/config.ts` :

# 1. Cloner le dépôt
- git clone https://github.com/BlueFear76/WebApp-Projet9.git

# 2. Installer les dépendances
- cd m1-site
- npm install

# 3. Lancer le serveur de développement
- npm run dev

## ⚙️ Configuration de l’URL de l’API

Dans le fichier `utils/config.ts`

