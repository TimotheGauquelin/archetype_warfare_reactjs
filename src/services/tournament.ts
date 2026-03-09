import api_aw from "../api/api_aw";
import { api_aw_token } from "../api/api_aw_token";
import {
  URL_BACK_GET_CURRENT_TOURNAMENTS,
  URL_BACK_GET_TOURNAMENT,
  URL_BACK_CREATE_TOURNAMENT,
  URL_BACK_UPDATE_TOURNAMENT,
  URL_BACK_DELETE_TOURNAMENT,
  URL_BACK_REGISTER_TOURNAMENT,
  URL_BACK_UNREGISTER_TOURNAMENT,
  URL_BACK_DROP_TOURNAMENT,
  URL_BACK_GET_MY_TOURNAMENTS,
  URL_BACK_GET_MY_TOURNAMENT_DETAIL,
  URL_BACK_REPORT_MATCH_RESULT,
  URL_BACK_GET_TOURNAMENT_STANDINGS,
  URL_BACK_SET_TOURNAMENT_MY_DECK,
  URL_BACK_GET_TOURNAMENT_PLAYER_DECK_SNAPSHOT,
  URL_BACK_ASSIGN_TOURNAMENT_PLAYER_DECK,
  URL_BACK_START_TOURNAMENT,
  URL_BACK_TOURNAMENT_NEXT_ROUND,
  URL_BACK_TOURNAMENT_ROLLBACK_ROUND,
  URL_BACK_TOURNAMENT_PLAYER_BAN,
  URL_BACK_REMOVE_TOURNAMENT_PLAYER,
  URL_BACK_ADD_TOURNAMENT_PLAYER,
  URL_BACK_TOGGLE_TOURNAMENT_REGISTRATION,
} from "../constant/urlsBack";
import type { Tournament } from "../types";
import { handleApiError, getErrorMessage, logError } from "../utils/errorHandler";
import { toast } from "react-toastify";

/**
 * Types spécifiques au détail de MON tournoi (/tournaments/:id/my-details)
 */
export interface MyTournamentPlayerUser {
  id: string;
  username?: string;
  email?: string;
  [key: string]: unknown;
}

export interface MyTournamentPlayer {
  id: number;
  tournament_id: string;
  user_id: string;
  match_wins: number;
  match_losses: number;
  match_draws: number;
  games_won: number;
  games_played: number;
  dropped: boolean;
  created_at: string;
  updated_at: string;
  user?: MyTournamentPlayerUser;
  deck_id?: string | null;
  penalties?: MyTournamentPlayerPenalty[];
  [key: string]: unknown;
}

export interface MyTournamentPlayerPenalty {
  id: number;
  penalty_type?: {
    id: number;
    code: string;
    label: string;
  };
  round?: number | null;
  tournament_match?: unknown | null;
  reason?: string | null;
  notes?: string | null;
  disqualification_with_prize?: unknown | null;
  applied_at?: string;
}

export interface MyTournamentMatch {
  id: number,
  round_id: number,
  status: "in_progress" | "completed" | "pending",
  player1: {
    id: number,
    username: string,
    isWinner: boolean,
    gamesWon: number
  },
  player2: {
    id: number,
    username: string,
    isWinner: boolean,
    gamesWon: number
  }
}

export interface MyTournamentRound {
  id: number,
  round_number: number,
  status: "in_progress" | "completed" | "pending"
  match: MyTournamentMatch
}

export interface MyTournamentDetail {
  id: string;
  name: string;
  status: "tournament_in_progress" | "tournament_finished" | "tournament_cancelled" | "registration_open" | "registration_closed";
  max_number_of_rounds: number;
  matches_per_round: number;
  current_round: number;
  event_date: string;
  event_date_end: string;
  location: string;
  max_players: number;
  is_online: boolean;
  tournament_player: MyTournamentPlayer;
  rounds: MyTournamentRound[];
  require_deck_list: boolean;
  allow_penalities: boolean;
}

export interface TournamentStanding {
  rank: number;
  tournament_player_id: number;
  user_id: string;
  username: string;
  deck?: TournamentPlayerDeckSnapshot | null;
  matches_breakdown: {
    wins: {
      count: number;
      total_points: number;
    };
    losses: {
      count: number;
      total_points: number;
    };
    draws: {
      count: number;
      total_points: number;
    };
    hasDropped: boolean;
    games_won: number;
    games_played: number;
  };
}

/** Match tel que renvoyé par GET /tournaments/:id (détail avec rondes). */
export interface TournamentDetailMatch {
  id: number;
  round_id: number;
  tournament_id: string;
  player1_tournament_player_id: number;
  player2_tournament_player_id: number | null;
  player1_games_won: number;
  player2_games_won: number;
  winner_tournament_player_id: number | null;
  status: "pending" | "in_progress" | "completed";
}

