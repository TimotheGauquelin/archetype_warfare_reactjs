import api_aw from "../api/api_aw";
import { api_aw_token } from "../api/api_aw_token";
import { URL_BACK_ADD_BANLIST, URL_BACK_DELETE_BANLIST, URL_BACK_GET_BANLISTS, URL_BACK_GET_CURRENT_BANLIST, URL_BACK_UPDATE_BANLIST } from "../constant/urlsBack";
import { URL_FRONT_ADMIN_BANLISTS } from "../constant/urlsFront";
import type { Banlist, SetStateCallback } from "../types";
import { handleApiError, getErrorMessage, logError } from "../utils/errorHandler";
import type { NavigateFunction } from "react-router-dom";
import type { ToastFunction } from "./websiteactions";

/**
 * Retrieves the current banlist
 */
export const getCurrentBanlist = async (
  setBanlist: SetStateCallback<Banlist>
): Promise<void> => {
  try {
    const response = await api_aw.get(URL_BACK_GET_CURRENT_BANLIST);
    if (response.status === 200 && response.data) {
      setBanlist(response.data);
    }
  } catch (error) {
    const appError = handleApiError(error);
    logError(appError, 'getCurrentBanlist');
  }
};

/**
 * Retrieves all banlists
 */
export const getBanlists = async (
  setBanlists: SetStateCallback<Banlist[]>
): Promise<void> => {
  try {
    const response = await api_aw.get(URL_BACK_GET_BANLISTS);
    if (response.status === 200 && response.data) {
      setBanlists(response.data);
    }
  } catch (error) {
    const appError = handleApiError(error);
    logError(appError, 'getBanlists');
  }
};

/**
 * Retrieves a banlist by its ID
 */
export const getBanlistById = async (
  id: number | string,
  setBanlist: SetStateCallback<Banlist>
): Promise<void> => {
  try {
    const response = await api_aw.get(`/banlists/${id}`);
    if (response.status === 200 && response.data?.data) {
      setBanlist(response.data.data);
    }
  } catch (error) {
    const appError = handleApiError(error);
    logError(appError, 'getBanlistById');
  }
};

// POST

/**
 * Adds a new banlist
 */
export const addBanlist = async (
  token: string,
  newBanlist: Partial<Banlist>,
  navigate: NavigateFunction,
  toast: ToastFunction,
  setIsLoading: SetStateCallback<boolean>
): Promise<void> => {
  try {
    setIsLoading(true);
    const response = await api_aw_token(token).post(URL_BACK_ADD_BANLIST, newBanlist);
    if (response.status === 201) {
      navigate(URL_FRONT_ADMIN_BANLISTS);
      toast.success("Banlist ajoutée avec succès");
    }
  } catch (error) {
    setIsLoading(false);
    const appError = handleApiError(error);
    logError(appError, 'addBanlist');
    toast.error(getErrorMessage(appError));
  } finally {
    setIsLoading(false);
  }
};

// PUT

/**
 * Updates a banlist
 */
export const updateBanlist = async (
  token: string,
  banlistId: number | string,
  data: Partial<Banlist>,
  navigate: NavigateFunction,
  setIsLoading: SetStateCallback<boolean>
): Promise<void> => {
  try {
    setIsLoading(true);
    const response = await api_aw_token(token).put(URL_BACK_UPDATE_BANLIST(banlistId), data);
    if (response.status === 200) {
      navigate(URL_FRONT_ADMIN_BANLISTS);
    }
  } catch (error) {
    setIsLoading(false);
    const appError = handleApiError(error);
    logError(appError, 'updateBanlist');
  } finally {
    setIsLoading(false);
  }
};

// DELETE

/**
 * Deletes a banlist
 */
export const deleteBanlist = async (
  token: string,
  banlistId: number | string,
  navigate: NavigateFunction,
  setIsLoading: SetStateCallback<boolean>
): Promise<void> => {
  try {
    setIsLoading(true);
    const response = await api_aw_token(token).delete(URL_BACK_DELETE_BANLIST(banlistId));
    if (response.status === 200) {
      navigate(URL_FRONT_ADMIN_BANLISTS);
    }
  } catch (error) {
    setIsLoading(false);
    const appError = handleApiError(error);
    logError(appError, 'deleteBanlist');
  } finally {
    setIsLoading(false);
  }
};
