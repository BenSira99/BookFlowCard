# BookFlowCard

## 📋 Description

Application mobile sécurisée BookFlowCard, développée avec React Native (Expo) et TypeScript.

## 🚀 Fonctionnalités

- Architecture "Clean" et modulaire (features, shared)
- Navigation fluide avec Expo Router
- Gestion de l'état avec Zustand
- Stockage sécurisé des clés via react-native-keychain et expo-secure-store

## 🛠️ Stack Technique

- React Native avec Expo SDK 55
- TypeScript
- Zustand (State management)
- Zod & React Hook Form (Validation de données)

## 📦 Prérequis

- Node.js >= 18
- NPM ou Yarn
- EAS CLI (optionnel pour les builds)

## ⚙️ Installation

```bash
npm install
# ou
yarn install
```

## 🔧 Configuration (.env)

Copiez le fichier `.env.example` en `.env` et remplissez les valeurs.

```bash
cp .env.example .env
```

## 🏃 Lancement

```bash
npx expo start
```

## 📁 Structure du Projet

- `src/app/` : Navigation Expo Router
- `src/features/` : Modules métier (ex: authentification)
- `src/shared/` : Composants et utilitaires réutilisables

## 🔒 Sécurité

- Les secrets ne sont jamais pushés (voir `.env.example`).
- Le chiffrement local est géré par `expo-secure-store` / `react-native-keychain`.

## 📄 Licence

MIT

## 👤 Auteur — BenSira99
