import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FaChevronDown } from "react-icons/fa";
import PaginationTableHead from "@/components/generic/pagination/PaginationTableHead";
import type {
  SeasonHighlightItem,
  SeasonHighlightVariant,
} from "@/components/pages/user/season/SeasonHighlight";
import { getSeasonPath } from "@/constant/urlsFront";
import type {
  QuizSeasonPodiumEntry,
  SeasonTournamentRankingEntry,
} from "@/services/quiz";
import { verbalDate } from "@/utils/date/verbalDate";
import { optimizeImageUrl } from "@/utils/image/optimizeImageUrl";
import { getSeasonMedalSrc } from "@/utils/quiz/seasonMedal";
import {
  getSeasonTournamentTierIconSrc,
  SEASON_TOURNAMENT_TIER_I18N_KEY,
} from "@/utils/tournament/seasonTournamentRank";

type SeasonEventCollapsibleProps = {
  item: SeasonHighlightItem;
  variant: Extract<SeasonHighlightVariant, "quiz" | "tournaments">;
  tournamentPodium?: SeasonTournamentRankingEntry[];
  quizPodium?: QuizSeasonPodiumEntry[];
  defaultOpen?: boolean;
};

const statusLabelKey = (
  status: SeasonHighlightItem["season"]["status"]
): string => {
  if (status === "current") return "quiz.seasonStatusCurrent";
  if (status === "past") return "quiz.seasonStatusPast";
  return "quiz.seasonStatusUpcoming";
};

const SeasonEventCollapsible: React.FC<SeasonEventCollapsibleProps> = ({
  item,
  variant,
  tournamentPodium = [],
  quizPodium = [],
  defaultOpen = true,
}) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(defaultOpen);
  const { season } = item;
  const isExceptional = Boolean(season.allowsOverlap);
  const isTournament = variant === "tournaments";
  const podiumTitle = isTournament
    ? t("quiz.seasonTournamentPodiumTitle")
    : t("quiz.seasonPodiumTitle");
  const seeAllPath = getSeasonPath(
    season.id,
    isTournament ? "tournaments" : "quiz"
  );

  const imageUrl = season.imageUrl
    ? optimizeImageUrl(season.imageUrl, "thumb")
    : null;
  const focalX = Math.max(0, Math.min(100, Number(season.imageFocalX) || 50));
  const focalY = Math.max(0, Math.min(100, Number(season.imageFocalY) || 50));
  const zoom = Math.max(
    1,
    Math.min(2.5, (Number(season.imageZoom) || 100) / 100)
  );

  const quizTableHead = [
    { colspan: "col-span-2", label: t("quiz.seasonPodiumColRank") },
    { colspan: "col-span-5", label: t("quiz.seasonPodiumColPlayer") },
    { colspan: "col-span-3", label: t("quiz.seasonPodiumColScore") },
    { colspan: "col-span-2", label: t("quiz.seasonPodiumColAttempts") },
  ];
  const tournamentTableHead = [
    { colspan: "col-span-2", label: t("quiz.seasonPodiumColRank") },
    { colspan: "col-span-4", label: t("quiz.seasonPodiumColPlayer") },
    { colspan: "col-span-3", label: t("quiz.seasonTournamentColPoints") },
    { colspan: "col-span-3", label: t("quiz.seasonTournamentColTier") },
  ];

  return (
    <section className="bg-white border border-sky-300 rounded-lg shadow-sm overflow-hidden">
      <button
        type="button"
        className={`relative w-full overflow-hidden text-left bg-sky-50 transition-colors ${
          open ? "border-b border-sky-200" : ""
        }`}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
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
            <div className="absolute inset-0 bg-gradient-to-r from-sky-50 via-sky-50/75 to-sky-50/10" />
          </div>
        )}

        <div className="relative z-10 flex items-start justify-between gap-3 p-4">
          <div className="min-w-0 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center rounded-md bg-sky-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                {t(statusLabelKey(season.status))}
              </span>
              {isExceptional && (
                <span className="inline-flex items-center rounded-md bg-violet-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                  {t("quiz.seasonExceptionalBadge")}
                </span>
              )}
            </div>
            <h3 className="font-semibold text-lg text-gray-900 truncate">
              {season.name}
            </h3>
            <p className="text-sm text-gray-700">
              {t("quiz.seasonRankingDates", {
                start: verbalDate(season.startDate),
                end: verbalDate(season.endDate),
              })}
            </p>
          </div>
          <FaChevronDown
            className={`w-4 h-4 text-gray-600 shrink-0 mt-1 transition-transform duration-200 ${
              open ? "rotate-180" : ""
            }`}
            aria-hidden
          />
        </div>
      </button>

      {open ? (
        <div className="p-4 space-y-2">
          <div className="flex flex-col gap-1 sscreen:flex-row sscreen:items-center sscreen:justify-between sscreen:gap-3">
            <h3 className="text-md font-semibold text-gray-800">
              {podiumTitle}
            </h3>
            <Link
              to={seeAllPath}
              className="self-end sscreen:self-auto shrink-0 text-sm font-medium text-blue-600 hover:text-yellow-600 hover:underline"
            >
              {t("quiz.seasonPodiumSeeAll")}
            </Link>
          </div>

          {isTournament ? (
            tournamentPodium.length === 0 ? (
              <p className="text-sm text-gray-500">
                {t("quiz.seasonTournamentRankingEmpty")}
              </p>
            ) : (
              <div className="w-full text-sm text-left text-gray-500">
                <PaginationTableHead tableHeadItem={tournamentTableHead} />
                <div className="grid grid-cols-12">
                  {tournamentPodium.map((entry) => {
                    const medalSrc = getSeasonMedalSrc(entry.rank);
                    const tier = entry.tier ?? "novice";
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
                        <div className="col-span-4 p-2 text-gray-900">
                          {entry.username}
                        </div>
                        <div className="col-span-3 p-2 text-center text-gray-800">
                          {entry.totalPoints}
                        </div>
                        <div className="col-span-3 p-2 text-gray-800">
                          <span className="inline-flex items-center gap-1.5 font-semibold">
                            <img
                              src={getSeasonTournamentTierIconSrc(tier)}
                              alt=""
                              className="w-5 h-5 object-contain shrink-0"
                              width={20}
                              height={20}
                              loading="lazy"
                              decoding="async"
                            />
                            {t(SEASON_TOURNAMENT_TIER_I18N_KEY[tier])}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )
          ) : quizPodium.length === 0 ? (
            <p className="text-sm text-gray-500">
              {t("quiz.seasonPodiumEmpty")}
            </p>
          ) : (
            <div className="w-full text-sm text-left text-gray-500">
              <PaginationTableHead tableHeadItem={quizTableHead} />
              <div className="grid grid-cols-12">
                {quizPodium.map((entry) => {
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
      ) : null}
    </section>
  );
};

export default SeasonEventCollapsible;
