import React from "react";
import { useLocation } from "react-router-dom";
import AdminBodyHeader from "../../../components/pages/admin/AdminBodyHeader";
import AdminStructure from "../../../components/pages/admin/AdminStructure";

const AdminFilesJumbotron = () => {
  const location = useLocation();
  const filesArray = location.state.filesArray;

  return (
    <AdminStructure>
      <AdminBodyHeader
        label="Jumbotron d'Archetype"
        catchphrase="Vérifiez tous les fichiers"
        // actionButton={() => {
        //   updateDatabase();
        // }}
        // actionButtonColor={`${
        //   databaseUpdateLoader ? "bg-gray-200" : "bg-green-500"
        // } p-2 rounded text-white font-bold`}
        // actionButtonText="Mettre à jour la BDD"
        // actionButtonDisabled={databaseUpdateLoader}
      />
      <div className="grid grid-cols-12 bg-gray-200">
        {filesArray.map((jumbotron, index) => {
          return (
            <div
              className="col-span-6 bg-green-200 m-1 p-1 rounded"
              key={index}
            >
              <img src={jumbotron.url} alt={index} />
              <p>{jumbotron.name}</p>
            </div>
          );
        })}
      </div>
    </AdminStructure>
  );
};

export default AdminFilesJumbotron;
