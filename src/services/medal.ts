import api_aw from "../api/api_aw";
import {
  URL_BACK_MEDALS_ME,
  URL_BACK_MEDALS_ME_SYNC,
  URL_BACK_MEDALS_USER,
} from "../constant/urlsBack";
import { handleApiError, logError } from "../utils/errorHandler";

export type UserMedalView = {
  medalId: number;
  code: string;
  category: string;
  title: string;
  description: string;
  iconUrl: string | null;
  isContextual: boolean;
  threshold: number | null;
  contextId: string | null;
  contextLabel: string | null;
  earnedAt: string | null;
};

export type MyMedalsResponse = {
  earned: UserMedalView[];
  locked: UserMedalView[];
};

export const getMyMedals = async (): Promise<MyMedalsResponse> => {
  try {
    const response = await api_aw.get(URL_BACK_MEDALS_ME);
    return {
      earned: response.data?.earned ?? [],
      locked: response.data?.locked ?? [],
    };
  } catch (error) {
    logError(handleApiError(error), "getMyMedals");
    return { earned: [], locked: [] };
  }
};

export const syncMyMedals = async (): Promise<MyMedalsResponse> => {
  try {
    const response = await api_aw.post(URL_BACK_MEDALS_ME_SYNC);
    return {
      earned: response.data?.earned ?? [],
      locked: response.data?.locked ?? [],
    };
  } catch (error) {
    logError(handleApiError(error), "syncMyMedals");
    return { earned: [], locked: [] };
  }
};

/** Médailles obtenues d'un joueur (profil public). */
export const getUserMedals = async (
  userId: number | string
): Promise<MyMedalsResponse> => {
  try {
    const response = await api_aw.get(URL_BACK_MEDALS_USER(userId));
    return {
      earned: response.data?.earned ?? [],
      locked: [],
    };
  } catch (error) {
    logError(handleApiError(error), "getUserMedals");
    return { earned: [], locked: [] };
  }
};
