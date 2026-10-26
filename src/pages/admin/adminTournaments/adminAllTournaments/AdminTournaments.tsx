import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import AdminBodyHeader from "@/components/pages/admin/AdminBodyHeader";
import AdminTournamentTable from "@/components/pages/admin/archetype/adminTournaments/AdminTournamentTable";
import {
  getAdminTournamentsByScopePath,
  URL_FRONT_ADMIN_TOURNAMENT_ADD,
} from "@/constant/urlsFront";
import { deleteTournament, getAllTournaments } from "@/services/tournament";
import type { RootState } from "@/redux/store";
import type { Tournament } from "@/types";
import AdminLayout from "../../adminLayout";
import PopUp from "@/components/generic/PopUp";
import usePopup from "@/hooks/usePopup";
import {
  ADMIN_TOURNAMENT_SCOPE_META,
  partitionAdminTournaments,
} from "@/utils/tournament/adminTournamentScope";

const PREVIEW_LIMIT = 10;

const AdminTournaments = () => {
  const { token } = useSelector((state: RootState) => state.user);
  const { isOpen, popupConfig, closePopup, showConfirmDialog } = usePopup();
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);

  const loadTournaments = useCallback(async () => {
    if (!token) {
      setTournaments([]);
      setLoading(false);
      toast.error("Authentification requise.");
      return;
    }
    setLoading(true);
    try {
      const list = await getAllTournaments(token);
      setTournaments(list);
    } catch (e) {
      toast.error("Erreur lors du chargement des tournois.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    void loadTournaments();
  }, [loadTournaments]);

  const { inProgress, upcoming, past } = useMemo(
    () => partitionAdminTournaments(tournaments),
    [tournaments]
  );

  const handleRequestDelete = useCallback(
    (tournament: Tournament) => {
      showConfirmDialog({
        title: "Supprimer le tournoi",
        message: `Êtes-vous sûr de vouloir supprimer le tournoi « ${tournament.name} » ? Cette action est irréversible.`,
        confirmText: "Supprimer",
        cancelText: "Annuler",
        onConfirm: () => {
          if (!token) return;
          void (async () => {
            try {
              await deleteTournament(tournament.id, token);
              toast.success("Tournoi supprimé");
              await loadTournaments();
            } catch {
              toast.error("Impossible de supprimer le tournoi");
            }
          })();
        },
      });
    },
    [showConfirmDialog, token, loadTournaments]
  );

  return (
    <AdminLayout>
      <AdminBodyHeader
        label="Tournois"
        catchphrase="Tournois en cours, à venir et passés"
        buttonUrl={URL_FRONT_ADMIN_TOURNAMENT_ADD}
        buttonLabel="Ajouter un tournoi"
      />

      <section className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm mb-10 space-y-3">
        <div className="flex flex-col sscreen:flex-row sscreen:items-center sscreen:justify-between gap-3">
          <h2 className="text-xl font-semibold text-gray-900">
            {ADMIN_TOURNAMENT_SCOPE_META["in-progress"].title}
          </h2>
          <div className="flex flex-wrap gap-2">
            <Link
              to={getAdminTournamentsByScopePath("in-progress")}
              className="h-fit block text-blue-700 px-3 py-2 bg-blue-50 border border-blue-200 rounded hover:bg-blue-100 font-semibold text-sm"
            >
              {ADMIN_TOURNAMENT_SCOPE_META["in-progress"].seeAllLabel}
            </Link>
          </div>
        </div>
        <p className="text-sm text-gray-600">
          {ADMIN_TOURNAMENT_SCOPE_META["in-progress"].description} Affichage
          des {PREVIEW_LIMIT} plus récents.
        </p>
        {loading ? (
          <p className="text-sm text-gray-500">Chargement…</p>
        ) : (
          <AdminTournamentTable
            tournaments={inProgress.slice(0, PREVIEW_LIMIT)}
            emptyMessage={ADMIN_TOURNAMENT_SCOPE_META["in-progress"].emptyMessage}
            onRequestDelete={handleRequestDelete}
          />
        )}
      </section>

      <section className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm mb-10 space-y-3">
        <div className="flex flex-col sscreen:flex-row sscreen:items-center sscreen:justify-between gap-3">
          <h2 className="text-xl font-semibold text-gray-900">
            {ADMIN_TOURNAMENT_SCOPE_META.upcoming.title}
          </h2>
          <div className="flex flex-wrap gap-2">
            <Link
              to={getAdminTournamentsByScopePath("upcoming")}
              className="h-fit block text-blue-700 px-3 py-2 bg-blue-50 border border-blue-200 rounded hover:bg-blue-100 font-semibold text-sm"
            >
              {ADMIN_TOURNAMENT_SCOPE_META.upcoming.seeAllLabel}
            </Link>
          </div>
        </div>
        <p className="text-sm text-gray-600">
          {ADMIN_TOURNAMENT_SCOPE_META.upcoming.description} Affichage des{" "}
          {PREVIEW_LIMIT} plus récents.
        </p>
        {loading ? (
          <p className="text-sm text-gray-500">Chargement…</p>
        ) : (
          <AdminTournamentTable
            tournaments={upcoming.slice(0, PREVIEW_LIMIT)}
            emptyMessage={ADMIN_TOURNAMENT_SCOPE_META.upcoming.emptyMessage}
            onRequestDelete={handleRequestDelete}
          />
        )}
      </section>

      <section className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm space-y-3">
        <div className="flex flex-col sscreen:flex-row sscreen:items-center sscreen:justify-between gap-3">
          <h2 className="text-xl font-semibold text-gray-900">
            {ADMIN_TOURNAMENT_SCOPE_META.past.title}
          </h2>
          <div className="flex flex-wrap gap-2">
            <Link
              to={getAdminTournamentsByScopePath("past")}
              className="h-fit block text-blue-700 px-3 py-2 bg-blue-50 border border-blue-200 rounded hover:bg-blue-100 font-semibold text-sm"
            >
              {ADMIN_TOURNAMENT_SCOPE_META.past.seeAllLabel}
            </Link>
          </div>
        </div>
        <p className="text-sm text-gray-600">
          {ADMIN_TOURNAMENT_SCOPE_META.past.description} Affichage des{" "}
          {PREVIEW_LIMIT} plus récents.
        </p>
        {loading ? (
          <p className="text-sm text-gray-500">Chargement…</p>
        ) : (
          <AdminTournamentTable
            tournaments={past.slice(0, PREVIEW_LIMIT)}
            emptyMessage={ADMIN_TOURNAMENT_SCOPE_META.past.emptyMessage}
            onRequestDelete={handleRequestDelete}
          />
        )}
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
    </AdminLayout>
  );
};

export default AdminTournaments;
