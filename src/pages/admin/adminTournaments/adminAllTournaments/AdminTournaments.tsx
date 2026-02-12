import AdminBodyHeader from "@/components/pages/admin/AdminBodyHeader";
import { URL_FRONT_ADMIN_TOURNAMENT_ADD } from "@/constant/urlsFront";
import AdminLayout from "../../adminLayout";

const AdminTournaments = () => {
  return (
    <AdminLayout>
      <AdminBodyHeader
        label="Tournois"
        catchphrase="Vous avez des tournois de toute sorte"
        buttonUrl={URL_FRONT_ADMIN_TOURNAMENT_ADD}
        buttonLabel="Ajouter un tournoi"
      />
    </AdminLayout>
  );
};

export default AdminTournaments;