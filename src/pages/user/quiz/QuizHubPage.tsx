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

const FREE_THEME_COLORS = [
  "bg-sky-100 hover:bg-sky-200",
  "bg-emerald-100 hover:bg-emerald-200",
  "bg-amber-100 hover:bg-amber-200",
  "bg-violet-100 hover:bg-violet-200",
  "bg-rose-100 hover:bg-rose-200",
  "bg-teal-100 hover:bg-teal-200",
];

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

  const loadHub = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getQuizHub();
      setHub(data);
    } catch {
      setError(t("quiz.loadError"));
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  useEffect(() => {
    loadHub();
  }, [loadHub]);

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
      <div className="px-4 py-6 max-w-4xl mx-auto space-y-8">
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
            {hub.seasonPodium && (
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  {t("quiz.seasonPodiumTitle")}
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                  {t("quiz.seasonPodiumHint", {
                    season: hub.seasonPodium.season.name,
                  })}
                </p>
                {hub.seasonPodium.podium.length === 0 ? (
                  <p className="text-sm text-gray-500">
                    {t("quiz.seasonPodiumEmpty")}
                  </p>
                ) : (
                  <ol className="space-y-2 max-w-xl">
                    {hub.seasonPodium.podium.map((entry) => (
                      <li
                        key={entry.userId}
                        className={`flex items-center justify-between rounded-lg px-4 py-3 shadow-md ${
                          entry.rank === 1
                            ? "bg-amber-50"
                            : entry.rank === 2
                              ? "bg-slate-100"
                              : "bg-orange-50"
                        }`}
                      >
                        <span className="font-semibold text-gray-900">
                          #{entry.rank} {entry.username}
                        </span>
                        <span className="text-sm text-gray-700">
                          {t("quiz.seasonPodiumScore", {
                            score: entry.totalScore,
                            attempts: entry.attemptsCount,
                          })}
                        </span>
                      </li>
                    ))}
                  </ol>
                )}
              </section>
            )}

            {hub.daily && (
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  {t("quiz.dailyTitle")}
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                  {t("quiz.dailyHint", { date: formattedDailyDate })}
                </p>
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
                  className="rounded-lg bg-indigo-50 p-4 shadow-md max-w-xl cursor-pointer hover:bg-indigo-100 hover:shadow-lg transition-all"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-semibold text-lg text-gray-900">
                      {t("quiz.dailyCardTitle")}
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
              </section>
            )}

            <section>
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
                      className={`rounded-lg p-4 shadow-md cursor-pointer hover:shadow-lg transition-all ${colorClass} ${
                        isBusy ? "opacity-60 pointer-events-none" : ""
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
