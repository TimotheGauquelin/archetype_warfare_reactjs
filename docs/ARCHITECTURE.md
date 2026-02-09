# Architecture du Projet - Archetype Warfare

## 📋 Vue d'ensemble

Ce document décrit l'architecture du projet après la migration vers Vite + TypeScript et l'implémentation du système de gestion d'erreurs centralisé.

## 🏗️ Structure du Projet

```
src/
├── api/                    # Configuration des clients API
│   ├── api_aw.ts          # Client API principal
│   ├── api_aw_token.ts    # Client API avec authentification
│   └── interceptors.ts    # Intercepteurs Axios pour gestion centralisée
├── components/             # Composants React
│   ├── generic/           # Composants réutilisables
│   └── pages/             # Composants spécifiques aux pages
├── constant/              # Constantes de l'application
├── hooks/                 # Hooks React personnalisés
├── pages/                 # Pages de l'application
├── redux/                 # Configuration Redux
│   ├── slice/            # Redux slices
│   └── store.ts          # Store Redux
├── services/              # Services API (tous typés)
├── styles/               # Fichiers SCSS
├── test/                 # Configuration des tests
├── types/                # Définitions TypeScript
│   └── index.ts          # Types principaux
├── utils/                # Utilitaires
│   ├── errorHandler.ts   # Système de gestion d'erreurs
│   └── ...
└── App.tsx               # Composant racine
```

## 🔧 Système de Gestion d'Erreurs

### Classe AppError

Toutes les erreurs sont converties en instances de `AppError` avec :
- `message` : Message d'erreur lisible
- `code` : Code d'erreur standardisé (ErrorCode enum)
- `statusCode` : Code HTTP (si applicable)
- `originalError` : Erreur originale pour le debugging

### Codes d'erreur standardisés

```typescript
enum ErrorCode {
  NETWORK_ERROR = 'NETWORK_ERROR',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  SERVER_ERROR = 'SERVER_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
  TIMEOUT = 'TIMEOUT',
  CANCELED = 'CANCELED',
}
```

### Utilisation

```typescript
import { handleApiError, getErrorMessage, logError } from '../utils/errorHandler';

try {
  const response = await api_aw.get('/endpoint');
  // ...
} catch (error) {
  const appError = handleApiError(error);
  logError(appError, 'context');
  toast.error(getErrorMessage(appError));
}
```

## 🔌 Intercepteurs Axios

Les intercepteurs sont configurés dans `src/api/interceptors.ts` :

1. **Intercepteur de requête** : Ajoute automatiquement le token d'authentification depuis Redux
2. **Intercepteur de réponse** : Convertit toutes les erreurs Axios en `AppError`

Configuration automatique dans `src/index.tsx`.

## 📝 Services Typés

Tous les services sont maintenant entièrement typés avec TypeScript :

### Exemple : Service Archetype

```typescript
export const getArchetypeById = async (
  archetypeId: number | string,
  setArchetype: SetStateCallback<Archetype>
): Promise<void> => {
  try {
    const response = await api_aw.get(URL_BACK_GET_ARCHETYPE_BY_ID(archetypeId));
    if (response.data) {
      setArchetype(response.data);
    }
  } catch (error) {
    const appError = handleApiError(error);
    logError(appError, 'getArchetypeById');
    throw appError;
  }
};
```

### Services disponibles

- ✅ `archetype.ts` - Gestion des archétypes
- ✅ `user.ts` - Gestion des utilisateurs
- ✅ `card.ts` - Recherche de cartes
- ✅ `auth.ts` - Authentification
- ✅ `banlist.ts` - Gestion des banlists
- ✅ `deck.ts` - Gestion des decks
- ✅ `attribute.ts` - Attributs de cartes
- ✅ `cardtype.ts` - Types de cartes
- ✅ `cardStatus.ts` - Statuts de cartes
- ✅ `type.ts` - Types de monstres
- ✅ `summonmechanic.ts` - Mécaniques d'invocation
- ✅ `era.ts` - Ères
- ✅ `file.ts` - Gestion des fichiers
- ✅ `websiteactions.ts` - Actions du site

## 📦 Types Principaux

Tous les types sont définis dans `src/types/index.ts` :

- `User` - Utilisateur
- `Archetype` - Archétype
- `Card` - Carte
- `Deck` - Deck
- `Banlist` - Banlist
- `Pagination` - Pagination
- `SearchCriteria` - Critères de recherche
- `ApiResponse<T>` - Réponse API générique
- `PaginatedResponse<T>` - Réponse paginée

## 🎯 Bonnes Pratiques

### 1. Gestion d'erreurs

✅ **À faire :**
```typescript
try {
  const response = await api_aw.get('/endpoint');
} catch (error) {
  const appError = handleApiError(error);
  logError(appError, 'context');
  // Gérer l'erreur de manière appropriée
}
```

❌ **À éviter :**
```typescript
catch (error) {
  console.log(error); // ❌ Ne pas utiliser console.log
}
```

### 2. Typage des services

✅ **À faire :**
```typescript
export const myService = async (
  param1: string,
  setState: SetStateCallback<MyType>
): Promise<void> => {
  // ...
};
```

❌ **À éviter :**
```typescript
export const myService = (param1, setState) => {
  // ❌ Pas de types
};
```

### 3. Utilisation des types

✅ **À faire :**
```typescript
import type { Archetype, Pagination } from '../types';
```

❌ **À éviter :**
```typescript
// ❌ Utiliser 'any' ou ne pas typer
```

## 🚀 Améliorations Futures

1. **Hooks personnalisés** : Créer des hooks réutilisables pour les appels API
2. **Tests unitaires** : Ajouter des tests pour les services
3. **Validation** : Ajouter Zod ou Yup pour la validation des réponses API
4. **Cache** : Implémenter un système de cache pour les requêtes
5. **Retry logic** : Ajouter une logique de retry pour les requêtes échouées

## 📚 Ressources

- [Documentation Vite](https://vitejs.dev/)
- [Documentation TypeScript](https://www.typescriptlang.org/)
- [Documentation Redux Toolkit](https://redux-toolkit.js.org/)
- [Documentation Axios](https://axios-http.com/)
