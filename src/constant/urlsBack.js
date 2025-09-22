//ARCHETYPE

export const URL_BACK_GET_ARCHETYPES = `/public/archetypes`;
export const URL_BACK_GET_ARCHETYPE = (id) => `/public/archetypes/${id}`;
export const URL_BACK_GET_FOUR_MOST_FAMOUS_ARCHETYPES = `/public/archetypes/fourMostFamousArchetypes`;
export const URL_BACK_GET_COUNT_NUMBER_OF_ARCHETYPE_ACTIVE = `/public/archetypes/count`;
export const URL_BACK_GET_RANDOM_ARCHETYPE = `archetypes/random`;

//BANLIST

export const URL_BACK_GET_BANLIST = (id) => `/public/banlists/${id}`;

//CARD TYPES

export const URL_BACK_GET_CARD_TYPES = `/public/cardTypes`;

//CARD MONSTER TYPES

export const URL_BACK_GET_MONSTER_TYPES = `/public/types`;

//CARD ATTRIBUTE

export const URL_BACK_GET_CARD_ATTRIBUTES = `/public/attributes`;

//USER
export const URL_BACK_GET_USER = (id) => `/public/users/${id}`;

//TOKEN

export const URL_BACK_CONFIRMATION_TOKEN = (token) =>
  `/public/update-confirmation-token/${token}`;

//////// NEW

//AUTHENTICATE
export const URL_BACK_LOGIN = "/authenticate/login"
export const URL_BACK_REGISTER = "/authenticate/register";


//ARCHETYPE

export const URL_BACK_SEARCH_ARCHETYPES = (size, page, name, era, type, attribute, summonmecanic) => `/archetypes/search?${size && `size=${size}`}${page && `&page=${page}`}${name && `&name=${name}`}${era && `&era=${era}`}${type && `&type=${type}`}${attribute && `&attribute=${attribute}`}${summonmecanic && `&summonmechanic=${summonmecanic}`}`
export const URL_BACK_GET_ARCHETYPE_BY_ID = (archetypeId) => `/archetypes/${archetypeId}`
export const URL_BACK_GET_FIVE_MOST_FAMOUS_ARCHETYPES = `/archetypes/getFiveMostFamousArchetypes`
export const URL_BACK_GET_FIVE_RANDOM_HIGHLIGHTED_ARCHETYPES = `/archetypes/getFiveRandomHighlightedArchetypes`
export const URL_BACK_GET_EIGHT_MOST_RECENT_ARCHETYPES = `/archetypes/getEightMostRecentArchetypes`
export const URL_BACK_ADD_ARCHETYPE = `/archetypes`
export const URL_BACK_UPDATE_ARCHETYPE = (archetypeId) => `/archetypes/${archetypeId}/update`
export const URL_BACK_SWITCH_IS_HIGHLIGHTED = (archetypeId) => `/archetypes/${archetypeId}/switchIsHighlighted`
export const URL_BACK_SWITCH_IS_ACTIVE = (archetypeId) => `/archetypes/${archetypeId}/switchIsActive`
export const URL_BACK_SWITCH_ALL_TO_IS_NOT_HIGHLIGHTED = `/archetypes/switchAllToIsNotHighlighted`
export const URL_BACK_SWITCH_ALL_TO_IS_UNACTIVE = `/archetypes/switchAllToIsUnactive`
export const URL_BACK_RESET_POPULARITY = `/archetypes/resetPopularity`
export const URL_BACK_DELETE_ARCHETYPE = (archetypeId) => `/archetypes/${archetypeId}`

// ATTRIBUTE

export const URL_BACK_GET_ALL_ATTRIBUTES = `/attributes`;

// BANLIST

export const URL_BACK_GET_CURRENT_BANLIST = `/banlists/current`;
export const URL_BACK_GET_BANLISTS = `/banlists`;
export const URL_BACK_ADD_BANLIST = `/banlists`;

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

// USER

export const URL_BACK_SEARCH_USERS = (size, pagination, username) => `/users/search?size=${size}&page=${pagination}&username=${username}`
export const URL_BACK_GET_ALL_USERS = '/users'
export const URL_BACK_GET_USER_BY_RESET_PASSWORD_TOKEN = (resetToken) => `/users/getUserByResetPassword/${resetToken}`
export const URL_BACK_ADD_USER = '/users'
export const URL_BACK_SWITCH_USER_IS_ACTIVE = (userId) => `/users/${userId}/switchIsActive`
export const URL_BACK_SWITCH_USER_IS_FORBIDDEN = (userId) => `/users/${userId}/switchIsForbidden`
export const URL_BACK_DELETE_USER = (userId) => `/users/${userId}`

///// PASSWORD
export const URL_BACK_UPDATE_PASSWORD = (userId) => `/authenticate/user/${userId}/update-password`
export const URL_BACK_REQUEST_NEW_PASSWORD = `/authenticate/request-new-password`