import { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AdminBodyHeader from "../../../components/pages/admin/AdminBodyHeader";
import AdminStructure from "../adminLayout";
import {
  getImagesFromCloudinaryFolder,
  uploadImageToFolder,
  type CloudinaryImage,
} from "../../../services/file";
import {
  URL_FRONT_ADMIN_FILES_ARCHETYPES_INTRODUCTION_CARD,
  URL_FRONT_ADMIN_FILES_ARCHETYPES_JUMBOTRON,
  URL_FRONT_ADMIN_FILES_PROFILE_DEFAULTS,
} from "../../../constant/urlsFront";
import Button from "../../../components/generic/buttons/classicButton/Button";
import {
  FOLDER_INTRODUCTION,
  FOLDER_JUMBOTRON,
  FOLDER_PROFILE_DEFAULT,
} from "../../../utils/const/cloudinary";
import PopUp from "../../../components/generic/PopUp";
import { FaTrash, FaPlus } from "react-icons/fa";
import { api_aw_token } from "../../../api/api_aw_token";
import type { RootState } from "../../../types";
import { optimizeImageUrl } from "../../../utils/image/optimizeImageUrl";
import { convertBase64 } from "../../../utils/img/convertBase";
import { handleApiError } from "../../../utils/errorHandler";

const AdminFiles = () => {
  const [archetypeJumbotronsImages, setArchetypeJumbotronsImages] = useState<
    CloudinaryImage[]
  >([]);
  const [archetypeCardsImages, setArchetypeCardsImages] = useState<
    CloudinaryImage[]
  >([]);
  const [profileDefaultImages, setProfileDefaultImages] = useState<
    CloudinaryImage[]
  >([]);
  const [isFetching, setIsFetching] = useState(false);
  const [imageToDelete, setImageToDelete] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { token, isAuthenticated } = useSelector(
    (state: RootState) => state.user
  );

  const navigate = useNavigate();

  const fetchImages = useCallback(async () => {
    try {
      setIsFetching(true);

      await Promise.all([
        getImagesFromCloudinaryFolder(
          FOLDER_INTRODUCTION,
          setArchetypeCardsImages
        ),
        getImagesFromCloudinaryFolder(
          FOLDER_JUMBOTRON,
          setArchetypeJumbotronsImages
        ),
        getImagesFromCloudinaryFolder(
          FOLDER_PROFILE_DEFAULT,
          setProfileDefaultImages
        ),
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
    if (!imageToDelete || !isAuthenticated) {
      setImageToDelete(null);
      return;
    }
    try {
      setIsDeleting(true);
      const encoded = encodeURIComponent(imageToDelete);
      await api_aw_token(token).delete(`/images/${encoded}`);
      await fetchImages();
      toast.success("Image supprimée");
    } catch (e) {
      console.error("Erreur lors de la suppression de l'image:", e);
      toast.error("Suppression impossible");
    } finally {
      setIsDeleting(false);
      setImageToDelete(null);
    }
  };

  const handleUploadProfileDefault = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
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
      await fetchImages();
      toast.success("Photo de profil ajoutée");
    } catch (error) {
      toast.error(handleApiError(error).message || "Upload impossible");
    } finally {
      setIsUploading(false);
    }
  };

  const renderImageTile = (
    imageUrl: string,
    key: string,
    aspectClass: string
  ) => (
    <div
      key={key}
      className={`relative ${aspectClass} rounded-lg border border-slate-300 bg-slate-100 overflow-hidden group shadow-sm`}
    >
      <button
        type="button"
        className="block w-full h-full cursor-zoom-in"
        onClick={() => setPreviewUrl(imageUrl)}
        title="Agrandir"
      >
        <img
          src={optimizeImageUrl(imageUrl, "card")}
          alt=""
          className="w-full h-full object-contain bg-[linear-gradient(45deg,#e2e8f0_25%,transparent_25%),linear-gradient(-45deg,#e2e8f0_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#e2e8f0_75%),linear-gradient(-45deg,transparent_75%,#e2e8f0_75%)] bg-[length:16px_16px] bg-[position:0_0,0_8px,8px_-8px,-8px_0]"
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

  return (
    <AdminStructure>
      <AdminBodyHeader
        label="Fichiers"
        catchphrase="Vérifiez tous les fichiers"
      />

      <section className="mb-8">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <h2 className="text-xl font-bold">Cartes de présentation</h2>
          <Button
            buttonText="Voir toutes les cartes de présentation"
            className="w-fit bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded font-semibold shadow-sm"
            action={() =>
              navigate(URL_FRONT_ADMIN_FILES_ARCHETYPES_INTRODUCTION_CARD)
            }
          />
        </div>
        <div className="grid grid-cols-2 sscreen:grid-cols-4 gap-3 rounded-xl bg-slate-50 border border-slate-200 p-3">
          {isFetching ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[3/4] rounded-lg bg-slate-200 animate-pulse"
              />
            ))
          ) : archetypeCardsImages.length > 0 ? (
            archetypeCardsImages.slice(0, 4).map((header) => {
              const imageUrl = header.secure_url || header.url || "";
              return renderImageTile(
                imageUrl,
                header.public_id,
                "aspect-[3/4]"
              );
            })
          ) : (
            <p className="col-span-full text-sm text-slate-600 p-2">
              Aucune carte de présentation.
            </p>
          )}
        </div>
      </section>

      <section className="mb-8">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <h2 className="text-xl font-bold">Jumbotrons d&apos;archétype</h2>
          <Button
            buttonText="Voir tous les jumbotrons"
            className="w-fit bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded font-semibold shadow-sm"
            action={() => navigate(URL_FRONT_ADMIN_FILES_ARCHETYPES_JUMBOTRON)}
          />
        </div>
        <div className="grid grid-cols-1 sscreen:grid-cols-2 gap-3 rounded-xl bg-slate-50 border border-slate-200 p-3">
          {isFetching ? (
            Array.from({ length: 2 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[16/9] rounded-lg bg-slate-200 animate-pulse"
              />
            ))
          ) : archetypeJumbotronsImages.length > 0 ? (
            archetypeJumbotronsImages.slice(0, 2).map((jumbotron) => {
              const imageUrl = jumbotron.secure_url || jumbotron.url || "";
              return renderImageTile(
                imageUrl,
                jumbotron.public_id,
                "aspect-[16/9]"
              );
            })
          ) : (
            <p className="col-span-full text-sm text-slate-600 p-2">
              Aucun jumbotron.
            </p>
          )}
        </div>
      </section>

      <section className="mb-4">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <h2 className="text-xl font-bold">Photos de profil par défaut</h2>
          <div className="flex flex-wrap gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleUploadProfileDefault}
            />
            <Button
              buttonText={
                isUploading ? "Upload…" : "Ajouter une photo de profil"
              }
              icon={<FaPlus className="w-3.5 h-3.5" aria-hidden />}
              className="w-fit bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded font-semibold shadow-sm disabled:opacity-50 inline-flex items-center"
              action={() => fileInputRef.current?.click()}
              disabled={isUploading || !isAuthenticated}
            />
            <Button
              buttonText="Voir toutes les photos de profil"
              className="w-fit bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded font-semibold shadow-sm"
              action={() => navigate(URL_FRONT_ADMIN_FILES_PROFILE_DEFAULTS)}
            />
          </div>
        </div>
        <div className="grid grid-cols-3 sscreen:grid-cols-6 gap-3 rounded-xl bg-slate-50 border border-slate-200 p-3">
          {isFetching ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square rounded-lg bg-slate-200 animate-pulse"
              />
            ))
          ) : profileDefaultImages.length > 0 ? (
            profileDefaultImages.slice(0, 6).map((img) => {
              const imageUrl = img.secure_url || img.url || "";
              return renderImageTile(
                imageUrl,
                img.public_id,
                "aspect-square"
              );
            })
          ) : (
            <p className="col-span-full text-sm text-slate-600 p-2">
              Aucune image dans{" "}
              <code className="text-xs bg-white px-1 rounded border">
                {FOLDER_PROFILE_DEFAULT}
              </code>
            </p>
          )}
        </div>
      </section>

      <PopUp
        isOpen={imageToDelete !== null}
        onClose={() => !isDeleting && setImageToDelete(null)}
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
            className="w-full max-h-[70vh] object-contain rounded-lg bg-slate-100"
          />
        ) : null}
      </PopUp>
    </AdminStructure>
  );
};

export default AdminFiles;
