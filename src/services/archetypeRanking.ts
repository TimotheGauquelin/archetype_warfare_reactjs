import api_aw from "../api/api_aw";
import {
  URL_BACK_GET_ARCHETYPE_RANKING,
  URL_BACK_GET_MY_ARCHETYPE_RANKINGS,
} from "../constant/urlsBack";
import { handleApiError, logError } from "../utils/errorHandler";

export interface ArchetypeRankingPlayer {
  userId: string;
  username: string | null;
  country: string | null;
  /** Points cumulés (1er=10, 2e=5, 3e=3, reste=1) sur tournois officiels. */
  points: number;
}

export interface ArchetypeRankingResponse {
  archetypeId: number;
  archetypeName: string;
  rankings: ArchetypeRankingPlayer[];
}

export interface MyArchetypeRankingEntry {
  archetypeId: number;
  archetypeName: string;
  slug: string | null;
  points: number;
  rank: number;
  playersCount: number;
}

export interface MyArchetypeRankingsResponse {
  totalPoints: number;
  archetypes: MyArchetypeRankingEntry[];
}

/**
 * Classement des joueurs pour un archétype (points sur tournois officiels).
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

/**
 * Points maîtres de l'utilisateur connecté, par archétype.
 */
export const getMyArchetypeRankings =
  async (): Promise<MyArchetypeRankingsResponse> => {
    try {
      const response = await api_aw.get(URL_BACK_GET_MY_ARCHETYPE_RANKINGS);
      return response.data as MyArchetypeRankingsResponse;
    } catch (error) {
      const appError = handleApiError(error);
      logError(appError, "getMyArchetypeRankings");
      throw appError;
    }
  };
