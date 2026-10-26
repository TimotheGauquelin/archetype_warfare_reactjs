import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import AdminBodyHeader from "@/components/pages/admin/AdminBodyHeader";
import AdminLayout from "../../adminLayout";
import { Input } from "@/components/generic/form/input/Input";
import { SwitchInput } from "@/components/generic/form/SwitchInput";
import SelectInput from "@/components/generic/form/SelectInput";
import Button from "@/components/generic/buttons/classicButton/Button";
import {
  getTournamentById,
  updateTournament,
  type UpdateTournamentPayload,
} from "@/services/tournament";
import { URL_FRONT_ADMIN_TOURNAMENTS } from "@/constant/urlsFront";
import type { RootState } from "@/redux/store";
import { toast } from "react-toastify";
import { Tournament, TournamentStatus } from "@/types";
import { formatDateForInputWithHours } from "@/utils/date/formatDateForInput";
import { MATCH_RESOLUTION_MODE_OPTIONS } from "@/utils/tournament/bestOfScore";

type TournamentFormState = Tournament & Record<string, unknown>;

const AdminUpdateTournament = () => {
  const { tournamentId } = useParams<{ tournamentId: string }>();
  const navigate = useNavigate();
  const { token } = useSelector((state: RootState) => state.user);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingTournament, setIsLoadingTournament] = useState(true);
  const [tournament, setTournament] = useState<TournamentFormState>({
    id: "",
    name: "",
    status: "registration_open",
    max_players: 2,
    location: "",
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
  });

  const matchesPerRoundOptions = [
    { id: "1", label: "1 Duel" },
    { id: "3", label: "3 Duels" },
    { id: "5", label: "5 Duels" },
  ];

  const matchResolutionModeOptions = MATCH_RESOLUTION_MODE_OPTIONS.map((o) => ({
    id: o.id,
    label: o.label,
  }));

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
          event_date: formatDateForInputWithHours(data.event_date),
          event_date_end: formatDateForInputWithHours(data.event_date_end),
          is_online: data.is_online,
          allow_penalities: data.allow_penalities as boolean,
        });
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
      if (!token || !tournamentId) {
        toast.error("Données manquantes.");
        return;
      }
      const start = new Date(tournament.event_date);
      const end = new Date(tournament.event_date_end);
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
        location: (tournament.location ?? "").trim(),
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
          <Input
            label="Lieu"
            inputType="text"
            attribute="location"
            data={tournament}
            setAction={setTournament}
            placeholder="Ex: Paris - Salle des Duelistes"
            colSpanWidth="6"
          />
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
            colSpanWidth="6"
          />
          <Input
            label="Date et heure de fin"
            required
            inputType="datetime-local"
            attribute="event_date_end"
            data={tournament}
            setAction={setTournament}
            min={tournament.event_date || undefined}
            colSpanWidth="6"
          />
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
