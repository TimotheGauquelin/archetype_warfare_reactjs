import api_aw from "../api/api_aw";
import {
  URL_BACK_ADD_USER,
  URL_BACK_ADMIN_SEND_PASSWORD_RESET,
  URL_BACK_ADMIN_USER_QUIZ,
  URL_BACK_ADMIN_USER_TOURNAMENTS,
  URL_BACK_CHANGE_MY_PASSWORD,
  URL_BACK_CREATE_USER_BY_ADMIN,
  URL_BACK_DELETE_USER,
  URL_BACK_GET_ALL_USERS,
  URL_BACK_GET_USER_BY_ID,
  URL_BACK_GET_USER_BY_RESET_PASSWORD_TOKEN,
  URL_BACK_GET_USER_ROLES,
  URL_BACK_SEARCH_USERS,
  URL_BACK_SWITCH_USER_IS_ACTIVE,
  URL_BACK_SWITCH_USER_IS_BANNED,
  URL_BACK_UPDATE_MY_PROFILE,
  URL_BACK_UPDATE_PASSWORD,
  URL_BACK_UPDATE_USER_BY_ADMIN,
} from "../constant/urlsBack";
import { URL_FRONT_ADMIN_USERS, URL_FRONT_HOME, URL_FRONT_LOGIN } from "../constant/urlsFront";
import { logOut } from "./auth";
import type {
  AdminUserQuizSummary,
  AdminUserTournamentSummaryItem,
  CardLocale,
  ChangePasswordForm,
  User,
  UserForm,
  PasswordUpdateForm,
  UserSearchCriteria,
  Pagination,
  PaginatedResponse,
  SetStateCallback,
  SetErrorMessageCallback,
} from "../types";
import { handleApiError, getErrorMessage, logError } from "../utils/errorHandler";
import type { NavigateFunction } from "react-router-dom";
import type { AppDispatch } from "../redux/store";
import type { ToastFunction } from "./websiteactions";

/**
 * Récupère tous les utilisateurs
 */
export const getUsers = async (
  setUsers: SetStateCallback<User[]>
): Promise<void> => {
  try {
    const response = await api_aw.get(URL_BACK_GET_ALL_USERS);
    if (response.status === 200 && response.data) {
      setUsers(response.data);
    }
  } catch (error) {
    const appError = handleApiError(error);
    logError(appError, 'getUsers');
  }
};

/**
 * Recherche d'utilisateurs avec critères et pagination
 */
export const searchUsers = async (
  size: number,
  pagination: Pagination,
  criteria: UserSearchCriteria,
  setUsers: SetStateCallback<PaginatedResponse<User>>
): Promise<void> => {
  try {
    const response = await api_aw.get(
      URL_BACK_SEARCH_USERS(size, pagination.currentPage, {
        q: criteria.q ?? criteria.username ?? "",
        is_active: criteria.is_active ?? "",
        is_banned: criteria.is_banned ?? "",
        role: criteria.role ?? "",
      })
    );
    if (response.status === 200 && response.data) {
      const raw = response.data as {
        data?: User[];
        pagination?: Pagination & { totalItems?: number };
      };
      const total =
        raw.pagination?.total ??
        raw.pagination?.totalItems ??
        0;
      setUsers({
        data: raw.data ?? [],
        pagination: {
          total,
          totalPages: raw.pagination?.totalPages ?? 1,
          currentPage: raw.pagination?.currentPage ?? pagination.currentPage,
          pageSize: raw.pagination?.pageSize ?? size,
        },
      });
    }
  } catch (error) {
    const appError = handleApiError(error);
    logError(appError, 'searchUsers');
  }
};

export type UserRoleOption = {
  id: number;
  label: string;
};

export const getUserRoles = async (): Promise<UserRoleOption[]> => {
  try {
    const response = await api_aw.get(URL_BACK_GET_USER_ROLES);
    if (response.status === 200 && Array.isArray(response.data)) {
      return response.data as UserRoleOption[];
    }
    return [];
  } catch (error) {
    const appError = handleApiError(error);
    logError(appError, "getUserRoles");
    return [];
  }
};

