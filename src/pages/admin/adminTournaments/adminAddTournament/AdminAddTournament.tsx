import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import AdminBodyHeader from "@/components/pages/admin/AdminBodyHeader";
import AdminLayout from "../../adminLayout";
import { Input } from "@/components/generic/form/input/Input";
import { SwitchInput } from "@/components/generic/form/SwitchInput";
import Button from "@/components/generic/buttons/classicButton/Button";
import { createTournament, type CreateTournamentPayload } from "@/services/tournament";
import {
  listAdminQuizSeasons,
  type AdminQuizSeason,
} from "@/services/quiz";
import { URL_FRONT_ADMIN_TOURNAMENTS } from "@/constant/urlsFront";
import type { RootState } from "@/redux/store";
import { toast } from "react-toastify";
import SelectInput from "@/components/generic/form/SelectInput";
import QuizImageCardSearch from "@/components/pages/admin/quiz/QuizImageCardSearch";
import ImageFocalZoomEditor from "@/components/pages/admin/ImageFocalZoomEditor";
import { MATCH_RESOLUTION_MODE_OPTIONS } from "@/utils/tournament/bestOfScore";
import {
  clampTournamentDatesToSeason,
  isTournamentFullyWithinSeason,
  seasonToDatetimeBounds,
} from "@/utils/tournament/seasonDateConstraints";

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
  description: string;
  event_date: string;
  event_date_end: string;
  is_online: boolean;
  require_deck_list: boolean;
  until_winner: boolean;
  is_official: boolean;
  allow_penalities: boolean;
  registration_close_hours_before: string;
  image_url: string;
  image_focal_x: number;
  image_focal_y: number;
  image_zoom: number;
  season_id: number | string | null;
} & Record<string, unknown>;

