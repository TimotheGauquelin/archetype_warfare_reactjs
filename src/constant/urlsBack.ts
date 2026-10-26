//ARCHETYPE

export const URL_BACK_GET_ARCHETYPES = `/public/archetypes`;
export const URL_BACK_GET_ARCHETYPE = (id: number | string) => `/public/archetypes/${id}`;
export const URL_BACK_GET_FOUR_MOST_FAMOUS_ARCHETYPES = `/public/archetypes/fourMostFamousArchetypes`;
export const URL_BACK_GET_COUNT_NUMBER_OF_ARCHETYPE_ACTIVE = `/public/archetypes/count`;
export const URL_BACK_GET_RANDOM_ARCHETYPE = `archetypes/random`;
export const URL_BACK_GET_ALL_ARCHETYPES_NAMES = `/archetypes/allNames`;

//BANLIST

export const URL_BACK_GET_BANLIST = (id: number | string) => `/banlists/${id}`;

//CARD TYPES

export const URL_BACK_GET_CARD_TYPES = `/card-types`;

//CARD MONSTER TYPES

export const URL_BACK_GET_MONSTER_TYPES = `/public/types`;

//CARD ATTRIBUTE

export const URL_BACK_GET_CARD_ATTRIBUTES = `/public/attributes`;

//USER
export const URL_BACK_GET_USER = (id: number | string) => `/public/users/${id}`;

//TOKEN

export const URL_BACK_CONFIRMATION_TOKEN = (token: string) =>
  `/public/update-confirmation-token/${token}`;

//////// NEW

//AUTHENTICATE
export const URL_BACK_LOGIN = "/authenticate/login"
export const URL_BACK_REGISTER = "/authenticate/register";
export const URL_BACK_DISCORD_AUTH = (params?: { locale?: string; acceptedTerms?: boolean }) => {
  const search = new URLSearchParams();
  if (params?.locale) search.set("locale", params.locale);
  if (params?.acceptedTerms) search.set("accepted_terms", "1");
  const query = search.toString();
  return `/authenticate/discord${query ? `?${query}` : ""}`;
};


//ARCHETYPE

export const URL_BACK_SEARCH_ARCHETYPES = (size?: number, page?: number, name?: string, era?: string, type?: string, attribute?: string, summonmecanic?: string, is_active?: boolean): string => {
  const params = new URLSearchParams();

  if (size) params.append('size', String(size));
  if (page) params.append('page', String(page));
  if (name) params.append('name', name);
  if (era) params.append('era', era);
  if (type) params.append('type', type);
  if (attribute) params.append('attribute', attribute);
  if (summonmecanic) params.append('summonmechanic', summonmecanic);
  if (is_active) params.append('is_active', String(is_active));
  return `/archetypes/search?${params.toString()}`;
};

export const URL_BACK_GET_ARCHETYPE_BY_ID = (archetypeId: number | string) => `/archetypes/${archetypeId}`
export const URL_BACK_GET_EIGHT_MOST_FAMOUS_ARCHETYPES = `/archetypes/getEightMostFamousArchetypes`
export const URL_BACK_GET_FIVE_RANDOM_HIGHLIGHTED_ARCHETYPES = `/archetypes/getFiveRandomHighlightedArchetypes`
export const URL_BACK_GET_EIGHT_MOST_RECENT_ARCHETYPES = `/archetypes/getEightMostRecentArchetypes`
export const URL_BACK_ADD_ARCHETYPE = `/archetypes`
export const URL_BACK_UPDATE_ARCHETYPE = (archetypeId: number | string) => `/archetypes/${archetypeId}/update`
export const URL_BACK_SWITCH_IS_HIGHLIGHTED = (archetypeId: number | string) => `/archetypes/${archetypeId}/switchIsHighlighted`
export const URL_BACK_SWITCH_IS_ACTIVE = (archetypeId: number | string) => `/archetypes/${archetypeId}/switchIsActive`
export const URL_BACK_SWITCH_ALL_TO_IS_NOT_HIGHLIGHTED = `/archetypes/switchAllToIsNotHighlighted`
export const URL_BACK_SWITCH_ALL_TO_IS_UNACTIVE = `/archetypes/switchAllToIsUnactive`
export const URL_BACK_RESET_POPULARITY = `/archetypes/resetPopularity`
export const URL_BACK_DELETE_ARCHETYPE = (archetypeId: number | string) => `/archetypes/${archetypeId}`

