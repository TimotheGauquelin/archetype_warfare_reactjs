import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SubtitleDivider from "@/components/generic/SubtitleDivider";
import { getSeasonPath } from "@/constant/urlsFront";
import {
  getQuizHub,
  type AdminQuizSeason,
  type QuizSeasonPodiumEntry,
} from "@/services/quiz";
import { verbalDate } from "@/utils/date/verbalDate";
import { optimizeImageUrl } from "@/utils/image/optimizeImageUrl";

export type SeasonHighlightVariant = "home" | "quiz" | "tournaments";

export type SeasonHighlightItem = {
  season: AdminQuizSeason;
  podium?: QuizSeasonPodiumEntry[];
};

type SeasonHighlightProps = {
  /** Si omis, charge les saisons en cours via le hub quiz. */
  items?: SeasonHighlightItem[] | null;
  variant?: SeasonHighlightVariant;
  className?: string;
  /** Titre style page d’accueil (SubtitleDivider). */
  homeSectionTitle?: boolean;
  titleKey?: string;
};

const statusLabelKey = (status: AdminQuizSeason["status"]) => {
  if (status === "current") return "quiz.seasonStatusCurrent";
  if (status === "past") return "quiz.seasonStatusPast";
  return "quiz.seasonStatusUpcoming";
};

export const SeasonHighlightCard: React.FC<{
  item: SeasonHighlightItem;
  variant: SeasonHighlightVariant;
  className?: string;
}> = ({ item, variant, className = "" }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { season } = item;
  const from =
    variant === "quiz"
      ? "quiz"
      : variant === "tournaments"
        ? "tournaments"
        : undefined;
  const rankingPath = getSeasonPath(season.id, from);
  const isExceptional = Boolean(season.allowsOverlap);
  const imageUrl = season.imageUrl
    ? optimizeImageUrl(season.imageUrl, "thumb")
    : null;
  const focalX = Math.max(0, Math.min(100, Number(season.imageFocalX) || 50));
  const focalY = Math.max(0, Math.min(100, Number(season.imageFocalY) || 50));
  const zoom = Math.max(
    1,
    Math.min(2.5, (Number(season.imageZoom) || 100) / 100)
  );

  const goToRanking = () => {
    navigate(rankingPath);
  };

  const cardTone = "border-sky-300 bg-sky-50 hover:bg-sky-50";
  const fadeTone = "from-sky-50 via-sky-50/75 to-sky-50/10";
  const badgeTone = "bg-sky-600";

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={goToRanking}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          goToRanking();
        }
      }}
      className={`relative overflow-hidden rounded-lg border p-4 shadow-md cursor-pointer transition-all hover:shadow-lg ${cardTone} ${className}`}
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
          <div className={`absolute inset-0 bg-gradient-to-r ${fadeTone}`} />
        </div>
      )}

      <div className="relative z-10 space-y-2">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white ${badgeTone}`}
              >
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
          </div>
        </div>

        <p className="text-sm text-gray-700">
          {t("quiz.seasonRankingDates", {
            start: verbalDate(season.startDate),
            end: verbalDate(season.endDate),
          })}
        </p>
      </div>
    </div>
  );
};

const SeasonHighlight: React.FC<SeasonHighlightProps> = ({
  items: itemsProp,
  variant = "home",
  className = "",
  homeSectionTitle = false,
  titleKey = "seasonHighlight.title",
}) => {
  const { t } = useTranslation();
  const [fetchedItems, setFetchedItems] = useState<SeasonHighlightItem[]>([]);
  const [isLoading, setIsLoading] = useState(itemsProp == null);

  const loadSeasons = useCallback(async () => {
    if (itemsProp != null) return;
    setIsLoading(true);
    try {
      const hub = await getQuizHub();
      const blocks =
        hub.seasonPodiums && hub.seasonPodiums.length > 0
          ? hub.seasonPodiums
          : hub.seasonPodium
            ? [hub.seasonPodium]
            : [];
      setFetchedItems(
        blocks
          .filter((b) => b.season.status === "current")
          .map((b) => ({ season: b.season, podium: b.podium }))
      );
    } catch {
      setFetchedItems([]);
    } finally {
      setIsLoading(false);
    }
  }, [itemsProp]);

  useEffect(() => {
    void loadSeasons();
  }, [loadSeasons]);

  const items = useMemo(() => {
    if (itemsProp != null) {
      return itemsProp.filter((item) => item.season.status === "current");
    }
    return fetchedItems;
  }, [itemsProp, fetchedItems]);

  if (isLoading || items.length === 0) return null;

  return (
    <section
      className={`${homeSectionTitle ? "space-y-0" : "space-y-3"} ${className}`}
    >
      {homeSectionTitle ? (
        <SubtitleDivider displayDivider label={t(titleKey)} />
      ) : (
        <h2 className="text-xl font-bold text-gray-900">{t(titleKey)}</h2>
      )}
      <div className="space-y-3">
        {items.map((item) => (
          <SeasonHighlightCard
            key={item.season.id}
            item={item}
            variant={variant}
          />
        ))}
      </div>
    </section>
  );
};

export default SeasonHighlight;
