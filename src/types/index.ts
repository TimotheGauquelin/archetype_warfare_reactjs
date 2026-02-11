// Types pour les rôles
export interface Role {
  id?: number;
  label: string;
}

export interface User {
  id: number | null;
  username: string | null;
  email: string | null;
  roles: Role[] | string[];
  token: string | null;
  isAuthenticated: boolean;
  is_active?: boolean;
  is_banned?: boolean;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
}

export interface UserForm {
  username?: string;
  email?: string;
  password?: string;
  roles?: string[];
  is_active?: boolean;
  is_banned?: boolean;
  [key: string]: unknown;
}

export interface UserUpdateForm {
  username: string;
  email: string;
  belovedArchetype: string;
  [key: string]: unknown;
}

export interface PasswordUpdateForm {
  password: string;
  confirmPassword: string;
  [key: string]: unknown;
}

// Types pour les critères de recherche d'utilisateurs
export interface UserSearchCriteria {
  username?: string;
}

// Types pour l'authentification
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  username: string;
  email: string;
  password: string;
  confirmPassword?: string;
  hasAcceptedTermsAndConditions: boolean;
}

export interface PasswordRequestForm {
  email: string;
}

export interface DecodedToken {
  id: number;
  username: string;
  email: string;
  roles: string[];
  exp?: number;
  iat?: number;
  sub?: string;
  [key: string]: unknown;
}

// Types pour Redux
export interface RootState {
  user: User;
}

// Types pour les réponses API
export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  status?: number;
}

// Types pour la pagination
export interface Pagination {
  total: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

// Types pour les réponses API paginées
export interface PaginatedResponse<T> {
  data: T[];
  pagination: Pagination;
}

// Type pour les réponses de recherche d'utilisateurs
export interface UserSearchResponse extends PaginatedResponse<User> {}

// Types pour la configuration du site
export interface SiteConfig {
  stream_banner_enabled?: boolean;
  registration_enabled?: boolean;
  [key: string]: unknown;
}

// Types pour les archétypes
export interface Archetype {
  id: number;
  name: string;
  nameSubtitle?: string;
  slider_info?: string;
  isWelcome?: boolean;
  slider_img_url?: string;
  card_img_url?: string;
  in_aw_date?: string;
  is_highlighted?: boolean;
  is_active?: boolean;
  popularity?: number;
  types?: Array<{ id: number; label: string }>;
  attributes?: Array<{ id: number; label: string }>;
  summon_mechanics?: Array<{ id: number; label: string }>;
  era?: { id: number; label: string };
  cards?: BanlistCard[];
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
}

// Types pour les critères de recherche
export interface SearchCriteria {
  size: number;
  page: number;
  name?: string;
  era?: string;
  type?: string;
  attribute?: string;
  summonmechanic?: string;
}

// Types pour les cartes
export interface Card {
  id: number;
  name: string;
  img_url?: string;
  card_type?: string;
  cardType?: { id: number; label: string };
  level?: number;
  atk?: number;
  def?: number;
  attribute?: { id: number; label: string };
  card_status?: {
    id?: number;
    label: string;
    limit?: number;
  };
  archetype_id?: number;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
}

// Types pour les critères de recherche de cartes
export interface CardSearchCriteria {
  size?: number;
  page?: number;
  name?: string;
  card_type?: string;
  level?: number;
  min_atk?: number;
  max_atk?: number;
  min_def?: number;
  max_def?: number;
  attribute?: string;
}

// Types pour les decks
export interface DeckCard {
  card: Card;
  img_url?: string;
  quantity: number;
}

export interface Deck {
  id?: number;
  name?: string;
  label?: string;
  comment?: string;
  archetype_id?: number;
  user_id?: number;
  deck_cards?: DeckCard[];
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
}

// Types pour les cartes de banlist
export interface BanlistCard {
  id: number;
  card: Card;
  card_status: {
    id: number;
    label: string;
    limit?: number;
  };
  explanation_text?: string;
  card_status_id?: number;
  banlist?: { id: number };
  [key: string]: unknown;
}

// Types pour les banlists
export interface Banlist {
  id: number;
  name: string;
  label?: string;
  date?: string;
  release_date?: string;
  description?: string;
  is_current?: boolean;
  is_active?: boolean;
  banlist_archetype_cards?: BanlistCard[];
  cards?: BanlistCard[];
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
}

// Types pour les cartes avec statut de banlist
export interface CardWithBanlistStatus {
  card: Card;
  card_status: {
    id: number;
    label: string;
    limit?: number;
  };
  explanation_text?: string;
  cardData?: {
    card: Card;
    [key: string]: unknown;
  };
}

export interface ComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export type SetStateCallback<T> = (value: T | ((prev: T) => T)) => void;
export type SetErrorMessageCallback = SetStateCallback<string>;

export type TournamentStatus = "registration_open" | "in_progress" | "finished" | "cancelled";

export interface TournamentPlayerUser {
  id?: number;
  username?: string;
  email?: string;
  [key: string]: unknown;
}

export interface TournamentPlayer {
  id?: number;
  user_id?: number;
  user?: TournamentPlayerUser;
  [key: string]: unknown;
}

export interface Tournament {
  id: number;
  name: string;
  status: TournamentStatus;
  max_players?: number;
  location?: string;
  event_date?: string;
  event_date_end?: string;
  is_online?: boolean;
  number_of_rounds?: number;
  matches_per_round?: number;
  players?: TournamentPlayer[];
  [key: string]: unknown;
}
