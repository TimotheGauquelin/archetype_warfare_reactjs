import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import AdminBodyHeader from "../../../components/pages/admin/AdminBodyHeader";
import AdminStructure from "../adminLayout";
import AdminQuizSeasonPagination from "../../../components/pages/admin/quiz/AdminQuizSeasonPagination";
import PopUp from "../../../components/generic/PopUp";
import usePopup from "../../../hooks/usePopup";
import {
  AdminQuizSeason,
  deleteAdminQuizSeason,
  listAdminQuizSeasons,
} from "../../../services/quiz";
import { URL_FRONT_ADMIN_QUIZ_SEASON_ADD } from "../../../constant/urlsFront";

const PAGE_SIZE = 30;

const AdminQuizSeasons = () => {
  const [seasons, setSeasons] = useState<AdminQuizSeason[]>([]);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const { isOpen, popupConfig, closePopup, showConfirmDialog } = usePopup();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setSeasons(await listAdminQuizSeasons());
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Impossible de charger les saisons"
      );
    } finally {
      setLoading(false);
      setRefresh(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load, refresh]);

  const totalPages = Math.max(1, Math.ceil(seasons.length / PAGE_SIZE));
  const page = Math.min(currentPage, totalPages);
  const paginatedSeasons = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return seasons.slice(start, start + PAGE_SIZE);
  }, [seasons, page]);

  const handleDelete = (season: AdminQuizSeason) => {
    showConfirmDialog({
      title: "Suppression de la saison",
      message: `Supprimer la saison « ${season.name} » ?`,
      onConfirm: () => {
        void (async () => {
          try {
            await deleteAdminQuizSeason(season.id);
            toast.success("Saison supprimée");
            setRefresh(true);
          } catch (error) {
            toast.error(
              error instanceof Error
                ? error.message
                : "Impossible de supprimer la saison"
            );
          }
        })();
      },
    });
  };

  return (
    <AdminStructure>
      <AdminBodyHeader
        label="Saisons Daily Quizz"
        catchphrase="Toutes les sessions (~3 mois)"
        buttonUrl={URL_FRONT_ADMIN_QUIZ_SEASON_ADD}
        buttonLabel="Ajouter une saison"
        returnButton
      />

      <AdminQuizSeasonPagination
        seasons={paginatedSeasons}
        loading={loading}
        onDelete={handleDelete}
        showFooter
        currentPage={page}
        setPagination={setCurrentPage}
        setRefresh={setRefresh}
        seasonsTotalCount={seasons.length}
        totalPages={totalPages}
        pageSize={PAGE_SIZE}
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

export default AdminQuizSeasons;
