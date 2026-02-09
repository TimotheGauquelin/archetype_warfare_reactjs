import { AxiosError, AxiosRequestConfig } from 'axios';
import api_aw from './api_aw';
import { handleApiError, logError } from '../utils/errorHandler';
import type { RootState } from '../types';
import type { Store } from '@reduxjs/toolkit';

let store: Store<RootState> | null = null;

/**
 * Configure le store Redux pour les intercepteurs
 */
export const configureInterceptors = (reduxStore: Store<RootState>): void => {
  store = reduxStore;
};

/**
 * Intercepteur de requête pour ajouter le token d'authentification
 */
const requestInterceptor = (config: AxiosRequestConfig): AxiosRequestConfig => {
  if (store) {
    const state = store.getState();
    const token = state.user.token;

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
};

/**
 * Intercepteur de réponse pour gérer les erreurs globalement
 */
const responseInterceptor = {
  onFulfilled: (response: unknown) => response,
  onRejected: (error: AxiosError) => {
    const appError = handleApiError(error);
    logError(appError, 'API Request');

    // Gestion spécifique pour les erreurs 401 (non autorisé)
    if (appError.statusCode === 401 && store) {
      // Optionnel : déconnecter l'utilisateur automatiquement
      // import { clearUser } from '../redux/slice/userSlice';
      // store.dispatch(clearUser());
    }

    return Promise.reject(appError);
  },
};

/**
 * Configure les intercepteurs pour l'API principale
 */
export const setupApiInterceptors = (): void => {
  api_aw.interceptors.request.use(requestInterceptor);
  api_aw.interceptors.response.use(
    responseInterceptor.onFulfilled,
    responseInterceptor.onRejected
  );
};
