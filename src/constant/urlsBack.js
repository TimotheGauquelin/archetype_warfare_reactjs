export const URL_BACK_AUTHENTICATE = "/authenticate";
export const URL_BACK_REGISTER = "/register";

//ARCHETYPE

export const URL_BACK_GET_ARCHETYPES = `/public/archetypes`;
export const URL_BACK_GET_ARCHETYPE = (id) => `/public/archetypes/${id}`;
export const URL_BACK_GET_FOUR_MOST_FAMOUS_ARCHETYPES = `/public/archetypes/fourMostFamousArchetypes`;
export const URL_BACK_GET_EIGHT_MOST_RECENT_ARCHETYPES = `/public/archetypes/eightMostRecentArchetypes`;
export const URL_BACK_GET_RANDOM_ARCHETYPE = `/public/archetypes/randomArchetype`;
export const URL_BACK_GET_COUNT_NUMBER_OF_ARCHETYPE_ACTIVE = `/public/archetypes/count`;

//BANLIST

export const URL_BACK_GET_BANLISTS = `/public/banlists`;
export const URL_BACK_GET_BANLIST = (id) => `/public/banlists/${id}`;

//CARD TYPES

export const URL_BACK_GET_CARD_TYPES = `/public/cardTypes`;

//CARD MONSTER TYPES

export const URL_BACK_GET_MONSTER_TYPES = `/public/types`;

//CARD ATTRIBUTE

export const URL_BACK_GET_CARD_ATTRIBUTES = `/public/attributes`;

//USER
export const URL_BACK_GET_ALL_USERS = `/public/users`;
export const URL_BACK_GET_USER = (id) => `/public/users/${id}`;

//TOKEN

export const URL_BACK_CONFIRMATION_TOKEN = (token) =>
  `/public/update-confirmation-token/${token}`;
