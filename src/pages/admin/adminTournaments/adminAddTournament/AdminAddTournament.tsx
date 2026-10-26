import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import AdminBodyHeader from "@/components/pages/admin/AdminBodyHeader";
import AdminLayout from "../../adminLayout";
import { Input } from "@/components/generic/form/input/Input";
import { SwitchInput } from "@/components/generic/form/SwitchInput";
import Button from "@/components/generic/buttons/classicButton/Button";
import { createTournament, type CreateTournamentPayload } from "@/services/tournament";
import { URL_FRONT_ADMIN_TOURNAMENTS } from "@/constant/urlsFront";
import type { RootState } from "@/redux/store";
import { toast } from "react-toastify";
import SelectInput from "@/components/generic/form/SelectInput";
import { MATCH_RESOLUTION_MODE_OPTIONS } from "@/utils/tournament/bestOfScore";

function toDatetimeLocal(date: Date): string {
  const pad = (n: number) => (n < 10 ? "0" + n : String(n));
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

type TournamentFormState = {
  name: string;
  max_number_of_rounds: string;
  matches_per_round: string;
  match_resolution_mode: string;
  max_players: string;
  location: string;
  event_date: string;
  event_date_end: string;
  is_online: boolean;
  require_deck_list: boolean;
  until_winner: boolean;
  is_official: boolean;
  allow_penalities: boolean;
} & Record<string, unknown>;

const defaultStart = () => {
  const d = new Date();
  d.setHours(14, 0, 0, 0);
  return toDatetimeLocal(d);
};
const defaultEnd = () => {
  const d = new Date();
  d.setHours(20, 0, 0, 0);
  return toDatetimeLocal(d);
};
const minEventStart = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return toDatetimeLocal(d);
};
const isBeforeToday = (date: Date): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const day = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  return day.getTime() < today.getTime();
};

const AdminAddTournament = () => {
  const navigate = useNavigate();
  const { token } = useSelector((state: RootState) => state.user);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState<TournamentFormState>({
    name: "",
    max_number_of_rounds: "",
    matches_per_round: "3",
    match_resolution_mode: "strict_wins",
    max_players: "16",
    location: "",
    event_date: defaultStart(),
    event_date_end: defaultEnd(),
    is_online: false,
    require_deck_list: false,
    until_winner: false,
    is_official: false,
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

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!token) {
        toast.error("Vous devez être connecté.");
        return;
      }
      const start = new Date(form.event_date);
      const end = new Date(form.event_date_end);
      if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
        toast.error("Dates de début ou de fin invalides.");
        return;
      }
      if (isBeforeToday(start)) {
        toast.error("La date de début ne peut pas être antérieure à aujourd'hui.");
        return;
      }
      if (end.getTime() < start.getTime()) {
        toast.error(
          "La date de fin doit être postérieure ou égale à la date de début."
        );
        return;
      }
      const payload: CreateTournamentPayload = {
        name: form.name.trim(),
        max_number_of_rounds: Number(form.max_number_of_rounds) || 1,
        matches_per_round: Number(form.matches_per_round) || 1,
        match_resolution_mode:
          form.match_resolution_mode === "highest_score"
            ? "highest_score"
            : "strict_wins",
        max_players: Number(form.max_players) || 2,
        location: form.location.trim(),
        event_date: start.toISOString(),
        event_date_end: end.toISOString(),
        is_online: form.is_online,
        require_deck_list: form.require_deck_list,
        until_winner: form.until_winner,
        is_official: form.is_official,
        allow_penalities: form.allow_penalities,
      };
      setIsLoading(true);
      try {
        await createTournament(payload, token);
        toast.success("Tournoi créé.");
        navigate(URL_FRONT_ADMIN_TOURNAMENTS);
      } catch {
        // erreur déjà toastée dans le service
      } finally {
        setIsLoading(false);
      }
    },
    [form, token, navigate]
  );

  const maxPlayersNumber = Number(form.max_players) || 0;
  const suggestedRounds =
    maxPlayersNumber > 1 ? Math.floor(Math.log2(maxPlayersNumber)) : 0;

  return (
    <AdminLayout>
      <AdminBodyHeader
        label="Ajouter un tournoi"
        catchphrase="Configurez les règles, le lieu et le calendrier du tournoi"
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
            data={form}
            setAction={setForm}
            displayRow
          />
          <SwitchInput
            label="Decklist obligatoire"
            attribute="require_deck_list"
            data={form}
            setAction={setForm}
            displayRow
          />
          <SwitchInput
            label="Tournoi officiel"
            attribute="is_official"
            data={form}
            setAction={setForm}
            displayRow
          />
          <SwitchInput
            label="Duels jusqu'au vainqueur"
            attribute="until_winner"
            data={form}
            setAction={setForm}
            displayRow
          />
          <SwitchInput
            label="Pénalités autorisées"
            attribute="allow_penalities"
            data={form}
            setAction={setForm}
            displayRow
          />
        </div>

        <div className="grid grid-cols-12 gap-4">
          <Input
            label="Nom du tournoi"
            required
            colSpanWidth="6"
            inputType="text"
            attribute="name"
            data={form}
            setAction={setForm}
            placeholder="Ex: Championnat du printemps 2025"
          />
          <Input
            label="Lieu"
            inputType="text"
            colSpanWidth="6"
            attribute="location"
            data={form}
            setAction={setForm}
            placeholder="Ex: Paris"
          />
          <Input
            label="Nombre max de joueurs"
            required
            inputType="number"
            attribute="max_players"
            colSpanWidth="6"
            data={form}
            setAction={setForm}
            min={2}
          />
          <SelectInput
            defaultOptionLabel="Choisir le nombre de duels par match"
            colSpanWidth="6"
            label="Duels par match (Best of)"
            required
            attribute="matches_per_round"
            data={form}
            setAction={setForm}
            options={matchesPerRoundOptions}
          />
          <SelectInput
            defaultOptionLabel="Choisir le mode de résolution"
            colSpanWidth="6"
            label="Résolution des matchs"
            required
            attribute="match_resolution_mode"
            data={form}
            setAction={setForm}
            options={matchResolutionModeOptions}
          />
          <Input
            label="Nombre de rondes"
            required
            inputType="number"
            attribute="max_number_of_rounds"
            data={form}
            setAction={setForm}
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
            data={form}
            setAction={setForm}
            min={minEventStart()}
            colSpanWidth="6"
          />
          <Input
            label="Date et heure de fin"
            required
            inputType="datetime-local"
            attribute="event_date_end"
            data={form}
            setAction={setForm}
            min={form.event_date || undefined}
            colSpanWidth="6"
          />
        </div>

        <p className="text-sm text-gray-600 bg-amber-50 border border-amber-200 rounded-md p-2">
          À la création, le tournoi est en statut « Non visible » : il n’apparaît
          pas aux joueurs tant que vous ne changez pas le statut (Modifier le
          tournoi).
        </p>

        <div className="flex gap-3 pt-2">
          <Button
            submit
            className="text-white p-2 bg-blue-400 rounded hover:bg-blue-500 font-bold cursor-pointer disabled:opacity-50"
            buttonText={isLoading ? "Création en cours…" : "Créer le tournoi"}
            disabled={isLoading}
          />
        </div>
      </form>
    </AdminLayout>
  );
};

export default AdminAddTournament;
