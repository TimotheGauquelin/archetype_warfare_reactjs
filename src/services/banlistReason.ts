import api_aw from "../api/api_aw";
import { api_aw_token } from "../api/api_aw_token";
import {
  URL_BACK_ADD_BANLIST_REASON,
  URL_BACK_DELETE_BANLIST_REASON,
  URL_BACK_GET_BANLIST_REASONS,
  URL_BACK_UPDATE_BANLIST_REASON,
} from "../constant/urlsBack";
import type { BanlistReason, SetStateCallback } from "../types";
import { getErrorMessage, handleApiError, logError } from "../utils/errorHandler";
import type { ToastFunction } from "./websiteactions";

export const getBanlistReasons = async (
  setReasons: SetStateCallback<BanlistReason[]>
): Promise<BanlistReason[]> => {
  try {
    const response = await api_aw.get(URL_BACK_GET_BANLIST_REASONS);
    if (response.status === 200 && Array.isArray(response.data)) {
      setReasons(response.data);
      return response.data;
    }
    return [];
  } catch (error) {
    const appError = handleApiError(error);
    logError(appError, "getBanlistReasons");
    return [];
  }
};

export const createBanlistReason = async (
  token: string,
  data: Partial<BanlistReason>,
  toast?: ToastFunction
): Promise<BanlistReason | null> => {
  try {
    const response = await api_aw_token(token).post(URL_BACK_ADD_BANLIST_REASON, data);
    if (response.status === 201) {
      toast?.success("Raison créée");
      return response.data as BanlistReason;
    }
    return null;
  } catch (error) {
    const appError = handleApiError(error);
    logError(appError, "createBanlistReason");
    toast?.error(getErrorMessage(appError));
    return null;
  }
};

export const updateBanlistReason = async (
  token: string,
  id: number,
  data: Partial<BanlistReason>,
  toast?: ToastFunction
): Promise<BanlistReason | null> => {
  try {
    const response = await api_aw_token(token).put(URL_BACK_UPDATE_BANLIST_REASON(id), data);
    if (response.status === 200) {
      toast?.success("Raison mise à jour");
      return response.data as BanlistReason;
    }
    return null;
  } catch (error) {
    const appError = handleApiError(error);
    logError(appError, "updateBanlistReason");
    toast?.error(getErrorMessage(appError));
    return null;
  }
};

export const deleteBanlistReason = async (
  token: string,
  id: number,
  toast?: ToastFunction
): Promise<boolean> => {
  try {
    const response = await api_aw_token(token).delete(URL_BACK_DELETE_BANLIST_REASON(id));
    if (response.status === 200) {
      toast?.success("Raison supprimée");
      return true;
    }
    return false;
  } catch (error) {
    const appError = handleApiError(error);
    logError(appError, "deleteBanlistReason");
    toast?.error(getErrorMessage(appError));
    return false;
  }
};
