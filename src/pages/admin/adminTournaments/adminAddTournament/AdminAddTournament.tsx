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

function toDatetimeLocal(date: Date): string {
  const pad = (n: number) => (n < 10 ? "0" + n : String(n));
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

type TournamentFormState = {
  name: string;
  max_number_of_rounds: string;
  matches_per_round: string;
  max_players: string;
  location: string;
  event_date: string;
  event_date_end: string;
  is_online: boolean;
};

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

const AdminAddTournament = () => {
  const navigate = useNavigate();
  const { token } = useSelector((state: RootState) => state.user);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState<TournamentFormState>({
    name: "",
    max_number_of_rounds: "",
    matches_per_round: "3",
    max_players: "16",
    location: "",
    event_date: defaultStart(),
    event_date_end: defaultEnd(),
    is_online: false,
  });

  const matchesPerRoundOptions = [
    { id: "1 Duel", label: "1 Duel" },
    { id: "3 Duels", label: "3 Duels" },
    { id: "5 Duels", label: "5 Duels" },
  ];

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!token) {
        toast.error("Vous devez être connecté.");
        return;
      }
      const payload: CreateTournamentPayload = {
        name: form.name.trim(),
        max_number_of_rounds: Number(form.max_number_of_rounds) || 1,
        matches_per_round: Number(form.matches_per_round) || 1,
        max_players: Number(form.max_players) || 2,
        location: form.location.trim(),
        event_date: new Date(form.event_date).toISOString(),
        event_date_end: new Date(form.event_date_end).toISOString(),
        is_online: form.is_online,
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
      <AdminBodyHeader label="Ajouter un tournoi" returnButton />

      <form onSubmit={handleSubmit} className="bg-gray-300 rounded p-4 mb-4 max-w-2xl">
        <div className="flex flex-col justify-end">
        <div className="flex justify-end">
            <SwitchInput
              label="Tournoi en ligne"
              attribute="is_online"
              data={form}
              setAction={setForm}
            />
            <SwitchInput
              label="Decklist obligatoire"
              attribute="require_deck_list"
              data={form}
              setAction={setForm}
            />
            <SwitchInput
              label="Duels jusqu'au vainqueur"
              attribute="until_winner"
              data={form}
              setAction={setForm}
            />
          </div>
          <div className="grid grid-cols-12 sm:grid-cols-6 gap-4">
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
          </div>
          <div className="grid grid-cols-12 sm:grid-cols-6 gap-4">
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
              label="Duels per match(Best of)"
              required
              attribute="matches_per_round"
              data={form as Record<string, unknown>}
              setAction={setForm as React.Dispatch<React.SetStateAction<Record<string, unknown>>>}
              options={matchesPerRoundOptions}
            />
          </div>
          <div className="grid grid-cols-12 sm:grid-cols-6 gap-4">
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
              data={form}
              setAction={setForm}
              colSpanWidth="6"
            />
            <Input
              label="Date et heure de fin"
              required
              inputType="datetime-local"
              attribute="event_date_end"
              data={form}
              setAction={setForm}
              colSpanWidth="6"
            />
          </div>
        </div>
        <div className="mt-4">
          <Button
            submit
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded font-semibold"
            buttonText={isLoading ? "Création en cours..." : "Créer le tournoi"}
            disabled={isLoading}
          />
        </div>
      </form>
    </AdminLayout >
  );
};

export default AdminAddTournament;
