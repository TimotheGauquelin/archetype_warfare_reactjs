import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useLocation, useParams, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { FaChevronDown } from "react-icons/fa";
import UserBasicLayout from "../layout";
import Loader from "@/components/generic/Loader";
import PaginationTableHead from "@/components/generic/pagination/PaginationTableHead";
import PaginationFooter from "@/components/generic/pagination/PaginationFooter";
import {
  getQuizSeasonRanking,
  getQuizSeasonTournamentRanking,
  type QuizSeasonPodiumEntry,
  type SeasonTournamentRankingEntry,
  type SeasonTournamentTier,
  type AdminQuizSeason,
} from "@/services/quiz";
import {
  getArchetypePublicPath,
  getUserProfilePath,
  URL_FRONT_MY_PROFILE,
  URL_FRONT_QUIZ,
  URL_FRONT_TOURNAMENTS,
} from "@/constant/urlsFront";
import { verbalDate } from "@/utils/date/verbalDate";
import { getSeasonMedalSrc } from "@/utils/quiz/seasonMedal";
import { renderInlineBold } from "@/utils/quiz/renderInlineBold";
import { optimizeImageUrl } from "@/utils/image/optimizeImageUrl";
import {
  SEASON_TOURNAMENT_TIERS,
  SEASON_TOURNAMENT_TIER_I18N_KEY,
  getSeasonTournamentTierIconSrc,
} from "@/utils/tournament/seasonTournamentRank";
import type { RootState } from "@/types";

const WAITING_ARCHETYPE_IMAGE =
  import.meta.env.BASE_URL + "assets/waiting_archetype_image.jpg";

type SeasonBackFrom = "quiz" | "tournaments";

const PAGE_SIZE = 20;

type RankingTab = "quiz" | "tournament";

const resolveBackFrom = (
  stateFrom: unknown,
  searchFrom: string | null
): SeasonBackFrom | null => {
  const raw =
    typeof stateFrom === "string"
      ? stateFrom
      : searchFrom != null
        ? searchFrom
        : null;
  if (raw === "quiz" || raw === "tournaments") return raw;
  try {
    if (!document.referrer) return null;
    const ref = new URL(document.referrer);
    if (ref.origin !== window.location.origin) return null;
    if (ref.pathname.startsWith("/quiz")) return "quiz";
    if (
      ref.pathname.startsWith("/tournaments") ||
      ref.pathname.startsWith("/my-tournaments")
    ) {
      return "tournaments";
    }
  } catch {
    /* ignore */
  }
  return null;
};

