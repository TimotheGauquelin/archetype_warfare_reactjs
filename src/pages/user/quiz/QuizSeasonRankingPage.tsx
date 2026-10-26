import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import UserBasicLayout from "../layout";
import Loader from "@/components/generic/Loader";
import PaginationTableHead from "@/components/generic/pagination/PaginationTableHead";
import PaginationFooter from "@/components/generic/pagination/PaginationFooter";
import {
  getQuizSeasonRanking,
  type QuizSeasonPodiumEntry,
  type AdminQuizSeason,
} from "@/services/quiz";
import { URL_FRONT_QUIZ } from "@/constant/urlsFront";
import { verbalDate } from "@/utils/date/verbalDate";
import { getSeasonMedalSrc } from "@/utils/quiz/seasonMedal";

const PAGE_SIZE = 20;

const QuizSeasonRankingPage = () => {
  const { t } = useTranslation();
  const { seasonId = "current" } = useParams<{ seasonId: string }>();
  const [season, setSeason] = useState<AdminQuizSeason | null>(null);
  const [podium, setPodium] = useState<QuizSeasonPodiumEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const tableHead = useMemo(
    () => [
      { colspan: "col-span-2", label: t("quiz.seasonPodiumColRank") },
      { colspan: "col-span-5", label: t("quiz.seasonPodiumColPlayer") },
      { colspan: "col-span-3", label: t("quiz.seasonPodiumColScore") },
      { colspan: "col-span-2", label: t("quiz.seasonPodiumColAttempts") },
    ],
    [t]
  );

  const loadRanking = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getQuizSeasonRanking(seasonId);
      setSeason(data.season);
      setPodium(data.podium);
      setPage(1);
    } catch {
      setSeason(null);
      setPodium([]);
      setError(t("quiz.seasonRankingLoadError"));
    } finally {
      setIsLoading(false);
    }
  }, [seasonId, t]);

  useEffect(() => {
    void loadRanking();
  }, [loadRanking]);

  const totalPages = Math.max(1, Math.ceil(podium.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paged = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return podium.slice(start, start + PAGE_SIZE);
  }, [podium, currentPage]);

  const statusLabel = useMemo(() => {
    if (!season) return "";
    if (season.status === "current") return t("quiz.seasonStatusCurrent");
    if (season.status === "past") return t("quiz.seasonStatusPast");
    return t("quiz.seasonStatusUpcoming");
  }, [season, t]);

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
        <div className="flex justify-end">
          <Link
            to={URL_FRONT_QUIZ}
            className="text-sm font-medium text-blue-600 hover:text-yellow-600 hover:underline"
          >
            {t("quiz.backToHub")}
          </Link>
        </div>

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
              <h2 className="text-xl font-bold text-gray-900">{season.name}</h2>
              <p className="text-sm text-gray-600">
                {t("quiz.seasonRankingDates", {
                  start: verbalDate(season.startDate),
                  end: verbalDate(season.endDate),
                })}
              </p>
              <p className="text-sm text-gray-600">
                {t("quiz.seasonRankingMeta", {
                  status: statusLabel,
                  days: season.dayCount,
                  questions: season.questionCount,
                  players: podium.length,
                })}
              </p>
            </section>

            <section className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm space-y-3">
              <h2 className="text-xl font-bold text-gray-900">
                {t("quiz.seasonRankingSectionTitle")}
              </h2>
              <p className="text-sm text-gray-600">
                {t("quiz.seasonPodiumHint", { season: season.name })}
              </p>
              {podium.length === 0 ? (
                <p className="text-sm text-gray-500">
                  {t("quiz.seasonPodiumEmpty")}
                </p>
              ) : (
                <div className="w-full text-sm text-left text-gray-500">
                  <PaginationTableHead tableHeadItem={tableHead} />
                  <div className="grid grid-cols-12">
                    {paged.map((entry) => {
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
                  {podium.length > PAGE_SIZE && (
                    <PaginationFooter
                      currentPage={currentPage}
                      setPagination={setPage}
                      setRefresh={() => undefined}
                      itemsTotalCount={podium.length}
                      totalPages={totalPages}
                      pageSize={PAGE_SIZE}
                    />
                  )}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </UserBasicLayout>
  );
};

export default QuizSeasonRankingPage;
