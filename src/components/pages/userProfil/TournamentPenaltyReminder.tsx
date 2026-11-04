import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FaExclamationTriangle } from "react-icons/fa";
import { URL_FRONT_MY_TOURNAMENT_DETAIL } from "@/constant/urlsFront";

interface TournamentPenaltyReminderProps {
  tournamentId: string;
  tournamentName: string;
  penaltiesCount: number;
  lateDeck: boolean;
  className?: string;
}

const TournamentPenaltyReminder: React.FC<TournamentPenaltyReminderProps> = ({
  tournamentId,
  tournamentName,
  penaltiesCount,
  lateDeck,
  className = "",
}) => {
  const { t } = useTranslation();

  return (
    <Link
      to={URL_FRONT_MY_TOURNAMENT_DETAIL(tournamentId)}
      className={`flex items-start gap-3 rounded-lg border border-orange-300 bg-orange-50 px-3.5 py-2.5 text-sm text-orange-950 shadow-sm hover:bg-orange-100/80 transition-colors ${className}`}
    >
      <FaExclamationTriangle
        className="mt-0.5 w-4 h-4 shrink-0 text-orange-600"
        aria-hidden
      />
      <p className="min-w-0 leading-snug">
        <span className="font-semibold">
          {t("profile.penaltyReminderTitle")}
        </span>
        <span className="text-orange-900/90">
          {" — "}
          {t("profile.penaltyReminderBody", {
            name: tournamentName,
            count: penaltiesCount,
            lateDeck: lateDeck
              ? t("profile.penaltyReminderLateDeck")
              : "",
          })}
        </span>
      </p>
    </Link>
  );
};

export default TournamentPenaltyReminder;