/** Ronde telle que renvoyée par GET /tournaments/:id. */
export interface TournamentDetailRound {
  id: number;
  tournament_id: string;
  round_number: number;
  status: "pending" | "in_progress" | "completed";
  matches: TournamentDetailMatch[];
}

export interface TournamentDetail {
  id: string;
  name: string;
  current_round: number;
  max_number_of_rounds: number;
  status: string;
  rounds: TournamentDetailRound[];
  max_players?: number;
  players?: TournamentPlayerAdmin[];
  matches_per_round: number;
  require_deck_list: boolean;
  allow_penalities: boolean;
  until_winner?: boolean;
}

export interface TournamentPlayerDeckSnapshot {
  id: number;
  tournament_player_id: number;
  label: string;
  archetype_id?: string | number | null;
  is_playable?: boolean;
  created_at?: string;
  cards?: Array<{
    id: number;
    tournament_player_deck_id: number;
    card_id: string;
    quantity: number;
    card?: {
      id: string;
      name: string;
      description?: string;
      img_url?: string;
      level?: number;
      atk?: number;
      def?: number;
      attribute?: string | null;
      card_type?: string | null;
      [key: string]: unknown;
    };
  }>;
  archetype?: {
    id: string | number;
    name: string;
    [key: string]: unknown;
  } | null;
  snapshot_by?: {
    username?: string;
    [key: string]: unknown;
  } | null;
  [key: string]: unknown;
}

