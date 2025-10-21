import React, { useEffect, useState } from "react";
import AdminBodyHeader from "../../../components/pages/admin/AdminBodyHeader";
import AdminStructure from "../../../components/pages/admin/AdminStructure";
import CurrentBanlistAlert from "../../../components/generic/CurrentBanlistAlert";
import AdminBanlistPagination from "../../../components/pages/admin/AdminBanlistPagination";
import { ToastContainer } from "react-toastify";
import { getBanlists, getCurrentBanlist } from "../../../services/banlist";
import { URL_FRONT_ADMIN_BANLIST_FORM } from "../../../constant/urlsFront";

const AdminBanlist = () => {
  const [banlists, setBanlists] = useState([]);
  const [currentBanlist, setCurrentBanlist] = useState({});
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    getCurrentBanlist(setCurrentBanlist)
    getBanlists(setBanlists);
    setRefresh(false);
  }, [refresh]);

  return (
    <AdminStructure>
      <AdminBodyHeader
        label="Banlist"
        catchphrase="Bannir, Limiter ou Illimiter"
        buttonUrl={URL_FRONT_ADMIN_BANLIST_FORM}
        buttonLabel="Ajouter une banlist"
      />
      <p>Banlist en cours :</p>
      {currentBanlist ? <CurrentBanlistAlert currentBanlist={currentBanlist} /> : <p className="bg-red-100 text-red-500 p-2 rounded-md">Aucune banlist en cours</p>}
      <AdminBanlistPagination
        banlists={banlists}
        setRefresh={setRefresh}
      />
      <ToastContainer />
    </AdminStructure>
  );
};

export default AdminBanlist;
