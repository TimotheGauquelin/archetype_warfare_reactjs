import { FormEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import AdminBodyHeader from "../../../components/pages/admin/AdminBodyHeader";
import AdminStructure from "../adminLayout";
import AdminQuizSeasonPoolTab from "../../../components/pages/admin/quiz/AdminQuizSeasonPoolTab";
import {
  createAdminQuizSeason,
  getAdminQuizSeason,
  updateAdminQuizSeason,
} from "../../../services/quiz";
import {
  URL_FRONT_ADMIN_QUIZZES,
  getAdminQuizSeasonUpdatePath,
} from "../../../constant/urlsFront";

const addDays = (isoDate: string, days: number): string => {
  const d = new Date(`${isoDate}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
};

const todayIso = () => new Date().toISOString().slice(0, 10);

type SeasonTab = "informations" | "pool";

interface AdminQuizSeasonFormProps {
  mode: "add" | "edit";
}

const AdminQuizSeasonForm = ({ mode }: AdminQuizSeasonFormProps) => {
  const navigate = useNavigate();
  const { seasonId } = useParams();
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState(todayIso());
  const [endDate, setEndDate] = useState(addDays(todayIso(), 89));
  const [loading, setLoading] = useState(mode === "edit");
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<SeasonTab>("informations");
  const [resolvedSeasonId, setResolvedSeasonId] = useState<number | null>(
    mode === "edit" && seasonId ? Number(seasonId) : null
  );

  useEffect(() => {
    if (mode !== "edit" || !seasonId) return;
    let cancelled = false;
    (async () => {
      try {
        const season = await getAdminQuizSeason(seasonId);
        if (cancelled) return;
        setName(season.name);
        setStartDate(season.startDate);
        setEndDate(season.endDate);
        setResolvedSeasonId(season.id);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Saison introuvable"
        );
        navigate(URL_FRONT_ADMIN_QUIZZES);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [mode, seasonId, navigate]);

  const onStartChange = (value: string) => {
    setStartDate(value);
    if (mode === "add") {
      setEndDate(addDays(value, 89));
    }
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!name.trim()) {
      toast.error("Nom requis");
      return;
    }
    setSaving(true);
    try {
      if (mode === "edit" && seasonId) {
        await updateAdminQuizSeason(seasonId, {
          name: name.trim(),
          startDate,
          endDate,
        });
        toast.success("Saison mise à jour");
        navigate(URL_FRONT_ADMIN_QUIZZES);
      } else {
        const created = await createAdminQuizSeason({
          name: name.trim(),
          startDate,
          endDate,
        });
        toast.success("Saison créée");
        navigate(getAdminQuizSeasonUpdatePath(created.id));
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Enregistrement impossible"
      );
    } finally {
      setSaving(false);
    }
  };

  const tabClass = (tab: SeasonTab) =>
    `py-2 px-4 rounded-t-md cursor-pointer ${activeTab === tab
      ? "text-blue-700 bg-blue-200 hover:bg-blue-300"
      : "text-gray-700 bg-gray-200 hover:bg-gray-300"
    }`;

  return (
    <AdminStructure>
      <AdminBodyHeader
        label={mode === "edit" ? "Modifier la saison" : "Nouvelle saison"}
        catchphrase="Une saison Daily Quizz dure environ 3 mois (90 jours)"
        returnButton
      />

      {loading ? (
        <p className="text-sm text-gray-500">Chargement…</p>
      ) : (
        <div>
          {mode === "edit" && (
            <div className="flex">
              <span
                className={tabClass("informations")}
                onClick={() => setActiveTab("informations")}
              >
                Informations générales
              </span>
              <span
                className={tabClass("pool")}
                onClick={() => setActiveTab("pool")}
              >
                Pool questions
              </span>
            </div>
          )}

          <div
            className={
              mode === "add" || activeTab === "informations" ? "" : "hidden"
            }
          >
            <form
              onSubmit={(e) => void onSubmit(e)}
              className={`max-w-lg space-y-4 bg-white p-4 ${
                mode === "edit"
                  ? "border border-t-0 rounded-b-md"
                  : "border rounded-md"
              }`}
            >
              <label className="flex flex-col gap-1 text-sm font-medium text-gray-800">
                Nom
                <input
                  type="text"
                  className="border rounded p-2"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex. Saison Printemps 2026"
                  required
                />
              </label>
              <label className="flex flex-col gap-1 text-sm font-medium text-gray-800">
                Date de début
                <input
                  type="date"
                  className="border rounded p-2"
                  value={startDate}
                  onChange={(e) => onStartChange(e.target.value)}
                  required
                />
              </label>
              <label className="flex flex-col gap-1 text-sm font-medium text-gray-800">
                Date de fin
                <input
                  type="date"
                  className="border rounded p-2"
                  value={endDate}
                  min={startDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
              </label>
              <p className="text-sm text-gray-500 bg-yellow-100 border border-yellow-500 p-2 rounded-md">
                <span className="text-yellow-500">ⓘ</span> Par défaut la fin est fixée à 90 jours après le début.
              </p>
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50"
              >
                {saving
                  ? "Enregistrement…"
                  : mode === "edit"
                    ? "Enregistrer"
                    : "Créer la saison"}
              </button>
            </form>
          </div>

          {mode === "edit" && resolvedSeasonId && (
            <AdminQuizSeasonPoolTab
              seasonId={resolvedSeasonId}
              active={activeTab === "pool"}
            />
          )}
        </div>
      )}
    </AdminStructure>
  );
};

export default AdminQuizSeasonForm;
