import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  getMyQuizStats,
  type MyQuizTypeStats,
} from "@/services/quiz";
import {
  getMyArchetypeRankings,
  type MyArchetypeRankingEntry,
} from "@/services/archetypeRanking";
import { getArchetypePublicPath } from "@/constant/urlsFront";
import NoItemMessage from "@/components/generic/NoItemMessage";

const MyProfileRankingTab = () => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [quizPoints, setQuizPoints] = useState(0);
  const [byType, setByType] = useState<MyQuizTypeStats[]>([]);
  const [archetypeTotal, setArchetypeTotal] = useState(0);
  const [archetypes, setArchetypes] = useState<MyArchetypeRankingEntry[]>([]);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    Promise.all([getMyQuizStats(), getMyArchetypeRankings()])
      .then(([quizStats, archetypeStats]) => {
        if (cancelled) return;
        setQuizPoints(quizStats.quizPoints ?? 0);
        setByType(quizStats.byType ?? []);
        setArchetypeTotal(archetypeStats.totalPoints ?? 0);
        setArchetypes(archetypeStats.archetypes ?? []);
      })
      .catch(() => {
        if (cancelled) return;
        setByType([]);
        setArchetypes([]);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-24 bg-gray-100 rounded-lg" />
        <div className="h-32 bg-gray-100 rounded-lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section>
        <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3">
          <h3 className="text-lg font-bold text-gray-900">
            {t("profile.rankingQuizTitle")}
          </h3>
          <p className="text-sm text-gray-600">
            {t("profile.rankingQuizTotal", { count: quizPoints })}
          </p>
        </div>
        {byType.length > 0 ? (
          <ul className="divide-y divide-gray-200 border border-gray-200 rounded-lg overflow-hidden">
            {byType.map((row) => (
              <li
                key={row.type}
                className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 bg-gray-50"
              >
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900">
                    {t(`quiz.types.${row.type}`, { defaultValue: row.type })}
                  </p>
                  <p className="text-sm text-gray-600">
                    {t("profile.rankingQuizAccuracy", {
                      accuracy: row.accuracy,
                      correct: row.correctCount,
                      total: row.answersCount,
                    })}
                  </p>
                </div>
                <p className="text-sm font-medium text-gray-800 shrink-0">
                  {t("profile.rankingPoints", { count: row.points })}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <NoItemMessage
            message={t("profile.rankingQuizEmpty")}
            textPosition="center"
          />
        )}
      </section>

      <section>
        <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3">
          <h3 className="text-lg font-bold text-gray-900">
            {t("profile.rankingArchetypesTitle")}
          </h3>
          <p className="text-sm text-gray-600">
            {t("profile.rankingArchetypesTotal", { count: archetypeTotal })}
          </p>
        </div>
        {archetypes.length > 0 ? (
          <ul className="divide-y divide-gray-200 border border-gray-200 rounded-lg overflow-hidden">
            {archetypes.map((row) => {
              const path = getArchetypePublicPath({
                id: row.archetypeId,
                slug: row.slug,
              });
              return (
                <li
                  key={row.archetypeId}
                  className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 bg-gray-50"
                >
                  <div className="min-w-0">
                    {path ? (
                      <Link
                        to={path}
                        className="font-semibold text-blue-800 hover:underline"
                      >
                        {row.archetypeName}
                      </Link>
                    ) : (
                      <span className="font-semibold text-gray-900">
                        {row.archetypeName}
                      </span>
                    )}
                    <p className="text-sm text-gray-600">
                      {t("profile.rankingArchetypeRank", {
                        rank: row.rank,
                        total: row.playersCount,
                      })}
                    </p>
                  </div>
                  <p className="text-sm font-medium text-gray-800 shrink-0">
                    {t("profile.rankingPoints", { count: row.points })}
                  </p>
                </li>
              );
            })}
          </ul>
        ) : (
          <NoItemMessage
            message={t("profile.rankingArchetypesEmpty")}
            textPosition="center"
          />
        )}
      </section>
    </div>
  );
};

export default MyProfileRankingTab;
