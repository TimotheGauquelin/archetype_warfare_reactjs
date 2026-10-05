import api_aw from "../api/api_aw";
import type { Card, Pagination, SetStateCallback } from "../types";
import { handleApiError, logError } from "../utils/errorHandler";

/**
 * Recherche de cartes avec critères et pagination
 */
export const searchCards = async (
  setCards: SetStateCallback<Card[]>,
  setPagination: SetStateCallback<Pagination>,
  size: number = 30,
  page: number = 1,
  name?: string,
  card_type?: string,
  level?: number,
  min_atk?: number,
  max_atk?: number,
  min_def?: number,
  max_def?: number,
  attribute?: string,
  signal?: AbortSignal | null
): Promise<void> => {
  const params = new URLSearchParams();

  if (size) params.append("size", size.toString());
  if (page) params.append("page", page.toString());
  if (name) params.append("name", name);
  if (card_type) params.append("card_type", card_type);
  if (level !== undefined) params.append("level", level.toString());
  if (min_atk !== undefined) params.append("min_atk", min_atk.toString());
  if (max_atk !== undefined) params.append("max_atk", max_atk.toString());
  if (min_def !== undefined) params.append("min_def", min_def.toString());
  if (max_def !== undefined) params.append("max_def", max_def.toString());
  if (attribute) params.append("attribute", attribute);

  const config = signal ? { signal } : {};

  try {
    const response = await api_aw.get(`/cards/search?${params.toString()}`, config);
    if (response.status === 200 && response.data) {
      setCards(response.data.data || []);
      setPagination(response.data.pagination || {
        total: 0,
        totalPages: 0,
        currentPage: page,
        pageSize: size,
      });
    }
  } catch (error) {
    const appError = handleApiError(error);
    // Ne pas logger les erreurs d'annulation
    if (appError.code !== 'CANCELED') {
      logError(appError, 'searchCards');
      setCards([]);
      setPagination({
        total: 0,
        totalPages: 0,
        currentPage: page,
        pageSize: size,
      });
    }
  }
};

/**
 * Recherche de cartes sans archétype ou par ID d'archétype
 */
export const searchCardsWithoutArchetypeAndByOneArchetypeId = async (
  archetypeId: number | string,
  setCards: SetStateCallback<Card[]>,
  setPagination: SetStateCallback<Pagination>,
  size: number = 30,
  page: number = 1,
  name?: string,
  card_type?: string,
  level?: number,
  min_atk?: number,
  max_atk?: number,
  min_def?: number,
  max_def?: number,
  attribute?: string,
  signal?: AbortSignal | null
): Promise<void> => {
  const params = new URLSearchParams();
  if (size) params.append("size", size.toString());
  if (page) params.append("page", page.toString());
  if (name) params.append("name", name);
  if (card_type) params.append("card_type", card_type);
  if (level !== undefined) params.append("level", level.toString());
  if (min_atk !== undefined) params.append("min_atk", min_atk.toString());
  if (max_atk !== undefined) params.append("max_atk", max_atk.toString());
  if (min_def !== undefined) params.append("min_def", min_def.toString());
  if (max_def !== undefined) params.append("max_def", max_def.toString());
  if (attribute) params.append("attribute", attribute);

  const config = signal ? { signal } : {};

  try {
    const response = await api_aw.get(
      `/cards/searchByArchetype/${archetypeId}?${params.toString()}`,
      config
    );
    if (response.status === 200 && response.data) {
      setCards(response.data.data || []);
      setPagination(response.data.pagination || {
        total: 0,
        totalPages: 0,
        currentPage: page,
        pageSize: size,
      });
    }
  } catch (error) {
    const appError = handleApiError(error);
    // Ne pas logger les erreurs d'annulation
    if (appError.code !== 'CANCELED') {
      logError(appError, 'searchCardsWithoutArchetypeAndByOneArchetypeId');
      setCards([]);
      setPagination({
        total: 0,
        totalPages: 0,
        currentPage: page,
        pageSize: size,
      });
    }
  }
};

export interface CardArchetypeLink {
  id: number;
  name: string;
  slug: string;
}

/** Réponse API pour une carte détail (id en string, attribute/card_type en string) */
export interface CardDetailResponse {
  id: string;
  name: string;
  description?: string;
  img_url?: string;
  level?: number;
  atk?: number;
  def?: number;
  attribute?: string;
  card_type?: string;
  archetypes?: CardArchetypeLink[];
  is_generic?: boolean;
}

export const getCardById = async (
  cardId: string,
  locale?: "fr" | "en"
): Promise<CardDetailResponse> => {
  const suffix = locale ? `?locale=${locale}` : "";
  const response = await api_aw.get<CardDetailResponse>(`/cards/${cardId}${suffix}`);
  if (response.status !== 200 || !response.data) {
    throw new Error("Carte introuvable");
  }
  return response.data;
};

export type CardUpdatePayload = {
  name?: string;
  description?: string | null;
  img_url?: string | null;
  level?: number | null;
  atk?: number | null;
  def?: number | null;
  attribute?: string | null;
  card_type?: string | null;
  locale?: string;
};

export const updateCardById = async (
  cardId: string,
  payload: CardUpdatePayload
): Promise<CardDetailResponse> => {
  const response = await api_aw.put<CardDetailResponse>(`/cards/${cardId}`, payload);
  if (response.status !== 200 || !response.data) {
    throw new Error("Impossible de mettre à jour la carte");
  }
  return response.data;
};