// ATTRIBUTE

export const URL_BACK_GET_ALL_ATTRIBUTES = `/attributes`;

// BANLIST

export const URL_BACK_GET_CURRENT_BANLIST = (displayArchetypesCards?: boolean) => `/banlists/current?include_archetype_cards=${displayArchetypesCards}`;
export const URL_BACK_GET_BANLISTS = `/banlists`; 
export const URL_BACK_ADD_BANLIST = `/banlists`;    
export const URL_BACK_UPDATE_BANLIST = (banlistId: number | string) => `/banlists/${banlistId}`;
export const URL_BACK_DELETE_BANLIST = (banlistId: number | string) => `/banlists/${banlistId}`;

// ERA

export const URL_BACK_GET_ALL_ERAS = `/eras`

// SUMMON MECHANIC

export const URL_BACK_GET_ALL_SUMMON_MECHANICS = `/summon-mechanics`

// TYPE

export const URL_BACK_GET_ALL_TYPES = `/types`

// CARD TYPES

export const URL_BACK_GET_ALL_CARD_TYPES = '/card-types'

// CARD STATUS

export const URL_BACK_GET_ALL_CARD_STATUS = '/card-statuses'

// DECKS

export const URL_BACK_GET_ALL_MY_DECKS = (userId: number | string) => `/decks/all/user/${userId}`;
export const URL_BACK_GET_PLAYABLE_DECKS = (userId: number | string) =>
  `/decks/all/user/${userId}?is_playable=true&is_active=true`;
export const URL_BACK_GET_DECK_BY_ID = (deckId: number | string) => `/decks/${deckId}`
export const URL_BACK_CREATE_DECK = `/decks/create`
export const URL_BACK_UPDATE_DECK = (deckId: number | string) => `/decks/updateMyDeck/${deckId}`
export const URL_BACK_DELETE_MY_DECK = (deckId: number | string) => `/decks/deleteMyDeck/${deckId}`

// USER

export const URL_BACK_SEARCH_USERS = (
  size: number,
  page: number,
  criteria: {
    q?: string;
    is_active?: "" | "true" | "false";
    is_banned?: "" | "true" | "false";
    role?: string;
  } = {}
) => {
  const params = new URLSearchParams();
  params.set("size", String(size));
  params.set("page", String(page));
  if (criteria.q?.trim()) params.set("q", criteria.q.trim());
  if (criteria.is_active === "true" || criteria.is_active === "false") {
    params.set("is_active", criteria.is_active);
  }
  if (criteria.is_banned === "true" || criteria.is_banned === "false") {
    params.set("is_banned", criteria.is_banned);
  }
  if (criteria.role?.trim()) params.set("role", criteria.role.trim());
  return `/users/search?${params.toString()}`;
};
export const URL_BACK_GET_USER_ROLES = "/users/roles";
export const URL_BACK_GET_ALL_USERS = '/users'
export const URL_BACK_GET_NEW_USERS = '/users/getNewUsers'
export const URL_BACK_GET_USER_BY_RESET_PASSWORD_TOKEN = (resetToken: string) => `/users/getUserByResetPassword/${resetToken}`
export const URL_BACK_GET_USER_BY_ID = (userId: number | string) => `/users/${userId}`
export const URL_BACK_ADD_USER = '/users'
export const URL_BACK_CREATE_USER_BY_ADMIN = '/users/admin/create'
export const URL_BACK_SWITCH_USER_IS_ACTIVE = (userId: number | string) => `/users/${userId}/switchIsActive`
export const URL_BACK_SWITCH_USER_IS_BANNED = (userId: number | string) => `/users/${userId}/switchIsBanned`
export const URL_BACK_UPDATE_USER_BY_ADMIN = (userId: number | string) => `/users/${userId}/updateUserByAdmin`
export const URL_BACK_ADMIN_SEND_PASSWORD_RESET = (userId: number | string) =>
  `/users/${userId}/admin/send-password-reset`;
