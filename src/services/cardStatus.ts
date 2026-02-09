import api_aw from "../api/api_aw";
import { URL_BACK_GET_ALL_CARD_STATUS } from "../constant/urlsBack";
import type { SetStateCallback } from "../types";
import { handleApiError, logError } from "../utils/errorHandler";

interface CardStatus {
  id: number;
  label: string;
  limit?: number;
  [key: string]: unknown;
}

/**
 * Récupère tous les statuts de cartes
 */
export const getCardStatus = async (
  setAllCardStatus: SetStateCallback<CardStatus[]>
): Promise<void> => {
  try {
    const response = await api_aw.get(URL_BACK_GET_ALL_CARD_STATUS);
    if (response.status === 200 && response.data) {
      setAllCardStatus(response.data);
    }
  } catch (error) {
    const appError = handleApiError(error);
    logError(appError, 'getCardStatus');
  }
};
