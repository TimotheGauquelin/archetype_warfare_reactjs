import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { URL_FRONT_MY_TOURNAMENT_DETAIL } from "@/constant/urlsFront";

interface TournamentDeckRequiredReminderProps {
  tournamentId: string;
  tournamentName: string;
  /** Ancre vers la section deck sur la page détail (optionnel). */
  showSelectCta?: boolean;
  className?: string;
}

const TournamentDeckRequiredReminder: React.FC<
  TournamentDeckRequiredReminderProps
> = ({
  tournamentId,
  tournamentName,
  className = "",
}) => {
    const { t } = useTranslation();

    return (
      <Link
        to={URL_FRONT_MY_TOURNAMENT_DETAIL(tournamentId)}
        className={`rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-950 ${className}`}
      >
        <p className="font-semibold">
          {t("profile.deckRequiredReminderTitle")}
        </p>
        <p className="mt-1">
          {t("profile.deckRequiredReminderBody", { name: tournamentName })}
        </p>
      </Link>
    );
  };

export default TournamentDeckRequiredReminder;