const REGISTRATION_CLOSE_HOURS_OPTIONS = [
  { id: "1", label: "1 heure avant" },
  { id: "6", label: "6 heures avant" },
  { id: "12", label: "12 heures avant" },
  { id: "24", label: "24 heures avant" },
  { id: "48", label: "48 heures avant" },
  { id: "72", label: "72 heures avant" },
];

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
  const { token, isAuthenticated } = useSelector((state: RootState) => state.user);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState<TournamentFormState>({
    name: "",
    max_number_of_rounds: "",
    matches_per_round: "3",
    match_resolution_mode: "strict_wins",
    max_players: "16",
    location: "",
    description: "",
    event_date: defaultStart(),
    event_date_end: defaultEnd(),
    is_online: false,
    require_deck_list: false,
    until_winner: false,
    is_official: false,
    allow_penalities: false,
    registration_close_hours_before: "48",
    image_url: "",
    image_focal_x: 50,
    image_focal_y: 50,
    image_zoom: 100,
    season_id: null,
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
    if (form.season_id == null || String(form.season_id) === "") return null;
    return (
      seasons.find((s) => String(s.id) === String(form.season_id)) ?? null
    );
  }, [seasons, form.season_id]);

  const seasonDateBounds = useMemo(() => {
    if (!selectedSeason) return null;
    return seasonToDatetimeBounds(
      selectedSeason.startDate,
      selectedSeason.endDate
    );
  }, [selectedSeason]);

  const eventDateMin = seasonDateBounds?.min ?? minEventStart();
  const eventDateMax = seasonDateBounds?.max;
  const eventDateEndMin = form.event_date
    ? seasonDateBounds
      ? form.event_date > seasonDateBounds.min
        ? form.event_date
        : seasonDateBounds.min
      : form.event_date
    : eventDateMin;
  const eventDateEndMax = seasonDateBounds?.max;

  const seasonOptions = useMemo(() => {
    const matching = seasons.filter((s) =>
      isTournamentFullyWithinSeason(
        form.event_date,
        form.event_date_end,
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
  }, [seasons, form.event_date, form.event_date_end, selectedSeason]);

  // Saison inconnue → retirer. Sinon maintenir les dates dans la fenêtre.
  useEffect(() => {
    if (form.season_id == null || String(form.season_id) === "") return;
    if (seasons.length === 0) return;
    if (!selectedSeason) {
      setForm((prev) => ({ ...prev, season_id: null }));
      return;
    }
    setForm((prev) => {
      const clamped = clampTournamentDatesToSeason(
        prev.event_date,
        prev.event_date_end,
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
    form.season_id,
    form.event_date,
    form.event_date_end,
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

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!isAuthenticated) {
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
      if (selectedSeason) {
        const ok = isTournamentFullyWithinSeason(
          form.event_date,
          form.event_date_end,
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
      const payload: CreateTournamentPayload = {
        name: form.name.trim(),
        max_number_of_rounds: Number(form.max_number_of_rounds) || 1,
        matches_per_round: Number(form.matches_per_round) || 1,
        match_resolution_mode:
          form.match_resolution_mode === "highest_score"
            ? "highest_score"
            : "strict_wins",
        max_players: Number(form.max_players) || 2,
        location: form.is_online ? "" : form.location.trim(),
        description: form.description.trim() || null,
        event_date: start.toISOString(),
        event_date_end: end.toISOString(),
        is_online: form.is_online,
        require_deck_list: form.require_deck_list,
        until_winner: form.until_winner,
        is_official: form.is_official,
        allow_penalities: form.allow_penalities,
        registration_close_hours_before:
          Number(form.registration_close_hours_before) || 48,
        image_url: form.image_url.trim() || null,
        image_focal_x: form.image_url.trim() ? form.image_focal_x : 50,
        image_focal_y: form.image_url.trim() ? form.image_focal_y : 50,
        image_zoom: form.image_url.trim() ? form.image_zoom : 100,
        season_id:
          form.season_id != null && String(form.season_id) !== ""
            ? Number(form.season_id)
            : null,
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
            colSpanWidth={form.is_online ? "12" : "6"}
            inputType="text"
            attribute="name"
            data={form}
            setAction={setForm}
            placeholder="Ex: Championnat du printemps 2025"
          />
          {!form.is_online && (
            <Input
              label="Lieu"
              inputType="text"
              colSpanWidth="6"
              attribute="location"
              data={form}
              setAction={setForm}
              placeholder="Ex: Paris"
            />
          )}
          <div className="col-span-12 flex flex-col text-sm font-medium text-gray-800">
            <span className="font-bold">Description:</span>
            <textarea
              rows={4}
              className="mt-1 p-2 rounded font-normal border border-gray-300"
              value={form.description}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, description: e.target.value }))
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
            min={eventDateMin}
            max={eventDateMax}
            colSpanWidth="6"
          />
          <Input
            label="Date et heure de fin"
            required
            inputType="datetime-local"
            attribute="event_date_end"
            data={form}
            setAction={setForm}
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
            data={form}
            setAction={setForm}
            options={seasonOptions}
            defaultOptionLabel="— Aucune saison —"
            colSpanWidth="12"
          />
          <p className="col-span-12 text-xs text-gray-600 -mt-2">
            Seules les saisons qui couvrent entièrement le début et la fin du
            tournoi sont proposées. Choisir une saison limite aussi les dates
            sélectionnables.
          </p>
          {form.is_official && !form.season_id && (
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
            data={form}
            setAction={setForm}
            options={REGISTRATION_CLOSE_HOURS_OPTIONS}
            colSpanWidth="6"
          />
        </div>

        <div className="space-y-2 rounded border border-gray-200 bg-gray-50 p-3">
          <QuizImageCardSearch
            selectedName={imageCardName}
            onSelect={(artworkUrl, cardName) => {
              setImageCardName(cardName);
              setForm((prev) => ({
                ...prev,
                image_url: artworkUrl,
                image_focal_x: 50,
                image_focal_y: 50,
                image_zoom: 100,
              }));
            }}
            onClear={() => {
              setImageCardName(null);
              setForm((prev) => ({
                ...prev,
                image_url: "",
                image_focal_x: 50,
                image_focal_y: 50,
                image_zoom: 100,
              }));
            }}
          />
          {form.image_url ? (
            <ImageFocalZoomEditor
              imageUrl={form.image_url}
              focalX={form.image_focal_x}
              focalY={form.image_focal_y}
              zoom={form.image_zoom}
              onFocalChange={(image_focal_x, image_focal_y) =>
                setForm((prev) => ({ ...prev, image_focal_x, image_focal_y }))
              }
              onZoomChange={(image_zoom) =>
                setForm((prev) => ({ ...prev, image_zoom }))
              }
              previewTone="amber"
              previewHint="Aperçu highlight officiel (droite)"
            />
          ) : null}
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
