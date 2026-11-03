import api_aw from "../api/api_aw";
import type { SetStateCallback } from "../types";
import { handleApiError, logError } from "../utils/errorHandler";

export interface CloudinaryImage {
  public_id: string;
  secure_url: string;
  id?: string;
  url?: string;
  [key: string]: unknown;
}

/**
 * Récupère toutes les images d'un dossier Cloudinary
 * (supporte les dossiers imbriqués via /images/by-folder).
 */
export const getImagesFromCloudinaryFolder = async (
  folderName: string,
  setState: SetStateCallback<CloudinaryImage[]>
): Promise<void> => {
  try {
    const response = await api_aw.get(`/images/by-folder`, {
      params: { folder: folderName },
    });
    if (response.status === 200 && Array.isArray(response.data?.data)) {
      setState(response.data.data);
      return;
    }
    setState([]);
  } catch (error) {
    const appError = handleApiError(error);
    logError(appError, "getImagesFromCloudinaryFolder");
    setState([]);
  }
};
