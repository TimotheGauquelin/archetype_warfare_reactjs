import React from "react";
import { Link } from "react-router-dom";
import Button from "../../../generic/buttons/classicButton/Button";
import type { Tournament, TournamentPlayer } from "../../../../types";
import { URL_FRONT_LOGIN, URL_FRONT_TOURNAMENTS } from "../../../../constant/urlsFront";
import { TOURNAMENT_STATUS } from "@/utils/trad/tournamentStatus";
import { verbalDate } from "@/utils/date/verbalDate";
import { deadlineWindow } from "@/utils/functions/deadlineWindow/deadlineWindow";

function getMatchTypeLabel(matchType: number | undefined): string {
  if (matchType === 3) return "Best of 3";
  if (matchType === 5) return "Best of 5";
  return "Single match";
}

interface TournamentDetailProps {
  tournament: Tournament;
  isLoggedIn: boolean;
  currentUserId: number | null;
  onRegister: () => void;
  isRegistering: boolean;
  registerSuccessMessage: string | null;
  registerErrorMessage: string | null;
  onUnregister: () => void;
  isUnregistering: boolean;
  unregisterErrorMessage: string | null;
}

const TournamentDetailsMainInfo: React.FC<TournamentDetailProps> = ({
  tournament,
  isLoggedIn,
  currentUserId,
  onRegister,
  isRegistering,
  registerSuccessMessage,
  registerErrorMessage,
  onUnregister,
  isUnregistering,
  unregisterErrorMessage,
}) => {

  const REGISTRATION_DEADLINE_HOURS = 48;
  const players = tournament.players ?? [];
  const withinWindow = deadlineWindow(tournament.event_date, REGISTRATION_DEADLINE_HOURS);
  const isRegistered = players.some((player: TournamentPlayer) => (player.user_id ?? (player.user as { id?: number | string })?.id) === currentUserId);

  const canRegisterToTournament =
    isLoggedIn &&
    tournament.status === "registration_open" &&
    !isRegistered &&
    (tournament.max_players == null || players.length < tournament.max_players) &&
    withinWindow;

  const canUnregisterToTournament = isLoggedIn && isRegistered && withinWindow && tournament.status === "registration_open";
  const showRegistrationClosedMessage =
    isLoggedIn &&
    tournament.status === "registration_open" &&
    !withinWindow &&
    !isRegistered;
  const showUnregisterClosedMessage = isLoggedIn && isRegistered && !withinWindow;

  return (
    <div className="space-y-6">
      <div>
        <div className="flex flex-row justify-between items-center">
          <span className="text-2xl font-bold text-gray-900">{tournament.name}</span>
          <Link
            to={URL_FRONT_TOURNAMENTS}
            className="text-blue-600 hover:underline mb-4 inline-block"
          >
            ← Retour à la liste des tournois
          </Link>
        </div>
        <p className="text-gray-600 mt-1">{TOURNAMENT_STATUS(tournament.status)}</p>
      </div>

      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
        <div>
          <dt className="text-gray-500">Joueurs inscrits</dt>
          <dd className="font-medium">
            {players.length}
            {tournament.max_players != null ? ` / ${tournament.max_players}` : ""}
          </dd>
        </div>
        {tournament.location != null && (
          <div>
            <dt className="text-gray-500">Lieu</dt>
            <dd className="font-medium">{tournament.location}</dd>
          </div>
        )}
        {tournament.event_date != null && (
          <div>
            <dt className="text-gray-500">Début</dt>
            <dd className="font-medium">{verbalDate(tournament.event_date, true)}</dd>
          </div>
        )}
        {tournament.event_date_end != null && (
          <div>
            <dt className="text-gray-500">Fin</dt>
            <dd className="font-medium">{verbalDate(tournament.event_date_end, true)}</dd>
          </div>
        )}
        {tournament.is_online !== undefined && (
          <div>
            <dt className="text-gray-500">Type</dt>
            <dd className="font-medium">{tournament.is_online ? "En ligne" : "Sur place"}</dd>
          </div>
        )}
        {tournament.rounds != null && (
          <div>
            <dt className="text-gray-500">Rondes</dt>
            <dd className="font-medium">{tournament.number_of_rounds}</dd>
          </div>
        )}
        <div>
          <dt className="text-gray-500">Type de match</dt>
          <dd className="font-medium">{getMatchTypeLabel(tournament.matches_per_round)}</dd>
        </div>
      </dl>

      <div className="border-t border-b py-4 space-y-3">
        {!isLoggedIn && tournament.status === "registration_open" && (
          <p className="text-gray-600 mb-2">
            <Link to={URL_FRONT_LOGIN} className="text-blue-600 hover:underline">
              Connectez-vous
            </Link>
            {" "}pour vous inscrire au tournoi.
          </p>
        )}
        {showRegistrationClosedMessage && (
          <p className="text-amber-700 font-medium">Inscriptions closes 48 h avant le début.</p>
        )}
        {canRegisterToTournament && (
          <div>
            <Button
              buttonText={isRegistering ? "Inscription en cours…" : "S'inscrire au tournoi"}
              disabled={isRegistering}
              action={onRegister}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            />
            {registerErrorMessage && (
              <p className="mt-2 text-red-600 text-sm">{registerErrorMessage}</p>
            )}
            {registerSuccessMessage && (
              <p className="mt-2 text-green-600 text-sm">{registerSuccessMessage}</p>
            )}
          </div>
        )}
        {showUnregisterClosedMessage && (
          <p className="text-amber-700 font-medium">Désinscription impossible 48 h avant le début.</p>
        )}
        {canUnregisterToTournament && (
          <div>
            <Button
              buttonText={isUnregistering ? "Désinscription en cours…" : "Se désinscrire"}
              disabled={isUnregistering}
              action={onUnregister}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            />
            {unregisterErrorMessage && (
              <p className="mt-2 text-red-600 text-sm">{unregisterErrorMessage}</p>
            )}
          </div>
        )}
        {isLoggedIn && tournament.status === "registration_open" && isRegistered && withinWindow && (
          <p className="text-green-600 font-medium">Vous êtes inscrit à ce tournoi.</p>
        )}
        {isLoggedIn && tournament.status === "registration_open" && !isRegistered && tournament.max_players != null && players.length >= tournament.max_players && (
          <p className="text-gray-600">Les inscriptions sont complètes.</p>
        )}
      </div>
    </div>
  );
};

export default TournamentDetailsMainInfo;
