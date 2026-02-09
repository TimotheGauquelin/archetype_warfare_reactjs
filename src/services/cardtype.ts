import api_aw from "../api/api_aw";
import { URL_BACK_GET_ALL_CARD_TYPES } from "../constant/urlsBack";
import type { SetStateCallback } from "../types";
import { handleApiError, logError } from "../utils/errorHandler";

interface CardType {
  id: number;
  label: string;
  [key: string]: unknown;
}

/**
 * Récupère tous les types de cartes
 */
export const getCardTypes = async (
  setAllCardTypes: SetStateCallback<CardType[]>
): Promise<void> => {
  try {
    const response = await api_aw.get(URL_BACK_GET_ALL_CARD_TYPES);
    if (response.status === 200 && response.data?.data) {
      setAllCardTypes(response.data.data);
    }
  } catch (error) {
    const appError = handleApiError(error);
    logError(appError, 'getCardTypes');
  }
};
