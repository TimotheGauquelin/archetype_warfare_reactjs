import api_aw from "../api/api_aw";
import { URL_BACK_ADD_USER, URL_BACK_CREATE_USER_BY_ADMIN, URL_BACK_DELETE_USER, URL_BACK_GET_ALL_USERS, URL_BACK_GET_USER_BY_ID, URL_BACK_GET_USER_BY_RESET_PASSWORD_TOKEN, URL_BACK_SEARCH_USERS, URL_BACK_SWITCH_USER_IS_ACTIVE, URL_BACK_SWITCH_USER_IS_BANNED, URL_BACK_UPDATE_PASSWORD, URL_BACK_UPDATE_USER_BY_ADMIN } from "../constant/urlsBack";
import { URL_FRONT_ADMIN_USERS, URL_FRONT_HOME, URL_FRONT_LOGIN } from "../constant/urlsFront";
import { logOut } from "./auth";
import type { User, UserForm, PasswordUpdateForm, UserSearchCriteria, Pagination, PaginatedResponse, SetStateCallback, SetErrorMessageCallback } from "../types";
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
      URL_BACK_SEARCH_USERS(size, pagination.currentPage, criteria.username ?? '')
    );
    if (response.status === 200 && response.data) {
      setUsers(response.data);
    }
  } catch (error) {
    const appError = handleApiError(error);
    logError(appError, 'searchUsers');
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
  navigate: NavigateFunction
): Promise<void> => {
  try {
    const response = await api_aw.post(URL_BACK_CREATE_USER_BY_ADMIN, newUser);
    if (response.status === 201) {
      navigate(URL_FRONT_ADMIN_USERS);
    }
  } catch (error) {
    const appError = handleApiError(error);
    logError(appError, 'createUserByAdmin');
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
