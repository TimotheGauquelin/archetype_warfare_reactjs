import api_aw from "../api/api_aw";
import { api_aw_token } from "../api/api_aw_token";
import {
  URL_BACK_GET_TOURNAMENTS,
  URL_BACK_GET_TOURNAMENT,
  URL_BACK_REGISTER_TOURNAMENT,
  URL_BACK_UNREGISTER_TOURNAMENT,
  URL_BACK_GET_MY_TOURNAMENTS,
  URL_BACK_GET_MY_TOURNAMENT_DETAIL,
  URL_BACK_REPORT_MATCH_RESULT,
} from "../constant/urlsBack";
import type { Tournament } from "../types";
import { handleApiError, getErrorMessage, logError } from "../utils/errorHandler";
import { toast } from "react-toastify";

/**
 * Types spécifiques au détail de MON tournoi (/tournaments/:id/my-details)
 */
export interface MyTournamentPlayerUser {
  id: string | number;
  username?: string;
  email?: string;
  [key: string]: unknown;
}

export interface MyTournamentPlayer {
  id: number;
  tournament_id: number;
  user_id: string | number;
  match_wins: number;
  match_losses: number;
  match_draws: number;
  games_won: number;
  games_played: number;
  dropped: boolean;
  created_at: string;
  updated_at: string;
  user?: MyTournamentPlayerUser;
  [key: string]: unknown;
}

export interface MyTournamentMatch {
  id: number;
  round_id: number;
  tournament_id: number;
  player1_tournament_player_id: number;
  player2_tournament_player_id: number;
  player1_games_won: number;
  player2_games_won: number;
  winner_tournament_player_id: number | null;
  status: string;
  created_at: string;
  updated_at: string;
  player1?: MyTournamentPlayer;
  player2?: MyTournamentPlayer;
  winner?: MyTournamentPlayer | null;
  [key: string]: unknown;
}

export interface MyTournamentRound {
  id: number;
  tournament_id: number;
  round_number: number;
  status: string;
  created_at: string;
  updated_at: string;
  matches: MyTournamentMatch[];
  [key: string]: unknown;
}

export interface MyTournamentDetail {
  id: number;
  name: string;
  number_of_rounds: number;
  matches_per_round: number;
  status: string;
  current_round: number | null;
  max_players: number;
  location: string;
  event_date: string;
  event_date_end?: string | null;
  is_online: boolean;
  created_at: string;
  updated_at: string;
  rounds: MyTournamentRound[];
  [key: string]: unknown;
}

export interface MatchResultPayload {
  player1_games_won: number;
  player2_games_won: number;
}

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
 * Get all tournaments for the current user.
 * Requires an authenticated token (use api_aw_token).
 */
export const getMyTournaments = async (token: string): Promise<Tournament[]> => {
  const api = api_aw_token(token);
  try {
    const response = await api.get<Tournament[] | { data: Tournament[] }>(URL_BACK_GET_MY_TOURNAMENTS);
    const data = response?.data;
    const list = Array.isArray(data) ? data : (data as { data?: Tournament[] })?.data ?? [];
    return list;
  } catch (error) {
    const appError = handleApiError(error);
    logError(appError, "getMyTournaments");
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
 * Get my personal details for a tournament (includes rounds & matches with players).
 */
export const getMyTournamentDetail = async (
  id: number | string,
  token: string
): Promise<MyTournamentDetail> => {
  const api = api_aw_token(token);
  try {
    const response = await api.get<MyTournamentDetail>(URL_BACK_GET_MY_TOURNAMENT_DETAIL(id));
    if (response?.data) return response.data;
    throw new Error("Réponse invalide");
  } catch (error) {
    const appError = handleApiError(error);
    logError(appError, "getMyTournamentDetail");
    throw appError;
  }
};

/**
 * Report the result of a match in a tournament.
 */
export const reportMatchResult = async (
  matchId: number | string,
  payload: MatchResultPayload,
  token: string
): Promise<void> => {
  console.log(token);
  const api = api_aw_token(token);
  console.log(payload);
  try {
    await api.put(URL_BACK_REPORT_MATCH_RESULT(matchId), payload);
    toast.success("Résultat du match enregistré.");
  } catch (error) {
    const appError = handleApiError(error);
    logError(appError, "reportMatchResult");
    toast.error(getErrorMessage(appError));
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
 * POST /tournaments/:id/unregister. On 400, throws AppError with API message.
 */
export const unregisterFromTournament = async (
  id: number | string,
  token: string
): Promise<void> => {
  const api = api_aw_token(token);
  try {
    await api.post(URL_BACK_UNREGISTER_TOURNAMENT(id));
    toast.success("Désinscription enregistrée.");
  } catch (error) {
    const appError = handleApiError(error);
    logError(appError, "unregisterFromTournament");
    toast.error(getErrorMessage(appError));
    throw appError;
  }
};
