import api_aw from "../api/api_aw";
import { URL_BACK_GET_ALL_ERAS } from "../constant/urlsBack";
import type { SetStateCallback } from "../types";
import { handleApiError, logError } from "../utils/errorHandler";

interface Era {
  id: number;
  label: string;
  [key: string]: unknown;
}

/**
 * Récupère toutes les ères
 */
export const getEras = async (
  setEras: SetStateCallback<Era[]>
): Promise<void> => {
  try {
    const response = await api_aw.get(URL_BACK_GET_ALL_ERAS);
    if (response.status === 200 && response.data) {
      setEras(response.data);
    }
  } catch (error) {
    const appError = handleApiError(error);
    logError(appError, 'getEras');
  }
};
