import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  AdminQuizQuestion,
  AdminQuizSeason,
  getAdminQuizSeason,
  listAdminQuizQuestions,
  updateAdminQuizQuestion,
} from "../../../../services/quiz";
import { getAdminQuizUpdatePath } from "../../../../constant/urlsFront";

const typeLabel = (type: string) => {
  switch (type) {
    case "true_false":
      return "Vrai/Faux";
    case "order":
      return "Ordre";
    case "name_the_cards":
      return "Nom";
    case "summoner":
      return "Invoc.";
    case "zoom":
      return "Zoom";
    case "hint_ladder":
      return "Indices";
    default:
      return "MCQ";
  }
};

const difficultyLabel = (difficulty?: string) => {
  switch (difficulty) {
    case "easy":
      return "Facile";
    case "hard":
      return "Difficile";
    case "medium":
    default:
      return "Moyen";
  }
};

const difficultyBadgeClass = (difficulty?: string) => {
  switch (difficulty) {
    case "easy":
      return "bg-green-500";
    case "hard":
      return "bg-red-500";
    case "medium":
    default:
      return "bg-orange-500";
  }
};

const questionImageUrl = (q: AdminQuizQuestion): string | null => {
  if (typeof q.image_url === "string" && q.image_url.trim()) {
    return q.image_url.trim();
  }
  const fromPayload = q.payload?.artworkUrl;
  if (typeof fromPayload === "string" && fromPayload.trim()) {
    return fromPayload.trim();
  }
  return null;
};