/**
 * Récupère un utilisateur par son token de réinitialisation de mot de passe
 */
export const getUserByResetPasswordToken = async (
  resetPasswordToken: string,
  setUser: SetStateCallback<User>,
  setError: SetErrorMessageCallback,
  navigate: NavigateFunction
): Promise<void> => {
  try {
    const response = await api_aw.get(
      URL_BACK_GET_USER_BY_RESET_PASSWORD_TOKEN(resetPasswordToken)
    );
    if (response.status === 200 && response.data) {
      setUser(response.data);
    }
  } catch (error) {
    const appError = handleApiError(error);
    logError(appError, 'getUserByResetPasswordToken');

    if (appError.statusCode === 400) {
      setError(appError.message);
      setTimeout(() => {
        navigate(URL_FRONT_LOGIN);
      }, 5000);
    } else if (appError.statusCode === 404) {
      setError("Le lien de réinitialisation de mot de passe est invalide");
      setTimeout(() => {
        navigate(URL_FRONT_HOME);
      }, 5000);
    } else {
      setError(appError.message);
    }
  }
};

/**
 * Récupère un utilisateur par son ID
 */
export const getUserById = async (
  userId: number | string,
  setUser: SetStateCallback<User>
): Promise<void> => {
  try {
    const response = await api_aw.get(URL_BACK_GET_USER_BY_ID(userId));
    if (response.status === 200 && response.data) {
      setUser(response.data);
    }
  } catch (error) {
    const appError = handleApiError(error);
    logError(appError, 'getUserById');
  }
};

/**
 * Ajoute un nouvel utilisateur
 */
export const addUser = async (
  newUser: UserForm,
  navigate: NavigateFunction
): Promise<void> => {
  try {
    const response = await api_aw.post(URL_BACK_ADD_USER, newUser);
    if (response.status === 201) {
      navigate(URL_FRONT_ADMIN_USERS);
    }
  } catch (error) {
    const appError = handleApiError(error);
    logError(appError, 'addUser');
  }
};

/**
 * Crée un utilisateur par un administrateur
 */
export const createUserByAdmin = async (
  newUser: UserForm,
  navigate: NavigateFunction,
  toast?: ToastFunction
): Promise<boolean> => {
  try {
    const response = await api_aw.post(URL_BACK_CREATE_USER_BY_ADMIN, newUser);
    if (response.status === 201) {
      toast?.success(
        (response.data as { message?: string })?.message ??
          "Utilisateur créé avec succès"
      );
      navigate(URL_FRONT_ADMIN_USERS);
      return true;
    }
    return false;
  } catch (error) {
    const appError = handleApiError(error);
    logError(appError, "createUserByAdmin");
    toast?.error(getErrorMessage(appError));
    return false;
  }
};

/**
 * Envoie un email de réinitialisation de mot de passe (admin).
 */
export const adminSendPasswordReset = async (
  userId: number | string,
  toast: ToastFunction
): Promise<boolean> => {
  try {
    const response = await api_aw.post(
      URL_BACK_ADMIN_SEND_PASSWORD_RESET(userId)
    );
    if (response.status === 200) {
      toast.success(
        (response.data as { message?: string })?.message ??
          "Email de réinitialisation envoyé"
      );
      return true;
    }
    toast.error("Impossible d'envoyer l'email");
    return false;
  } catch (error) {
    const appError = handleApiError(error);
    logError(appError, "adminSendPasswordReset");
    toast.error(getErrorMessage(appError));
    return false;
  }
};

/**
 * Résumé quiz d'un utilisateur (admin).
 */
export const getAdminUserQuizSummary = async (
  userId: number | string
): Promise<AdminUserQuizSummary | null> => {
  try {
    const response = await api_aw.get(URL_BACK_ADMIN_USER_QUIZ(userId));
    if (response.status === 200 && response.data) {
      return response.data as AdminUserQuizSummary;
    }
    return null;
  } catch (error) {
    const appError = handleApiError(error);
    logError(appError, "getAdminUserQuizSummary");
    return null;
  }
};

