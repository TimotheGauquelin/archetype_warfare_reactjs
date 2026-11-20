import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import AdminBodyHeader from "@/components/pages/admin/AdminBodyHeader";
import AdminLayout from "../../adminLayout";
import { Input } from "@/components/generic/form/input/Input";
import { SwitchInput } from "@/components/generic/form/SwitchInput";
import SelectInput from "@/components/generic/form/SelectInput";
import QuizImageCardSearch from "@/components/pages/admin/quiz/QuizImageCardSearch";
import ImageFocalZoomEditor from "@/components/pages/admin/ImageFocalZoomEditor";
import Button from "@/components/generic/buttons/classicButton/Button";
import {
  getTournamentById,
  updateTournament,
  type UpdateTournamentPayload,
} from "@/services/tournament";
import {
  listAdminQuizSeasons,
  type AdminQuizSeason,
} from "@/services/quiz";
import { URL_FRONT_ADMIN_TOURNAMENTS } from "@/constant/urlsFront";
import type { RootState } from "@/redux/store";
import { toast } from "react-toastify";
import { Tournament, TournamentStatus } from "@/types";
import { formatDateForInputWithHours } from "@/utils/date/formatDateForInput";
import { MATCH_RESOLUTION_MODE_OPTIONS } from "@/utils/tournament/bestOfScore";
import {
  clampTournamentDatesToSeason,
  isTournamentFullyWithinSeason,
  seasonToDatetimeBounds,
} from "@/utils/tournament/seasonDateConstraints";

type TournamentFormState = Tournament & Record<string, unknown>;

