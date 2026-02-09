import api_aw from "../api/api_aw";
import { URL_BACK_GET_ALL_TYPES } from "../constant/urlsBack";
import type { SetStateCallback } from "../types";
import { handleApiError, logError } from "../utils/errorHandler";

interface Type {
  id: number;
  label: string;
  [key: string]: unknown;
}

/**
 * Récupère tous les types
 */
export const getTypes = async (
  setTypes: SetStateCallback<Type[]>
): Promise<void> => {
  try {
    const response = await api_aw.get(URL_BACK_GET_ALL_TYPES);
    if (response.status === 200 && response.data) {
      setTypes(response.data);
    }
  } catch (error) {
    const appError = handleApiError(error);
    logError(appError, 'getTypes');
  }
};