/**
 * Tournois d'un utilisateur (admin).
 */
export const getAdminUserTournamentsSummary = async (
  userId: number | string
): Promise<AdminUserTournamentSummaryItem[] | null> => {
  try {
    const response = await api_aw.get(URL_BACK_ADMIN_USER_TOURNAMENTS(userId));
    if (response.status === 200 && response.data) {
      const raw = response.data as { tournaments?: AdminUserTournamentSummaryItem[] };
      return Array.isArray(raw.tournaments) ? raw.tournaments : [];
    }
    return null;
  } catch (error) {
    const appError = handleApiError(error);
    logError(appError, "getAdminUserTournamentsSummary");
    return null;
  }
};

/**
 * Bascule l'état "actif" d'un utilisateur
 */
export const switchIsActive = async (
  userId: number | string,
  setRefresh: SetStateCallback<boolean>
): Promise<void> => {
  try {
    const response = await api_aw.put(URL_BACK_SWITCH_USER_IS_ACTIVE(userId));
    if (response.status === 200) {
      setRefresh(true);
    }
  } catch (error) {
    const appError = handleApiError(error);
    logError(appError, 'switchIsActive');
  }
};

/**
 * Bascule l'état "banni" d'un utilisateur
 */
export const switchIsBanned = async (
  userId: number | string,
  setRefresh: SetStateCallback<boolean>
): Promise<void> => {
  try {
    const response = await api_aw.put(URL_BACK_SWITCH_USER_IS_BANNED(userId));
    if (response.status === 200) {
      setRefresh(true);
    }
  } catch (error) {
    const appError = handleApiError(error);
    logError(appError, 'switchIsBanned');
  }
};

/**
 * Résultat d'une tentative de réinitialisation de mot de passe (pour useActionState)
 */
export interface PasswordResetResult {
  success?: boolean;
  error?: string;
  multipleErrors?: string | Record<string, string[]>;
}

/**
 * Met à jour le mot de passe et retourne un résultat (pour useActionState).
 * En cas de succès, l'appelant doit gérer toast et navigation.
 */
export const updatePasswordWithResult = async (
  userId: number | string,
  form: PasswordUpdateForm
): Promise<PasswordResetResult> => {
  try {
    const response = await api_aw.put(URL_BACK_UPDATE_PASSWORD(userId), form);
    if (response.status === 200) {
      return { success: true };
    }
    return { error: "Une erreur inattendue s'est produite." };
  } catch (error) {
    const appError = handleApiError(error);
    logError(appError, 'updatePasswordWithResult');

    if (appError.originalError && typeof appError.originalError === 'object' && 'response' in appError.originalError) {
      const axiosError = appError.originalError as { response?: { data?: { message?: string | Record<string, string[]> } } };
      if (axiosError.response?.data?.message) {
        return { multipleErrors: axiosError.response.data.message };
      }
    }
    return { multipleErrors: "Une erreur est survenue lors de la modification du mot de passe. Veuillez réessayer." };
  }
};

/**
 * Met à jour le mot de passe d'un utilisateur
 */
export const updatePassword = async (
  userId: number | string,
  form: PasswordUpdateForm,
  navigate: NavigateFunction,
  setMultipleErrors: SetStateCallback<string | Record<string, string[]>>,
  setIsUpdating: SetStateCallback<boolean>,
  toast: ToastFunction
): Promise<void> => {
  try {
    setIsUpdating(true);
    const response = await api_aw.put(URL_BACK_UPDATE_PASSWORD(userId), form);
    if (response.status === 200) {
      toast.success("Mot de passe modifié avec succès !");
      setTimeout(() => {
        navigate(URL_FRONT_LOGIN);
      }, 2000);
    }
  } catch (error) {
    setIsUpdating(false);
    const appError = handleApiError(error);
    logError(appError, 'updatePassword');

    // Gestion des erreurs de validation multiples
    if (appError.originalError && typeof appError.originalError === 'object' && 'response' in appError.originalError) {
      const axiosError = appError.originalError as { response?: { data?: { message?: string | Record<string, string[]> } } };
      if (axiosError.response?.data?.message) {
        setMultipleErrors(axiosError.response.data.message);
        return;
      }
    }
    setMultipleErrors("Une erreur est survenue lors de la modification du mot de passe. Veuillez réessayer.");
  }
};

