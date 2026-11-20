import api_aw from "../api/api_aw";
import {
  URL_BACK_AUTH_ME,
  URL_BACK_LOGIN,
  URL_BACK_LOGOUT,
  URL_BACK_REGISTER,
  URL_BACK_REQUEST_NEW_PASSWORD,
} from "../constant/urlsBack";
import { URL_FRONT_HOME } from "../constant/urlsFront";
import { setUser, clearUser } from "../redux/slice/userSlice";
import type { LoginForm, RegisterForm, PasswordRequestForm } from "../types";
import { handleApiError, getErrorMessage, logError } from "../utils/errorHandler";
import type { AppDispatch } from "../redux/store";
import type { NavigateFunction } from "react-router-dom";
import type { SetStateCallback, SetErrorMessageCallback } from "../types";
import { clearSessionToken } from "@/utils/auth/sessionToken";

export interface LoginResult {
  error?: string;
}

type AuthUserPayload = {
  id: string | number;
  email?: string;
  username?: string | null;
  roles?: string[];
};

function dispatchAuthUser(
  dispatch: AppDispatch,
  user: AuthUserPayload,
  expiresAt?: number | null
): void {
  dispatch(
    setUser({
      isAuthenticated: true,
      id: String(user.id),
      username: user.username ?? null,
      email: user.email ?? "",
      roles: user.roles ?? [],
      token: null,
      expiresAt: expiresAt ?? null,
    })
  );
}

/**
 * Connect a user and return the result (for useActionState).
 * JWT stocké en cookie httpOnly côté API.
 */
export const logIn = async (
  user: LoginForm,
  dispatch: AppDispatch,
  navigate: NavigateFunction
): Promise<LoginResult> => {
  try {
    const response = await api_aw.post(URL_BACK_LOGIN, user);
    if (response.status === 200 && response.data?.user) {
      dispatchAuthUser(
        dispatch,
        response.data.user as AuthUserPayload,
        response.data.expiresAt as number | null | undefined
      );
      navigate(URL_FRONT_HOME);
      return {};
    }
    return { error: "Une erreur inattendue s'est produite." };
  } catch (error) {
    const appError = handleApiError(error);
    logError(appError, "logIn");

    if (appError.statusCode === 429) {
      const message =
        typeof appError.originalError === "object" &&
        appError.originalError &&
        "response" in appError.originalError
          ? (appError.originalError as { response?: { data?: string } }).response
              ?.data || appError.message
          : appError.message;
      return { error: message };
    }
    return { error: getErrorMessage(appError) };
  }
};

/** Restaure la session via cookie httpOnly. */
export const fetchAuthMe = async (dispatch: AppDispatch): Promise<boolean> => {
  try {
    const response = await api_aw.get(URL_BACK_AUTH_ME);
    if (response.status === 200 && response.data?.user) {
      dispatchAuthUser(dispatch, response.data.user as AuthUserPayload);
      return true;
    }
    return false;
  } catch {
    clearSessionToken();
    dispatch(clearUser());
    return false;
  }
};

export interface PasswordRequestResult {
  success?: boolean;
  error?: string;
}

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
    logError(appError, "requestNewPasswordWithResult");
    return { error: getErrorMessage(appError) };
  }
};

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
    logError(appError, "requestNewPassword");
    setError(getErrorMessage(appError));
  }
};

export interface RegisterResult {
  success?: boolean;
  message?: string;
  multipleErrors?: Record<string, string[]> | null;
}

export const registerUser = async (userData: RegisterForm): Promise<RegisterResult> => {
  try {
    const response = await api_aw.post(URL_BACK_REGISTER, userData);
    if (response.status === 201) {
      return { success: true };
    }
    return { message: "Une erreur inattendue s'est produite." };
  } catch (error) {
    const appError = handleApiError(error);
    logError(appError, "registerUser");

    if (
      appError.originalError &&
      typeof appError.originalError === "object" &&
      "response" in appError.originalError
    ) {
      const axiosError = appError.originalError as {
        response?: { status?: number; data?: string | { message?: string } };
      };
      if (axiosError.response?.status === 429) {
        const msg =
          typeof axiosError.response.data === "string"
            ? axiosError.response.data
            : axiosError.response.data?.message || appError.message;
        return { message: msg };
      }
      if (axiosError.response?.data) {
        const msg =
          typeof axiosError.response.data === "string"
            ? axiosError.response.data
            : axiosError.response.data?.message || appError.message;
        return { message: msg };
      }
    }
    return {
      message: "Une erreur s'est produite lors de l'inscription. Veuillez réessayer.",
    };
  }
};

/** Déconnecte (clear cookie serveur + état local). */
export const logOut = async (
  dispatch: AppDispatch,
  navigate: NavigateFunction
): Promise<void> => {
  try {
    await api_aw.post(URL_BACK_LOGOUT);
  } catch {
    // ignore réseau
  } finally {
    clearSessionToken();
    dispatch(clearUser());
    navigate(URL_FRONT_HOME);
  }
};
