import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FaExclamationTriangle } from "react-icons/fa";
import { URL_FRONT_MY_TOURNAMENT_DETAIL } from "@/constant/urlsFront";

interface TournamentDeckRequiredReminderProps {
  tournamentId: string;
  tournamentName: string;
  className?: string;
}

const TournamentDeckRequiredReminder: React.FC<
  TournamentDeckRequiredReminderProps
> = ({ tournamentId, tournamentName, className = "" }) => {
  const { t } = useTranslation();

  return (
    <Link
      to={URL_FRONT_MY_TOURNAMENT_DETAIL(tournamentId)}
      className={`flex items-start gap-3 rounded-lg border border-amber-300 bg-amber-50 px-3.5 py-2.5 text-sm text-amber-950 shadow-sm hover:bg-amber-100/80 transition-colors ${className}`}
    >
      <FaExclamationTriangle
        className="mt-0.5 w-4 h-4 shrink-0 text-amber-600"
        aria-hidden
      />
      <p className="min-w-0 leading-snug">
        <span className="font-semibold">
          {t("profile.deckRequiredReminderTitle")}
        </span>
        <span className="text-amber-900/90">
          {" — "}
          {t("profile.deckRequiredReminderBody", { name: tournamentName })}
        </span>
      </p>
    </Link>
  );
};

export default TournamentDeckRequiredReminder;