export const URL_BACK_ADMIN_USER_QUIZ = (userId: number | string) =>
  `/users/${userId}/admin/quiz`;
export const URL_BACK_ADMIN_USER_TOURNAMENTS = (userId: number | string) =>
  `/users/${userId}/admin/tournaments`;
export const URL_BACK_DELETE_USER = (userId: number | string) => `/users/${userId}`
export const URL_BACK_UPDATE_MY_PROFILE = (userId: number | string) => `/users/${userId}`
export const URL_BACK_CHANGE_MY_PASSWORD = (userId: number | string) => `/users/${userId}/password`

///// PASSWORD
export const URL_BACK_UPDATE_PASSWORD = (userId: number | string) => `/authenticate/user/${userId}/update-password`
export const URL_BACK_REQUEST_NEW_PASSWORD = `/authenticate/request-new-password`

///// WEBSITE ACTIONS
export const URL_BACK_GET_CONFIG = '/website-actions'
export const URL_BACK_TOGGLE_STREAM_BAR = '/website-actions/stream-banner'
export const URL_BACK_TOGGLE_REGISTRATION = '/website-actions/registration'

// TOURNAMENTS
export const URL_BACK_GET_CURRENT_TOURNAMENTS = '/tournaments/current';
export const URL_BACK_GET_ALL_TOURNAMENTS = '/tournaments/all';
export const URL_BACK_CREATE_TOURNAMENT = '/tournaments';
export const URL_BACK_GET_TOURNAMENT = (id: number | string) => `/tournaments/${id}`;
export const URL_BACK_UPDATE_TOURNAMENT = (id: number | string) => `/tournaments/${id}`;
export const URL_BACK_DELETE_TOURNAMENT = (id: number | string) => `/tournaments/${id}`;
export const URL_BACK_REGISTER_TOURNAMENT = (id: number | string) => `/tournaments/${id}/register`;
export const URL_BACK_UNREGISTER_TOURNAMENT = (id: number | string) => `/tournaments/${id}/unregister`;
export const URL_BACK_DROP_TOURNAMENT = (id: number | string) => `/tournaments/${id}/drop`;
export const URL_BACK_GET_MY_TOURNAMENTS = '/tournaments/my-tournaments';
export const URL_BACK_GET_MY_TOURNAMENT_DETAIL = (id: number | string) => `/tournaments/${id}/my-details`;
export const URL_BACK_SET_TOURNAMENT_MY_DECK = (tournamentId: number | string) =>
  `/tournaments/${tournamentId}/my-deck`;
export const URL_BACK_REPORT_MATCH_RESULT = (matchId: number | string) =>
  `/tournaments/matches/${matchId}/result`;
export const URL_BACK_GET_TOURNAMENT_STANDINGS = (id: number | string) =>
  `/tournaments/${id}/standings`;
export const URL_BACK_START_TOURNAMENT = (id: number | string) =>
  `/tournaments/${id}/start`;
export const URL_BACK_TOURNAMENT_NEXT_ROUND = (id: number | string) =>
  `/tournaments/${id}/rounds/next`;
export const URL_BACK_TOURNAMENT_ROLLBACK_ROUND = (id: number | string) =>
  `/tournaments/${id}/rounds/rollback`;
export const URL_BACK_TOURNAMENT_REPAIR_ROUND = (id: number | string) =>
  `/tournaments/${id}/rounds/repair`;
