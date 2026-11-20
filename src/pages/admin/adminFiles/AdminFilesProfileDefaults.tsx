import { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import AdminBodyHeader from "../../../components/pages/admin/AdminBodyHeader";
import AdminStructure from "../adminLayout";
import {
  getImagesFromCloudinaryFolder,
  uploadImageToFolder,
  type CloudinaryImage,
} from "../../../services/file";
import PopUp from "../../../components/generic/PopUp";
import { FaPlus, FaTrash } from "react-icons/fa";
import { api_aw_token } from "../../../api/api_aw_token";
import type { RootState } from "../../../types";
import { optimizeImageUrl } from "../../../utils/image/optimizeImageUrl";
import { FOLDER_PROFILE_DEFAULT } from "../../../utils/const/cloudinary";
import { convertBase64 } from "../../../utils/img/convertBase";
import { handleApiError } from "../../../utils/errorHandler";
import Button from "../../../components/generic/buttons/classicButton/Button";

const checkerBg =
  "bg-[linear-gradient(45deg,#e2e8f0_25%,transparent_25%),linear-gradient(-45deg,#e2e8f0_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#e2e8f0_75%),linear-gradient(-45deg,transparent_75%,#e2e8f0_75%)] bg-[length:16px_16px] bg-[position:0_0,0_8px,8px_-8px,-8px_0]";

const AdminFilesProfileDefaults = () => {
  const [images, setImages] = useState<CloudinaryImage[]>([]);
  const [imageToDelete, setImageToDelete] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { token, isAuthenticated } = useSelector(
    (state: RootState) => state.user
  );

  const fetchImages = useCallback(() => {
    void getImagesFromCloudinaryFolder(FOLDER_PROFILE_DEFAULT, setImages);
  }, []);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const handleConfirmDelete = async () => {
    if (!imageToDelete || !isAuthenticated) {
      setImageToDelete(null);
      return;
    }
    try {
      setIsDeleting(true);
      const encoded = encodeURIComponent(imageToDelete);
      await api_aw_token(token).delete(`/images/${encoded}`);
      fetchImages();
      toast.success("Image supprimée");
    } catch (e) {
      console.error("Erreur lors de la suppression de l'avatar :", e);
      toast.error("Suppression impossible");
    } finally {
      setIsDeleting(false);
      setImageToDelete(null);
    }
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !isAuthenticated) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Choisissez un fichier image");
      return;
    }

    try {
      setIsUploading(true);
      const base64Img = await convertBase64(file);
      if (typeof base64Img !== "string") {
        toast.error("Lecture du fichier impossible");
        return;
      }
      await uploadImageToFolder(base64Img, FOLDER_PROFILE_DEFAULT);
      fetchImages();
      toast.success("Photo de profil ajoutée");
    } catch (error) {
      toast.error(handleApiError(error).message || "Upload impossible");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <AdminStructure>
      <AdminBodyHeader
        label="Photos de profil par défaut"
        catchphrase="Images proposées aux utilisateurs (Cloudinary picture_profile/default)"
        returnButton={true}
      />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleUpload}
        />
        <Button
          buttonText={isUploading ? "Upload…" : "Ajouter une photo de profil"}
          icon={<FaPlus className="w-3.5 h-3.5" aria-hidden />}
          className="w-fit bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded font-semibold shadow-sm disabled:opacity-50 inline-flex items-center"
          action={() => fileInputRef.current?.click()}
          disabled={isUploading || !isAuthenticated}
        />
      </div>

      {images.length === 0 ? (
        <p className="text-sm text-gray-600">
          Aucune image dans le dossier{" "}
          <code className="text-xs bg-gray-100 px-1 rounded">
            {FOLDER_PROFILE_DEFAULT}
          </code>
          .
        </p>
      ) : (
        <div className="grid grid-cols-2 sscreen:grid-cols-4 lscreen:grid-cols-5 gap-4 rounded-xl bg-slate-50 border border-slate-200 p-4">
          {images.map((img, index) => {
            const imageUrl = img.secure_url || img.url || "";
            return (
              <div
                className={`relative aspect-square rounded-lg border border-slate-300 overflow-hidden group shadow-sm ${checkerBg}`}
                key={img.public_id || index}
              >
                <button
                  type="button"
                  className="block w-full h-full cursor-zoom-in"
                  onClick={() => setPreviewUrl(imageUrl)}
                  title="Agrandir"
                >
                  <img
                    className="w-full h-full object-contain"
                    src={optimizeImageUrl(imageUrl, "card")}
                    alt=""
                    loading="lazy"
                    decoding="async"
                  />
                </button>
                <button
                  type="button"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-red-600 text-white p-1.5 rounded-full shadow"
                  onClick={() => setImageToDelete(imageUrl)}
                  aria-label="Supprimer"
                >
                  <FaTrash className="w-3.5 h-3.5" />
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

      <PopUp
        isOpen={previewUrl !== null}
        onClose={() => setPreviewUrl(null)}
        title="Aperçu"
        showCloseButton
      >
        {previewUrl ? (
          <img
            src={optimizeImageUrl(previewUrl, "card")}
            alt=""
            className={`w-full max-h-[70vh] object-contain rounded-lg ${checkerBg}`}
          />
        ) : null}
      </PopUp>
    </AdminStructure>
  );
};

export default AdminFilesProfileDefaults;
