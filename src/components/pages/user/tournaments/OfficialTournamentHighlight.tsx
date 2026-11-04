import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import type { Tournament } from "@/types";
import { URL_FRONT_TOURNAMENT } from "@/constant/urlsFront";
import { optimizeImageUrl } from "@/utils/image/optimizeImageUrl";
import { verbalDate } from "@/utils/date/verbalDate";
import SubtitleDivider from "@/components/generic/SubtitleDivider";
import {
  formatCountdown,
  isTournamentInProgressStatus,
  isUserRegisteredToTournament,
  selectOfficialTournamentHighlights,
  shouldShowHighlightCountdown,
} from "@/utils/tournament/officialTournamentHighlight";

interface OfficialTournamentHighlightProps {
  tournaments: Tournament[];
  className?: string;
  titleKey?: string;
  /** Titre style page d’accueil (SubtitleDivider), comme les listes d’archétypes. */
  homeSectionTitle?: boolean;
}

const OfficialTournamentHighlightCard: React.FC<{
  tournament: Tournament;
  userId: string | null;
}> = ({ tournament, userId }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [nowMs, setNowMs] = useState(() => Date.now());

  const showCountdown = shouldShowHighlightCountdown(tournament, nowMs);
  const inProgress =
    isTournamentInProgressStatus(tournament.status) ||
    (tournament.event_date != null &&
      nowMs >= new Date(tournament.event_date).getTime() &&
      !shouldShowHighlightCountdown(tournament, nowMs));

  useEffect(() => {
    if (!showCountdown && !inProgress) return;
    const id = window.setInterval(() => setNowMs(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [showCountdown, inProgress]);

  const registered = isUserRegisteredToTournament(tournament, userId);
  const imageUrl = tournament.image_url
    ? optimizeImageUrl(String(tournament.image_url), "thumb")
    : null;
  const focalX = Math.max(0, Math.min(100, Number(tournament.image_focal_x) || 50));
  const focalY = Math.max(0, Math.min(100, Number(tournament.image_focal_y) || 50));
  const zoom = Math.max(1, Math.min(2.5, (Number(tournament.image_zoom) || 100) / 100));

  const startMs = tournament.event_date
    ? new Date(tournament.event_date).getTime()
    : 0;
  const countdownLabel =
    showCountdown && startMs > nowMs
      ? formatCountdown(startMs - nowMs)
      : null;

  let badgeLabel = registered
    ? t("officialTournamentHighlight.badgeRegistered")
    : t("officialTournamentHighlight.badgeNotRegistered");
  let badgeClass = registered ? "bg-green-600" : "bg-slate-500";
  if (inProgress) {
    badgeLabel = t("officialTournamentHighlight.badgeInProgress");
    badgeClass = "bg-orange-500";
  }

  const goToTournament = () => {
    navigate(URL_FRONT_TOURNAMENT(tournament.id));
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={goToTournament}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          goToTournament();
        }
      }}
      className="relative overflow-hidden rounded-lg border border-amber-300 bg-amber-50 p-4 shadow-md cursor-pointer transition-all hover:shadow-lg hover:bg-amber-50"
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
          <div className="absolute inset-0 bg-gradient-to-r from-amber-50 via-amber-50/75 to-amber-50/10" />
        </div>
      )}

      <div className="relative z-10 space-y-2">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center rounded-md bg-amber-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                {t("officialTournamentHighlight.officialBadge")}
              </span>
              {countdownLabel && (
                <span className="inline-flex items-center rounded-md bg-red-600 px-2 py-0.5 text-xs font-bold tabular-nums text-white">
                  {t("officialTournamentHighlight.countdown", {
                    time: countdownLabel,
                  })}
                </span>
              )}
            </div>
            <h3 className="font-semibold text-lg text-gray-900 truncate">
              {tournament.name}
            </h3>
          </div>
          <span
            className={`shrink-0 inline-flex items-center px-3 py-1 text-white text-xs font-bold rounded-md shadow-sm ${badgeClass}`}
          >
            {badgeLabel}
          </span>
        </div>

        <p className="text-sm text-gray-700">
          {tournament.event_date
            ? t("officialTournamentHighlight.startsAt", {
                date: verbalDate(tournament.event_date, true),
              })
            : null}
          {tournament.location
            ? ` · ${tournament.is_online ? t("tournamentsPage.online") : tournament.location}`
            : tournament.is_online
              ? ` · ${t("tournamentsPage.online")}`
              : null}
        </p>

        <p className="text-sm font-medium text-amber-800">
          <Link
            to={URL_FRONT_TOURNAMENT(tournament.id)}
            className="underline hover:text-amber-950"
            onClick={(e) => e.stopPropagation()}
          >
            {t("officialTournamentHighlight.seeTournament")}
          </Link>
        </p>
      </div>
    </div>
  );
};

const OfficialTournamentHighlight: React.FC<
  OfficialTournamentHighlightProps
> = ({
  tournaments,
  className = "",
  titleKey = "officialTournamentHighlight.title",
  homeSectionTitle = false,
}) => {
  const { t } = useTranslation();
  const userId = useSelector((state: RootState) => state.user.id);
  const [nowMs, setNowMs] = useState(() => Date.now());

  const highlights = useMemo(
    () => selectOfficialTournamentHighlights(tournaments, nowMs),
    [tournaments, nowMs]
  );

  const needsTicker = useMemo(
    () =>
      highlights.some(
        (tournament) =>
          shouldShowHighlightCountdown(tournament, nowMs) ||
          isTournamentInProgressStatus(tournament.status)
      ) || highlights.length > 0,
    [highlights, nowMs]
  );

  useEffect(() => {
    if (!needsTicker) return;
    const id = window.setInterval(() => setNowMs(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [needsTicker]);

  if (highlights.length === 0) return null;

  return (
    <section className={`${homeSectionTitle ? "space-y-0" : "space-y-3"} ${className}`}>
      {homeSectionTitle ? (
        <SubtitleDivider displayDivider label={t(titleKey)} />
      ) : (
        <h2 className="text-xl font-bold text-gray-900">{t(titleKey)}</h2>
      )}
      <div className="space-y-3">
        {highlights.map((tournament) => (
          <OfficialTournamentHighlightCard
            key={tournament.id}
            tournament={tournament}
            userId={userId}
          />
        ))}
      </div>
    </section>
  );
};

export default OfficialTournamentHighlight;
