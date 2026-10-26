export const URL_FRONT_HOME = "/";
export const URL_FRONT_LOGIN = "/login";
export const URL_FRONT_REGISTER = "/register";
export const URL_FRONT_TERMS_AND_CONDITIONS = "/terms-and-conditions";
export const URL_FRONT_DISCORD_CALLBACK = "/login/discord/callback";
export const URL_FRONT_ABOUT = "/about";
export const URL_FRONT_PASSWORD_LOST = "/password-lost";
export const URL_FRONT_PASSWORD_RESET = "/password-reset/:resetToken";
export const URL_FRONT_ARCHETYPES = "/archetypes";
export const URL_FRONT_ARCHETYPE = (slug: string): string =>
  `/archetype/${encodeURIComponent(slug)}`;
/** Préfère le slug public ; repli sur l'id si slug absent (données anciennes). */
export const getArchetypePublicPath = (archetype: {
  id?: number | string | null;
  slug?: string | null;
}): string | null => {
  const slug = archetype.slug?.trim();
  if (slug) return URL_FRONT_ARCHETYPE(slug);
  if (archetype.id != null && String(archetype.id).trim() !== "") {
    return URL_FRONT_ARCHETYPE(String(archetype.id));
  }
  return null;
};
export const URL_FRONT_BANLIST = "/banlist";
export const URL_FRONT_ROAD_MAP = "/road-map";
export const URL_FRONT_TOURNAMENTS = "/tournaments";
export const URL_FRONT_TOURNAMENT = (id: number | string): string => `/tournaments/${id}`;
export const URL_FRONT_QUIZ = "/quiz";
export const URL_FRONT_QUIZ_DAILY = "/quiz/daily";
export const URL_FRONT_QUIZ_PLAY = (attemptId: string): string =>
  `/quiz/play/${attemptId}`;
export const URL_FRONT_QUIZ_SEASON_RANKING = "/quiz/season/:seasonId";
export const getQuizSeasonRankingPath = (seasonId: number | string = "current") =>
  `/quiz/season/${seasonId}`;

//Profil
export const URL_FRONT_MY_PROFILE = "/my-profile";
export const URL_FRONT_MY_PROFILE_EDIT = "/my-profile/edit";
export const URL_FRONT_MY_DECKS = "/my-decks";
export const URL_FRONT_MY_DECK_ADD = "/my-decks/add";
export const URL_FRONT_MY_DECK_UPDATE = "/my-decks/update/:deckId";
export const getMyDeckUpdatePath = (deckId: number | string): string => `/my-decks/update/${deckId}`;
export const URL_FRONT_MY_TOURNAMENTS = "/my-tournaments";
export const URL_FRONT_MY_TOURNAMENT_DETAIL = (id: number | string): string => `/my-tournaments/${id}`;

//Admin

export const URL_FRONT_ADMIN_HOME = "/admin/home";
export const URL_FRONT_ADMIN_ARCHETYPES = "/admin/archetypes"
export const URL_FRONT_ADMIN_ARCHETYPE_ADD_FORM = "/admin/archetypes/add";
export const URL_FRONT_ADMIN_ARCHETYPE_UPDATE_FORM = "/admin/archetypes/update/:archetypeId";
export const URL_FRONT_ADMIN_BANLISTS = "/admin/banlists";
export const URL_FRONT_ADMIN_BANLIST_UPDATE = "/admin/banlists/update/:banlistId";
export const URL_FRONT_ADMIN_BANLIST_ADD = "/admin/banlists/add";
export const URL_FRONT_ADMIN_USERS = "/admin/users";
export const URL_FRONT_ADMIN_USERS_ALL = "/admin/users/all";
export const URL_FRONT_ADMIN_TOURNAMENTS = "/admin/tournaments";
export const URL_FRONT_ADMIN_TOURNAMENTS_BY_SCOPE =
  "/admin/tournaments/scope/:scope";
export const getAdminTournamentsByScopePath = (
  scope: "in-progress" | "upcoming" | "past"
) => `/admin/tournaments/scope/${scope}`;
export const URL_FRONT_ADMIN_TOURNAMENT_ADD = "/admin/tournaments/add";
export const URL_FRONT_ADMIN_TOURNAMENT_UPDATE = "/admin/tournaments/update/:tournamentId";
export const getAdminTournamentUpdatePath = (tournamentId: number | string) => `/admin/tournaments/update/${tournamentId}`;
export const URL_FRONT_ADMIN_TOURNAMENT_MANAGE = "/admin/tournaments/manage/:tournamentId";
export const getAdminTournamentManagePath = (tournamentId: number | string) => `/admin/tournaments/manage/${tournamentId}`;
export const URL_FRONT_ADMIN_USER_ADD = "/admin/users/add";
export const URL_FRONT_ADMIN_USER_UPDATE = "/admin/users/update/:userId";
export const URL_FRONT_ADMIN_CARDS = "/admin/cards";
export const URL_FRONT_ADMIN_CARD_DETAIL = "/admin/cards/:cardId";
export const URL_FRONT_ADMIN_QUIZZES = "/admin/quizzes";
export const URL_FRONT_ADMIN_QUIZ_QUESTIONS = "/admin/quizzes/questions";
export const URL_FRONT_ADMIN_QUIZ_SEASONS = "/admin/quizzes/seasons";
export const URL_FRONT_ADMIN_QUIZ_SEASON_ADD = "/admin/quizzes/seasons/add";
export const URL_FRONT_ADMIN_QUIZ_SEASON_UPDATE =
  "/admin/quizzes/seasons/update/:seasonId";
export const getAdminQuizSeasonUpdatePath = (seasonId: number | string) =>
  `/admin/quizzes/seasons/update/${seasonId}`;
export const URL_FRONT_ADMIN_QUIZ_ADD = "/admin/quizzes/add";
export const URL_FRONT_ADMIN_QUIZ_UPDATE = "/admin/quizzes/update/:questionId";
export const getAdminQuizUpdatePath = (questionId: number | string) =>
  `/admin/quizzes/update/${questionId}`;
export const URL_FRONT_ADMIN_OPTIONS = "/admin/options";
export const URL_FRONT_ADMIN_FILES = "/admin/files";
export const URL_FRONT_ADMIN_FILES_ARCHETYPES_JUMBOTRON = "/admin/files/archetypes/jumbotron";
export const URL_FRONT_ADMIN_FILES_ARCHETYPES_INTRODUCTION_CARD = "/admin/files/archetypes/introduction-card";

