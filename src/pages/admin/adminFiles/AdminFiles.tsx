import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AdminBodyHeader from "../../../components/pages/admin/AdminBodyHeader";
import AdminStructure from "../adminLayout";
import { getImagesFromCloudinaryFolder, type CloudinaryImage } from "../../../services/file";
import { URL_FRONT_ADMIN_FILES_ARCHETYPES_INTRODUCTION_CARD, URL_FRONT_ADMIN_FILES_ARCHETYPES_JUMBOTRON } from "../../../constant/urlsFront";
import Button from "../../../components/generic/buttons/classicButton/Button";
import { FOLDER_INTRODUCTION, FOLDER_JUMBOTRON } from "../../../utils/const/cloudinary";
import PopUp from "../../../components/generic/PopUp";
import { FaTrash } from "react-icons/fa";
import { api_aw_token } from "../../../api/api_aw_token";
import type { RootState } from "../../../types";

const AdminFiles = () => {
  const [archetypeJumbotronsImages, setArchetypeJumbotronsImages] = useState<CloudinaryImage[]>([]);
  const [archetypeCardsImages, setArchetypeCardsImages] = useState<CloudinaryImage[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [imageToDelete, setImageToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { token } = useSelector((state: RootState) => state.user);

  const navigate = useNavigate();

  const fetchImages = useCallback(async () => {
    try {
      setIsFetching(true);

      await Promise.all([
        getImagesFromCloudinaryFolder(FOLDER_INTRODUCTION, setArchetypeCardsImages),
        getImagesFromCloudinaryFolder(FOLDER_JUMBOTRON, setArchetypeJumbotronsImages),
      ]);
    } catch (err) {
      console.error("Erreur lors du chargement des images:", err);
    } finally {
      setIsFetching(false);
    }
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
      await fetchImages();
    } catch (e) {
      console.error("Erreur lors de la suppression de l'image:", e);
    } finally {
      setIsDeleting(false);
      setImageToDelete(null);
    }
  };

  return (
    <AdminStructure>
      <AdminBodyHeader
        label="Fichiers"
        catchphrase="Vérifiez tous les fichiers"
      />
      <div>
        <p className="text-xl font-bold">
          Voir tous les cartes d'archetype :
        </p>
        <div className="flex flex-col items-end">
          <div className="grid grid-cols-12 gap-1 bg-gray-200 rounded p-1 my-2 ">
            {isFetching ? (
              <div className="w-full h-[100px] bg-gray-200 rounded animate-pulse">
              </div>
            ) : archetypeCardsImages.length > 0 && (
              archetypeCardsImages.slice(0, 4).map((header) => {
                const imageUrl = header.secure_url || header.url || "";
                return (
                  <div
                    key={header.public_id}
                    className="relative col-span-3 border-2 border-black rounded group"
                  >
                    <img src={imageUrl} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-red-600 text-white p-1 rounded-full shadow"
                      onClick={() => setImageToDelete(imageUrl)}
                    >
                      <FaTrash className="w-4 h-4" />
                    </button>
                  </div>
                );
              })
            )}
          </div>
          <Button
            buttonText="Voir toutes les cartes de présentation"
            className="block w-fit mt-2 bg-blue-500 text-white px-4 py-2 rounded font-semibold transition-all duration-200 shadow-sm"
            action={() => {
              navigate(URL_FRONT_ADMIN_FILES_ARCHETYPES_INTRODUCTION_CARD);
            }}
          />
        </div>
      </div>
      <div>
        <p className="text-xl font-bold">
          Voir tous les jumbotrons d'archetype :
        </p>
        <div className="flex flex-col items-end">
          <div className="grid grid-cols-12 gap-1 bg-gray-200 rounded p-1 my-2 ">
            {isFetching
              ? (
                <div className="w-full h-[100px] bg-gray-200 rounded animate-pulse">
                </div>
              )
              : archetypeJumbotronsImages?.length > 0 && (
                archetypeJumbotronsImages.slice(0, 2).map((jumbotron) => {
                  const imageUrl = jumbotron.secure_url || jumbotron.url || "";
                  return (
                    <div
                      key={jumbotron.public_id}
                      className="relative col-span-6 border-2 border-black rounded group"
                    >
                      <img src={imageUrl} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-red-600 text-white p-1 rounded-full shadow"
                        onClick={() => setImageToDelete(imageUrl)}
                      >
                        <FaTrash className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })
              )}
          </div>
          <Button
            buttonText="Voir tous les jumbotrons"
            className="block w-fit mt-2 bg-blue-500 text-white px-4 py-2 rounded font-semibold transition-all duration-200 shadow-sm"
            action={() => {
              navigate(URL_FRONT_ADMIN_FILES_ARCHETYPES_JUMBOTRON);
            }}
          />
        </div>
      </div>

      <PopUp
        isOpen={imageToDelete !== null}
        onClose={() => !isDeleting && setImageToDelete(null)}
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

export default AdminFiles;
