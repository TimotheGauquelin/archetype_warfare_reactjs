import api_aw from "../api/api_aw";
import {
  URL_BACK_QUIZ_ADMIN_QUESTION,
  URL_BACK_QUIZ_ADMIN_QUESTIONS,
  URL_BACK_QUIZ_ADMIN_SEASON,
  URL_BACK_QUIZ_ADMIN_SEASON_AUTO_SCHEDULE,
  URL_BACK_QUIZ_ADMIN_SEASON_PODIUM,
  URL_BACK_QUIZ_ADMIN_SEASONS,
  URL_BACK_QUIZ_ATTEMPT,
  URL_BACK_QUIZ_FINISH,
  URL_BACK_QUIZ_HUB,
  URL_BACK_QUIZ_SEASON_RANKING,
  URL_BACK_QUIZ_MY_STATS,
  URL_BACK_QUIZ_START_DAILY,
  URL_BACK_QUIZ_START_FREE,
  URL_BACK_QUIZ_SUBMIT_ANSWER,
  URL_BACK_QUIZ_SWITCH_ALL_TO_INACTIVE,
  URL_BACK_QUIZ_SWITCH_ALL_TO_NON_DAILY,
  URL_BACK_QUIZ_THEMES,
} from "../constant/urlsBack";
import type { SetStateCallback } from "../types";
import { handleApiError, logError } from "../utils/errorHandler";

export type QuizTheme = {
  id: number;
  slug: string;
  label: string;
  description: string | null;
  questionCount?: number;
};

export type QuizDifficulty = "easy" | "medium" | "hard";

export type QuizMcqChoice = {
  text: string;
  cardId?: string | null;
  name?: string | null;
  artworkUrl?: string | null;
};

export type QuizOrderItem = {
  id: string;
  label: string;
  imageUrl?: string | null;
};

export type QuizNameTheCardsAnswer = {
  cardId: string;
  label: string;
  name?: string | null;
  artworkUrl?: string | null;
};

export type QuizSummonerProposition = {
  id?: string;
  cardId: string;
  label: string;
  name?: string | null;
  artworkUrl?: string | null;
  isMaterial?: boolean;
};

export type QuizPublicQuestion = {
  id: number;
  type:
    | "mcq"
    | "true_false"
    | "order"
    | "name_the_cards"
    | "summoner"
    | "zoom"
    | "hint_ladder"
    | string;
  prompt: string;
  points: number;
  difficulty?: QuizDifficulty;
  imageUrl?: string | null;
  hint?: string | null;
  explanation?: string | null;
  theme?: { id: number; slug: string; label: string } | null;
  payload: {
    choices?: Array<string | QuizMcqChoice>;
    correctIndex?: number;
    correct?: boolean;
    items?: QuizOrderItem[];
    correctOrder?: string[];
    monsterCount?: number;
    materialCount?: number;
    propositions?: QuizSummonerProposition[];
    answers?: QuizNameTheCardsAnswer[];
    cardId?: string;
    label?: string;
    name?: string | null;
    artworkUrl?: string | null;
    focusX?: number;
    focusY?: number;
    phaseDurationSeconds?: number;
    maxPoints?: number;
    hints?: {
      hard?: string;
      medium?: string;
      easy?: string;
      newbie?: string;
    };
    levels?: Array<{ level: string; points: number }>;
  };
  userAnswer?: Record<string, unknown> | null;
  isCorrect?: boolean | null;
  correctPayload?: {
    choices?: Array<string | QuizMcqChoice>;
    correctIndex?: number;
    correct?: boolean;
    items?: QuizOrderItem[];
    correctOrder?: string[];
    answers?: QuizNameTheCardsAnswer[];
    cardId?: string;
    answer?: QuizNameTheCardsAnswer | null;
  } | null;
};

