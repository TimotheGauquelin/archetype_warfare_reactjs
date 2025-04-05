import React, { useContext } from "react";
import AdminBodyHeader from "../../components/pages/admin/AdminBodyHeader";

import AdminStructure from "../../components/pages/admin/AdminStructure";
import jwt_decode from "jwt-decode";
import { useSelector } from "react-redux";
import AuthContext from "../../context/AuthContext";

const AdminHome = () => {
  const { authUser } = useContext(AuthContext) 

  return (
    <AdminStructure>
      <AdminBodyHeader
        label="Tableau de Bord"
        catchphrase={`Bonjour ${authUser.username}, comment allez-vous aujourd'hui ?`}
      />
      <p>Banlist en cours: </p>
      {/* <CurrentBanlistAlert /> */}

      <p className="font-bold text-red-500">
        [Prochaines fonctionnalités à venir..]
      </p>
    </AdminStructure>
  );
};

export default AdminHome;