/** Joueur du tournoi avec infos pour l’admin (liste joueurs, bannir, deck). */
export interface TournamentPlayerAdmin {
  id: number;
  tournament_id: string;
  user_id?: string;
  user?: { id?: string; username?: string; [key: string]: unknown };
  banned?: boolean;
  dropped?: boolean;
  /** ID du deck associé (si présent) */
  deck_id?: string | null;
  /** Snapshot du deck au moment de l’inscription (inclut cartes) */
  deck_snapshot?: TournamentPlayerDeckSnapshot | null;
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
    const response = await api_aw.get<Tournament[] | { data: Tournament[] }>(URL_BACK_GET_CURRENT_TOURNAMENTS);
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

export interface GetTournamentOptions {
  includePlayers?: boolean;
}

/**
 * Get a tournament by its id.
 * GET /tournaments/:id (sans query ou includePlayers=true) ou ?includePlayers=false
 */
export const getTournamentById = async (
  id: number | string,
  options?: GetTournamentOptions
): Promise<Tournament> => {
  try {
    const params =
      options?.includePlayers === false ? { includePlayers: "false" } : undefined;
    const response = await api_aw.get<Tournament>(URL_BACK_GET_TOURNAMENT(id), {
      params,
    });
    if (response?.data) return response.data;
    throw new Error("Réponse invalide");
  } catch (error) {
    const appError = handleApiError(error);
    logError(appError, "getTournamentById");
    throw appError;
  }
};

/**
 * Get tournament detail with rounds and matches (for admin manage page).
 * GET /tournaments/:id (sans query ou includePlayers=true) ou ?includePlayers=false.
 * Sans joueurs : rounds et matches toujours renvoyés.
 */
export const getTournamentDetail = async (
  id: number | string,
  options?: GetTournamentOptions
): Promise<TournamentDetail> => {
  try {
    const params =
      options?.includePlayers === false ? { includePlayers: "false" } : undefined;
    const response = await api_aw.get<TournamentDetail>(
      URL_BACK_GET_TOURNAMENT(id),
      { params }
    );
    if (response?.data) return response.data;
    throw new Error("Réponse invalide");
  } catch (error) {
    const appError = handleApiError(error);
    logError(appError, "getTournamentDetail");
    throw appError;
  }
};

/**
 * Get final standings for a tournament, ordered from best to worst.
 */
export const getTournamentStandings = async (
  id: number | string
): Promise<TournamentStanding[]> => {
  try {
    const response = await api_aw.get<TournamentStanding[]>(
      URL_BACK_GET_TOURNAMENT_STANDINGS(id)
    );
    return response?.data ?? [];
  } catch (error) {
    const appError = handleApiError(error);
    logError(appError, "getTournamentStandings");
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
  try {
    await api_aw_token(token).put(URL_BACK_REPORT_MATCH_RESULT(matchId), payload);
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

/**
 * Payload pour créer un tournoi. POST /tournaments.
 */
export interface CreateTournamentPayload {
  name: string;
  max_number_of_rounds: number;
  matches_per_round: number;
  max_players: number;
  location: string;
  event_date: string;
  event_date_end: string;
  is_online: boolean;
}

/**
 * Create a tournament. Requires a token (admin).
 * POST /tournaments.
 */
export const createTournament = async (
  payload: CreateTournamentPayload,
  token: string
): Promise<Tournament> => {
  const api = api_aw_token(token);
  try {
    const response = await api.post<Tournament>(URL_BACK_CREATE_TOURNAMENT, payload);
    if (response?.data) return response.data;
    throw new Error("Réponse invalide");
  } catch (error) {
    const appError = handleApiError(error);
    logError(appError, "createTournament");
    toast.error(getErrorMessage(appError));
    throw appError;
  }
};

/**
 * Payload pour mettre à jour un tournoi. PUT /tournaments/:id.
 */
export interface UpdateTournamentPayload {
  name: string;
  status: string;
  max_players: number;
  location: string;
  event_date: string;
  event_date_end: string;
  is_online: boolean;
  require_deck_list: boolean;
  until_winner: boolean;
  max_number_of_rounds: number;
  matches_per_round: number;
  allow_penalities: boolean;
}

/**
 * Update a tournament. Requires a token (admin).
 * PUT /tournaments/:id.
 */
export const updateTournament = async (
  id: number | string,
  payload: UpdateTournamentPayload,
  token: string
): Promise<Tournament> => {
  const api = api_aw_token(token);
  try {
    const response = await api.put<Tournament>(URL_BACK_UPDATE_TOURNAMENT(id), payload);
    if (response?.data) {
      return response.data;
    }
    throw new Error("Réponse invalide");
  } catch (error) {
    const appError = handleApiError(error);
    logError(appError, "updateTournament");
    toast.error(getErrorMessage(appError));
    throw appError;
  }
};

export const toggleTournamentRegistration = async (
  id: number | string,
  token: string
): Promise<void> => {
  const api = api_aw_token(token);
  try {
    const response = await api.put(URL_BACK_TOGGLE_TOURNAMENT_REGISTRATION(id));
    if (response?.data) {
      toast.success(response.data.message);
    }
  }
  catch (error) {
    const appError = handleApiError(error);
    logError(appError, "toggleTournamentRegistration");
    toast.error(getErrorMessage(appError));
    throw appError;
  }
};

/**
 * Delete a tournament. Admin only. DELETE /tournaments/:id
 */
export const deleteTournament = async (
  id: number | string,
  token: string
): Promise<void> => {
  const api = api_aw_token(token);
  try {
    await api.delete(URL_BACK_DELETE_TOURNAMENT(id));
    toast.success("Tournoi supprimé.");
  } catch (error) {
    const appError = handleApiError(error);
    logError(appError, "deleteTournament");
    toast.error(getErrorMessage(appError));
    throw appError;
  }
};

/**
 * Drop from a tournament. Requires a token.
 * POST /tournaments/:id/drop. Backend applique les règles (avant/pendant tournoi).
 */
export const dropFromTournament = async (
  id: number | string,
  token: string
): Promise<void> => {
  const api = api_aw_token(token);
  try {
    await api.post(URL_BACK_DROP_TOURNAMENT(id));
    toast.success("Vous avez quitté le tournoi.");
  } catch (error) {
    const appError = handleApiError(error);
    logError(appError, "dropFromTournament");
    toast.error(getErrorMessage(appError));
    throw appError;
  }
};

/**
 * Rollback the current round of a tournament. Admin only.
 * PUT /tournaments/:id/rounds/rollback
 */
export const rollbackTournamentRound = async (
  id: number | string,
  token: string
): Promise<void> => {
  const api = api_aw_token(token);
  try {
    const response = await api.put(URL_BACK_TOURNAMENT_ROLLBACK_ROUND(id));
    if (response?.data?.message) {
      toast.success(response.data.message);
    } else {
      toast.success("Ronde annulée.");
    }
  } catch (error) {
    const appError = handleApiError(error);
    logError(appError, "rollbackTournamentRound");
    toast.error(getErrorMessage(appError));
    throw appError;
  }
};

/**
 * Définit le deck du joueur pour ce tournoi (inscription au deck).
 * PUT /tournaments/:id/my-deck avec body { deckId: string } (UUID).
 */
export const setTournamentMyDeck = async (
  tournamentId: number | string,
  deckId: string,
  token: string
): Promise<void> => {
  const api = api_aw_token(token);
  try {
    await api.put(URL_BACK_SET_TOURNAMENT_MY_DECK(tournamentId), { deckId });
    toast.success("Deck enregistré pour le tournoi.");
  } catch (error) {
    const appError = handleApiError(error);
    logError(appError, "setTournamentMyDeck");
    toast.error(getErrorMessage(appError));
    throw appError;
  }
};

/**
 * Récupère le snapshot du deck d'un joueur de tournoi.
 * GET /tournaments/players/:playerId/deck-snapshot
 */
export const getTournamentPlayerDeckSnapshot = async (
  playerId: number | string,
  token: string
): Promise<TournamentPlayerDeckSnapshot | null> => {
  const api = api_aw_token(token);
  try {
    const response = await api.get<TournamentPlayerDeckSnapshot | null>(
      URL_BACK_GET_TOURNAMENT_PLAYER_DECK_SNAPSHOT(playerId)
    );
    return response?.data ?? null;
  } catch (error) {
    const appError = handleApiError(error);
    logError(appError, "getTournamentPlayerDeckSnapshot");
    throw appError;
  }
};

/**
 * Assigne un deck jouable à un joueur du tournoi (Admin).
 * PUT /tournaments/:tournamentId/players/:playerId/deck avec body { deckId: string } (UUID).
 */
export const assignTournamentPlayerDeck = async (
  tournamentId: number | string,
  playerId: number | string,
  deckId: string,
  token: string
): Promise<{ tournamentPlayer: TournamentPlayerAdmin } | null> => {
  const api = api_aw_token(token);
  try {
    const response = await api.put<{
      message?: string;
      tournamentPlayer: TournamentPlayerAdmin;
    }>(URL_BACK_ASSIGN_TOURNAMENT_PLAYER_DECK(tournamentId, playerId), {
      deckId,
    });
    if (response?.status === 200 && response.data) {
      toast.success(response.data.message ?? "Deck assigné au joueur");
      return response.data;
    }
    return null;
  } catch (error) {
    const appError = handleApiError(error);
    logError(appError, "assignTournamentPlayerDeck");
    toast.error(getErrorMessage(appError));
    throw appError;
  }
};

/**
 * Start a tournament. Sets status to tournament_beginning. Admin only.
 * PUT /tournaments/:id/start
 */
export const startTournament = async (
  id: number | string,
  token: string
): Promise<void> => {
  const api = api_aw_token(token);
  try {
    await api.put(URL_BACK_START_TOURNAMENT(id));
    toast.success("Tournoi démarré.");
  } catch (error) {
    const appError = handleApiError(error);
    logError(appError, "startTournament");
    toast.error(getErrorMessage(appError));
    throw appError;
  }
};

/**
 * Advance to next round. Backend checks that all matches of current round are completed. Admin only.
 * POST /tournaments/:id/rounds/next
 */
export const tournamentNextRound = async (
  id: number | string,
  token: string
): Promise<void> => {
  const api = api_aw_token(token);
  try {
    await api.put(URL_BACK_TOURNAMENT_NEXT_ROUND(id));
    toast.success("Passage à la ronde suivante");
  } catch (error) {
    const appError = handleApiError(error);
    logError(appError, "tournamentNextRound");
    toast.error(getErrorMessage(appError));
    throw appError;
  }
};

/**
 * Set a tournament player as banned or not. Admin only.
 * PUT /tournaments/:id/players/:tournamentPlayerId/ban with body { banned: boolean }
 */
export const setTournamentPlayerBanned = async (
  tournamentId: number | string,
  tournamentPlayerId: number | string,
  banned: boolean,
  token: string
): Promise<void> => {
  const api = api_aw_token(token);
  try {
    await api.put(URL_BACK_TOURNAMENT_PLAYER_BAN(tournamentId, tournamentPlayerId), {
      banned,
    });
    toast.success(banned ? "Joueur banni du tournoi." : "Joueur réintégré.");
  } catch (error) {
    const appError = handleApiError(error);
    logError(appError, "setTournamentPlayerBanned");
    toast.error(getErrorMessage(appError));
    throw appError;
  }
};

/**
 * Remove a player from the tournament (admin only).
 * DELETE /tournaments/:id/players/:tournamentPlayerId/remove
 */
export const removePlayerFromTournament = async (
  tournamentId: number | string,
  tournamentPlayerId: number | string,
  token: string
): Promise<void> => {
  const api = api_aw_token(token);
  try {
    const response = await api.delete(URL_BACK_REMOVE_TOURNAMENT_PLAYER(tournamentId, tournamentPlayerId));
    toast.success(response.data.message);
  } catch (error) {
    const appError = handleApiError(error);
    logError(appError, "removePlayerFromTournament");
    toast.error(getErrorMessage(appError));
    throw appError;
  }
};

/**
 * Add a user to a tournament (admin only). POST /tournaments/:id/players/:userId
 */
export const addPlayerToTournament = async (
  tournamentId: number | string,
  userId: number | string,
  token: string
): Promise<void> => {
  const api = api_aw_token(token);
  try {
    await api.post(URL_BACK_ADD_TOURNAMENT_PLAYER(tournamentId, userId));
    toast.success("Joueur ajouté au tournoi.");
  } catch (error) {
    const appError = handleApiError(error);
    logError(appError, "addPlayerToTournament");
    toast.error(getErrorMessage(appError));
    throw appError;
  }
};
