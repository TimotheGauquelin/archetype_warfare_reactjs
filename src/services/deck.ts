import { api_aw_token } from "../api/api_aw_token";
import { URL_BACK_CREATE_DECK, URL_BACK_DELETE_MY_DECK, URL_BACK_GET_ALL_MY_DECKS, URL_BACK_GET_DECK_BY_ID, URL_BACK_UPDATE_DECK } from "../constant/urlsBack";
import { URL_FRONT_MY_DECKS } from "../constant/urlsFront";
import type { Deck, SetStateCallback } from "../types";
import { handleApiError, getErrorMessage, logError } from "../utils/errorHandler";
import type { NavigateFunction } from "react-router-dom";
import type { ToastFunction } from "./websiteactions";

/**
 * Récupère tous les decks d'un utilisateur
 */
export const getMyDecks = async (
  token: string,
  id: number | string,
  setMyDecks: SetStateCallback<Deck[]>,
  setIsFetching: SetStateCallback<boolean>,
  setError?: SetStateCallback<string | null>
): Promise<void> => {
  try {
    setError?.(null);
    setIsFetching(true);
    const response = await api_aw_token(token).get(URL_BACK_GET_ALL_MY_DECKS(id));
    if (response.status === 200 && response.data) {
      setMyDecks(response.data);
      setIsFetching(false);
    }
  } catch (error) {
    setIsFetching(false);
    const appError = handleApiError(error);
    logError(appError, 'getMyDecks');
    setError?.(getErrorMessage(appError));
  }
};

/**
 * Récupère un deck par son ID
 */
export const getDeckById = async (
  token: string,
  deckId: number | string,
  setDeck: SetStateCallback<Deck>,
  setIsFetching: SetStateCallback<boolean>,
  toast: ToastFunction,
  navigate: NavigateFunction
): Promise<void> => {
  try {
    setIsFetching(true);
    const response = await api_aw_token(token).get(URL_BACK_GET_DECK_BY_ID(deckId));
    if (response.status === 200 && response.data) {
      setDeck(response.data);
      setIsFetching(false);
    }
  } catch (error) {
    setIsFetching(false);
    const appError = handleApiError(error);
    logError(appError, 'getDeckById');
    toast.error("Impossible de récupérer le deck");
    navigate(URL_FRONT_MY_DECKS);
  }
};

/**
 * Crée un nouveau deck
 */
export const createDeck = async (
  token: string,
  myDeck: Partial<Deck>,
  toast: ToastFunction,
  navigate: NavigateFunction,
  setIsLoading: SetStateCallback<boolean>
): Promise<void> => {
  try {
    setIsLoading(true);
    const response = await api_aw_token(token).post(URL_BACK_CREATE_DECK, myDeck);
    if (response.status === 201) {
      setIsLoading(false);
      navigate(URL_FRONT_MY_DECKS);
      toast.success("Deck créé avec succès");
    }
  } catch (error) {
    setIsLoading(false);
    const appError = handleApiError(error);
    logError(appError, 'createDeck');
    toast.error(getErrorMessage(appError));
  }
};

// PUT

/**
 * Met à jour un deck
 */
export const updateDeck = async (
  token: string,
  deckId: number | string,
  myDeck: Partial<Deck>,
  toast: ToastFunction,
  navigate: NavigateFunction,
  setIsLoading: SetStateCallback<boolean>
): Promise<void> => {
  try {
    setIsLoading(true);
    const response = await api_aw_token(token).put(URL_BACK_UPDATE_DECK(deckId), myDeck);
    if (response.status === 200) {
      setIsLoading(false);
      toast.success("Deck modifié avec succès");
      navigate(URL_FRONT_MY_DECKS);
    }
  } catch (error) {
    setIsLoading(false);
    const appError = handleApiError(error);
    logError(appError, 'updateDeck');
    toast.error(getErrorMessage(appError));
  }
};

// DELETE

/**
 * Supprime un deck
 */
export const deleteMyDeck = async (
  token: string,
  deckId: number | string,
  setIsLoading: SetStateCallback<boolean>,
  navigate: NavigateFunction,
  toast: ToastFunction
): Promise<void> => {
  try {
    setIsLoading(true);
    const response = await api_aw_token(token).delete(URL_BACK_DELETE_MY_DECK(deckId));
    if (response.status === 200) {
      setIsLoading(false);
      navigate(URL_FRONT_MY_DECKS);
      toast.success("Deck supprimé avec succès");
    }
  } catch (error) {
    setIsLoading(false);
    const appError = handleApiError(error);
    logError(appError, 'deleteMyDeck');
    toast.error(getErrorMessage(appError));
  }
};
