import AdminBodyHeader from "@/components/pages/admin/AdminBodyHeader";
import AdminLayout from "../../adminLayout";

const AdminAddTournament = () => {
  return (
    <AdminLayout>
      <AdminBodyHeader
        label="Ajouter un tournoi"
        returnButton
      />
    </AdminLayout>
  );
};

export default AdminAddTournament;