import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import AdminBodyHeader from "../../../components/pages/admin/AdminBodyHeader";
import AdminStructure from "../../../components/pages/admin/AdminStructure";
import CurrentBanlistAlert from "../../../components/generic/CurrentBanlistAlert";
import AdminBanlistPagination from "../../../components/pages/admin/AdminBanlistPagination";
import { deleteBanlist, getBanlists, getCurrentBanlist } from "../../../services/banlist";
import { URL_FRONT_ADMIN_BANLIST_ADD } from "../../../constant/urlsFront";
import usePopup from "../../../hooks/usePopup";
import PopUp from "../../../components/generic/PopUp";

const AdminBanlist = () => {
  const [banlists, setBanlists] = useState([]);
  const [currentBanlist, setCurrentBanlist] = useState({});
  const [refresh, setRefresh] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { token } = useSelector((state) => state.user);
  const { isOpen, popupConfig, closePopup, showConfirmDialog } = usePopup();

  const handleDeleteBanlist = (banlistId) => {
    showConfirmDialog({
      title: "Supprimer la banlist",
      message: "Êtes-vous sûr de vouloir supprimer cette banlist ?",
      onConfirm: () => {
        deleteBanlist(token, banlistId, navigate, setIsLoading);
        setRefresh(true)
      }
    });
  };

  useEffect(() => {
    getCurrentBanlist(setCurrentBanlist, setIsLoading);
    getBanlists(setBanlists);
    setRefresh(false);
  }, [refresh]);

  return (
    <AdminStructure>
      <AdminBodyHeader
        label="Banlist"
        catchphrase="Bannir, Limiter ou Illimiter"
        buttonUrl={URL_FRONT_ADMIN_BANLIST_ADD}
        buttonLabel="Ajouter une banlist"
      />
      <p>Banlist en cours :</p>
      {currentBanlist ? <CurrentBanlistAlert currentBanlist={currentBanlist} /> : <p className="bg-red-100 text-red-500 p-2 rounded-md">Aucune banlist en cours</p>}
      <AdminBanlistPagination
        banlists={banlists}
        setRefresh={setRefresh}
        handleDeleteBanlist={handleDeleteBanlist}
      />
      <PopUp
        isOpen={isOpen}
        onClose={closePopup}
        title={popupConfig.title}
        className={popupConfig.className}
        showCloseButton={popupConfig.showCloseButton}
        closeOnBackdropClick={popupConfig.closeOnBackdropClick}
      >
        {popupConfig.content}
      </PopUp>
    </AdminStructure>
  );
};

export default AdminBanlist;
