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
import { FOLDER_INTRODUCTION } from "../../../utils/const/cloudinary";

const checkerBg =
  "bg-[linear-gradient(45deg,#e2e8f0_25%,transparent_25%),linear-gradient(-45deg,#e2e8f0_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#e2e8f0_75%),linear-gradient(-45deg,transparent_75%,#e2e8f0_75%)] bg-[length:16px_16px] bg-[position:0_0,0_8px,8px_-8px,-8px_0]";

const AdminFilesIntroductionCard = () => {
  const [archetypeIntroductionCardImages, setArchetypeIntroductionCardImages] =
    useState<CloudinaryImage[]>([]);
  const [publicId, setPublicId] = useState<{
    asset_folder: string | null;
    display_name: string | null;
  } | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { token, isAuthenticated } = useSelector(
    (state: RootState) => state.user
  );

  const fetchImages = useCallback(() => {
    getImagesFromCloudinaryFolder(
      FOLDER_INTRODUCTION,
      setArchetypeIntroductionCardImages
    );
  }, []);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const handleConfirmDelete = async () => {
    if (!publicId || !isAuthenticated) {
      setPublicId(null);
      return;
    }
    try {
      setIsDeleting(true);
      const publicIdToDelete = `${publicId.asset_folder}/${publicId.display_name}`;
      await api_aw_token(token).delete(`/images/${publicIdToDelete}`);
      fetchImages();
    } catch (e) {
      console.error("Erreur lors de la suppression de l'image :", e);
    } finally {
      setIsDeleting(false);
      setPublicId(null);
    }
  };

  return (
    <AdminStructure>
      <AdminBodyHeader
        label="Cartes de Présentation d'Archetype"
        catchphrase="Vérifiez tous les fichiers"
        returnButton={true}
      />
      <div className="grid grid-cols-2 sscreen:grid-cols-3 lscreen:grid-cols-4 gap-4 rounded-xl bg-slate-50 border border-slate-200 p-4">
        {archetypeIntroductionCardImages.map((card, index) => {
          const imageUrl = card.secure_url || card.url || "";
          return (
            <div
              className={`relative aspect-[3/4] rounded-lg border border-slate-300 overflow-hidden group shadow-sm ${checkerBg}`}
              key={card.public_id || index}
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
                  alt={String(index)}
                  loading="lazy"
                  decoding="async"
                />
              </button>
              <button
                type="button"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-red-600 text-white p-1.5 rounded-full shadow"
                onClick={() =>
                  setPublicId({
                    asset_folder: card.asset_folder as string,
                    display_name: card.display_name as string,
                  })
                }
                aria-label="Supprimer"
              >
                <FaTrash className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>

      <PopUp
        isOpen={publicId !== null}
        onClose={() => !isDeleting && setPublicId(null)}
        title="Supprimer l'image"
        showCloseButton={!isDeleting}
        closeOnBackdropClick={!isDeleting}
      >
        <p className="text-gray-700 mb-4">
          Voulez-vous vraiment supprimer cette image ? Cette action est
          irréversible.
        </p>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => setPublicId(null)}
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

export default AdminFilesIntroductionCard;
