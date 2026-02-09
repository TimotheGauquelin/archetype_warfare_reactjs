import { URL_BACK_TOGGLE_REGISTRATION, URL_BACK_TOGGLE_STREAM_BAR } from "../constant/urlsBack";
import { URL_BACK_GET_CONFIG } from "../constant/urlsBack";
import { api_aw_token } from "../api/api_aw_token";
import api_aw from "../api/api_aw";
import type { SiteConfig, SetStateCallback } from "../types";
import type { Id } from "react-toastify";
import { handleApiError, getErrorMessage, logError } from "../utils/errorHandler";

export type SetConfigFunction = (config: SiteConfig) => void;
export type SetIsFetchingFunction = SetStateCallback<boolean>;
export type SetIsUpdatingFunction = SetStateCallback<boolean>;
export type ToastFunction = {
    success: (message: string) => Id;
    error: (message: string) => Id;
};

/**
 * Récupère la configuration du site
 */
export const getConfig = async (
  setConfig: SetConfigFunction,
  setIsFetching?: SetIsFetchingFunction
): Promise<void> => {
  try {
    if (setIsFetching) setIsFetching(true);
    const response = await api_aw.get(URL_BACK_GET_CONFIG);
    if (response.status === 200 && response.data) {
      setConfig(response.data);
    }
  } catch (error) {
    const appError = handleApiError(error);
    logError(appError, 'getConfig');
    setConfig({});
  } finally {
    if (setIsFetching) setIsFetching(false);
  }
};

/**
 * Bascule l'affichage de la bannière de streaming
 */
export const toggleStreamBar = async (
  token: string,
  setIsUpdating: SetIsUpdatingFunction,
  toast: ToastFunction
): Promise<void> => {
  try {
    setIsUpdating(true);
    const response = await api_aw_token(token).put(URL_BACK_TOGGLE_STREAM_BAR);
    if (response.status === 200 && response.data?.message) {
      toast.success(response.data.message);
    }
  } catch (error) {
    setIsUpdating(false);
    const appError = handleApiError(error);
    logError(appError, 'toggleStreamBar');
    toast.error(getErrorMessage(appError));
  } finally {
    setIsUpdating(false);
  }
};

/**
 * Bascule l'état d'inscription (activé/désactivé)
 */
export const toggleRegistration = async (
  token: string,
  setIsUpdating: SetIsUpdatingFunction,
  toast: ToastFunction
): Promise<void> => {
  try {
    setIsUpdating(true);
    const response = await api_aw_token(token).put(URL_BACK_TOGGLE_REGISTRATION);
    if (response.status === 200 && response.data?.message) {
      toast.success(response.data.message);
    }
  } catch (error) {
    setIsUpdating(false);
    const appError = handleApiError(error);
    logError(appError, 'toggleRegistration');
    toast.error(getErrorMessage(appError));
  } finally {
    setIsUpdating(false);
  }
};