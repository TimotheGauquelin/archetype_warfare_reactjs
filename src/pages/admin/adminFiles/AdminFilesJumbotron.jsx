import React, { useEffect, useState } from "react";
import AdminBodyHeader from "../../../components/pages/admin/AdminBodyHeader";
import AdminStructure from "../../../components/pages/admin/AdminStructure";
import { getImagesFromCloudinaryFolder } from "../../../services/file";

const AdminFilesJumbotron = () => {
  const [archetypeJumbotronsImages, setArchetypeJumbotronsImages] = useState([]);

  useEffect(() => {
    getImagesFromCloudinaryFolder("jumbotron_archetypes", setArchetypeJumbotronsImages);
  }, []);

  return (
    <AdminStructure>
      <AdminBodyHeader
        label="Jumbotron d'Archetype"
        catchphrase="Vérifiez tous les fichiers"
        returnButton={true}
      />
      <div className="grid grid-cols-12">
        {archetypeJumbotronsImages.map((jumbotron, index) => {
          return (
            <div
              className="col-span-4 m-1 rounded border-2 border-black"
              key={index}
            >
              <img className="w-full h-full object-cover" src={jumbotron.url} alt={index} />
            </div>
          );
        })}
      </div>
    </AdminStructure>
  );
};

export default AdminFilesJumbotron;
