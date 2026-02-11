import React from "react";
import { Link } from "react-router-dom";
import type { Tournament } from "../../../../types";
import { URL_FRONT_TOURNAMENT } from "../../../../constant/urlsFront";
import { TOURNAMENT_STATUS } from "@/utils/trad/tournamentStatus";
import { verbalDate } from "@/utils/date/verbalDate";

function getCardColorClass(status: string | undefined): string {
  if (status?.toLowerCase() === "tournament_cancelled" || status?.toLowerCase() === "cancelled") {
    return "bg-red-50 hover:bg-red-100 border-red-200";
  }
  return "bg-white hover:bg-gray-50 border-gray-200";
}

interface TournamentCardProps {
  tournament: Tournament;
  /**
   * Route cible optionnelle. Si non fournie, on utilise la page publique du tournoi.
   */
  to?: string;
}

const TournamentCard: React.FC<TournamentCardProps> = ({ tournament, to }) => {
  const playersCount = tournament.players?.length ?? 0;
  const maxPlayers = tournament.max_players;
  const statusLabel = TOURNAMENT_STATUS(tournament.status as string);
  const cardColorClass = getCardColorClass(tournament.status as string);
  const target = to ?? URL_FRONT_TOURNAMENT(tournament.id);

  return (
    <Link
      to={target}
      className={`block border border-gray-200 p-4 rounded-lg ${cardColorClass} hover:shadow transition-all`}
    >
      <h2 className="text-lg font-semibold text-gray-900 mb-2">{tournament.name}</h2>
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
        <span className="font-medium">
          {statusLabel}
        </span>
        <span>
          {playersCount}
          {maxPlayers != null ? ` / ${maxPlayers}` : ""} joueurs
        </span>
        {tournament.number_of_rounds != null && <span>{tournament.number_of_rounds} rondes</span>}
        {tournament.event_date && <span>{verbalDate(tournament.event_date)}</span>}
        {tournament.location && <span>{tournament.location}</span>}
        {tournament.is_online !== undefined && (
          <span>{tournament.is_online ? "En ligne" : "Sur place"}</span>
        )}
      </div>
    </Link>
  );
};

export default TournamentCard;
