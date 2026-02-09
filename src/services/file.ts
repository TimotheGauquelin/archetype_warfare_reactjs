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
 */
export const getImagesFromCloudinaryFolder = async (
  folderName: string,
  setState: SetStateCallback<CloudinaryImage[]>
): Promise<void> => {
  try {
    const response = await api_aw.get(`/images/${folderName}/all`);
    if (response.status === 200 && response.data?.data) {
      setState(response.data.data);
    }
  } catch (error) {
    const appError = handleApiError(error);
    logError(appError, 'getImagesFromCloudinaryFolder');
  }
};
