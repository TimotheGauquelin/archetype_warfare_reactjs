import React from "react";
import AdminStructure from "../../../components/pages/admin/AdminStructure";
import AdminBodyHeader from "../../../components/pages/admin/AdminBodyHeader";
import { ToastContainer } from "react-toastify";
import AdminUserFormik from "../../../components/pages/admin/users/AdminUserFormik";

const AdminUserAdd = () => {
  return (
    <AdminStructure>
      <AdminBodyHeader
        label="Ajouter un utilisateur"
        catchphrase=""
        returnButton
      />
      <AdminUserFormik />
      <ToastContainer />
    </AdminStructure>
  );
};

export default AdminUserAdd;