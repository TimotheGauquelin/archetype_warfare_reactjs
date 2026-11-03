import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import UserBasicLayout from "../layout";
import {
  getQuizHub,
  startFreeQuiz,
  type QuizHubDailyEntry,
  type QuizHubResponse,
} from "@/services/quiz";
import {
  URL_FRONT_LOGIN,
  URL_FRONT_QUIZ_PLAY,
  getQuizDailyPath,
  getQuizSeasonRankingPath,
} from "@/constant/urlsFront";
import type { RootState } from "@/types";
import Loader from "@/components/generic/Loader";
import PaginationTableHead from "@/components/generic/pagination/PaginationTableHead";
import { getSeasonMedalSrc } from "@/utils/quiz/seasonMedal";
import { optimizeImageUrl } from "@/utils/image/optimizeImageUrl";

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
    } catch {
      setError(t("quiz.loadError"));
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  useEffect(() => {
    void loadHub();
  }, [loadHub]);

  const primarySeasonBlock = useMemo(() => {
    if (hub?.seasonPodiums && hub.seasonPodiums.length > 0) {
      return (
        hub.seasonPodiums.find((b) => !b.season.allowsOverlap) ??
        hub.seasonPodiums[0]
      );
    }
    return hub?.seasonPodium ?? null;
  }, [hub?.seasonPodiums, hub?.seasonPodium]);

  const hubDailies = useMemo((): QuizHubDailyEntry[] => {
    if (hub?.dailies && hub.dailies.length > 0) return hub.dailies;
    if (hub?.daily) return [hub.daily];
    return [];
  }, [hub?.dailies, hub?.daily]);

  const podiumEntries = (primarySeasonBlock?.podium ?? []).slice(0, 3);

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

  const freePlayRemaining =
    hub?.freePlay && !hub.freePlay.unlimited
      ? hub.freePlay.remaining ?? 0
      : null;
  const freePlayBlocked =
    freePlayRemaining !== null && freePlayRemaining <= 0;

  const handleFree = async (themeSlug: string) => {
    if (!requireAuth()) return;
    if (busyTheme) return;
    if (freePlayBlocked) {
      setError(t("quiz.freeLimitReached"));
      return;
    }
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

  const handleDailyCardClick = (entry: QuizHubDailyEntry) => {
    if (!requireAuth()) return;
    if (
      entry.myAttempt?.status === "finished" ||
      entry.myAttempt?.status === "in_progress"
    ) {
      navigate(URL_FRONT_QUIZ_PLAY(entry.myAttempt.id));
      return;
    }
    navigate(getQuizDailyPath(entry.seasonId));
  };

  const dailyStatusBadge = (entry: QuizHubDailyEntry) => {
    const attempt = entry.myAttempt;
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
            {(hub.daily || primarySeasonBlock) && (
              <section className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm space-y-4">
                <div className="flex flex-col gap-1 sscreen:flex-row sscreen:items-center sscreen:justify-between sscreen:gap-3">
                  <h2 className="text-xl font-bold text-gray-900">
                    {primarySeasonBlock
                      ? t("quiz.seasonBlockTitle", {
                          season: primarySeasonBlock.season.name,
                        })
                      : t("quiz.dailyTitle")}
                  </h2>
                  {primarySeasonBlock && (
                    <Link
                      to={getQuizSeasonRankingPath(
                        primarySeasonBlock.season.id,
                      )}
                      className="self-end sscreen:self-auto shrink-0 text-sm font-medium text-blue-600 hover:text-yellow-600 hover:underline"
                    >
                      {t("quiz.seasonPodiumSeeAll")}
                    </Link>
                  )}
                </div>

                {primarySeasonBlock && (
                  <div>
                    <h3 className="text-md font-semibold text-gray-800 mb-2">
                      {t("quiz.seasonPodiumTitle")}:
                    </h3>
                    {podiumEntries.length === 0 ? (
                      <p className="text-sm text-gray-500">
                        {t("quiz.seasonPodiumEmpty")}
                      </p>
                    ) : (
                      <div className="w-full text-sm text-left text-gray-500">
                        <PaginationTableHead tableHeadItem={podiumTableHead} />
                        <div className="grid grid-cols-12">
                          {podiumEntries.map((entry) => {
                            const medalSrc = getSeasonMedalSrc(entry.rank);
                            return (
                              <div
                                key={entry.userId}
                                className="grid grid-cols-12 col-span-12 items-center border-b border-l border-r hover:bg-slate-200"
                              >
                                <div className="col-span-2 p-2 flex items-center justify-center gap-1.5 font-semibold text-gray-900">
                                  {medalSrc ? (
                                    <img
                                      src={medalSrc}
                                      alt=""
                                      className="w-6 h-6 object-contain shrink-0"
                                      width={24}
                                      height={24}
                                      loading="lazy"
                                      decoding="async"
                                    />
                                  ) : null}
                                  <span>#{entry.rank}</span>
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
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {hubDailies.length > 0 && (
                  <div className="space-y-3">
                    {hubDailies.map((entry) => {
                      const isExceptional = Boolean(
                        entry.season?.allowsOverlap,
                      );
                      const imageUrl = entry.season?.imageUrl
                        ? optimizeImageUrl(entry.season.imageUrl, "thumb")
                        : null;
                      const focalX = entry.season?.imageFocalX ?? 50;
                      const focalY = entry.season?.imageFocalY ?? 50;
                      const zoom = (entry.season?.imageZoom ?? 100) / 100;
                      return (
                        <div
                          key={entry.seasonId ?? entry.quizDate}
                          role="button"
                          tabIndex={0}
                          onClick={() => handleDailyCardClick(entry)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              handleDailyCardClick(entry);
                            }
                          }}
                          className={`relative overflow-hidden rounded-lg border p-4 shadow-md cursor-pointer transition-all hover:shadow-lg ${
                            isExceptional
                              ? "border-amber-300 bg-amber-50/40 hover:bg-amber-50"
                              : "border-gray-200 bg-white hover:bg-slate-50"
                          }`}
                        >
                          {imageUrl && (
                            <div
                              className="pointer-events-none absolute inset-y-0 right-0 w-[42%] overflow-hidden"
                              aria-hidden
                            >
                              <img
                                src={imageUrl}
                                alt=""
                                className="h-full w-full object-cover opacity-55"
                                style={{
                                  objectPosition: `${focalX}% ${focalY}%`,
                                  transform: `scale(${zoom})`,
                                  transformOrigin: `${focalX}% ${focalY}%`,
                                }}
                              />
                              <div
                                className={`absolute inset-0 bg-gradient-to-r ${
                                  isExceptional
                                    ? "from-amber-50 via-amber-50/75 to-amber-50/10"
                                    : "from-white via-white/75 to-white/10"
                                }`}
                              />
                            </div>
                          )}
                          <div className="relative z-10 space-y-1">
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0 space-y-1">
                                {isExceptional && entry.season && (
                                  <div className="flex flex-wrap items-center gap-2">
                                    <p className="font-semibold text-gray-900">
                                      {entry.season.name}
                                    </p>
                                    <span className="inline-flex items-center rounded-md bg-amber-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                                      {t("quiz.seasonExceptionalBadge")}
                                    </span>
                                  </div>
                                )}
                                <h4 className="font-semibold text-md text-gray-900">
                                  {t("quiz.dailyHint", {
                                    date: formattedDailyDate,
                                  })}
                                </h4>
                              </div>
                              {dailyStatusBadge(entry)}
                            </div>
                            <p className="text-sm text-gray-600">
                              {entry.theme
                                ? t("quiz.dailyCardTheme", {
                                    theme: entry.theme.label,
                                  })
                                : t("quiz.dailyCardSubtitle")}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>
            )}

            <section className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-between gap-3 mb-2">
                <h2 className="text-xl font-bold text-gray-900">
                  {t("quiz.freeTitle")}
                </h2>
                {freePlayRemaining !== null && (
                  <span className="shrink-0 text-sm font-semibold text-gray-700">
                    {t("quiz.freeRemaining", { count: freePlayRemaining })}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600 mb-4">{t("quiz.freeHint")}</p>
              {freePlayBlocked && (
                <p className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-4">
                  {t("quiz.freeLimitReached")}
                </p>
              )}
              <div className="grid gap-4 sm:grid-cols-2">
                {hub.themes.map((theme, index) => {
                  const colorClass =
                    FREE_THEME_COLORS[index % FREE_THEME_COLORS.length];
                  const isBusy = busyTheme === `free-${theme.slug}`;
                  const isDisabled = isBusy || freePlayBlocked;
                  return (
                    <div
                      key={theme.slug}
                      role="button"
                      tabIndex={isDisabled ? -1 : 0}
                      aria-disabled={isDisabled}
                      onClick={() => {
                        if (!isDisabled) void handleFree(theme.slug);
                      }}
                      onKeyDown={(e) => {
                        if (isDisabled) return;
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          void handleFree(theme.slug);
                        }
                      }}
                      className={`rounded-lg p-4 shadow-md transition-all ${colorClass} ${
                        isDisabled
                          ? "opacity-60 pointer-events-none cursor-not-allowed"
                          : "cursor-pointer hover:shadow-lg"
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
