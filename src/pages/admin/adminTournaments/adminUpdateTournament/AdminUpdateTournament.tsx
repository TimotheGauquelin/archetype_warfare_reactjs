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

const AdminUpdateTournament = () => {
  const { tournamentId } = useParams<{ tournamentId: string }>();
  const navigate = useNavigate();
  const { token } = useSelector((state: RootState) => state.user);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingTournament, setIsLoadingTournament] = useState(true);
  const [tournament, setTournament] = useState<Tournament>({
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
    require_deck_list: false,
    until_winner: false,
    allow_penalities: false,
  });

  const matchesPerRoundOptions = [
    { id: "1 Duel", label: "1 Duel" },
    { id: "3 Duels", label: "3 Duels" },
    { id: "5 Duels", label: "5 Duels" },
  ];

  
  const maxPlayersNumber = Number(tournament.max_players) || 0;
  const suggestedRounds =
    maxPlayersNumber > 1 ? Math.floor(Math.log2(maxPlayersNumber)) : 0;


  useEffect(() => {
    if (!tournamentId) return;
    let cancelled = false;
    getTournamentById(tournamentId)
      .then((tournament) => {
        if (cancelled) return;
        setTournament({
          id: tournament.id,
          name: tournament.name,
          status: tournament.status as TournamentStatus,
          max_players: tournament.max_players,
          max_number_of_rounds: tournament.max_number_of_rounds,
          matches_per_round: tournament.matches_per_round,
          require_deck_list: tournament.require_deck_list,
          until_winner: tournament.until_winner,
          location: tournament.location,
          event_date: formatDateForInputWithHours(tournament.event_date),
          event_date_end: formatDateForInputWithHours(tournament.event_date_end),
          is_online: tournament.is_online,
          allow_penalities: tournament.allow_penalities as boolean,
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
      const payload: UpdateTournamentPayload = {
        name: (tournament.name ?? "").trim(),
        status: tournament.status,
        max_players: Number(tournament.max_players) || 2,
        location: (tournament.location ?? "").trim(),
        event_date: new Date(tournament.event_date).toISOString(),
        event_date_end: new Date(tournament.event_date_end).toISOString(),
        is_online: tournament.is_online,
        require_deck_list: tournament.require_deck_list as boolean,
        until_winner: tournament.until_winner as boolean,
        max_number_of_rounds: Number(tournament.max_number_of_rounds) || 1,
        matches_per_round: Number(tournament.matches_per_round) || 1,
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
        <AdminBodyHeader label="Modifier le tournoi" returnButton />
        <p className="text-gray-500 p-4">Chargement du tournoi…</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <AdminBodyHeader label="Modifier le tournoi" returnButton />
      <form onSubmit={handleSubmit} className="bg-gray-300 rounded p-4 mb-4 max-w-2xl">
        <div className="grid grid-cols-1 sm:grid-cols-2">
          <div className="flex justify-end">
            <SwitchInput
              label="Tournoi en ligne"
              attribute="is_online"
              data={tournament}
              setAction={setTournament}
            />
            <SwitchInput
              label="Decklist obligatoire"
              attribute="require_deck_list"
              data={tournament}
              setAction={setTournament}
            />
            <SwitchInput
              label="Duels jusqu'au vainqueur"
              attribute="until_winner"
              data={tournament}
              setAction={setTournament}
            />
            <SwitchInput
              label="Pénalités autorisées"
              attribute="allow_penalities"
              data={tournament}
              setAction={setTournament}
            />
          </div>
          <div className="grid grid-cols-12 sm:grid-cols-6 gap-4">
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
            <Input
              label="Lieu"
              inputType="text"
              attribute="location"
              data={tournament}
              setAction={setTournament}
              placeholder="Ex: Paris - Salle des Duelistes"
              colSpanWidth="6"
            />
          </div>
          <div className="grid grid-cols-12 sm:grid-cols-6 gap-4">
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
              label="Duels per match(Best of)"
              required
              attribute="matches_per_round"
              data={tournament as Record<string, unknown>}
              setAction={setTournament as React.Dispatch<React.SetStateAction<Record<string, unknown>>>}
              options={matchesPerRoundOptions}
            />
          </div>
          <div className="grid grid-cols-12 sm:grid-cols-6 gap-4">
            <Input
              label="Nombre de rondes"
              required inputType="number"
              attribute="max_number_of_rounds"
              data={tournament}
              setAction={setTournament}
              min={1}
              max={20}
              colSpanWidth="6"
              placeholder={maxPlayersNumber > 1
                ? `Nb. Rondes optimal pour ${maxPlayersNumber} joueurs: ${suggestedRounds}`
                : "Saisissez au moins 2 joueurs pour calculer un nombre de rondes optimal"}
            />
          </div>
          <div className="grid grid-cols-12 sm:grid-cols-6 gap-4">
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
              colSpanWidth="6"
            />
          </div>
        </div>
        <div className="mt-4">
          <Button
            submit
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded font-semibold"
            buttonText={isLoading ? "Enregistrement…" : "Enregistrer les modifications"}
            disabled={isLoading}
          />
        </div>
      </form>
    </AdminLayout>
  );
};

export default AdminUpdateTournament;
