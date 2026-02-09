import api_aw from "../api/api_aw";
import { URL_BACK_GET_ALL_SUMMON_MECHANICS } from "../constant/urlsBack";
import type { SetStateCallback } from "../types";
import { handleApiError, logError } from "../utils/errorHandler";

interface SummonMechanic {
  id: number;
  label: string;
  [key: string]: unknown;
}

/**
 * Récupère toutes les mécaniques d'invocation
 */
export const getSummonMechanics = async (
  setSummonMechanics: SetStateCallback<SummonMechanic[]>
): Promise<void> => {
  try {
    const response = await api_aw.get(URL_BACK_GET_ALL_SUMMON_MECHANICS);
    if (response.status === 200 && response.data) {
      setSummonMechanics(response.data);
    }
  } catch (error) {
    const appError = handleApiError(error);
    logError(appError, 'getSummonMechanics');
  }
};
