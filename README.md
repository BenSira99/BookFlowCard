# BiblioCard (BookFlow Card)

## 📋 Description
Application mobile React Native **Premium** pour la gestion des adhérents d'une bibliothèque. Conçue avec une expérience utilisateur fluide, des animations de pointe et une sécurité rigoureuse, elle transforme la carte de bibliothèque physique en un compagnon numérique intelligent.

## 🚀 Fonctionnalités (Modules 1 à 10)
- **M1 : Authentification Sécurisée** — Écran de bienvenue animé, login PIN/Biométrie, et verrouillage automatique.
- **M2 : Support Biométrique** — Intégration FaceID / TouchID avec fallback PIN.
- **M3 : Tableau de bord Interactif** — Statistiques vivantes, progression XP utilisateur ("Barre Liquide") et accès rapide.
- **M4 : Catalogue & Recherche** — Recherche intelligente, filtres par catégories et scanner ISBN intelligent (Expo SDK 55).
- **M5 : Carte Membre Digitale** — QR Code dynamique, luminosité forcée au maximum et design élégant.
- **M6 : Profil Utilisateur** — Gestion des informations personnelles, pseudonyme et avatars configurables.
- **M7 : Emprunts, Retours & Réservations** — Suivi en temps réel des livres empruntés, historique et gestion des amendes.
- **M8 : Statistiques de Lecture** — Visualisation des habitudes de lecture avec graphiques premium.
- **M9 : Informations Bibliothèque** — Horaires dynamiques, événements avec effet parallax, FAQ et formulaire de contact animé ("Avion en papier").
- **M10 : Paramètres & Personnalisation** — Transition de thème circulaire (Sombre/Clair), gestion du cache (Shimmer effect) et sécurité PIN.

## 🛠️ Stack Technique
- **Core** : React Native (Expo SDK 55)
- **Langage** : TypeScript (Strict Mode)
- **Animations** : React Native Reanimated 3+, Lottie, Skia (pour certains effets visuels)
- **State Management** : Zustand (avec persistance)
- **Navigation** : React Navigation 7
- **UI/UX** : Glassmorphism, Micro-interactions, Haptic Feedback

## 📦 Prérequis
- Node.js (v18+)
- Expo Go ou Build local
- Périphérique physique recommandé pour la biométrie et le scanner

## ⚙️ Installation
```bash
npm install
```

## 🔧 Configuration (.env)
Copier le fichier `.env.example` vers `.env` et configurer les variables :
```env
EXPO_PUBLIC_API_URL=https://votre-api.com
EXPO_PUBLIC_SECURE_KEY=votre_cle_de_chiffrement
```

## 🏃 Lancement
```bash
npx expo start
```

## 🧪 Qualité du Code
- **Linting** : ESLint + Prettier
- **Type Checking** : TypeScript `noEmit` (0 erreur)
- **Security Audit** : Orienté OWASP Mobile Top 10

## 📁 Structure du Projet
- `src/screens/` : Écrans organisés par modules (auth, app, catalog, info, settings).
- `src/components/` : Composants atomiques et premium.
- `src/store/` : Logique métier et persistence des données.
- `src/navigation/` : Architecture de navigation imbriquée.
- `src/theme/` : Design system centralisé (couleurs Teal/Navy).

## 🔒 Sécurité
- **CWE-620/308** : Validation stricte des changements de PIN.
- **Wipe sécurisé** : Nettoyage des données locales lors de la déconnexion ou via les paramètres.
- **Stockage** : Utilisation de `AES-256` via SecureStore pour les secrets.

## 📄 Licence
MIT — Développé par BenSira99

## 👤 Auteur
**Ben Sira** — Senior Full-Stack Engineer
[GitHub](https://github.com/BenSira99) | [Email](mailto:ligbandrohbensira@gmail.com)
