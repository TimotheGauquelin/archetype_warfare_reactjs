import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import AdminBodyHeader from "../../../components/pages/admin/AdminBodyHeader";
import AdminStructure from "../adminLayout";
import CurrentBanlistAlert from "../../../components/generic/CurrentBanlistAlert";
import AdminBanlistPagination from "../../../components/pages/admin/AdminBanlistPagination";
import { deleteBanlist, getBanlists, getCurrentBanlist } from "../../../services/banlist";
import { URL_FRONT_ADMIN_BANLIST_ADD } from "../../../constant/urlsFront";
import usePopup from "../../../hooks/usePopup";
import PopUp from "../../../components/generic/PopUp";
import type { RootState } from "../../../redux/store";
import type { Banlist } from "../../../types";

const AdminBanlist = () => {
  const [banlists, setBanlists] = useState<Banlist[]>([]);
  const [currentBanlist, setCurrentBanlist] = useState<Banlist | null>(null);
  const [refresh, setRefresh] = useState(false);
  const [, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { token } = useSelector((state: RootState) => state.user);
  const { isOpen, popupConfig, closePopup, showConfirmDialog } = usePopup();

  const handleDeleteBanlist = (banlistId: number) => {
    showConfirmDialog({
      title: "Supprimer la banlist",
      message: "Êtes-vous sûr de vouloir supprimer cette banlist ?",
      onConfirm: () => {
        if (token) deleteBanlist(token, banlistId, navigate, setIsLoading);
        setRefresh(true);
      }
    });
  };

  useEffect(() => {
    getCurrentBanlist((v) => setCurrentBanlist(prev => typeof v === 'function' ? (v as (p: Banlist | null) => Banlist | null)(prev) : v));
    getBanlists((v) => setBanlists(prev => typeof v === 'function' ? (v as (p: Banlist[]) => Banlist[])(prev) : v));
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
      {currentBanlist && currentBanlist.id ? <CurrentBanlistAlert currentBanlist={currentBanlist} /> : <p className="bg-red-100 text-red-500 p-2 rounded-md">Aucune banlist en cours</p>}
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
