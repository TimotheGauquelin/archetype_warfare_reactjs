import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  getAllTournaments,
  setTournamentSeasonId,
} from "@/services/tournament";
import type { RootState } from "@/redux/store";
import type { Tournament } from "@/types";
import { TOURNAMENT_STATUS } from "@/utils/trad/tournamentStatus";
import { verbalDate } from "@/utils/date/verbalDate";
import {
  getAdminTournamentManagePath,
  getAdminTournamentUpdatePath,
  URL_FRONT_ADMIN_TOURNAMENT_ADD,
} from "@/constant/urlsFront";
import { partitionAdminTournaments } from "@/utils/tournament/adminTournamentScope";

interface AdminSeasonTournamentPoolTabProps {
  seasonId: number;
  active: boolean;
}

const AdminSeasonTournamentPoolTab = ({
  seasonId,
  active,
}: AdminSeasonTournamentPoolTabProps) => {
  const { token, isAuthenticated } = useSelector((state: RootState) => state.user);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [candidates, setCandidates] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(false);
  const [attachingId, setAttachingId] = useState<string>("");
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const [inSeason, withoutSeason] = await Promise.all([
        getAllTournaments(token, { season_id: seasonId }),
        getAllTournaments(token, { without_season: true }),
      ]);
      setTournaments(inSeason);
      // Uniquement non passés (à venir + en cours)
      const { upcoming, inProgress } = partitionAdminTournaments(withoutSeason);
      setCandidates([...inProgress, ...upcoming]);
    } catch {
      toast.error("Impossible de charger les tournois de la saison");
      setTournaments([]);
      setCandidates([]);
    } finally {
      setLoading(false);
    }
  }, [token, seasonId]);

  useEffect(() => {
    if (!active) return;
    void load();
  }, [active, load]);

  const stats = useMemo(() => {
    const official = tournaments.filter((t) => t.is_official).length;
    const finished = tournaments.filter(
      (t) => t.status === "tournament_finished"
    ).length;
    const upcoming = tournaments.filter((t) =>
      ["not_visible", "registration_open", "registration_closed"].includes(
        t.status
      )
    ).length;
    return { official, finished, upcoming, total: tournaments.length };
  }, [tournaments]);

  const handleDetach = async (tournament: Tournament) => {
    if (!isAuthenticated) return;
    setBusyId(tournament.id);
    try {
      await setTournamentSeasonId(tournament.id, null, token);
      toast.success(`« ${tournament.name} » détaché de la saison`);
      await load();
    } finally {
      setBusyId(null);
    }
  };

  const handleAttach = async () => {
    if (!isAuthenticated || !attachingId) return;
    setBusyId(attachingId);
    try {
      const t = candidates.find((c) => c.id === attachingId);
      await setTournamentSeasonId(attachingId, seasonId, token);
      toast.success(
        t ? `« ${t.name} » rattaché à la saison` : "Tournoi rattaché"
      );
      setAttachingId("");
      await load();
    } finally {
      setBusyId(null);
    }
  };

  if (!active) return null;

  return (
    <div className="border border-t-0 rounded-b-md bg-white p-4 space-y-4">
      <div className="flex flex-col sscreen:flex-row sscreen:items-start sscreen:justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Pool tournois</h3>
          <p className="text-sm text-gray-600 mt-1">
            Inventaire des tournois rattachés à cette saison. Seuls les{" "}
            <strong>officiels</strong> alimentent le classement circuit (Swiss
            3/1/0).
          </p>
        </div>
        <Link
          to={URL_FRONT_ADMIN_TOURNAMENT_ADD}
          className="h-fit text-sm font-semibold text-white px-3 py-2 bg-blue-500 rounded hover:bg-blue-600"
        >
          Créer un tournoi
        </Link>
      </div>

      <div className="flex flex-wrap gap-2 text-xs">
        <span className="px-2 py-1 rounded bg-slate-100 text-slate-800 font-medium">
          {stats.total} tournoi(s)
        </span>
        <span className="px-2 py-1 rounded bg-emerald-100 text-emerald-800 font-medium">
          {stats.official} officiel(s)
        </span>
        <span className="px-2 py-1 rounded bg-sky-100 text-sky-800 font-medium">
          {stats.upcoming} à venir / inscriptions
        </span>
        <span className="px-2 py-1 rounded bg-violet-100 text-violet-800 font-medium">
          {stats.finished} terminé(s)
        </span>
      </div>

      <div className="flex flex-col tablet:flex-row gap-2 items-stretch tablet:items-end border rounded p-3 bg-slate-50">
        <label className="flex-1 flex flex-col gap-1 text-sm font-medium text-gray-800">
          Rattacher un tournoi sans saison (non passé)
          <select
            className="border rounded p-2 font-normal bg-white"
            value={attachingId}
            onChange={(e) => setAttachingId(e.target.value)}
            disabled={loading || candidates.length === 0}
          >
            <option value="">
              {candidates.length === 0
                ? "Aucun tournoi à venir / en cours"
                : "— Choisir —"}
            </option>
            {candidates.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
                {t.is_official ? " (officiel)" : ""} —{" "}
                {t.event_date ? verbalDate(t.event_date, true) : "sans date"}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          disabled={!attachingId || busyId != null}
          onClick={() => void handleAttach()}
          className="px-4 py-2 rounded bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 disabled:opacity-50"
        >
          Rattacher
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-gray-500">Chargement…</p>
      ) : tournaments.length === 0 ? (
        <p className="text-sm text-gray-500 border rounded p-4 text-center">
          Aucun tournoi dans cette saison. Créez-en un ou rattachez un tournoi
          existant.
        </p>
      ) : (
        <div className="overflow-x-auto border rounded">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-slate-100 text-gray-700">
              <tr>
                <th className="p-2 font-semibold">Nom</th>
                <th className="p-2 font-semibold">Dates</th>
                <th className="p-2 font-semibold">Statut</th>
                <th className="p-2 font-semibold">Officiel</th>
                <th className="p-2 font-semibold">Joueurs</th>
                <th className="p-2 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tournaments.map((t) => {
                const playerCount = Array.isArray(t.players)
                  ? t.players.length
                  : 0;
                return (
                  <tr key={t.id} className="border-t hover:bg-slate-50">
                    <td className="p-2 font-medium text-gray-900">{t.name}</td>
                    <td className="p-2 text-gray-700 whitespace-nowrap">
                      {t.event_date ? verbalDate(t.event_date, true) : "—"}
                      {t.event_date_end
                        ? ` → ${verbalDate(t.event_date_end, true)}`
                        : ""}
                    </td>
                    <td className="p-2 text-gray-700">
                      {TOURNAMENT_STATUS(t.status)}
                    </td>
                    <td className="p-2">
                      {t.is_official ? (
                        <span className="text-emerald-700 font-semibold">
                          Oui
                        </span>
                      ) : (
                        <span className="text-amber-700">Non</span>
                      )}
                    </td>
                    <td className="p-2 text-gray-700">{playerCount}</td>
                    <td className="p-2">
                      <div className="flex flex-wrap gap-2">
                        <Link
                          to={getAdminTournamentManagePath(t.id)}
                          className="text-blue-600 hover:underline font-medium"
                        >
                          Gérer
                        </Link>
                        <Link
                          to={getAdminTournamentUpdatePath(t.id)}
                          className="text-blue-600 hover:underline font-medium"
                        >
                          Modifier
                        </Link>
                        <button
                          type="button"
                          disabled={busyId === t.id}
                          onClick={() => void handleDetach(t)}
                          className="text-red-600 hover:underline font-medium disabled:opacity-50"
                        >
                          Détacher
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminSeasonTournamentPoolTab;
