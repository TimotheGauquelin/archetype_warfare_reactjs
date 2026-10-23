import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  AdminQuizQuestion,
  AdminQuizSeason,
  autoScheduleAdminQuizSeason,
  getAdminQuizSeason,
  listAdminQuizQuestions,
  updateAdminQuizQuestion,
} from "../../../../services/quiz";
import { getAdminQuizUpdatePath } from "../../../../constant/urlsFront";
import PopUp from "../../../generic/PopUp";
import usePopup from "../../../../hooks/usePopup";

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

const buildAssignmentsFromPool = (
  poolList: AdminQuizQuestion[]
): Record<string, number> => {
  const map: Record<string, number> = {};
  for (const q of poolList) {
    const day = q.scheduled_date ? String(q.scheduled_date).slice(0, 10) : null;
    if (day) map[day] = q.id;
  }
  return map;
};

const assignmentsEqual = (
  a: Record<string, number>,
  b: Record<string, number>
): boolean => {
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;
  return keysA.every((key) => a[key] === b[key]);
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
  const [allQuestions, setAllQuestions] = useState<AdminQuizQuestion[]>([]);
  /** Snapshot serveur : jour → questionId */
  const [initialByDay, setInitialByDay] = useState<Record<string, number>>({});
  /** Brouillon local : jour → questionId */
  const [draftByDay, setDraftByDay] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [filterTheme, setFilterTheme] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterDifficulty, setFilterDifficulty] = useState("");
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [autoScheduling, setAutoScheduling] = useState(false);
  const { isOpen, popupConfig, closePopup, showConfirmDialog } = usePopup();

  const daysListRef = useRef<HTMLUListElement | null>(null);
  const savedScrollTop = useRef(0);
  const questionsById = useMemo(() => {
    const map = new Map<number, AdminQuizQuestion>();
    for (const q of allQuestions) map.set(q.id, q);
    return map;
  }, [allQuestions]);

  const applyLoadedData = useCallback(
    (
      seasonData: AdminQuizSeason,
      poolList: AdminQuizQuestion[],
      fullList: AdminQuizQuestion[]
    ) => {
      const assignments = buildAssignmentsFromPool(poolList);
      setSeason(seasonData);
      setAllQuestions(fullList);
      setInitialByDay(assignments);
      setDraftByDay(assignments);
      setSelectedDay((prev) => {
        if (prev && prev >= seasonData.startDate && prev <= seasonData.endDate) {
          return prev;
        }
        return seasonData.startDate;
      });
    },
    []
  );

  const load = useCallback(
    async (opts?: { soft?: boolean }) => {
      const soft = Boolean(opts?.soft);
      if (!soft) setLoading(true);
      if (daysListRef.current) {
        savedScrollTop.current = daysListRef.current.scrollTop;
      }
      try {
        const [seasonData, poolList, fullList] = await Promise.all([
          getAdminQuizSeason(seasonId),
          listAdminQuizQuestions({ season_id: seasonId }),
          listAdminQuizQuestions(),
        ]);
        applyLoadedData(seasonData, poolList, fullList);
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Impossible de charger le planning"
        );
      } finally {
        setLoading(false);
        requestAnimationFrame(() => {
          if (daysListRef.current) {
            daysListRef.current.scrollTop = savedScrollTop.current;
          }
        });
      }
    },
    [seasonId, applyLoadedData]
  );

  useEffect(() => {
    if (!active) return;
    void load();
  }, [active, load]);

  const days = useMemo(() => {
    if (!season) return [];
    return enumerateDays(season.startDate, season.endDate);
  }, [season]);

  const questionByDay = useMemo(() => {
    const map = new Map<string, AdminQuizQuestion>();
    for (const [day, questionId] of Object.entries(draftByDay)) {
      const q = questionsById.get(questionId);
      if (q) map.set(day, q);
    }
    return map;
  }, [draftByDay, questionsById]);

  const draftAssignedIds = useMemo(
    () => new Set(Object.values(draftByDay)),
    [draftByDay]
  );

  const filledCount = Object.keys(draftByDay).length;
  const isDirty = !assignmentsEqual(initialByDay, draftByDay);

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

  /** Questions encore assignables (jamais brûlées Daily, pas déjà dans le brouillon). */
  const availablePool = useMemo(() => {
    return allQuestions.filter(
      (q) => !q.was_daily_question && !draftAssignedIds.has(q.id)
    );
  }, [allQuestions, draftAssignedIds]);

  const typeOptions = useMemo(() => {
    const types = new Set<string>();
    for (const q of availablePool) {
      if (q.type) types.add(q.type);
    }
    return Array.from(types)
      .map((type) => ({ type, label: typeLabel(type) }))
      .sort((a, b) => a.label.localeCompare(b.label, "fr"));
  }, [availablePool]);

  const available = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return availablePool.filter((q) => {
      if (filterTheme && q.theme?.slug !== filterTheme) return false;
      if (filterType && q.type !== filterType) return false;
      if (filterDifficulty && q.difficulty !== filterDifficulty) return false;
      if (!needle) return true;
      return (
        q.prompt.toLowerCase().includes(needle) ||
        String(q.id).includes(needle) ||
        (q.theme?.label ?? "").toLowerCase().includes(needle)
      );
    });
  }, [availablePool, search, filterTheme, filterType, filterDifficulty]);

  const emptyDaysCount = Math.max(0, days.length - filledCount);
  const showAutoFillButton =
    emptyDaysCount > 0 && availablePool.length > 0;

  const assignToDay = (question: AdminQuizQuestion, day: string) => {
    setDraftByDay((prev) => {
      const next = { ...prev };
      // Libérer le jour si une autre question y était
      next[day] = question.id;
      return next;
    });
  };

  const clearDay = (day: string) => {
    setDraftByDay((prev) => {
      const next = { ...prev };
      delete next[day];
      return next;
    });
  };

  const saveDraft = async () => {
    if (!isDirty || saving) return;
    setSaving(true);
    if (daysListRef.current) {
      savedScrollTop.current = daysListRef.current.scrollTop;
    }

    const toClear = new Set<number>();
    const toAssign: Array<{ day: string; questionId: number }> = [];

    for (const day of days) {
      const oldId = initialByDay[day] ?? null;
      const newId = draftByDay[day] ?? null;
      if (oldId === newId) continue;
      if (oldId != null) toClear.add(oldId);
      if (newId != null) toAssign.push({ day, questionId: newId });
    }

    try {
      for (const questionId of toClear) {
        await updateAdminQuizQuestion(questionId, {
          was_daily_question: true,
          season_id: null,
          scheduled_date: null,
        });
      }
      for (const { day, questionId } of toAssign) {
        await updateAdminQuizQuestion(questionId, {
          was_daily_question: true,
          season_id: seasonId,
          scheduled_date: day,
        });
      }
      toast.success("Planning enregistré");
      await load({ soft: true });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Enregistrement impossible"
      );
      await load({ soft: true });
    } finally {
      setSaving(false);
    }
  };

  const applyAutoScheduleToDraft = (
    assigned: Array<{ day: string; questionId: number }>
  ) => {
    if (assigned.length === 0) return;
    setDraftByDay((prev) => {
      const next = { ...prev };
      for (const item of assigned) {
        next[item.day] = item.questionId;
      }
      return next;
    });
    toast.success(
      `${assigned.length} jour(s) ajoutés au brouillon — pensez à enregistrer.`
    );
  };

  const handleAutoSchedule = async () => {
    if (autoScheduling || !showAutoFillButton) return;

    setAutoScheduling(true);
    try {
      const result = await autoScheduleAdminQuizSeason(seasonId, {
        dryRun: true,
        currentAssignments: draftByDay,
        // Même pool que la liste « Ajouter une question » (évite le filtre trop strict côté API)
        candidateQuestionIds: availablePool.map((q) => q.id),
      });

      if (result.assignedCount === 0 && !result.notEnoughQuestions) {
        toast.info("Aucun jour à remplir.");
        return;
      }

      if (result.notEnoughQuestions || result.skippedDays.length > 0) {
        const remaining = Math.max(
          0,
          result.emptyDaysBefore - result.assignedCount
        );
        showConfirmDialog({
          title: "Questions insuffisantes",
          message:
            `Il n'y a pas assez de questions pour couvrir tous les jours restants ` +
            `(${result.assignedCount} placement(s) possible(s) sur ${result.emptyDaysBefore}, ` +
            `${remaining} jour(s) resteront vides). ` +
            `Les questions disponibles seront quand même disposées selon les règles ` +
            `(écart niveau+mode, variation). Il faudra en recréer pour compléter. Continuer ?`,
          confirmText: "Continuer",
          cancelText: "Annuler",
          onConfirm: () => {
            applyAutoScheduleToDraft(result.assigned);
          },
        });
        return;
      }

      applyAutoScheduleToDraft(result.assigned);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Planification automatique impossible"
      );
    } finally {
      setAutoScheduling(false);
    }
  };

  if (!active) return null;

  if ((loading && !season) || !season) {
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
            {isDirty && (
              <span className="ml-2 text-amber-700 font-medium">
                · modifications non enregistrées
              </span>
            )}
          </p>
        </div>
        {showAutoFillButton && (
          <button
            type="button"
            disabled={autoScheduling || saving}
            onClick={() => void handleAutoSchedule()}
            className="shrink-0 px-4 py-2 rounded bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {autoScheduling
              ? "Planification…"
              : `Auto-remplir`}
          </button>
        )}
      </div>

      <div className="grid gap-4 lscreen:grid-cols-2">
        <section className="space-y-2">
          <h4 className="text-sm font-semibold text-gray-800">Jours de la saison</h4>
          <ul
            ref={daysListRef}
            className="max-h-[28rem] overflow-y-auto divide-y border rounded"
          >
            {days.map((day) => {
              const assigned = questionByDay.get(day);
              const isSelected = selectedDay === day;
              const wasChanged =
                (initialByDay[day] ?? null) !== (draftByDay[day] ?? null);
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
                    <span className="min-w-0 flex-1">
                      <span className="font-medium text-gray-900 block">
                        {formatDateFr(day)}
                        {wasChanged && (
                          <span className="ml-1 text-amber-600 text-xs font-normal">
                            (modifié)
                          </span>
                        )}
                      </span>
                      {assigned ? (
                        <span className="block space-y-1 mt-1">
                          <span className="flex flex-wrap items-center gap-1.5">
                            <span className="inline-flex items-center px-2 py-0.5 text-white text-xs font-bold rounded bg-indigo-600">
                              {typeLabel(assigned.type)}
                            </span>
                            <span
                              className={`inline-flex items-center px-2 py-0.5 text-white text-xs font-bold rounded ${difficultyBadgeClass(
                                assigned.difficulty
                              )}`}
                            >
                              {difficultyLabel(assigned.difficulty)}
                            </span>
                            <span className="inline-flex items-center px-2 py-0.5 text-white text-xs font-bold rounded bg-slate-600">
                              {assigned.theme?.label ?? "—"}
                            </span>
                            <span className="text-xs text-gray-500">
                              #{assigned.id}
                            </span>
                          </span>
                          <span className="text-gray-600 line-clamp-1 block text-xs">
                            {assigned.prompt}
                          </span>
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
          <div className="flex justify-start">
            <button
              type="button"
              disabled={!isDirty || saving}
              onClick={() => void saveDraft()}
              className="px-4 py-2 rounded bg-blue-700 text-white text-sm font-semibold hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? "Enregistrement…" : "Enregistrer le planning"}
            </button>
          </div>
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
                        #{selectedQuestion.id} ·{" "}
                        {typeLabel(selectedQuestion.type)}
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
                      Éditer la question
                    </Link>
                    <button
                      type="button"
                      onClick={() => clearDay(selectedDay)}
                      className="text-sm text-red-600 hover:underline font-medium"
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
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    aria-label="Filtrer par mode de jeu"
                  >
                    <option value="">Tous les modes</option>
                    {typeOptions.map((opt) => (
                      <option key={opt.type} value={opt.type}>
                        {opt.label}
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
                            onClick={() => assignToDay(q, selectedDay)}
                            className="shrink-0 px-3 py-1.5 rounded bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700"
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

      <PopUp
        isOpen={isOpen}
        onClose={closePopup}
        title={popupConfig.title}
        className={popupConfig.className}
        showCloseButton={popupConfig.showCloseButton}
        closeOnBackdropClick={popupConfig.closeOnBackdropClick}
      >
        {popupConfig.content}
      </PopUp>
    </div>
  );
};

export default AdminQuizSeasonPoolTab;
