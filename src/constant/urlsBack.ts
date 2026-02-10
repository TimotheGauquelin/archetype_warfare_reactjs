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


//ARCHETYPE

export const URL_BACK_SEARCH_ARCHETYPES = (size?: number, page?: number, name?: string, era?: string, type?: string, attribute?: string, summonmecanic?: string): string => {
  const params = new URLSearchParams();

  if (size) params.append('size', String(size));
  if (page) params.append('page', String(page));
  if (name) params.append('name', name);
  if (era) params.append('era', era);
  if (type) params.append('type', type);
  if (attribute) params.append('attribute', attribute);
  if (summonmecanic) params.append('summonmechanic', summonmecanic);

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

export const URL_BACK_GET_CURRENT_BANLIST = `/banlists/current`;
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

export const URL_BACK_GET_ALL_MY_DECKS = (userId: number | string) => `/decks/all/user/${userId}`
export const URL_BACK_GET_DECK_BY_ID = (deckId: number | string) => `/decks/${deckId}`
export const URL_BACK_CREATE_DECK = `/decks/create`
export const URL_BACK_UPDATE_DECK = (deckId: number | string) => `/decks/updateMyDeck/${deckId}`
export const URL_BACK_DELETE_MY_DECK = (deckId: number | string) => `/decks/deleteMyDeck/${deckId}`

// USER

export const URL_BACK_SEARCH_USERS = (size: number, pagination: number, username: string) => `/users/search?size=${size}&page=${pagination}&username=${username}`
export const URL_BACK_GET_ALL_USERS = '/users'
export const URL_BACK_GET_NEW_USERS = '/users/getNewUsers'
export const URL_BACK_GET_USER_BY_RESET_PASSWORD_TOKEN = (resetToken: string) => `/users/getUserByResetPassword/${resetToken}`
export const URL_BACK_GET_USER_BY_ID = (userId: number | string) => `/users/${userId}`
export const URL_BACK_ADD_USER = '/users'
export const URL_BACK_CREATE_USER_BY_ADMIN = '/users/admin/create'
export const URL_BACK_SWITCH_USER_IS_ACTIVE = (userId: number | string) => `/users/${userId}/switchIsActive`
export const URL_BACK_SWITCH_USER_IS_BANNED = (userId: number | string) => `/users/${userId}/switchIsBanned`
export const URL_BACK_UPDATE_USER_BY_ADMIN = (userId: number | string) => `/users/${userId}/updateUserByAdmin`
export const URL_BACK_DELETE_USER = (userId: number | string) => `/users/${userId}`

///// PASSWORD
export const URL_BACK_UPDATE_PASSWORD = (userId: number | string) => `/authenticate/user/${userId}/update-password`
export const URL_BACK_REQUEST_NEW_PASSWORD = `/authenticate/request-new-password`

///// WEBSITE ACTIONS
export const URL_BACK_GET_CONFIG = '/website-actions'
export const URL_BACK_TOGGLE_STREAM_BAR = '/website-actions/stream-banner'
export const URL_BACK_TOGGLE_REGISTRATION = '/website-actions/registration'

// TOURNAMENTS
export const URL_BACK_GET_TOURNAMENTS = '/tournaments';
export const URL_BACK_GET_TOURNAMENT = (id: number | string) => `/tournaments/${id}`;
export const URL_BACK_REGISTER_TOURNAMENT = (id: number | string) => `/tournaments/${id}/register`;
export const URL_BACK_UNREGISTER_TOURNAMENT = (id: number | string) => `/tournaments/${id}/register`;