const AdminUpdateTournament = () => {
  const { tournamentId } = useParams<{ tournamentId: string }>();
  const navigate = useNavigate();
  const { token, isAuthenticated } = useSelector((state: RootState) => state.user);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingTournament, setIsLoadingTournament] = useState(true);
  const [tournament, setTournament] = useState<TournamentFormState>({
    id: "",
    name: "",
    status: "registration_open",
    max_players: 2,
    location: "",
    description: "",
    event_date: "",
    event_date_end: "",
    is_online: false,
    max_number_of_rounds: 1,
    matches_per_round: 0,
    match_resolution_mode: "strict_wins",
    require_deck_list: false,
    is_official: false,
    until_winner: false,
    allow_penalities: false,
    registration_close_hours_before: 48,
    image_url: null as string | null,
    image_focal_x: 50,
    image_focal_y: 50,
    image_zoom: 100,
    season_id: null as number | null,
  });
  const [imageCardName, setImageCardName] = useState<string | null>(null);
  const [seasons, setSeasons] = useState<AdminQuizSeason[]>([]);

  useEffect(() => {
    let cancelled = false;
    listAdminQuizSeasons()
      .then((data) => {
        if (!cancelled) setSeasons(data);
      })
      .catch(() => {
        if (!cancelled) setSeasons([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const selectedSeason = useMemo(() => {
    if (tournament.season_id == null || String(tournament.season_id) === "") {
      return null;
    }
    return (
      seasons.find((s) => String(s.id) === String(tournament.season_id)) ??
      null
    );
  }, [seasons, tournament.season_id]);

  const seasonDateBounds = useMemo(() => {
    if (!selectedSeason) return null;
    return seasonToDatetimeBounds(
      selectedSeason.startDate,
      selectedSeason.endDate
    );
  }, [selectedSeason]);

  const eventDateMin = seasonDateBounds?.min;
  const eventDateMax = seasonDateBounds?.max;
  const eventDateEndMin = tournament.event_date
    ? seasonDateBounds
      ? tournament.event_date > seasonDateBounds.min
        ? tournament.event_date
        : seasonDateBounds.min
      : tournament.event_date
    : eventDateMin;
  const eventDateEndMax = seasonDateBounds?.max;

  const seasonOptions = useMemo(() => {
    const matching = seasons.filter((s) =>
      isTournamentFullyWithinSeason(
        tournament.event_date,
        tournament.event_date_end,
        s.startDate,
        s.endDate
      )
    );
    // Garder la saison sélectionnée visible le temps du clamp.
    if (
      selectedSeason &&
      !matching.some((s) => String(s.id) === String(selectedSeason.id))
    ) {
      matching.push(selectedSeason);
    }
    return matching.map((s) => ({
      id: String(s.id),
      label: `${s.name} (${s.startDate} → ${s.endDate})`,
    }));
  }, [
    seasons,
    tournament.event_date,
    tournament.event_date_end,
    selectedSeason,
  ]);

  // Saison inconnue → retirer. Sinon maintenir les dates dans la fenêtre.
  useEffect(() => {
    if (
      tournament.season_id == null ||
      String(tournament.season_id) === ""
    ) {
      return;
    }
    if (seasons.length === 0) return;
    if (!selectedSeason) {
      setTournament((prev) => ({ ...prev, season_id: null }));
      return;
    }
    setTournament((prev) => {
      const clamped = clampTournamentDatesToSeason(
        String(prev.event_date ?? ""),
        String(prev.event_date_end ?? ""),
        selectedSeason.startDate,
        selectedSeason.endDate
      );
      if (
        clamped.event_date === prev.event_date &&
        clamped.event_date_end === prev.event_date_end
      ) {
        return prev;
      }
      return { ...prev, ...clamped };
    });
  }, [
    selectedSeason,
    seasons.length,
    tournament.season_id,
    tournament.event_date,
    tournament.event_date_end,
  ]);

  const matchesPerRoundOptions = [
    { id: "1", label: "1 Duel" },
    { id: "3", label: "3 Duels" },
    { id: "5", label: "5 Duels" },
  ];

  const matchResolutionModeOptions = MATCH_RESOLUTION_MODE_OPTIONS.map((o) => ({
    id: o.id,
    label: o.label,
  }));

  const registrationCloseHoursOptions = [
    { id: "1", label: "1 heure avant" },
    { id: "6", label: "6 heures avant" },
    { id: "12", label: "12 heures avant" },
    { id: "24", label: "24 heures avant" },
    { id: "48", label: "48 heures avant" },
    { id: "72", label: "72 heures avant" },
  ];

  const statusOptions = [
    { id: "not_visible", label: "Non visible" },
    { id: "registration_open", label: "Inscriptions ouvertes" },
    { id: "registration_closed", label: "Inscriptions closes" },
    { id: "tournament_beginning", label: "Début du tournoi" },
    { id: "tournament_in_progress", label: "Tournoi en cours" },
    { id: "tournament_finished", label: "Tournoi terminé" },
    { id: "tournament_cancelled", label: "Tournoi annulé" },
    { id: "tournament_did_not_happen", label: "Pas eu lieu" },
  ];

  const maxPlayersNumber = Number(tournament.max_players) || 0;
  const suggestedRounds =
    maxPlayersNumber > 1 ? Math.floor(Math.log2(maxPlayersNumber)) : 0;

  useEffect(() => {
    if (!tournamentId) return;
    let cancelled = false;
    getTournamentById(tournamentId)
      .then((data) => {
        if (cancelled) return;
        setTournament({
          id: data.id,
          name: data.name,
          status: data.status as TournamentStatus,
          max_players: data.max_players,
          max_number_of_rounds: data.max_number_of_rounds,
          matches_per_round: data.matches_per_round,
          match_resolution_mode: data.match_resolution_mode ?? "strict_wins",
          require_deck_list: data.require_deck_list,
          is_official: data.is_official ?? false,
          until_winner: data.until_winner,
          location: data.location,
          description: data.description ?? "",
          event_date: formatDateForInputWithHours(data.event_date),
          event_date_end: formatDateForInputWithHours(data.event_date_end),
          is_online: data.is_online,
          allow_penalities: data.allow_penalities as boolean,
          registration_close_hours_before:
            data.registration_close_hours_before ?? 48,
          image_url: data.image_url ?? null,
          image_focal_x: data.image_focal_x ?? 50,
          image_focal_y: data.image_focal_y ?? 50,
          image_zoom: data.image_zoom ?? 100,
          season_id: data.season_id ?? null,
        });
        setImageCardName(data.image_url ? "Image actuelle" : null);
      })
      .catch(() => {
        if (!cancelled) toast.error("Impossible de charger le tournoi.");
      })
      .finally(() => {
        if (!cancelled) setIsLoadingTournament(false);
      });
    return () => {
      cancelled = true;
    };
  }, [tournamentId]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!isAuthenticated || !tournamentId) {
        toast.error("Données manquantes.");
        return;
      }
      const start = new Date(tournament.event_date);
      const end = new Date(tournament.event_date_end);
      if (selectedSeason) {
        const ok = isTournamentFullyWithinSeason(
          tournament.event_date,
          tournament.event_date_end,
          selectedSeason.startDate,
          selectedSeason.endDate
        );
        if (!ok) {
          toast.error(
            "Les dates du tournoi doivent être entièrement comprises dans la saison sélectionnée."
          );
          return;
        }
      }
      if (
        Number.isNaN(start.getTime()) ||
        Number.isNaN(end.getTime()) ||
        end.getTime() < start.getTime()
      ) {
        toast.error(
          "La date de fin doit être postérieure ou égale à la date de début."
        );
        return;
      }
      const payload: UpdateTournamentPayload = {
        name: (tournament.name ?? "").trim(),
        status: tournament.status,
        max_players: Number(tournament.max_players) || 2,
        location: tournament.is_online
          ? ""
          : (tournament.location ?? "").trim(),
        description:
          typeof tournament.description === "string"
            ? tournament.description.trim() || null
            : null,
        event_date: start.toISOString(),
        event_date_end: end.toISOString(),
        is_online: tournament.is_online,
        require_deck_list: tournament.require_deck_list as boolean,
        is_official: tournament.is_official as boolean,
        until_winner: tournament.until_winner as boolean,
        max_number_of_rounds: Number(tournament.max_number_of_rounds) || 1,
        matches_per_round: Number(tournament.matches_per_round) || 1,
        match_resolution_mode:
          tournament.match_resolution_mode === "highest_score"
            ? "highest_score"
            : "strict_wins",
        allow_penalities: tournament.allow_penalities as boolean,
        registration_close_hours_before:
          Number(tournament.registration_close_hours_before) || 48,
        image_url:
          typeof tournament.image_url === "string" && tournament.image_url.trim()
            ? tournament.image_url.trim()
            : null,
        image_focal_x:
          typeof tournament.image_url === "string" && tournament.image_url.trim()
            ? Number(tournament.image_focal_x) || 50
            : 50,
        image_focal_y:
          typeof tournament.image_url === "string" && tournament.image_url.trim()
            ? Number(tournament.image_focal_y) || 50
            : 50,
        image_zoom:
          typeof tournament.image_url === "string" && tournament.image_url.trim()
            ? Number(tournament.image_zoom) || 100
            : 100,
        season_id:
          tournament.season_id != null && String(tournament.season_id) !== ""
            ? Number(tournament.season_id)
            : null,
      };
      setIsLoading(true);
      try {
        await updateTournament(tournamentId, payload, token);
        toast.success("Tournoi mis à jour");
        navigate(URL_FRONT_ADMIN_TOURNAMENTS);
      } catch {
        // erreur déjà toastée dans le service
      } finally {
        setIsLoading(false);
      }
    },
    [tournament, token, tournamentId, navigate]
  );

  if (isLoadingTournament) {
    return (
      <AdminLayout>
        <AdminBodyHeader
          label="Modifier le tournoi"
          catchphrase="Mettez à jour les paramètres du tournoi"
          returnButton
        />
        <p className="text-sm text-gray-500">Chargement du tournoi…</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <AdminBodyHeader
        label="Modifier le tournoi"
        catchphrase="Mettez à jour les paramètres du tournoi"
        returnButton
      />
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm space-y-4 max-w-3xl"
      >
        <div className="flex flex-wrap justify-end gap-2">
          <SwitchInput
            label="Tournoi en ligne"
            attribute="is_online"
            data={tournament}
            setAction={setTournament}
            displayRow
          />
          <SwitchInput
            label="Decklist obligatoire"
            attribute="require_deck_list"
            data={tournament}
            setAction={setTournament}
            displayRow
          />
          <SwitchInput
            label="Tournoi officiel"
            attribute="is_official"
            data={tournament}
            setAction={setTournament}
            displayRow
          />
          <SwitchInput
            label="Duels jusqu'au vainqueur"
            attribute="until_winner"
            data={tournament}
            setAction={setTournament}
            displayRow
          />
          <SwitchInput
            label="Pénalités autorisées"
            attribute="allow_penalities"
            data={tournament}
            setAction={setTournament}
            displayRow
          />
        </div>

        <div className="grid grid-cols-12 gap-4">
          <Input
            label="Nom du tournoi"
            required
            inputType="text"
            attribute="name"
            data={tournament}
            setAction={setTournament}
            placeholder="Ex: Championnat du printemps 2025"
            colSpanWidth="6"
          />
          <SelectInput
            defaultOptionLabel="Choisir un statut"
            colSpanWidth="6"
            label="Statut"
            required
            attribute="status"
            data={tournament}
            setAction={setTournament}
            options={statusOptions}
          />
          {!tournament.is_online && (
            <Input
              label="Lieu"
              inputType="text"
              attribute="location"
              data={tournament}
              setAction={setTournament}
              placeholder="Ex: Paris - Salle des Duelistes"
              colSpanWidth="6"
            />
          )}
          <div className="col-span-12 flex flex-col text-sm font-medium text-gray-800">
            <span className="font-bold">Description:</span>
            <textarea
              rows={4}
              className="mt-1 p-2 rounded font-normal border border-gray-300"
              value={
                typeof tournament.description === "string"
                  ? tournament.description
                  : ""
              }
              onChange={(e) =>
                setTournament((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Présentation du tournoi…"
            />
            <span className="mt-1 text-xs text-gray-600 font-normal">
              Formatage : **gras**, __souligné__, *italique*, *red*rouge*red*,
              *green*vert*green*, Entrée = nouvelle ligne.
            </span>
          </div>
          <Input
            label="Nombre max de joueurs"
            required
            inputType="number"
            attribute="max_players"
            data={tournament}
            setAction={setTournament}
            min={2}
            colSpanWidth="6"
          />
          <SelectInput
            defaultOptionLabel="Choisir le nombre de duels par match"
            colSpanWidth="6"
            label="Duels par match (Best of)"
            required
            attribute="matches_per_round"
            data={tournament}
            setAction={setTournament}
            options={matchesPerRoundOptions}
          />
          <SelectInput
            defaultOptionLabel="Choisir le mode de résolution"
            colSpanWidth="6"
            label="Résolution des matchs"
            required
            attribute="match_resolution_mode"
            data={tournament}
            setAction={setTournament}
            options={matchResolutionModeOptions}
          />
          <Input
            label="Nombre de rondes"
            required
            inputType="number"
            attribute="max_number_of_rounds"
            data={tournament}
            setAction={setTournament}
            min={1}
            max={20}
            colSpanWidth="6"
            placeholder={
              maxPlayersNumber > 1
                ? `Nb. Rondes optimal pour ${maxPlayersNumber} joueurs: ${suggestedRounds}`
                : "Saisissez au moins 2 joueurs pour calculer un nombre de rondes optimal"
            }
          />
          <Input
            label="Date et heure de début"
            required
            inputType="datetime-local"
            attribute="event_date"
            data={tournament}
            setAction={setTournament}
            min={eventDateMin}
            max={eventDateMax}
            colSpanWidth="6"
          />
          <Input
            label="Date et heure de fin"
            required
            inputType="datetime-local"
            attribute="event_date_end"
            data={tournament}
            setAction={setTournament}
            min={eventDateEndMin}
            max={eventDateEndMax}
            colSpanWidth="6"
          />
          {selectedSeason ? (
            <p className="col-span-12 text-xs text-gray-600 -mt-2">
              Dates limitées à la saison « {selectedSeason.name} » (
              {selectedSeason.startDate} → {selectedSeason.endDate}).
            </p>
          ) : null}
          <SelectInput
            label="Saison (circuit officiel)"
            attribute="season_id"
            data={tournament}
            setAction={setTournament}
            options={seasonOptions}
            defaultOptionLabel="— Aucune saison —"
            colSpanWidth="12"
          />
          <p className="col-span-12 text-xs text-gray-600 -mt-2">
            Seules les saisons qui couvrent entièrement le début et la fin du
            tournoi sont proposées. Choisir une saison limite aussi les dates
            sélectionnables.
          </p>
          {tournament.is_official && !tournament.season_id && (
            <p className="col-span-12 text-xs text-amber-700 -mt-2">
              Un tournoi officiel sans saison n&apos;attribue pas de points au
              classement saison (Swiss 3/1/0).
            </p>
          )}
          <SelectInput
            defaultOptionLabel="Choisir le délai de fermeture"
            label="Fermeture des inscriptions"
            required
            attribute="registration_close_hours_before"
            data={tournament}
            setAction={setTournament}
            options={registrationCloseHoursOptions}
            colSpanWidth="6"
          />
        </div>

        <div className="space-y-2 rounded border border-gray-200 bg-gray-50 p-3">
          <QuizImageCardSearch
            selectedName={imageCardName}
            onSelect={(artworkUrl, cardName) => {
              setImageCardName(cardName);
              setTournament((prev) => ({
                ...prev,
                image_url: artworkUrl,
                image_focal_x: 50,
                image_focal_y: 50,
                image_zoom: 100,
              }));
            }}
            onClear={() => {
              setImageCardName(null);
              setTournament((prev) => ({
                ...prev,
                image_url: null,
                image_focal_x: 50,
                image_focal_y: 50,
                image_zoom: 100,
              }));
            }}
          />
          {typeof tournament.image_url === "string" && tournament.image_url ? (
            <ImageFocalZoomEditor
              imageUrl={tournament.image_url}
              focalX={Number(tournament.image_focal_x) || 50}
              focalY={Number(tournament.image_focal_y) || 50}
              zoom={Number(tournament.image_zoom) || 100}
              onFocalChange={(image_focal_x, image_focal_y) =>
                setTournament((prev) => ({
                  ...prev,
                  image_focal_x,
                  image_focal_y,
                }))
              }
              onZoomChange={(image_zoom) =>
                setTournament((prev) => ({ ...prev, image_zoom }))
              }
              previewTone="amber"
              previewHint="Aperçu highlight officiel (droite)"
            />
          ) : null}
        </div>

        <div className="flex gap-3 pt-2">
          <Button
            submit
            className="text-white p-2 bg-blue-400 rounded hover:bg-blue-500 font-bold cursor-pointer disabled:opacity-50"
            buttonText={
              isLoading ? "Enregistrement…" : "Enregistrer les modifications"
            }
            disabled={isLoading}
          />
        </div>
      </form>
    </AdminLayout>
  );
};

export default AdminUpdateTournament;
