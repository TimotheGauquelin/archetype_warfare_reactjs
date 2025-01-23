import React from "react";
import AdminBodyHeader from "../../../components/pages/admin/AdminBodyHeader";
import AdminStructure from "../../../components/pages/admin/AdminStructure";

const AdminFilesJumbotronForm = () => {
  return (
    <AdminStructure>
      <AdminBodyHeader
        label="Ajouter un jumbotron d'Archetype"
        catchphrase="Vérifiez tous les fichiers"
      />
    </AdminStructure>
  );
};

export default AdminFilesJumbotronForm;