/**
 * Persiste la langue préférée de l'utilisateur connecté (mails + UI).
 */
export const updateMyLocale = async (
  userId: number | string,
  locale: CardLocale,
  token: string
): Promise<void> => {
  try {
    await api_aw.patch(
      URL_BACK_UPDATE_MY_PROFILE(userId),
      { locale },
      { headers: { Authorization: `Bearer ${token}` } }
    );
  } catch (error) {
    const appError = handleApiError(error);
    logError(appError, "updateMyLocale");
  }
};

/**
 * Met à jour le profil (biographie, archétype préféré, locale).
 */
export const updateMyProfile = async (
  userId: number | string,
  payload: {
    biography?: string | null;
    country?: string | null;
    loved_archetype_id?: number | string | null;
    locale?: CardLocale;
  },
  token: string,
  toast: ToastFunction
): Promise<User | null> => {
  try {
    const response = await api_aw.patch(
      URL_BACK_UPDATE_MY_PROFILE(userId),
      payload,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (response.status === 200) {
      toast.success("Profil mis à jour");
      return (response.data?.user as User) ?? null;
    }
    toast.error("Une erreur inattendue s'est produite.");
    return null;
  } catch (error) {
    const appError = handleApiError(error);
    logError(appError, "updateMyProfile");
    toast.error(getErrorMessage(appError));
    return null;
  }
};

/**
 * Change le mot de passe depuis le profil (vérifie le mot de passe actuel).
 */
export const changeMyPassword = async (
  userId: number | string,
  form: ChangePasswordForm,
  token: string,
  toast: ToastFunction
): Promise<boolean> => {
  try {
    const response = await api_aw.put(
      URL_BACK_CHANGE_MY_PASSWORD(userId),
      form,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (response.status === 200) {
      toast.success("Mot de passe mis à jour");
      return true;
    }
    toast.error("Une erreur inattendue s'est produite.");
    return false;
  } catch (error) {
    const appError = handleApiError(error);
    logError(appError, "changeMyPassword");
    toast.error(getErrorMessage(appError));
    return false;
  }
};

/**
 * Met à jour un utilisateur par un administrateur
 */
export const updateUserByAdmin = async (
  userId: number | string,
  form: UserForm,
  navigate: NavigateFunction,
  toast: ToastFunction,
  setIsLoading: SetStateCallback<boolean>
): Promise<void> => {
  try {
    setIsLoading(true);
    const response = await api_aw.put(URL_BACK_UPDATE_USER_BY_ADMIN(userId), form);
    if (response.status === 200) {
      navigate(URL_FRONT_ADMIN_USERS);
      toast.success("Utilisateur modifié avec succès");
    }
  } catch (error) {
    setIsLoading(false);
    const appError = handleApiError(error);
    logError(appError, 'updateUserByAdmin');
    toast.error(getErrorMessage(appError));
  }
};

/**
 * Supprime un utilisateur (auto-suppression)
 */
export const deleteUser = async (
  userId: number | string,
  dispatch: AppDispatch,
  navigate: NavigateFunction
): Promise<void> => {
  try {
    const response = await api_aw.delete(URL_BACK_DELETE_USER(userId));
    if (response.status === 200) {
      logOut(dispatch, navigate);
    }
  } catch (error) {
    const appError = handleApiError(error);
    logError(appError, 'deleteUser');
  }
};

/**
 * Supprime un utilisateur par un administrateur
 */
export const deleteUserByAdmin = async (
  userId: number | string,
  setRefresh: SetStateCallback<boolean>
): Promise<void> => {
  try {
    const response = await api_aw.delete(URL_BACK_DELETE_USER(userId));
    if (response.status === 200) {
      setRefresh(true);
    }
  } catch (error) {
    const appError = handleApiError(error);
    logError(appError, 'deleteUserByAdmin');
  }
};
