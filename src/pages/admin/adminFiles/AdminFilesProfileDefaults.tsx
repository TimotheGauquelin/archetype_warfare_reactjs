import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import AdminBodyHeader from "../../../components/pages/admin/AdminBodyHeader";
import AdminStructure from "../adminLayout";
import {
  getImagesFromCloudinaryFolder,
  type CloudinaryImage,
} from "../../../services/file";
import PopUp from "../../../components/generic/PopUp";
import { FaTrash } from "react-icons/fa";
import { api_aw_token } from "../../../api/api_aw_token";
import type { RootState } from "../../../types";
import { optimizeImageUrl } from "../../../utils/image/optimizeImageUrl";
import { FOLDER_PROFILE_DEFAULT } from "../../../utils/const/cloudinary";

const AdminFilesProfileDefaults = () => {
  const [images, setImages] = useState<CloudinaryImage[]>([]);
  const [imageToDelete, setImageToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { token } = useSelector((state: RootState) => state.user);

  const fetchImages = useCallback(() => {
    void getImagesFromCloudinaryFolder(FOLDER_PROFILE_DEFAULT, setImages);
  }, []);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const handleConfirmDelete = async () => {
    if (!imageToDelete || !token) {
      setImageToDelete(null);
      return;
    }
    try {
      setIsDeleting(true);
      const encoded = encodeURIComponent(imageToDelete);
      await api_aw_token(token).delete(`/images/${encoded}`);
      fetchImages();
    } catch (e) {
      console.error("Erreur lors de la suppression de l'avatar :", e);
    } finally {
      setIsDeleting(false);
      setImageToDelete(null);
    }
  };

  return (
    <AdminStructure>
      <AdminBodyHeader
        label="Photos de profil par défaut"
        catchphrase="Images proposées aux utilisateurs (Cloudinary picture_profile/default)"
        returnButton={true}
      />
      {images.length === 0 ? (
        <p className="text-sm text-gray-600">
          Aucune image dans le dossier{" "}
          <code className="text-xs bg-gray-100 px-1 rounded">
            {FOLDER_PROFILE_DEFAULT}
          </code>
          .
        </p>
      ) : (
        <div className="grid grid-cols-12 gap-2">
          {images.map((img, index) => {
            const imageUrl = img.secure_url || img.url || "";
            return (
              <div
                className="relative col-span-3 sscreen:col-span-2 m-1 rounded border-2 border-black group aspect-square overflow-hidden"
                key={img.public_id || index}
              >
                <img
                  className="w-full h-full object-cover"
                  src={optimizeImageUrl(imageUrl, "thumb")}
                  alt=""
                  width={160}
                  height={160}
                  loading="lazy"
                  decoding="async"
                />
                <button
                  type="button"
                  className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-red-600 text-white p-1 rounded-full shadow"
                  onClick={() => setImageToDelete(imageUrl)}
                >
                  <FaTrash className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      <PopUp
        isOpen={imageToDelete !== null}
        onClose={() => !isDeleting && setImageToDelete(null)}
        title="Supprimer l'image"
        showCloseButton={!isDeleting}
        closeOnBackdropClick={!isDeleting}
      >
        <p className="text-gray-700 mb-4">
          Voulez-vous vraiment supprimer cette photo de profil par défaut ?
        </p>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => setImageToDelete(null)}
            className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
            disabled={isDeleting}
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={handleConfirmDelete}
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
            disabled={isDeleting}
          >
            {isDeleting ? "Suppression..." : "Supprimer"}
          </button>
        </div>
      </PopUp>
    </AdminStructure>
  );
};

export default AdminFilesProfileDefaults;
