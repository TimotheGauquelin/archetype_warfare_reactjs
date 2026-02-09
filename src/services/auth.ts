import jwtDecode from "jwt-decode";
import api_aw from "../api/api_aw";
import { URL_BACK_LOGIN, URL_BACK_REGISTER, URL_BACK_REQUEST_NEW_PASSWORD } from "../constant/urlsBack";
import { URL_FRONT_HOME } from "../constant/urlsFront";
import { setUser, clearUser } from "../redux/slice/userSlice";
import type { LoginForm, RegisterForm, PasswordRequestForm, DecodedToken } from "../types";
import { handleApiError, getErrorMessage, logError } from "../utils/errorHandler";
import type { AppDispatch } from "../redux/store";
import type { NavigateFunction } from "react-router-dom";
import type { SetStateCallback, SetErrorMessageCallback } from "../types";

/**
 * Résultat d'une tentative de connexion (pour useActionState / form actions)
 */
export interface LoginResult {
  error?: string;
}

/**
 * Connect a user and return the result (for useActionState).
 * If successful, dispatch and navigate are called; the caller receives {}.
 */
export const logIn = async (
  user: LoginForm,
  dispatch: AppDispatch,
  navigate: NavigateFunction
): Promise<LoginResult> => {
  try {
    const response = await api_aw.post(URL_BACK_LOGIN, user);
    if (response.status === 200 && response.data?.token) {
      const decodedToken = jwtDecode<DecodedToken>(response.data.token);

      dispatch(setUser({
        isAuthenticated: true,
        id: decodedToken.id,
        username: decodedToken.username,
        email: decodedToken.email,
        roles: decodedToken.roles,
        token: response.data.token
      }));

      navigate(URL_FRONT_HOME);
      return {};
    }
    return { error: "Une erreur inattendue s'est produite." };
  } catch (error) {
    const appError = handleApiError(error);
    logError(appError, 'logIn');

    if (appError.statusCode === 429) {
      const message = typeof appError.originalError === 'object' && appError.originalError && 'response' in appError.originalError
        ? (appError.originalError as { response?: { data?: string } }).response?.data || appError.message
        : appError.message;
      return { error: message };
    }
    return { error: getErrorMessage(appError) };
  }
};

/**
 * Résultat d'une demande de réinitialisation de mot de passe (pour useActionState)
 */
export interface PasswordRequestResult {
  success?: boolean;
  error?: string;
}

/**
 * Demande un nouveau mot de passe et retourne un résultat (pour useActionState).
 */
export const requestNewPasswordWithResult = async (
  email: PasswordRequestForm
): Promise<PasswordRequestResult> => {
  try {
    const response = await api_aw.post(URL_BACK_REQUEST_NEW_PASSWORD, email);
    if (response.status === 200) {
      return { success: true };
    }
    return { error: "Une erreur inattendue s'est produite." };
  } catch (error) {
    const appError = handleApiError(error);
    logError(appError, 'requestNewPasswordWithResult');
    return { error: getErrorMessage(appError) };
  }
};

/**
 * Demande un nouveau mot de passe
 */
export const requestNewPassword = async (
  email: PasswordRequestForm,
  setRequestIsDone: SetStateCallback<boolean>,
  setError: SetErrorMessageCallback,
  setIsLoading: SetStateCallback<boolean>
): Promise<void> => {
  try {
    setIsLoading(true);
    const response = await api_aw.post(URL_BACK_REQUEST_NEW_PASSWORD, email);
    if (response.status === 200) {
      setIsLoading(false);
      setRequestIsDone(true);
    }
  } catch (error) {
    setIsLoading(false);
    const appError = handleApiError(error);
    logError(appError, 'requestNewPassword');
    setError(getErrorMessage(appError));
  }
};

/**
 * Result of a registration attempt (for useActionState)
 */
export interface RegisterResult {
  success?: boolean;
  message?: string;
  multipleErrors?: Record<string, string[]> | null;
}

/**
 * Register a new user and return a result (for useActionState).
 * If successful, the caller must handle toast and navigation.
 */
export const registerUser = async (userData: RegisterForm): Promise<RegisterResult> => {
  try {
    const response = await api_aw.post(URL_BACK_REGISTER, userData);
    if (response.status === 201) {
      return { success: true };
    }
    return { message: "Une erreur inattendue s'est produite." };
  } catch (error) {
    const appError = handleApiError(error);
    logError(appError, 'registerUser');

    if (appError.originalError && typeof appError.originalError === 'object' && 'response' in appError.originalError) {
      const axiosError = appError.originalError as { response?: { status?: number; data?: string | { message?: string } } };
      if (axiosError.response?.status === 429) {
        const msg = typeof axiosError.response.data === 'string' ? axiosError.response.data : axiosError.response.data?.message || appError.message;
        return { message: msg };
      }
      if (axiosError.response?.data) {
        const msg = typeof axiosError.response.data === 'string' ? axiosError.response.data : axiosError.response.data?.message || appError.message;
        return { message: msg };
      }
    }
    return { message: "Une erreur s'est produite lors de l'inscription. Veuillez réessayer." };
  }
};

/**
 * Déconnecte un utilisateur
 */
export const logOut = (dispatch: AppDispatch, navigate: NavigateFunction): void => {
  dispatch(clearUser());
  navigate(URL_FRONT_HOME);
};
