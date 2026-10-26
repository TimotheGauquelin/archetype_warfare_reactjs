import AdminStructure from "../adminLayout";
import AdminBodyHeader from "../../../components/pages/admin/AdminBodyHeader";
import { ToastContainer } from "react-toastify";
import AdminUserFormik from "../../../components/pages/admin/users/AdminUserFormik";

const AdminUserAdd = () => {
  return (
    <AdminStructure>
      <AdminBodyHeader
        label="Ajouter un utilisateur"
        catchphrase="Créez un compte et assignez ses rôles"
        returnButton
      />
      <AdminUserFormik />
      <ToastContainer />
    </AdminStructure>
  );
};

export default AdminUserAdd;