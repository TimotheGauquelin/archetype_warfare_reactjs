import React, { useEffect, useState } from "react";
import api_aw from "../../../api/api_aw";
import AdminBodyHeader from "../../../components/pages/admin/AdminBodyHeader";
import AdminStructure from "../../../components/pages/admin/AdminStructure";
import CurrentBanlistAlert from "../../../components/generic/CurrentBanlistAlert";
import AdminBanlistPagination from "../../../components/pages/admin/AdminBanlistPagination";
import { ToastContainer } from "react-toastify";
import { URL_BACK_GET_BANLISTS } from "../../../constant/urlsBack";

const AdminBanlist = () => {
  const [banlists, setBanlists] = useState([]);
  const [refresh, setRefresh] = useState(false);

  const getBanlists = () => {
    api_aw.get(URL_BACK_GET_BANLISTS).then((response) => {
      if (response.status === 200) {
        setBanlists(response.data);
      }
    });
  };

  function numberOfCardsFromArchetypePerStatus(statusLabel, banlistId) {
    const banlistIndex = banlists.findIndex((fi) => fi.id === banlistId);
    var nbCards = banlists[banlistIndex]?.cards.filter(
      (c) => c.cardStatus.label === statusLabel
    ).length;
    return nbCards;
  }

  useEffect(() => {
    getBanlists();
    setRefresh(false);
  }, [refresh]);

  return (
    <AdminStructure>
      <AdminBodyHeader
        label="Banlist"
        catchphrase="Bannir, Limiter ou Illimiter"
        buttonUrl="/admin/banlists/form"
        buttonLabel="Ajouter une banlist"
      />
      <p>Banlist en cours :</p>
      <CurrentBanlistAlert />
      <AdminBanlistPagination
        banlists={banlists}
        numberOfCardsFromArchetypePerStatus={
          numberOfCardsFromArchetypePerStatus
        }
        setRefresh={setRefresh}
      />
      <ToastContainer />
    </AdminStructure>
  );
};

export default AdminBanlist;