export const URL_BACK_TOURNAMENT_PLAYER_BAN = (
  tournamentId: number | string,
  tournamentPlayerId: number | string
) => `/tournaments/${tournamentId}/players/${tournamentPlayerId}/ban`;
export const URL_BACK_REMOVE_TOURNAMENT_PLAYER = (
  tournamentId: number | string,
  tournamentPlayerId: number | string
) => `/tournaments/${tournamentId}/players/${tournamentPlayerId}/remove`;
export const URL_BACK_ADMIN_SET_TOURNAMENT_PLAYER_DROPPED = (
  tournamentId: number | string,
  tournamentPlayerId: number | string
) => `/tournaments/${tournamentId}/players/${tournamentPlayerId}/drop`;
export const URL_BACK_ADD_TOURNAMENT_PLAYER = (
  tournamentId: number | string,
  userId: number | string
) => `/tournaments/${tournamentId}/players/${userId}`;

export const URL_BACK_TOGGLE_TOURNAMENT_REGISTRATION = (tournamentId: number | string) => `/tournaments/${tournamentId}/registration/toggle`;  

export const URL_BACK_GET_TOURNAMENT_PLAYER_DECK_SNAPSHOT = (
  playerId: number | string
) => `/tournaments/players/${playerId}/deck-snapshot`;

export const URL_BACK_ASSIGN_TOURNAMENT_PLAYER_DECK = (
  tournamentId: number | string,
  playerId: number | string
) => `/tournaments/${tournamentId}/players/${playerId}/deck`;

export const URL_BACK_GET_ARCHETYPE_RANKING = (archetypeId: number | string) =>
  `/archetype-rankings/archetype/${archetypeId}`;
export const URL_BACK_GET_MY_ARCHETYPE_RANKINGS = `/archetype-rankings/me`;

export const URL_BACK_QUIZ_HUB = `/quizzes/hub`;
export const URL_BACK_QUIZ_SEASON_RANKING = (seasonId: number | string = "current") =>
  `/quizzes/seasons/${seasonId}/ranking`;
export const URL_BACK_QUIZ_MY_STATS = `/quizzes/me/stats`;
export const URL_BACK_QUIZ_THEMES = `/quizzes/themes`;
export const URL_BACK_QUIZ_START_FREE = `/quizzes/attempts/free`;
export const URL_BACK_QUIZ_START_DAILY = `/quizzes/attempts/daily`;
export const URL_BACK_QUIZ_ATTEMPT = (attemptId: string) =>
  `/quizzes/attempts/${attemptId}`;
export const URL_BACK_QUIZ_SUBMIT_ANSWER = (attemptId: string) =>
  `/quizzes/attempts/${attemptId}/answers`;
export const URL_BACK_QUIZ_FINISH = (attemptId: string) =>
  `/quizzes/attempts/${attemptId}/finish`;
export const URL_BACK_QUIZ_ADMIN_QUESTIONS = `/quizzes/admin/questions`;
export const URL_BACK_QUIZ_ADMIN_QUESTION = (questionId: number | string) =>
  `/quizzes/admin/questions/${questionId}`;
export const URL_BACK_QUIZ_SWITCH_ALL_TO_INACTIVE = `/quizzes/admin/questions/switchAllToInactive`;
export const URL_BACK_QUIZ_SWITCH_ALL_TO_NON_DAILY = `/quizzes/admin/questions/switchAllToNonDaily`;
export const URL_BACK_QUIZ_ADMIN_SEASONS = `/quizzes/admin/seasons`;
export const URL_BACK_QUIZ_ADMIN_SEASON = (seasonId: number | string) =>
  `/quizzes/admin/seasons/${seasonId}`;
export const URL_BACK_QUIZ_ADMIN_SEASON_PODIUM = (seasonId: number | string) =>
  `/quizzes/admin/seasons/${seasonId}/podium`;
export const URL_BACK_QUIZ_ADMIN_SEASON_AUTO_SCHEDULE = (
  seasonId: number | string
) => `/quizzes/admin/seasons/${seasonId}/auto-schedule`;