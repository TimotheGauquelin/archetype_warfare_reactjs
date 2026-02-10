export const URL_FRONT_HOME = "/";
export const URL_FRONT_LOGIN = "/login";
export const URL_FRONT_REGISTER = "/register";
export const URL_FRONT_TERMS_AND_CONDITIONS = "/terms-and-conditions";
export const URL_FRONT_DISCORD_CALLBACK = "/login/discord/callback";
export const URL_FRONT_ABOUT = "/about";
export const URL_FRONT_PASSWORD_LOST = "/password-lost";
export const URL_FRONT_PASSWORD_RESET = "/password-reset/:resetToken";
export const URL_FRONT_ARCHETYPES = "/archetypes";
export const URL_FRONT_ARCHETYPE = (id: number | string): string => `/archetype/${id}`;
export const URL_FRONT_BANLIST = "/banlist";
export const URL_FRONT_ROAD_MAP = "/road-map";
export const URL_FRONT_TOURNAMENTS = "/tournaments";
export const URL_FRONT_TOURNAMENT = (id: number | string): string => `/tournaments/${id}`;

//Profil
export const URL_FRONT_MY_PROFILE = "/my-profile";
export const URL_FRONT_MY_PROFILE_EDIT = "/my-profile/edit";
export const URL_FRONT_MY_DECKS = "/my-decks";
export const URL_FRONT_MY_DECK_ADD = "/my-decks/add";
export const URL_FRONT_MY_DECK_UPDATE = "/my-decks/update/:deckId";
export const getMyDeckUpdatePath = (deckId: number | string): string => `/my-decks/update/${deckId}`;

//Admin

export const URL_FRONT_ADMIN_HOME = "/admin/home";
export const URL_FRONT_ADMIN_ARCHETYPES = "/admin/archetypes"
export const URL_FRONT_ADMIN_ARCHETYPE_ADD_FORM = "/admin/archetypes/add";
export const URL_FRONT_ADMIN_ARCHETYPE_UPDATE_FORM = "/admin/archetypes/update/:archetypeId";
export const URL_FRONT_ADMIN_BANLISTS = "/admin/banlists";
export const URL_FRONT_ADMIN_BANLIST_UPDATE = "/admin/banlists/update/:banlistId";
export const URL_FRONT_ADMIN_BANLIST_ADD = "/admin/banlists/add";
export const URL_FRONT_ADMIN_USERS = "/admin/users";
export const URL_FRONT_ADMIN_USER_ADD = "/admin/users/add";
export const URL_FRONT_ADMIN_USER_UPDATE = "/admin/users/update/:userId";
export const URL_FRONT_ADMIN_CARDS = "/admin/cards";
export const URL_FRONT_ADMIN_OPTIONS = "/admin/options";
export const URL_FRONT_ADMIN_FILES = "/admin/files";
export const URL_FRONT_ADMIN_FILES_ARCHETYPES_JUMBOTRON = "/admin/files/archetypes/jumbotron";
export const URL_FRONT_ADMIN_FILES_ARCHETYPES_INTRODUCTION_CARD = "/admin/files/archetypes/introduction-card";

