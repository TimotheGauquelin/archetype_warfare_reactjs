import { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import AdminBodyHeader from "@/components/pages/admin/AdminBodyHeader";
import AdminSection from "@/components/pages/admin/AdminSection";
import AdminSectionTitle from "@/components/pages/admin/AdminSectionTitle";
import AdminTournamentTable from "@/components/pages/admin/archetype/adminTournaments/AdminTournamentTable";
import { URL_FRONT_ADMIN_TOURNAMENT_ADD } from "@/constant/urlsFront";
import { deleteTournament, getTournaments } from "@/services/tournament";
import type { RootState } from "@/redux/store";
import type { Tournament } from "@/types";
import AdminLayout from "../../adminLayout";
import NoItemMessage from "@/components/generic/NoItemMessage";
import PopUp from "@/components/generic/PopUp";
import usePopup from "@/hooks/usePopup";

const STATUS_IN_PROGRESS = [
  "tournament_beginning",
  "tournament_is_beginning",
  "tournament_in_progress",
];
const STATUS_FINISHED = ["tournament_finished", "tournament_cancelled"];
const STATUS_UPCOMING = ["registration_open", "registration_closed"];

const AdminTournaments = () => {
  const { token } = useSelector((state: RootState) => state.user);
  const { isOpen, popupConfig, closePopup, showConfirmDialog } = usePopup();
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTournaments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await getTournaments();
      setTournaments(list);
    } catch (e) {
      setError("Erreur lors du chargement des tournois.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadTournaments();
  }, [loadTournaments]);

  const { inProgress, finished, upcoming } = useMemo(() => {
    const inProgress = tournaments.filter((t) =>
      STATUS_IN_PROGRESS.includes(t.status as string)
    );
    const finished = tournaments.filter((t) =>
      STATUS_FINISHED.includes(t.status as string)
    );
    const upcoming = tournaments.filter((t) =>
      STATUS_UPCOMING.includes(t.status as string)
    );
    return { inProgress, finished, upcoming };
  }, [tournaments]);

  const handleRequestDelete = useCallback(
    (tournament: Tournament) => {
      showConfirmDialog({
        title: "Supprimer le tournoi",
        message: `Êtes-vous sûr de vouloir supprimer le tournoi « ${tournament.name} » ? Cette action est irréversible.`,
        confirmText: "Supprimer",
        cancelText: "Annuler",
        onConfirm: () => {
          if (token) {
            deleteTournament(tournament.id, token).then(loadTournaments).catch(() => {});
          }
        },
      });
    },
    [showConfirmDialog, token, loadTournaments]
  );

  return (
    <AdminLayout>
      <AdminBodyHeader
        label="Tournois"
        catchphrase="Vous avez des tournois de toute sorte"
        buttonUrl={URL_FRONT_ADMIN_TOURNAMENT_ADD}
        buttonLabel="Ajouter un tournoi"
      />

      {error && (
        <p className="mt-4 text-red-600 text-sm" role="alert">
          {error}
        </p>
      )}

      {loading ? (
        <p className="mt-4 text-gray-600 text-sm">Chargement…</p>
      ) : (
        <div className="mt-4 space-y-8">
          <AdminSection>
            <AdminSectionTitle sectionTitle="En cours" />
            <AdminTournamentTable
              tournaments={inProgress}
              emptyMessage="Aucun tournoi en cours."
              onRequestDelete={handleRequestDelete}
            />
          </AdminSection>

          <AdminSection>
            <AdminSectionTitle sectionTitle="À venir" />
            <AdminTournamentTable
              tournaments={upcoming}
              emptyMessage="Aucun tournoi à venir."
              onRequestDelete={handleRequestDelete}
            />
          </AdminSection>

          <AdminSection>
            <AdminSectionTitle sectionTitle="Passés" />
            <AdminTournamentTable
              tournaments={finished}
              emptyMessage="Aucun tournoi passé."
              onRequestDelete={handleRequestDelete}
            />
          </AdminSection>

          {tournaments.length === 0 && (
            <NoItemMessage message="Il n'y a aucun tournoi" />
          )}
        </div>
      )}

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