import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api_aw from "../../../api/api_aw";
import AdminBodyHeader from "../../../components/pages/admin/AdminBodyHeader";
import AdminStructure from "../../../components/pages/admin/AdminStructure";

const AdminFiles = () => {
  const [archetypeJumbotronsImages, setArchetypeJumbotronsImages] = useState([]);
  const [archetypeCardsImages, setArchetypeCardsImages] = useState([]);

  // const getAllarchetypeJumbotronsImages = () => {
  //   api_aw.get(`public/profiles`).then((response) => {
  //     if (response.status === 200) {
  //       setArchetypeJumbotronsImages(
  //         response.data.filter(
  //           (jumbotron) => jumbotron.filetype === "ARCHETYPE_JUMBOTRON"
  //         )
  //       );
  //       setArchetypeCardsImages(
  //         response.data.filter(
  //           (jumbotron) => jumbotron.filetype === "ARCHETYPE_PRESENTATION"
  //         )
  //       );
  //     }
  //   });
  // };

  const getImagesFromCloudinaryFolder = async (folderName, setState) => {
    api_aw.get(`/images/${folderName}/all`).then((response) => {
      console.log(response.data);
      if (response.status === 200) {
        setState(response.data.data);
      }
    });
  };

  useEffect(() => {
    getImagesFromCloudinaryFolder("introduction_archetypes", setArchetypeCardsImages);
    getImagesFromCloudinaryFolder("jumbotron_archetypes", setArchetypeJumbotronsImages);
    // getAllarchetypeJumbotronsImages();
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
        <div className="bg-gray-200 rounded p-1 my-2 ">
          <div className="grid grid-cols-12 gap-1">
            {archetypeCardsImages.length > 0 && archetypeCardsImages.slice(0, 4).map((header) => {
              return (
                <div key={header.id} className="col-span-3 border-2 border-black rounded">
                  <img src={header.url} alt="" />
                </div>
              );
            })}
          </div>
          <Link
            className="block lscreen:pr-5"
            to="/admin/files/archetypesheader"
            state={{ filesArray: archetypeCardsImages }}
          >
            <button className="bg-green-300 mt-2 rounded p-1">Voir tout</button>
          </Link>
        </div>
      </div>
      <div>
        <p className="text-xl font-bold">
          Voir tous les jumbotrons d'archetype :
        </p>
        <div className="bg-gray-200 rounded p-1 my-2 ">
          <div className="grid grid-cols-12 gap-1">
            {archetypeJumbotronsImages.length > 0 && archetypeJumbotronsImages.slice(0, 2).map((jumbotron) => {
              return (
                <div key={jumbotron.id} className="col-span-6 border-2 border-black rounded">
                  <img src={jumbotron.url} alt="" />
                </div>
              );
            })}
          </div>
          <Link
            className="block lscreen:pr-5"
            to="/admin/files/archetypesjumbotron"
            state={{ filesArray: archetypeJumbotronsImages }}
          >
            <button className="bg-green-300 mt-2 rounded p-1">Voir tout</button>
          </Link>
        </div>
      </div>
    </AdminStructure>
  );
};

export default AdminFiles;
