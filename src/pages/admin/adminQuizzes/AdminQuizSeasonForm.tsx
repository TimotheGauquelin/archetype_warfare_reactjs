import { FormEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import AdminBodyHeader from "../../../components/pages/admin/AdminBodyHeader";
import AdminStructure from "../adminLayout";
import AdminQuizSeasonPoolTab from "../../../components/pages/admin/quiz/AdminQuizSeasonPoolTab";
import CheckboxSlider from "../../../components/generic/CheckboxSlider";
import QuizImageCardSearch from "../../../components/pages/admin/quiz/QuizImageCardSearch";
import ImageFocalZoomEditor from "../../../components/pages/admin/ImageFocalZoomEditor";
import {
  createAdminQuizSeason,
  getAdminQuizSeason,
  updateAdminQuizSeason,
} from "../../../services/quiz";
import {
  URL_FRONT_ADMIN_QUIZZES,
  getAdminQuizSeasonUpdatePath,
} from "../../../constant/urlsFront";
import { convertBase64 } from "../../../utils/img/convertBase";

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
  const [imageUrl, setImageUrl] = useState<string>("");
  const [imageMode, setImageMode] = useState<"upload" | "card">("upload");
  const [imageCardName, setImageCardName] = useState<string | null>(null);
  const [imageFocalX, setImageFocalX] = useState(50);
  const [imageFocalY, setImageFocalY] = useState(50);
  const [imageZoom, setImageZoom] = useState(100);
  const [allowsOverlap, setAllowsOverlap] = useState(false);
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
        setImageUrl(season.imageUrl ?? "");
        setImageFocalX(season.imageFocalX ?? 50);
        setImageFocalY(season.imageFocalY ?? 50);
        setImageZoom(season.imageZoom ?? 100);
        setAllowsOverlap(Boolean(season.allowsOverlap));
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
      const payload = {
        name: name.trim(),
        startDate,
        endDate,
        imageUrl: imageUrl.trim() || null,
        imageFocalX,
        imageFocalY,
        imageZoom,
        allowsOverlap,
      };
      if (mode === "edit" && seasonId) {
        await updateAdminQuizSeason(seasonId, payload);
        toast.success("Saison mise à jour");
        navigate(URL_FRONT_ADMIN_QUIZZES);
      } else {
        const created = await createAdminQuizSeason(payload);
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

              <label className="flex items-start gap-3 rounded border border-amber-200 bg-amber-50 p-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="mt-1"
                  checked={allowsOverlap}
                  onChange={(e) => setAllowsOverlap(e.target.checked)}
                />
                <span className="text-sm text-gray-800">
                  <span className="font-medium">Saison exceptionnelle</span>
                  <span className="block text-xs text-gray-600 mt-0.5 font-normal">
                    Peut chevaucher une saison normale (ex. Halloween). Ajoute
                    une question daily thématique en plus, sans compter dans le
                    score de la saison chevauchée.
                  </span>
                </span>
              </label>

              <div className="space-y-2 rounded border border-gray-200 bg-gray-50 p-3">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm font-medium text-gray-800">
                    Image d&apos;illustration
                  </p>
                  <div className="flex flex-row items-center gap-2">
                    <span className="text-xs font-medium text-gray-800 whitespace-nowrap">
                      Depuis mon PC
                    </span>
                    <label className="inline-flex relative items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={imageMode === "card"}
                        onChange={() => {
                          const nextMode =
                            imageMode === "card" ? "upload" : "card";
                          setImageMode(nextMode);
                          setImageCardName(null);
                          setImageUrl("");
                          setImageFocalX(50);
                          setImageFocalY(50);
                          setImageZoom(100);
                        }}
                      />
                      <CheckboxSlider />
                    </label>
                    <span className="text-xs font-medium text-gray-800 whitespace-nowrap">
                      Depuis une carte
                    </span>
                  </div>
                </div>
                {imageMode === "upload" ? (
                  <label className="flex flex-col gap-1 text-sm text-gray-700">
                    Fichier image
                    <input
                      type="file"
                      accept="image/*"
                      className="font-normal"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const base64Img = await convertBase64(file);
                        if (typeof base64Img === "string") {
                          setImageCardName(null);
                          setImageUrl(base64Img);
                          setImageFocalX(50);
                          setImageFocalY(50);
                          setImageZoom(100);
                        }
                      }}
                    />
                  </label>
                ) : (
                  <QuizImageCardSearch
                    selectedName={imageCardName}
                    onSelect={(artworkUrl, cardName) => {
                      setImageCardName(cardName);
                      setImageUrl(artworkUrl);
                      setImageFocalX(50);
                      setImageFocalY(50);
                      setImageZoom(100);
                    }}
                    onClear={() => {
                      setImageCardName(null);
                      setImageUrl("");
                      setImageFocalX(50);
                      setImageFocalY(50);
                      setImageZoom(100);
                    }}
                  />
                )}
                {imageUrl && (
                  <>
                    <ImageFocalZoomEditor
                      imageUrl={imageUrl}
                      focalX={imageFocalX}
                      focalY={imageFocalY}
                      zoom={imageZoom}
                      onFocalChange={(x, y) => {
                        setImageFocalX(x);
                        setImageFocalY(y);
                      }}
                      onZoomChange={setImageZoom}
                      previewTone="white"
                      previewHint="Aperçu item profil (droite)"
                    />
                    <button
                      type="button"
                      className="text-sm text-red-600 hover:underline text-left"
                      onClick={() => {
                        setImageCardName(null);
                        setImageUrl("");
                        setImageFocalX(50);
                        setImageFocalY(50);
                        setImageZoom(100);
                      }}
                    >
                      Retirer l&apos;image
                    </button>
                  </>
                )}
                <p className="text-xs text-gray-500">
                  Affichée en fond (droite) sur le profil, dans « Daily Quiz —
                  Par session ».
                </p>
              </div>

              <p className="text-sm text-gray-500 bg-yellow-100 border border-yellow-500 p-2 rounded-md">
                <span className="text-yellow-500">ⓘ</span> Par défaut la fin est
                fixée à 90 jours après le début.
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
