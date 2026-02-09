import api_aw from "../api/api_aw";
import { URL_BACK_GET_ALL_ATTRIBUTES } from "../constant/urlsBack";
import type { SetStateCallback } from "../types";
import { handleApiError, logError } from "../utils/errorHandler";

interface Attribute {
  id: number;
  label: string;
  [key: string]: unknown;
}

/**
 * Récupère tous les attributs
 */
export const getAttributes = async (
  setAttributes: SetStateCallback<Attribute[]>
): Promise<void> => {
  try {
    const response = await api_aw.get(URL_BACK_GET_ALL_ATTRIBUTES);
    if (response.status === 200 && response.data) {
      setAttributes(response.data);
    }
  } catch (error) {
    const appError = handleApiError(error);
    logError(appError, 'getAttributes');
  }
};
