import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import AdminBodyHeader from "../../../components/pages/admin/AdminBodyHeader";
import AdminStructure from "../adminLayout";
import AdminBanlistPagination from "../../../components/pages/admin/AdminBanlistPagination";
import PaginationTableHead from "../../../components/generic/pagination/PaginationTableHead";
import AdminBanlistPaginationTableBody from "../../../components/pages/admin/AdminBanlistPaginationTableBody";
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
    getCurrentBanlist((v) => setCurrentBanlist(prev => typeof v === 'function' ? (v as (p: Banlist | null) => Banlist | null)(prev) : v), false);
    getBanlists((v) => setBanlists(prev => typeof v === 'function' ? (v as (p: Banlist[]) => Banlist[])(prev) : v));
    setRefresh(false);
  }, [refresh]);

  const currentBanlistsArray = useMemo(
    () => (currentBanlist ? [currentBanlist] : []),
    [currentBanlist]
  );

  const currentTableHeadItems = useMemo(
    () => [
      { colspan: "col-span-2", label: "Titre de la banlist" },
      { colspan: "col-span-2", label: "Date d'application" },
      { colspan: "col-span-1", label: "Nb c. totales" },
      { colspan: "col-span-1", label: "Nb. c. interdites" },
      { colspan: "col-span-1", label: "Nb. c. limitées" },
      { colspan: "col-span-1", label: "Nb. c. semi-limitées" },
      { colspan: "col-span-4", label: "Actions" },
    ],
    []
  );

  return (
    <AdminStructure>
      <AdminBodyHeader
        label="Banlist"
        catchphrase="Bannir, Limiter ou Illimiter"
        buttonUrl={URL_FRONT_ADMIN_BANLIST_ADD}
        buttonLabel="Ajouter une banlist"
      />
      <p>Banlist en cours :</p>
      {currentBanlistsArray.length ? (
        <div className="w-full text-sm text-left text-gray-500 dark:text-gray-400 mt-2">
          <PaginationTableHead tableHeadItem={currentTableHeadItems} />
          <AdminBanlistPaginationTableBody
            arrayItems={currentBanlistsArray}
            handleDeleteBanlist={handleDeleteBanlist}
          />
        </div>
      ) : (
        <p className="bg-red-100 text-red-500 p-2 rounded-md">
          Aucune banlist en cours
        </p>
      )}
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