export type QuizAttempt = {
  id: string;
  mode: "free" | "daily";
  status: "in_progress" | "finished";
  score: number;
  maxScore: number;
  dailyDate: string | null;
  startedAt?: string;
  finishedAt?: string | null;
  timerStartedAt?: string | null;
  timeLimitSeconds?: number | null;
  quizPointsAwarded?: boolean;
  userQuizPoints?: number;
  theme: { id: number; slug: string; label: string } | null;
  questions: QuizPublicQuestion[];
  answeredCount: number;
  totalCount: number;
};

export type QuizSeasonPodiumEntry = {
  rank: number;
  userId: string;
  username: string;
  totalScore: number;
  attemptsCount: number;
};

export type AdminQuizSeason = {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  dayCount: number;
  questionCount: number;
  status: "past" | "current" | "upcoming";
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type QuizHubResponse = {
  themes: QuizTheme[];
  today: string;
  daily: {
    quizDate: string;
    questionCount: number;
    theme: QuizTheme | null;
    myAttempt: {
      id: string;
      status: string;
      score: number;
      max_score: number;
    } | null;
  } | null;
  seasonPodium?: {
    season: AdminQuizSeason;
    podium: QuizSeasonPodiumEntry[];
  } | null;
};

export type MyQuizTypeStats = {
  type: string;
  answersCount: number;
  correctCount: number;
  points: number;
  accuracy: number;
};

export type MyQuizStatsResponse = {
  quizPoints: number;
  byType: MyQuizTypeStats[];
};

export const getQuizHub = async (): Promise<QuizHubResponse> => {
  try {
    const response = await api_aw.get(URL_BACK_QUIZ_HUB);
    return response.data as QuizHubResponse;
  } catch (error) {
    const appError = handleApiError(error);
    logError(appError, "getQuizHub");
    throw appError;
  }
};

export type QuizSeasonRankingResponse = {
  season: AdminQuizSeason;
  podium: QuizSeasonPodiumEntry[];
};

/** Classement complet d'une saison (public). */
export const getQuizSeasonRanking = async (
  seasonId: number | string = "current"
): Promise<QuizSeasonRankingResponse> => {
  try {
    const response = await api_aw.get(URL_BACK_QUIZ_SEASON_RANKING(seasonId));
    return response.data as QuizSeasonRankingResponse;
  } catch (error) {
    const appError = handleApiError(error);
    logError(appError, "getQuizSeasonRanking");
    throw appError;
  }
};

/** Stats quiz de l'utilisateur (points daily + perf par mode de jeu). */
export const getMyQuizStats = async (): Promise<MyQuizStatsResponse> => {
  try {
    const response = await api_aw.get(URL_BACK_QUIZ_MY_STATS);
    return response.data as MyQuizStatsResponse;
  } catch (error) {
    const appError = handleApiError(error);
    logError(appError, "getMyQuizStats");
    throw appError;
  }
};

export const startFreeQuiz = async (
  themeSlug: string,
  questionCount = 5
): Promise<QuizAttempt> => {
  try {
    const response = await api_aw.post(URL_BACK_QUIZ_START_FREE, {
      themeSlug,
      questionCount,
    });
    return response.data as QuizAttempt;
  } catch (error) {
    const appError = handleApiError(error);
    logError(appError, "startFreeQuiz");
    throw appError;
  }
};

export const startDailyQuiz = async (): Promise<QuizAttempt> => {
  try {
    const response = await api_aw.post(URL_BACK_QUIZ_START_DAILY);
    return response.data as QuizAttempt;
  } catch (error) {
    const appError = handleApiError(error);
    logError(appError, "startDailyQuiz");
    throw appError;
  }
};

export const getQuizAttempt = async (attemptId: string): Promise<QuizAttempt> => {
  try {
    const response = await api_aw.get(URL_BACK_QUIZ_ATTEMPT(attemptId));
    return response.data as QuizAttempt;
  } catch (error) {
    const appError = handleApiError(error);
    logError(appError, "getQuizAttempt");
    throw appError;
  }
};

export const submitQuizAnswer = async (
  attemptId: string,
  questionId: number,
  answer: Record<string, unknown>
): Promise<QuizAttempt> => {
  try {
    const response = await api_aw.post(URL_BACK_QUIZ_SUBMIT_ANSWER(attemptId), {
      questionId,
      answer,
    });
    return response.data as QuizAttempt;
  } catch (error) {
    const appError = handleApiError(error);
    logError(appError, "submitQuizAnswer");
    throw appError;
  }
};

export const finishQuizAttempt = async (attemptId: string): Promise<QuizAttempt> => {
  try {
    const response = await api_aw.post(URL_BACK_QUIZ_FINISH(attemptId));
    return response.data as QuizAttempt;
  } catch (error) {
    const appError = handleApiError(error);
    logError(appError, "finishQuizAttempt");
    throw appError;
  }
};

export type AdminQuizQuestion = {
  id: number;
  theme_id: number;
  theme: { id: number; slug: string; label: string } | null;
  type:
    | "mcq"
    | "true_false"
    | "order"
    | "name_the_cards"
    | "summoner"
    | "zoom"
    | "hint_ladder"
    | string;
  prompt: string;
  payload: {
    choicesMode?: "text" | "cards";
    choices?: Array<string | QuizMcqChoice>;
    correctIndex?: number;
    correct?: boolean;
    items?: QuizOrderItem[];
    correctOrder?: string[];
    monsterCount?: number;
    materialCount?: number;
    propositions?: QuizSummonerProposition[];
    answers?: QuizNameTheCardsAnswer[];
    cardId?: string;
    label?: string;
    name?: string | null;
    artworkUrl?: string | null;
    focusX?: number;
    focusY?: number;
    phaseDurationSeconds?: number;
    hints?: {
      hard?: string;
      medium?: string;
      easy?: string;
      newbie?: string;
    };
  };
  points: number;
  is_active: boolean;
  /** Déjà utilisée / planifiée en Daily : non replanifiable ailleurs */
  was_daily_question: boolean;
  /** Secondes pour le daily : 0 = pas de chrono, max 30 */
  daily_time_limit_seconds: number;
  season_id?: number | null;
  scheduled_date?: string | null;
  season?: {
    id: number;
    name: string;
    startDate: string;
    endDate: string;
  } | null;
  difficulty: QuizDifficulty;
  image_url?: string | null;
  hint?: string | null;
  explanation?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type AdminQuizSeasonInput = {
  name: string;
  startDate: string;
  endDate?: string;
};

export type AdminQuizQuestionInput = {
  themeSlug: string;
  type:
    | "mcq"
    | "true_false"
    | "order"
    | "name_the_cards"
    | "summoner"
    | "zoom"
    | "hint_ladder";
  prompt: string;
  payload: {
    choicesMode?: "text" | "cards";
    choices?: Array<string | QuizMcqChoice>;
    correctIndex?: number;
    correct?: boolean;
    items?: QuizOrderItem[];
    correctOrder?: string[];
    monsterCount?: number;
    materialCount?: number;
    propositions?: Array<{
      cardId: string | null;
      label: string;
      isMaterial?: boolean;
    }>;
    answers?: Array<{ cardId: string | null; label: string }>;
    cardId?: string | null;
    label?: string;
    focusX?: number;
    focusY?: number;
    phaseDurationSeconds?: number;
    hints?: {
      hard?: string;
      medium?: string;
      easy?: string;
      newbie?: string;
    };
  };
  points?: number;
  is_active?: boolean;
  was_daily_question?: boolean;
  daily_time_limit_seconds?: number;
  season_id?: number | null;
  scheduled_date?: string | null;
  difficulty?: QuizDifficulty;
  image_url?: string | null;
  hint?: string | null;
  explanation?: string | null;
};

export const getQuizThemes = async (): Promise<QuizTheme[]> => {
  try {
    const response = await api_aw.get(URL_BACK_QUIZ_THEMES);
    return (response.data?.themes ?? []) as QuizTheme[];
  } catch (error) {
    const appError = handleApiError(error);
    logError(appError, "getQuizThemes");
    throw appError;
  }
};

export const listAdminQuizQuestions = async (filters?: {
  theme?: string;
  type?: string;
  is_active?: boolean;
  was_daily_question?: boolean;
  difficulty?: QuizDifficulty;
  season_id?: number;
  limit?: number;
}): Promise<AdminQuizQuestion[]> => {
  try {
    const params: Record<string, string> = {};
    if (filters?.theme) params.theme = filters.theme;
    if (filters?.type) params.type = filters.type;
    if (filters?.difficulty) params.difficulty = filters.difficulty;
    if (filters?.is_active !== undefined) {
      params.is_active = String(filters.is_active);
    }
    if (filters?.was_daily_question !== undefined) {
      params.was_daily_question = String(filters.was_daily_question);
    }
    if (filters?.season_id !== undefined) {
      params.season_id = String(filters.season_id);
    }
    if (filters?.limit !== undefined) {
      params.limit = String(filters.limit);
    }
    const response = await api_aw.get(URL_BACK_QUIZ_ADMIN_QUESTIONS, { params });
    return (response.data?.questions ?? []) as AdminQuizQuestion[];
  } catch (error) {
    const appError = handleApiError(error);
    logError(appError, "listAdminQuizQuestions");
    throw appError;
  }
};

export const listAdminQuizSeasons = async (options?: {
  preview?: boolean;
}): Promise<AdminQuizSeason[]> => {
  try {
    const params: Record<string, string> = {};
    if (options?.preview) params.preview = "true";
    const response = await api_aw.get(URL_BACK_QUIZ_ADMIN_SEASONS, { params });
    return (response.data?.seasons ?? []) as AdminQuizSeason[];
  } catch (error) {
    const appError = handleApiError(error);
    logError(appError, "listAdminQuizSeasons");
    throw appError;
  }
};

export const getAdminQuizSeason = async (
  seasonId: number | string
): Promise<AdminQuizSeason> => {
  try {
    const response = await api_aw.get(URL_BACK_QUIZ_ADMIN_SEASON(seasonId));
    return response.data as AdminQuizSeason;
  } catch (error) {
    const appError = handleApiError(error);
    logError(appError, "getAdminQuizSeason");
    throw appError;
  }
};

export const createAdminQuizSeason = async (
  data: AdminQuizSeasonInput
): Promise<AdminQuizSeason> => {
  try {
    const response = await api_aw.post(URL_BACK_QUIZ_ADMIN_SEASONS, data);
    return response.data as AdminQuizSeason;
  } catch (error) {
    const appError = handleApiError(error);
    logError(appError, "createAdminQuizSeason");
    throw appError;
  }
};

export const updateAdminQuizSeason = async (
  seasonId: number | string,
  data: Partial<AdminQuizSeasonInput>
): Promise<AdminQuizSeason> => {
  try {
    const response = await api_aw.put(URL_BACK_QUIZ_ADMIN_SEASON(seasonId), data);
    return response.data as AdminQuizSeason;
  } catch (error) {
    const appError = handleApiError(error);
    logError(appError, "updateAdminQuizSeason");
    throw appError;
  }
};

export const deleteAdminQuizSeason = async (
  seasonId: number | string
): Promise<void> => {
  try {
    await api_aw.delete(URL_BACK_QUIZ_ADMIN_SEASON(seasonId));
  } catch (error) {
    const appError = handleApiError(error);
    logError(appError, "deleteAdminQuizSeason");
    throw appError;
  }
};

export const getAdminQuizSeasonPodium = async (
  seasonId: number | string
): Promise<{
  season: AdminQuizSeason;
  podium: QuizSeasonPodiumEntry[];
}> => {
  try {
    const response = await api_aw.get(URL_BACK_QUIZ_ADMIN_SEASON_PODIUM(seasonId));
    return response.data as {
      season: AdminQuizSeason;
      podium: QuizSeasonPodiumEntry[];
    };
  } catch (error) {
    const appError = handleApiError(error);
    logError(appError, "getAdminQuizSeasonPodium");
    throw appError;
  }
};

export type AutoScheduleSeasonResult = {
  assignedCount: number;
  skippedDays: string[];
  emptyDaysBefore: number;
  notEnoughQuestions: boolean;
  assigned: Array<{
    day: string;
    questionId: number;
    difficulty: string;
    type: string;
  }>;
};

/**
 * Propose un auto-remplissage (dryRun par défaut) à partir du brouillon courant.
 * Ne persiste rien côté serveur tant que dryRun=true.
 */
export const autoScheduleAdminQuizSeason = async (
  seasonId: number | string,
  options?: {
    dryRun?: boolean;
    currentAssignments?: Record<string, number>;
    candidateQuestionIds?: number[];
  }
): Promise<AutoScheduleSeasonResult> => {
  try {
    const response = await api_aw.post(
      URL_BACK_QUIZ_ADMIN_SEASON_AUTO_SCHEDULE(seasonId),
      {
        dryRun: options?.dryRun !== false,
        currentAssignments: options?.currentAssignments ?? {},
        candidateQuestionIds: options?.candidateQuestionIds ?? [],
      }
    );
    return response.data as AutoScheduleSeasonResult;
  } catch (error) {
    const appError = handleApiError(error);
    logError(appError, "autoScheduleAdminQuizSeason");
    throw appError;
  }
};

export const createAdminQuizQuestion = async (
  data: AdminQuizQuestionInput
): Promise<AdminQuizQuestion> => {
  try {
    const response = await api_aw.post(URL_BACK_QUIZ_ADMIN_QUESTIONS, data);
    return response.data as AdminQuizQuestion;
  } catch (error) {
    const appError = handleApiError(error);
    logError(appError, "createAdminQuizQuestion");
    throw appError;
  }
};

export const updateAdminQuizQuestion = async (
  questionId: number,
  data: Partial<AdminQuizQuestionInput>
): Promise<AdminQuizQuestion> => {
  try {
    const response = await api_aw.put(URL_BACK_QUIZ_ADMIN_QUESTION(questionId), data);
    return response.data as AdminQuizQuestion;
  } catch (error) {
    const appError = handleApiError(error);
    logError(appError, "updateAdminQuizQuestion");
    throw appError;
  }
};

export const deleteAdminQuizQuestion = async (questionId: number): Promise<void> => {
  try {
    await api_aw.delete(URL_BACK_QUIZ_ADMIN_QUESTION(questionId));
  } catch (error) {
    const appError = handleApiError(error);
    logError(appError, "deleteAdminQuizQuestion");
    throw appError;
  }
};

export const switchAllQuizQuestionsToInactive = async (
  setRefresh: SetStateCallback<boolean>
): Promise<void> => {
  try {
    const response = await api_aw.put(URL_BACK_QUIZ_SWITCH_ALL_TO_INACTIVE);
    if (response.status === 200) {
      setRefresh(true);
    }
  } catch (error) {
    const appError = handleApiError(error);
    logError(appError, "switchAllQuizQuestionsToInactive");
    throw appError;
  }
};

export const switchAllQuizQuestionsToNonDaily = async (
  setRefresh: SetStateCallback<boolean>
): Promise<void> => {
  try {
    const response = await api_aw.put(URL_BACK_QUIZ_SWITCH_ALL_TO_NON_DAILY);
    if (response.status === 200) {
      setRefresh(true);
    }
  } catch (error) {
    const appError = handleApiError(error);
    logError(appError, "switchAllQuizQuestionsToNonDaily");
    throw appError;
  }
};
