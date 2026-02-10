import api_aw from "../api/api_aw";
import { api_aw_token } from "../api/api_aw_token";
import {
  URL_BACK_GET_TOURNAMENTS,
  URL_BACK_GET_TOURNAMENT,
  URL_BACK_REGISTER_TOURNAMENT,
  URL_BACK_UNREGISTER_TOURNAMENT,
} from "../constant/urlsBack";
import type { Tournament } from "../types";
import { handleApiError, getErrorMessage, logError } from "../utils/errorHandler";
import { toast } from "react-toastify";

/**
 * Get all tournaments (all statuses). No client-side filter.
 */
export const getTournaments = async (): Promise<Tournament[]> => {
  try {
    const response = await api_aw.get<Tournament[] | { data: Tournament[] }>(URL_BACK_GET_TOURNAMENTS);
    const data = response?.data;
    const list = Array.isArray(data) ? data : (data as { data?: Tournament[] })?.data ?? [];
    return list;
  } catch (error) {
    const appError = handleApiError(error);
    logError(appError, "getTournaments");
    throw appError;
  }
};

/**
 * Get a tournament by its id.
 */
export const getTournamentById = async (id: number | string): Promise<Tournament> => {
  try {
    const response = await api_aw.get<Tournament>(URL_BACK_GET_TOURNAMENT(id));
    if (response?.data) return response.data;
    throw new Error("Réponse invalide");
  } catch (error) {
    const appError = handleApiError(error);
    logError(appError, "getTournamentById");
    throw appError;
  }
};

/**
 * Register to a tournament. Requires a token (use api_aw_token).
 * On 400, throws AppError with API message (use getErrorMessage in UI).
 */
export const registerToTournament = async (
  id: number | string,
  token: string
): Promise<void> => {
  const api = api_aw_token(token);
  try {
    await api.post(URL_BACK_REGISTER_TOURNAMENT(id));
    toast.success("Inscription enregistrée.");
  } catch (error) {
    const appError = handleApiError(error);
    logError(appError, "registerToTournament");
    toast.error(getErrorMessage(appError));
    throw appError;
  }
};

/**
 * Unregister from a tournament. Requires a token.
 * DELETE /tournaments/:id/register. On 400, throws AppError with API message.
 */
export const unregisterFromTournament = async (
  id: number | string,
  token: string
): Promise<void> => {
  const api = api_aw_token(token);
  try {
    await api.delete(URL_BACK_UNREGISTER_TOURNAMENT(id));
    toast.success("Désinscription enregistrée.");
  } catch (error) {
    const appError = handleApiError(error);
    logError(appError, "unregisterFromTournament");
    toast.error(getErrorMessage(appError));
    throw appError;
  }
}
