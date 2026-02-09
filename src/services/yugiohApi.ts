import axios, { AxiosInstance } from 'axios';
import { handleApiError, logError } from '../utils/errorHandler';

/**
 * Client Axios pour l'API YGOProDeck
 */
const yugiohApi: AxiosInstance = axios.create({
  baseURL: 'https://db.ygoprodeck.com/api/v7',
  timeout: 10000,
});

/**
 * Types pour les réponses de l'API YGOProDeck
 */
export interface YGOProDeckCard {
  id: number;
  name: string;
  type: string;
  desc: string;
  atk?: number;
  def?: number;
  level?: number;
  race?: string;
  attribute?: string;
  card_images: Array<{
    id: number;
    image_url: string;
    image_url_small: string;
    image_url_cropped: string;
  }>;
  [key: string]: unknown;
}

export interface YGOProDeckResponse {
  data: YGOProDeckCard[];
}

/**
 * Récupère des cartes par leurs IDs depuis l'API YGOProDeck
 */
export const getCardsByIds = async (
  cardIds: number[],
  language: string = 'fr'
): Promise<YGOProDeckCard[]> => {
  try {
    const idsString = cardIds.join(',');
    const response = await yugiohApi.get<YGOProDeckResponse>(
      `/cardinfo.php?id=${idsString}&language=${language}`
    );
    
    if (response.status === 200 && response.data?.data) {
      return response.data.data;
    }
    
    return [];
  } catch (error) {
    const appError = handleApiError(error);
    logError(appError, 'getCardsByIds');
    return [];
  }
};

/**
 * Recherche des cartes par nom depuis l'API YGOProDeck
 */
export const searchCardsByName = async (
  name: string,
  language: string = 'fr',
  num: number = 20,
  offset: number = 0
): Promise<YGOProDeckCard[]> => {
  try {
    const response = await yugiohApi.get<YGOProDeckResponse>(
      `/cardinfo.php?fname=${encodeURIComponent(name)}&language=${language}&num=${num}&offset=${offset}`
    );
    
    if (response.status === 200 && response.data?.data) {
      return response.data.data;
    }
    
    return [];
  } catch (error) {
    const appError = handleApiError(error);
    logError(appError, 'searchCardsByName');
    return [];
  }
};

/**
 * Récupère le nombre total de cartes correspondant à un nom
 */
export const getCardsCountByName = async (
  name: string,
  language: string = 'fr'
): Promise<number> => {
  try {
    const response = await yugiohApi.get<YGOProDeckResponse>(
      `/cardinfo.php?fname=${encodeURIComponent(name)}&language=${language}`
    );
    
    if (response.status === 200 && response.data?.data) {
      return response.data.data.length;
    }
    
    return 0;
  } catch (error) {
    const appError = handleApiError(error);
    logError(appError, 'getCardsCountByName');
    return 0;
  }
};