const QuizSeasonRankingPage = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const currentUserId = useSelector((state: RootState) => state.user.id);
  const { seasonId = "current" } = useParams<{ seasonId: string }>();
  const [season, setSeason] = useState<AdminQuizSeason | null>(null);
  const [podium, setPodium] = useState<QuizSeasonPodiumEntry[]>([]);
  const [tournamentRanking, setTournamentRanking] = useState<
    SeasonTournamentRankingEntry[]
  >([]);
  const [ranksFrozen, setRanksFrozen] = useState(false);
  const [activeTab, setActiveTab] = useState<RankingTab>(() => {
    if (typeof window === "undefined") return "quiz";
    const hash = window.location.hash.replace(/^#/, "");
    if (hash === "tournament-ranking") return "tournament";
    if (hash === "quiz-ranking") return "quiz";
    const from = new URLSearchParams(window.location.search).get("from");
    if (from === "tournaments") return "tournament";
    return "quiz";
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [tierTableOpen, setTierTableOpen] = useState(false);
  const [playableArchetypesExpanded, setPlayableArchetypesExpanded] =
    useState(false);

  const rankingTabFromLocation = useCallback((): RankingTab => {
    const hash = location.hash.replace(/^#/, "");
    if (hash === "tournament-ranking") return "tournament";
    if (hash === "quiz-ranking") return "quiz";
    if (searchParams.get("from") === "tournaments") return "tournament";
    return "quiz";
  }, [location.hash, searchParams]);

  const tierLabel = useCallback(
    (tier: SeasonTournamentTier | null | undefined) => {
      if (!tier) return "";
      return t(SEASON_TOURNAMENT_TIER_I18N_KEY[tier]);
    },
    [t]
  );

  const quizTableHead = useMemo(
    () => [
      { colspan: "col-span-2", label: t("quiz.seasonPodiumColRank") },
      { colspan: "col-span-5", label: t("quiz.seasonPodiumColPlayer") },
      { colspan: "col-span-3", label: t("quiz.seasonPodiumColScore") },
      { colspan: "col-span-2", label: t("quiz.seasonPodiumColAttempts") },
    ],
    [t]
  );

  const tournamentTableHead = useMemo(
    () => [
      { colspan: "col-span-2", label: t("quiz.seasonPodiumColRank") },
      { colspan: "col-span-3", label: t("quiz.seasonPodiumColPlayer") },
      { colspan: "col-span-2", label: t("quiz.seasonTournamentColPoints") },
      { colspan: "col-span-2", label: t("quiz.seasonTournamentColEvents") },
      { colspan: "col-span-3", label: t("quiz.seasonTournamentColTier") },
    ],
    [t]
  );

  const loadRanking = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [quizData, tournamentData] = await Promise.all([
        getQuizSeasonRanking(seasonId),
        getQuizSeasonTournamentRanking(seasonId).catch(() => ({
          season: null as AdminQuizSeason | null,
          ranking: [] as SeasonTournamentRankingEntry[],
          ranksFrozen: false,
        })),
      ]);
      setSeason(quizData.season ?? tournamentData.season);
      setPodium(quizData.podium);
      setTournamentRanking(tournamentData.ranking ?? []);
      setRanksFrozen(Boolean(tournamentData.ranksFrozen));
      setPage(1);
    } catch {
      setSeason(null);
      setPodium([]);
      setTournamentRanking([]);
      setRanksFrozen(false);
      setError(t("quiz.seasonRankingLoadError"));
    } finally {
      setIsLoading(false);
    }
  }, [seasonId, t]);

  useEffect(() => {
    void loadRanking();
  }, [loadRanking]);

  useEffect(() => {
    setActiveTab(rankingTabFromLocation());
  }, [rankingTabFromLocation]);

  useEffect(() => {
    setPage(1);
  }, [activeTab]);

  useEffect(() => {
    if (isLoading) return;
    const hash = location.hash.replace(/^#/, "");
    if (hash !== "quiz-ranking" && hash !== "tournament-ranking") return;
    const frame = window.requestAnimationFrame(() => {
      document.getElementById(hash)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [isLoading, location.hash, activeTab]);

  const activeRows =
    activeTab === "quiz" ? podium : tournamentRanking;
  const totalPages = Math.max(1, Math.ceil(activeRows.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paged = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return activeRows.slice(start, start + PAGE_SIZE);
  }, [activeRows, currentPage]);

  const statusLabel = useMemo(() => {
    if (!season) return "";
    if (season.status === "current") return t("quiz.seasonStatusCurrent");
    if (season.status === "past") return t("quiz.seasonStatusPast");
    return t("quiz.seasonStatusUpcoming");
  }, [season, t]);

  const backFrom = useMemo(
    () =>
      resolveBackFrom(
        (location.state as { from?: string } | null)?.from,
        searchParams.get("from")
      ),
    [location.state, searchParams]
  );

  const tabClass = (tab: RankingTab) =>
    `px-3 py-1.5 text-sm font-semibold rounded-t-md cursor-pointer ${activeTab === tab
      ? "bg-blue-200 text-blue-800"
      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
    }`;

  return (
    <UserBasicLayout
      mainTitle={t("quiz.seasonRankingTitle")}
      subTitle={
        season
          ? t("quiz.seasonRankingSubtitle", { season: season.name })
          : t("quiz.seasonRankingSubtitleFallback")
      }
    >
      <div className="px-4 py-6 max-w-4xl mx-auto space-y-4">
        {backFrom && (
          <div className="flex justify-end">
            <Link
              to={backFrom === "quiz" ? URL_FRONT_QUIZ : URL_FRONT_TOURNAMENTS}
              className="text-sm font-medium text-blue-600 hover:text-yellow-600 hover:underline"
            >
              {backFrom === "quiz"
                ? t("quiz.backToHub")
                : t("quiz.backToTournamentsHub")}
            </Link>
          </div>
        )}

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

        {!isLoading && season && (
          <>
            <section className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-xl font-bold text-gray-900">{season.name}</h2>
                <span
                  className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-white ${season.status === "current"
                      ? "bg-blue-600"
                      : season.status === "past"
                        ? "bg-red-600"
                        : "bg-slate-500"
                    }`}
                >
                  {statusLabel}
                </span>
              </div>
              <p className="text-sm text-gray-600">
                {t("quiz.seasonRankingDates", {
                  start: verbalDate(season.startDate),
                  end: verbalDate(season.endDate),
                })}
              </p>
              {season.description?.trim() ? (
                <div className="text-sm text-gray-700 pt-1">
                  {renderInlineBold(season.description)}
                </div>
              ) : null}
            </section>

            <div className="relative scroll-mt-24">
              <span
                id="quiz-ranking"
                className="absolute -top-24 h-0 w-0"
                aria-hidden
              />
              <span
                id="tournament-ranking"
                className="absolute -top-24 h-0 w-0"
                aria-hidden
              />
              <div className="flex gap-1">
                <button
                  type="button"
                  className={tabClass("quiz")}
                  onClick={() => setActiveTab("quiz")}
                >
                  {t("quiz.seasonRankingTabQuiz")}
                </button>
                <button
                  type="button"
                  className={tabClass("tournament")}
                  onClick={() => setActiveTab("tournament")}
                >
                  {t("quiz.seasonRankingTabTournament")}
                </button>
              </div>

              <section className="bg-white border border-gray-200 rounded-b-lg rounded-tr-lg p-4 shadow-sm space-y-3">
                {activeTab === "tournament" && (() => {
                  const allPlayable =
                    season.playableArchetypesDisplay ??
                    season.playableArchetypes ??
                    [];
                  const previewLimit = 18;
                  const needsSeeMore = allPlayable.length > previewLimit;
                  const visiblePlayable =
                    playableArchetypesExpanded || !needsSeeMore
                      ? allPlayable
                      : allPlayable.slice(0, previewLimit);
                  return (
                    <div className="space-y-2">
                      <h2 className="text-xl font-bold text-gray-900">
                        {t("quiz.seasonPlayableArchetypesTitle")}
                      </h2>
                      {season.playableArchetypesRestricted ? (
                        <p className="text-sm text-gray-600">
                          {t("quiz.seasonPlayableArchetypesSelection")}
                        </p>
                      ) : null}
                      <ul className="grid grid-cols-9 gap-2">
                        {visiblePlayable.map((archetype) => {
                          const raw = archetype.cardImgUrl?.trim();
                          const src = raw
                            ? optimizeImageUrl(raw, "card")
                            : WAITING_ARCHETYPE_IMAGE;
                          const href = getArchetypePublicPath({
                            id: archetype.id,
                            slug: archetype.slug,
                          });
                          const tileClass =
                            "flex min-w-0 flex-col items-center justify-start gap-1 rounded-md bg-white p-1 border border-gray-200";
                          const content = (
                            <>
                              <img
                                src={src}
                                alt={archetype.name}
                                className="h-10 w-10 sscreen:h-12 sscreen:w-12 rounded object-cover bg-gray-50 shrink-0"
                                loading="lazy"
                                onError={(event) => {
                                  const img = event.currentTarget;
                                  if (
                                    img.src.endsWith(
                                      "waiting_archetype_image.jpg"
                                    )
                                  ) {
                                    return;
                                  }
                                  img.src = WAITING_ARCHETYPE_IMAGE;
                                }}
                              />
                              <span
                                className="w-full text-center text-[10px] leading-tight text-gray-700 truncate"
                                title={archetype.name}
                              >
                                {archetype.name}
                              </span>
                            </>
                          );
                          return (
                            <li key={archetype.id} className="min-w-0">
                              {href ? (
                                <Link
                                  to={href}
                                  className={`${tileClass} hover:border-blue-300 hover:shadow-sm transition-colors`}
                                >
                                  {content}
                                </Link>
                              ) : (
                                <div className={tileClass}>{content}</div>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                      {needsSeeMore ? (
                        <div className="flex justify-end">
                          <button
                            type="button"
                            className="text-sm font-medium text-blue-600 hover:text-yellow-600 hover:underline"
                            onClick={() =>
                              setPlayableArchetypesExpanded((open) => !open)
                            }
                          >
                            {playableArchetypesExpanded
                              ? t("quiz.seasonPlayableArchetypesSeeLess")
                              : t("quiz.seasonPlayableArchetypesSeeMore")}
                          </button>
                        </div>
                      ) : null}
                    </div>
                  );
                })()}
                <h2 className="text-xl font-bold text-gray-900">
                  {activeTab === "quiz"
                    ? t("quiz.seasonRankingSectionTitle")
                    : t("quiz.seasonTournamentRankingTitle")}
                </h2>

                {activeTab === "quiz" ? (
                  <p className="text-sm text-gray-600">
                    {t(
                      season.status === "past"
                        ? "quiz.seasonQuizPlayersHintPast"
                        : "quiz.seasonQuizPlayersHintActive",
                      {
                        season: season.name,
                        count: podium.length,
                      }
                    )}
                  </p>
                ) : (
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>
                      {t("quiz.seasonTournamentRankingHint", {
                        season: season.name,
                      })}
                    </p>
                    <p>{t("quiz.seasonTournamentRankingHintBonus")}</p>
                  </div>
                )}

                {activeTab === "tournament" && (
                  <div className="border border-gray-200 rounded-md overflow-hidden">
                    <button
                      type="button"
                      className="w-full flex items-center justify-between gap-2 px-3 py-2 text-left bg-gray-50 hover:bg-gray-100 transition-colors"
                      onClick={() => setTierTableOpen((open) => !open)}
                      aria-expanded={tierTableOpen}
                    >
                      <span className="font-semibold text-gray-900 text-sm">
                        {t("quiz.seasonTierTableTitle")}
                        {ranksFrozen ? (
                          <span className="ml-2 font-normal text-xs text-violet-700">
                            — {t("quiz.seasonTierTableFrozenNote")}
                          </span>
                        ) : null}
                      </span>
                      <FaChevronDown
                        className={`w-3.5 h-3.5 text-gray-600 shrink-0 transition-transform duration-200 ${tierTableOpen ? "rotate-180" : ""
                          }`}
                        aria-hidden
                      />
                    </button>
                    {tierTableOpen ? (
                      <div className="overflow-x-auto border-t border-gray-200">
                        <table className="min-w-full text-sm text-left">
                          <thead className="bg-gray-100 text-gray-700">
                            <tr>
                              <th className="px-3 py-2 font-semibold">
                                {t("quiz.seasonTierTableColRank")}
                              </th>
                              <th className="px-3 py-2 font-semibold">
                                {t("quiz.seasonTierTableColPoints")}
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {SEASON_TOURNAMENT_TIERS.map((tier) => (
                              <tr
                                key={tier.id}
                                className="border-t border-gray-200 text-gray-800"
                              >
                                <td className="px-3 py-1.5">
                                  <span className="inline-flex items-center gap-2">
                                    <img
                                      src={getSeasonTournamentTierIconSrc(
                                        tier.id
                                      )}
                                      alt=""
                                      className="w-5 h-5 object-contain shrink-0"
                                      width={20}
                                      height={20}
                                      loading="lazy"
                                      decoding="async"
                                    />
                                    {tierLabel(tier.id)}
                                  </span>
                                </td>
                                <td className="px-3 py-1.5">
                                  {tier.minPoints}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : null}
                  </div>
                )}
                {activeTab === "quiz" && activeRows.length === 0 ? (
                  <p className="text-sm text-gray-500">
                    {t("quiz.seasonPodiumEmpty")}
                  </p>
                ) : activeRows.length > 0 ? (
                  <div className="w-full text-sm text-left text-gray-500">
                    <PaginationTableHead
                      tableHeadItem={
                        activeTab === "quiz" ? quizTableHead : tournamentTableHead
                      }
                    />
                    <div className="grid grid-cols-12">
                      {paged.map((entry) => {
                        const medalSrc = getSeasonMedalSrc(entry.rank);
                        const isQuiz = activeTab === "quiz";
                        const quizEntry = entry as QuizSeasonPodiumEntry;
                        const tournamentEntry =
                          entry as SeasonTournamentRankingEntry;
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
                            <div
                              className={`${isQuiz ? "col-span-5" : "col-span-3"
                                } p-2 text-gray-900`}
                            >
                              {entry.userId ? (
                                <Link
                                  to={
                                    String(entry.userId) ===
                                      String(currentUserId)
                                      ? URL_FRONT_MY_PROFILE
                                      : getUserProfilePath(entry.userId)
                                  }
                                  className="hover:underline font-medium"
                                >
                                  {entry.username}
                                </Link>
                              ) : (
                                entry.username
                              )}
                            </div>
                            <div
                              className={`${isQuiz ? "col-span-3" : "col-span-2"
                                } p-2 text-center text-gray-800`}
                            >
                              {isQuiz
                                ? quizEntry.totalScore
                                : tournamentEntry.totalPoints}
                            </div>
                            <div className="col-span-2 p-2 text-center text-gray-800">
                              {isQuiz
                                ? quizEntry.attemptsCount
                                : tournamentEntry.tournamentsCount}
                            </div>
                            {!isQuiz && (
                              <div className="col-span-3 p-2 text-gray-800">
                                <span className="inline-flex items-center gap-1.5 text-xs sscreen:text-sm font-semibold">
                                  <img
                                    src={getSeasonTournamentTierIconSrc(
                                      tournamentEntry.tier ?? "novice"
                                    )}
                                    alt=""
                                    className="w-5 h-5 object-contain shrink-0"
                                    width={20}
                                    height={20}
                                    loading="lazy"
                                    decoding="async"
                                  />
                                  {tierLabel(tournamentEntry.tier ?? "novice")}
                                </span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    {activeRows.length > PAGE_SIZE && (
                      <PaginationFooter
                        currentPage={currentPage}
                        setPagination={setPage}
                        setRefresh={() => undefined}
                        itemsTotalCount={activeRows.length}
                        totalPages={totalPages}
                        pageSize={PAGE_SIZE}
                      />
                    )}
                  </div>
                ) : null}
              </section>
            </div>
          </>
        )}
      </div>
    </UserBasicLayout>
  );
};

export default QuizSeasonRankingPage;
