import React from "react";
import AdminBodyHeader from "../../components/pages/admin/AdminBodyHeader";

import AdminStructure from "../../components/pages/admin/AdminStructure";
import jwt_decode from "jwt-decode";
import CurrentBanlistAlert from "../../components/generic/CurrentBanlistAlert";
import { useSelector } from "react-redux";

const AdminHome = () => {
  const { token } = useSelector((state) => state.user);
  var decoded = token && jwt_decode(token);

  return (
    <AdminStructure>
      <AdminBodyHeader
        label="Tableau de Bord"
        catchphrase={`Bonjour ${decoded?.sub}, comment allez-vous aujourd'hui ?`}
      />
      <p>Banlist en cours: </p>
      <CurrentBanlistAlert />

      <p className="font-bold text-red-500">
        [Prochaines fonctionnalités à venir..]
      </p>
    </AdminStructure>
  );
};

export default AdminHome;
