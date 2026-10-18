import api_aw from "../api/api_aw";
import { URL_BACK_GET_ARCHETYPE_RANKING } from "../constant/urlsBack";
import { handleApiError, logError } from "../utils/errorHandler";

export interface ArchetypeRankingPlayer {
  userId: string;
  username: string | null;
  tournamentWins: number;
}

export interface ArchetypeRankingResponse {
  archetypeId: number;
  archetypeName: string;
  rankings: ArchetypeRankingPlayer[];
}

/**
 * Classement des joueurs pour un archétype (victoires de tournoi avec cet archétype).
 */
export const getArchetypeRanking = async (
  archetypeIdOrSlug: number | string
): Promise<ArchetypeRankingResponse> => {
  try {
    const response = await api_aw.get(
      URL_BACK_GET_ARCHETYPE_RANKING(archetypeIdOrSlug)
    );
    return response.data as ArchetypeRankingResponse;
  } catch (error) {
    const appError = handleApiError(error);
    logError(appError, "getArchetypeRanking");
    throw appError;
  }
};
