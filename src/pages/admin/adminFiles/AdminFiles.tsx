import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminBodyHeader from "../../../components/pages/admin/AdminBodyHeader";
import AdminStructure from "../adminLayout";
import { getImagesFromCloudinaryFolder, type CloudinaryImage } from "../../../services/file";
import { URL_FRONT_ADMIN_FILES_ARCHETYPES_INTRODUCTION_CARD, URL_FRONT_ADMIN_FILES_ARCHETYPES_JUMBOTRON } from "../../../constant/urlsFront";
import Button from "../../../components/generic/buttons/classicButton/Button";
import { FOLDER_INTRODUCTION, FOLDER_JUMBOTRON } from "../../../utils/const/cloudinary";

const AdminFiles = () => {
  const [archetypeJumbotronsImages, setArchetypeJumbotronsImages] = useState<CloudinaryImage[]>([]);
  const [archetypeCardsImages, setArchetypeCardsImages] = useState<CloudinaryImage[]>([]);
  const [isFetching, setIsFetching] = useState(false);

  const navigate = useNavigate();

  const fetchImages = async () => {
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
  };

  useEffect(() => {
    fetchImages();
  }, []);

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
                return (
                  <div key={header.public_id} className="col-span-3 border-2 border-black rounded">
                    <img src={header.secure_url || header.url} alt="" />
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
              : archetypeJumbotronsImages?.length > 0 && (archetypeJumbotronsImages.slice(0, 2).map((jumbotron) => {
                return (
                  <div key={jumbotron.public_id} className="col-span-6 border-2 border-black rounded">
                    <img src={jumbotron.secure_url || jumbotron.url} alt="" />
                  </div>
                )
              }))}
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
    </AdminStructure>
  );
};

export default AdminFiles;
