import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import UserBasicLayout from "../layout";
import {
  getQuizHub,
  startFreeQuiz,
  type QuizHubResponse,
} from "@/services/quiz";
import {
  URL_FRONT_LOGIN,
  URL_FRONT_QUIZ_DAILY,
  URL_FRONT_QUIZ_PLAY,
} from "@/constant/urlsFront";
import type { RootState } from "@/types";
import Loader from "@/components/generic/Loader";
import PaginationTableHead from "@/components/generic/pagination/PaginationTableHead";
import PaginationFooter from "@/components/generic/pagination/PaginationFooter";

const FREE_THEME_COLORS = [
  "bg-sky-100 hover:bg-sky-200",
  "bg-emerald-100 hover:bg-emerald-200",
  "bg-amber-100 hover:bg-amber-200",
  "bg-violet-100 hover:bg-violet-200",
  "bg-rose-100 hover:bg-rose-200",
  "bg-teal-100 hover:bg-teal-200",
];

const PODIUM_PAGE_SIZE = 10;

const QuizHubPage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isAuthenticated = useSelector(
    (state: RootState) => state.user.isAuthenticated
  );
  const [hub, setHub] = useState<QuizHubResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyTheme, setBusyTheme] = useState<string | null>(null);
  const [podiumPage, setPodiumPage] = useState(1);

  const podiumTableHead = useMemo(
    () => [
      { colspan: "col-span-2", label: t("quiz.seasonPodiumColRank") },
      { colspan: "col-span-5", label: t("quiz.seasonPodiumColPlayer") },
      { colspan: "col-span-3", label: t("quiz.seasonPodiumColScore") },
      { colspan: "col-span-2", label: t("quiz.seasonPodiumColAttempts") },
    ],
    [t]
  );

  const loadHub = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getQuizHub();
      setHub(data);
      setPodiumPage(1);
    } catch {
      setError(t("quiz.loadError"));
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  useEffect(() => {
    loadHub();
  }, [loadHub]);

  const podiumEntries = hub?.seasonPodium?.podium ?? [];
  const podiumTotalPages = Math.max(
    1,
    Math.ceil(podiumEntries.length / PODIUM_PAGE_SIZE)
  );
  const pagedPodium = useMemo(() => {
    const start = (podiumPage - 1) * PODIUM_PAGE_SIZE;
    return podiumEntries.slice(start, start + PODIUM_PAGE_SIZE);
  }, [podiumEntries, podiumPage]);

  useEffect(() => {
    if (podiumPage > podiumTotalPages) {
      setPodiumPage(podiumTotalPages);
    }
  }, [podiumPage, podiumTotalPages]);

  const formattedDailyDate = useMemo(() => {
    if (!hub?.today) return "";
    const date = new Date(`${hub.today}T12:00:00`);
    return date.toLocaleDateString(
      i18n.language?.startsWith("en") ? "en-GB" : "fr-FR",
      { day: "numeric", month: "long", year: "numeric" }
    );
  }, [hub?.today, i18n.language]);

  const requireAuth = () => {
    if (!isAuthenticated) {
      navigate(URL_FRONT_LOGIN);
      return false;
    }
    return true;
  };

  const handleFree = async (themeSlug: string) => {
    if (!requireAuth()) return;
    if (busyTheme) return;
    setBusyTheme(`free-${themeSlug}`);
    try {
      const attempt = await startFreeQuiz(themeSlug);
      navigate(URL_FRONT_QUIZ_PLAY(attempt.id));
    } catch {
      setError(t("quiz.startError"));
    } finally {
      setBusyTheme(null);
    }
  };

  const handleDailyCardClick = () => {
    if (!hub?.daily || !requireAuth()) return;
    if (hub.daily.myAttempt?.status === "finished") {
      navigate(URL_FRONT_QUIZ_PLAY(hub.daily.myAttempt.id));
      return;
    }
    if (hub.daily.myAttempt?.status === "in_progress") {
      navigate(URL_FRONT_QUIZ_PLAY(hub.daily.myAttempt.id));
      return;
    }
    navigate(URL_FRONT_QUIZ_DAILY);
  };

  return (
    <UserBasicLayout
      mainTitle={t("hero.quiz.title")}
      subTitle={t("hero.quiz.subtitle")}
    >
      <div className="px-4 py-6 max-w-4xl mx-auto space-y-6">
        {isLoading && (
          <div className="flex justify-center py-10">
            <Loader />
          </div>
        )}

        {error && (
          <p className="text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
            {error}
          </p>
        )}

        {!isLoading && hub && (
          <>
            {hub.daily && (
              <section className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    {t("quiz.dailyTitle")}
                  </h2>
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={handleDailyCardClick}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleDailyCardClick();
                      }
                    }}
                    className="rounded-lg border border-gray-200 p-4 shadow-md cursor-pointer hover:bg-slate-100 hover:shadow-lg transition-all"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-semibold text-lg text-gray-900">
                          {t("quiz.dailyHint", { date: formattedDailyDate })}
                      </h3>
                      {(() => {
                        const attempt = hub.daily.myAttempt;
                        let label = t("quiz.dailyStatusTodo");
                        let badgeClass = "bg-slate-500";
                        if (attempt?.status === "in_progress") {
                          label = t("quiz.dailyStatusInProgress");
                          badgeClass = "bg-amber-500";
                        } else if (attempt?.status === "finished") {
                          const success = attempt.score > 0;
                          label = success
                            ? t("quiz.dailyStatusSuccess")
                            : t("quiz.dailyStatusFailed");
                          badgeClass = success ? "bg-green-500" : "bg-red-500";
                        }
                        return (
                          <span
                            className={`shrink-0 inline-flex items-center px-3 py-1 text-white text-xs font-bold rounded-md shadow-sm ${badgeClass}`}
                          >
                            {label}
                          </span>
                        );
                      })()}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {hub.daily.theme
                        ? t("quiz.dailyCardTheme", {
                          theme: hub.daily.theme.label,
                        })
                        : t("quiz.dailyCardSubtitle")}
                    </p>
                  </div>
                </div>
                {hub.seasonPodium && (
                  <div className="mt-4">
                    <h2 className="text-xl font-bold text-gray-900 mb-2">
                      {t("quiz.seasonPodiumTitle")}
                    </h2>
                    <p className="text-sm text-gray-600 mb-4">
                      {t("quiz.seasonPodiumHint", {
                        season: hub.seasonPodium.season.name,
                      })}
                    </p>
                    {podiumEntries.length === 0 ? (
                      <p className="text-sm text-gray-500">
                        {t("quiz.seasonPodiumEmpty")}
                      </p>
                    ) : (
                      <div className="w-full text-sm text-left text-gray-500">
                        <PaginationTableHead tableHeadItem={podiumTableHead} />
                        <div className="grid grid-cols-12">
                          {pagedPodium.map((entry) => (
                            <div
                              key={entry.userId}
                              className="grid grid-cols-12 col-span-12 items-center border-b border-l border-r hover:bg-slate-200"
                            >
                              <div className="col-span-2 p-2 text-center font-semibold text-gray-900">
                                #{entry.rank}
                              </div>
                              <div className="col-span-5 p-2 text-gray-900">
                                {entry.username}
                              </div>
                              <div className="col-span-3 p-2 text-center text-gray-800">
                                {entry.totalScore}
                              </div>
                              <div className="col-span-2 p-2 text-center text-gray-800">
                                {entry.attemptsCount}
                              </div>
                            </div>
                          ))}
                        </div>
                        {podiumEntries.length > PODIUM_PAGE_SIZE && (
                          <PaginationFooter
                            currentPage={podiumPage}
                            setPagination={setPodiumPage}
                            setRefresh={() => undefined}
                            itemsTotalCount={podiumEntries.length}
                            totalPages={podiumTotalPages}
                            pageSize={PODIUM_PAGE_SIZE}
                          />
                        )}
                      </div>
                    )}
                  </div>
                )}
              </section>
            )}



            <section className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                {t("quiz.freeTitle")}
              </h2>
              <p className="text-sm text-gray-600 mb-4">{t("quiz.freeHint")}</p>
              <div className="grid gap-4 sm:grid-cols-2">
                {hub.themes.map((theme, index) => {
                  const colorClass =
                    FREE_THEME_COLORS[index % FREE_THEME_COLORS.length];
                  const isBusy = busyTheme === `free-${theme.slug}`;
                  return (
                    <div
                      key={theme.slug}
                      role="button"
                      tabIndex={isBusy ? -1 : 0}
                      aria-disabled={isBusy}
                      onClick={() => {
                        if (!isBusy) void handleFree(theme.slug);
                      }}
                      onKeyDown={(e) => {
                        if (isBusy) return;
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          void handleFree(theme.slug);
                        }
                      }}
                      className={`rounded-lg p-4 shadow-md cursor-pointer hover:shadow-lg transition-all ${colorClass} ${isBusy ? "opacity-60 pointer-events-none" : ""
                        }`}
                    >
                      <h3 className="font-semibold text-gray-900">
                        {theme.label}
                      </h3>
                      {theme.description && (
                        <p className="text-sm text-gray-700 mt-1">
                          {theme.description}
                        </p>
                      )}
                      {isBusy && (
                        <p className="text-sm text-gray-600 mt-2">
                          {t("quiz.starting")}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          </>
        )}
      </div>
    </UserBasicLayout>
  );
};

export default QuizHubPage;
