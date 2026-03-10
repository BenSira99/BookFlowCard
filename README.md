# Nom du Projet
BiblioCard (BookFlow Card)

## 📋 Description
Application mobile React Native pour la gestion des adhérents d'une bibliothèque. Elle permet une authentification sécurisée via PIN ou biométrie et offre une carte membre numérique avec QR dynamique intégrée.

## 🚀 Fonctionnalités
- Authentification premium avec Lottie / Animations
- Support de la biométrie (FaceID / TouchID)
- Tableau de bord personnalisé
- Carte membre numérique avec luminosité max et QR dynamique

## 🛠️ Stack Technique
- React Native (Expo)
- TypeScript
- Zustand (Gestion d'état)
- React Navigation
- React Native Reanimated & Lottie

## 📦 Prérequis
- Node.js (v18+)
- Expo CLI
- Périphérique physique ou émulateur (iOS/Android)

## ⚙️ Installation
```bash
npm install
# ou
yarn install
```

## 🔧 Configuration (.env)
Copier le fichier `.env.example` vers `.env` (non versionné) et remplir les variables d'environnement.

## 🏃 Lancement
```bash
npx expo start
```

## 🧪 Tests
```bash
npm run test
```

## 🐳 Docker
*(Non applicable pour le frontend mobile dans cette itération)*

## 📁 Structure du Projet
- `src/screens` : Écrans de l'application (Navigation)
- `src/components` : Composants réutilisables (Boutons, Champs de texte)
- `src/theme` : Couleurs, Typographies, et Constantes visuelles
- `src/store` : Magasins d'état Zustand
- `src/navigation` : Les différents routeurs
- `src/utils` : Services et utilitaires techniques (Stockage sécurisé, etc.)

## 🔒 Sécurité
- Utilisation de `expo-secure-store` pour le stockage des tokens
- Verrouillage applicatif après 5 tentatives échouées de code PIN
- Nettoyage des données sensibles
- Conformité OWASP M1 / M2 en cours d'amélioration

## 📄 Licence
MIT

## 👤 Auteur — BenSira99