const formatDateFr = (iso: string) => {
  try {
    return new Date(`${iso}T12:00:00`).toLocaleDateString("fr-FR", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
};

const enumerateDays = (start: string, end: string): string[] => {
  const days: string[] = [];
  const cursor = new Date(`${start}T12:00:00Z`);
  const last = new Date(`${end}T12:00:00Z`);
  while (cursor.getTime() <= last.getTime()) {
    days.push(cursor.toISOString().slice(0, 10));
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return days;
};

interface AdminQuizSeasonPoolTabProps {
  seasonId: number;
  active: boolean;
}

const AdminQuizSeasonPoolTab = ({
  seasonId,
  active,
}: AdminQuizSeasonPoolTabProps) => {
  const [season, setSeason] = useState<AdminQuizSeason | null>(null);
  const [pool, setPool] = useState<AdminQuizQuestion[]>([]);
  const [allQuestions, setAllQuestions] = useState<AdminQuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filterTheme, setFilterTheme] = useState("");
  const [filterDifficulty, setFilterDifficulty] = useState("");
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [refresh, setRefresh] = useState(0);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [seasonData, poolList, fullList] = await Promise.all([
        getAdminQuizSeason(seasonId),
        listAdminQuizQuestions({ season_id: seasonId }),
        listAdminQuizQuestions(),
      ]);
      setSeason(seasonData);
      setPool(poolList);
      setAllQuestions(fullList);
      setSelectedDay((prev) => prev ?? seasonData.startDate);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Impossible de charger le planning"
      );
    } finally {
      setLoading(false);
    }
  }, [seasonId]);

  useEffect(() => {
    if (!active) return;
    void load();
  }, [active, load, refresh]);

  const days = useMemo(() => {
    if (!season) return [];
    return enumerateDays(season.startDate, season.endDate);
  }, [season]);

  const questionByDay = useMemo(() => {
    const map = new Map<string, AdminQuizQuestion>();
    for (const q of pool) {
      const day = q.scheduled_date ? String(q.scheduled_date).slice(0, 10) : null;
      if (day) map.set(day, q);
    }
    return map;
  }, [pool]);

  const poolIds = useMemo(() => new Set(pool.map((q) => q.id)), [pool]);

  const filledCount = questionByDay.size;

  const themeOptions = useMemo(() => {
    const bySlug = new Map<string, string>();
    for (const q of allQuestions) {
      if (q.theme?.slug) {
        bySlug.set(q.theme.slug, q.theme.label);
      }
    }
    return Array.from(bySlug.entries())
      .map(([slug, label]) => ({ slug, label }))
      .sort((a, b) => a.label.localeCompare(b.label, "fr"));
  }, [allQuestions]);

  const available = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return allQuestions
      .filter((q) => !poolIds.has(q.id))
      .filter((q) => !q.was_daily_question)
      .filter((q) => {
        if (filterTheme && q.theme?.slug !== filterTheme) return false;
        if (filterDifficulty && q.difficulty !== filterDifficulty) return false;
        if (!needle) return true;
        return (
          q.prompt.toLowerCase().includes(needle) ||
          String(q.id).includes(needle) ||
          (q.theme?.label ?? "").toLowerCase().includes(needle)
        );
      });
  }, [allQuestions, poolIds, search, filterTheme, filterDifficulty]);

  const assignToDay = async (question: AdminQuizQuestion, day: string) => {
    setBusyKey(`add-${question.id}-${day}`);
    try {
      await updateAdminQuizQuestion(question.id, {
        was_daily_question: true,
        season_id: seasonId,
        scheduled_date: day,
      });
      toast.success(`Question planifiée le ${formatDateFr(day)}`);
      setRefresh((n) => n + 1);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Planification impossible"
      );
    } finally {
      setBusyKey(null);
    }
  };

  const clearDay = async (question: AdminQuizQuestion) => {
    setBusyKey(`rm-${question.id}`);
    try {
      // Garder was_daily_question = true : non replanifiable
      await updateAdminQuizQuestion(question.id, {
        was_daily_question: true,
        season_id: null,
        scheduled_date: null,
      });
      toast.success("Jour libéré");
      setRefresh((n) => n + 1);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Retrait impossible"
      );
    } finally {
      setBusyKey(null);
    }
  };

  if (!active) return null;

  if (loading || !season) {
    return <p className="p-4 text-sm text-gray-500">Chargement du planning…</p>;
  }

  const selectedQuestion = selectedDay
    ? questionByDay.get(selectedDay) ?? null
    : null;

  return (
    <div className="space-y-6 border border-t-0 rounded-b-md bg-white p-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Planning : 1 question / jour
          </h3>
          <p className="text-sm text-gray-600">
            {filledCount} / {days.length} jours planifiés · {season.startDate} →{" "}
            {season.endDate}
          </p>
        </div>
      </div>

      <div className="grid gap-4 lscreen:grid-cols-2">
        <section className="space-y-2">
          <h4 className="text-sm font-semibold text-gray-800">Jours de la saison</h4>
          <ul className="max-h-[28rem] overflow-y-auto divide-y border rounded">
            {days.map((day) => {
              const assigned = questionByDay.get(day);
              const isSelected = selectedDay === day;
              return (
                <li key={day}>
                  <button
                    type="button"
                    onClick={() => setSelectedDay(day)}
                    className={`w-full text-left px-3 py-2 text-sm flex items-start justify-between gap-2 ${
                      isSelected
                        ? "bg-blue-50 ring-1 ring-inset ring-blue-300"
                        : "hover:bg-slate-50"
                    }`}
                  >
                    <span>
                      <span className="font-medium text-gray-900 block">
                        {formatDateFr(day)}
                      </span>
                      {assigned ? (
                        <span className="text-gray-600 line-clamp-1">
                          #{assigned.id} · {typeLabel(assigned.type)} ·{" "}
                          {assigned.prompt}
                        </span>
                      ) : (
                        <span className="text-amber-700">Non planifié</span>
                      )}
                    </span>
                    <span
                      className={`shrink-0 mt-1 h-2.5 w-2.5 rounded-full ${
                        assigned ? "bg-emerald-500" : "bg-amber-400"
                      }`}
                    />
                  </button>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="space-y-4">
          {selectedDay && (
            <div className="rounded border bg-slate-50 p-3 space-y-2">
              <h4 className="text-sm font-semibold text-gray-900">
                {formatDateFr(selectedDay)}
              </h4>
              {selectedQuestion ? (
                <div className="space-y-2">
                  <div className="flex gap-3 items-start">
                    {questionImageUrl(selectedQuestion) && (
                      <img
                        src={questionImageUrl(selectedQuestion) ?? ""}
                        alt=""
                        className="h-16 w-16 object-cover rounded border shrink-0"
                      />
                    )}
                    <div className="min-w-0 space-y-1">
                      <p className="text-sm font-medium text-gray-900">
                        #{selectedQuestion.id} · {typeLabel(selectedQuestion.type)}
                      </p>
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="inline-flex items-center px-2 py-0.5 text-white text-xs font-bold rounded bg-slate-600">
                          {selectedQuestion.theme?.label ?? "—"}
                        </span>
                        <span
                          className={`inline-flex items-center px-2 py-0.5 text-white text-xs font-bold rounded ${difficultyBadgeClass(
                            selectedQuestion.difficulty
                          )}`}
                        >
                          {difficultyLabel(selectedQuestion.difficulty)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 line-clamp-3">
                        {selectedQuestion.prompt}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Link
                      to={getAdminQuizUpdatePath(selectedQuestion.id)}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Modifier
                    </Link>
                    <button
                      type="button"
                      disabled={busyKey === `rm-${selectedQuestion.id}`}
                      onClick={() => void clearDay(selectedQuestion)}
                      className="text-sm text-red-600 hover:underline font-medium disabled:opacity-50"
                    >
                      Retirer ce jour
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-amber-800">
                  Aucune question pour ce jour — choisissez-en une ci-dessous.
                </p>
              )}
            </div>
          )}

          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-gray-800">
              Ajouter une question sur ce jour
            </h4>
            {!selectedDay || selectedQuestion ? (
              <p className="text-sm text-gray-500">
                {selectedQuestion
                  ? "Retirez d'abord la question du jour pour en assigner une autre."
                  : "Sélectionnez un jour libre dans la liste."}
              </p>
            ) : (
              <>
                <div className="flex flex-col sscreen:flex-row gap-2">
                  <input
                    type="search"
                    className="border rounded p-2 text-sm flex-1 min-w-0"
                    placeholder="Rechercher (id, énoncé)…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <select
                    className="border rounded p-2 text-sm sscreen:w-44 shrink-0"
                    value={filterTheme}
                    onChange={(e) => setFilterTheme(e.target.value)}
                    aria-label="Filtrer par thème"
                  >
                    <option value="">Tous les thèmes</option>
                    {themeOptions.map((theme) => (
                      <option key={theme.slug} value={theme.slug}>
                        {theme.label}
                      </option>
                    ))}
                  </select>
                  <select
                    className="border rounded p-2 text-sm sscreen:w-40 shrink-0"
                    value={filterDifficulty}
                    onChange={(e) => setFilterDifficulty(e.target.value)}
                    aria-label="Filtrer par niveau"
                  >
                    <option value="">Tous les niveaux</option>
                    <option value="easy">Facile</option>
                    <option value="medium">Moyen</option>
                    <option value="hard">Difficile</option>
                  </select>
                </div>
                {available.length === 0 ? (
                  <p className="text-sm text-gray-500">
                    Aucune question disponible.
                  </p>
                ) : (
                  <ul className="divide-y border rounded max-h-72 overflow-y-auto">
                    {available.map((q) => {
                      const img = questionImageUrl(q);
                      return (
                        <li
                          key={q.id}
                          className="flex flex-col sscreen:flex-row sscreen:items-center sscreen:justify-between gap-2 p-3 text-sm hover:bg-slate-50"
                        >
                          <div className="flex gap-3 min-w-0 flex-1">
                            {img ? (
                              <img
                                src={img}
                                alt=""
                                className="h-14 w-14 object-cover rounded border shrink-0 bg-white"
                              />
                            ) : (
                              <div className="h-14 w-14 rounded border bg-slate-100 shrink-0 flex items-center justify-center text-[10px] text-slate-400">
                                N/A
                              </div>
                            )}
                            <div className="min-w-0">
                              <p className="font-medium text-gray-900 truncate">
                                #{q.id} · {typeLabel(q.type)}
                              </p>
                              <div className="flex flex-wrap items-center gap-1.5 mt-0.5 mb-1">
                                <span className="inline-flex items-center px-2 py-0.5 text-white text-xs font-bold rounded bg-slate-600">
                                  {q.theme?.label ?? "—"}
                                </span>
                                <span
                                  className={`inline-flex items-center px-2 py-0.5 text-white text-xs font-bold rounded ${difficultyBadgeClass(
                                    q.difficulty
                                  )}`}
                                >
                                  {difficultyLabel(q.difficulty)}
                                </span>
                              </div>
                              <p className="text-gray-600 line-clamp-2">
                                {q.prompt}
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            disabled={busyKey === `add-${q.id}-${selectedDay}`}
                            onClick={() => void assignToDay(q, selectedDay)}
                            className="shrink-0 px-3 py-1.5 rounded bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 disabled:opacity-50"
                          >
                            Planifier
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminQuizSeasonPoolTab;
