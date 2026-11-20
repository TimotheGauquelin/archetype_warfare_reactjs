import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import AdminBodyHeader from "@/components/pages/admin/AdminBodyHeader";
import AdminStructure from "../adminLayout";
import AdminQuizSeasonPagination from "@/components/pages/admin/quiz/AdminQuizSeasonPagination";
import PopUp from "@/components/generic/PopUp";
import usePopup from "@/hooks/usePopup";
import {
  AdminQuizSeason,
  deleteAdminQuizSeason,
  listAdminQuizSeasons,
} from "@/services/quiz";
import {
  URL_FRONT_ADMIN_SEASON_ADD,
  URL_FRONT_ADMIN_SEASONS_ALL,
} from "@/constant/urlsFront";

const AdminSeasons = () => {
  const [seasons, setSeasons] = useState<AdminQuizSeason[]>([]);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const { isOpen, popupConfig, closePopup, showConfirmDialog } = usePopup();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setSeasons(await listAdminQuizSeasons({ preview: true }));
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

  const handleDeleteSeason = (season: AdminQuizSeason) => {
    showConfirmDialog({
      title: "Suppression de la saison",
      message: `Supprimer la saison « ${season.name} » ? Les questions et tournois liés ne seront plus rattachés à une saison.`,
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
        label="Saisons"
        catchphrase="Saisons plateforme : Daily Quizz et tournois officiels"
      />

      <section className="bg-white border border-gray-200 rounded-lg p-2.5 tablet:p-4 shadow-sm mb-6 tablet:mb-10 space-y-3 overflow-hidden">
        <div className="flex flex-col sscreen:flex-row sscreen:items-center sscreen:justify-between gap-2 tablet:gap-3">
          <h2 className="text-lg tablet:text-xl font-semibold text-gray-900 leading-snug">
            Gérer les saisons
          </h2>
          <div className="flex flex-col tablet:flex-row flex-wrap gap-2 w-full sscreen:w-auto">
            <Link
              to={URL_FRONT_ADMIN_SEASON_ADD}
              className="h-fit block text-center text-white px-3 py-2 bg-blue-400 rounded hover:bg-blue-500 font-bold text-sm"
            >
              Ajouter une saison
            </Link>
            <Link
              to={URL_FRONT_ADMIN_SEASONS_ALL}
              className="h-fit block text-center text-blue-700 px-3 py-2 bg-blue-50 border border-blue-200 rounded hover:bg-blue-100 font-semibold text-sm"
            >
              Voir toutes les saisons
            </Link>
          </div>
        </div>
        <p className="text-xs tablet:text-sm text-gray-600 leading-snug">
          Saison en cours et les prochaines (~3 mois). Une saison regroupe le
          Daily Quizz et les tournois officiels du circuit.
        </p>

        <AdminQuizSeasonPagination
          seasons={seasons}
          loading={loading}
          onDelete={handleDeleteSeason}
        />
      </section>

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

export default AdminSeasons;
