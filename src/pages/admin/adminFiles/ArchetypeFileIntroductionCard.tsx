import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import AdminBodyHeader from "../../../components/pages/admin/AdminBodyHeader";
import AdminStructure from "../adminLayout";
import { getImagesFromCloudinaryFolder, type CloudinaryImage } from "../../../services/file";
import PopUp from "../../../components/generic/PopUp";
import { FaTrash } from "react-icons/fa";
import { api_aw_token } from "../../../api/api_aw_token";
import type { RootState } from "../../../types";

const AdminFilesIntroductionCard = () => {
  const [archetypeIntroductionCardImages, setArchetypeIntroductionCardImages] = useState<CloudinaryImage[]>([]);
  const [publicId, setPublicId] = useState<
    {
      asset_folder: string | null,
      display_name: string | null
    }
    | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { token } = useSelector((state: RootState) => state.user);

  const fetchImages = useCallback(() => {
    getImagesFromCloudinaryFolder("introduction_archetypes", setArchetypeIntroductionCardImages);
  }, []);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const handleConfirmDelete = async () => {
    if (!publicId || !token) {
      setPublicId(null);
      return;
    }
    try {
      setIsDeleting(true);
     const publicIdToDelete = `${publicId.asset_folder}/${publicId.display_name}`;
      await api_aw_token(token).delete(`/images/${publicIdToDelete}`)
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
      <div className="grid grid-cols-12">
        {archetypeIntroductionCardImages.map((card, index) => {
          const imageUrl = card.secure_url || card.url;
          return (
            <div
              className="relative col-span-4 m-1 rounded border-2 border-black group"
              key={index}
            >
              <img
                className="w-full h-full object-cover"
                src={imageUrl}
                alt={String(index)}
              />
              <button
                type="button"
                className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-red-600 text-white p-1 rounded-full shadow"
                onClick={() => setPublicId({asset_folder: card.asset_folder as string, display_name: card.display_name as string })}
              >
                <FaTrash className="w-4 h-4" />
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
          Voulez-vous vraiment supprimer cette image ? Cette action est irréversible.
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
    </AdminStructure>
  );
};

export default AdminFilesIntroductionCard;
