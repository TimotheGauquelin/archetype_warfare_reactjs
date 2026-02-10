import React from "react";
import { Link } from "react-router-dom";
import Button from "../../../generic/buttons/classicButton/Button";
import type { Tournament, TournamentPlayer } from "../../../../types";
import { URL_FRONT_LOGIN, URL_FRONT_TOURNAMENTS } from "../../../../constant/urlsFront";
import { TOURNAMENT_STATUS } from "@/utils/trad/tournament_status";

const STATUS_LABELS: Record<string, string> = {
  registration_open: "Inscriptions ouvertes",
  in_progress: "En cours",
  finished: "Terminé",
  cancelled: "Annulé",
};

function formatDateTime(value: string | undefined): string {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const REGISTRATION_DEADLINE_HOURS = 48;

/** Inscription/désinscription autorisée seulement si on est à plus de 48 h du début (event_date). */
function isWithinRegistrationWindow(eventDate: string | undefined): boolean {
  if (!eventDate) return true;
  const start = new Date(eventDate).getTime();
  const deadline = start - REGISTRATION_DEADLINE_HOURS * 60 * 60 * 1000;
  return Date.now() < deadline;
}

function getMatchTypeLabel(matchType: number | undefined): string {
  if (matchType === 3) return "Best of 3";
  return "1 match";
}

function getPlayerDisplayName(p: TournamentPlayer): string {
  const u = p.user;
  if (u?.username) return u.username;
  if (u?.email) return u.email;
  return "Joueur";
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

const TournamentDetail: React.FC<TournamentDetailProps> = ({
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
  const players = tournament.players ?? [];
  const maxPlayers = tournament.max_players;
  const statusLabel = STATUS_LABELS[tournament.status] ?? tournament.status;
  const withinWindow = isWithinRegistrationWindow(tournament.event_date);
  const isRegistered = players.some((p) => (p.user_id ?? (p.user as { id?: number })?.id) === currentUserId);

  const canRegister =
    isLoggedIn &&
    tournament.status === "registration_open" &&
    !isRegistered &&
    (maxPlayers == null || players.length < maxPlayers) &&
    withinWindow;

  const canUnregister = isLoggedIn && isRegistered && withinWindow;
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
            {maxPlayers != null ? ` / ${maxPlayers}` : ""}
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
            <dd className="font-medium">{formatDateTime(tournament.event_date)}</dd>
          </div>
        )}
        {tournament.event_date_end != null && (
          <div>
            <dt className="text-gray-500">Fin</dt>
            <dd className="font-medium">{formatDateTime(tournament.event_date_end)}</dd>
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
          <dd className="font-medium">{getMatchTypeLabel(tournament.match_type)}</dd>
        </div>
      </dl>

      {/* Inscription / Désinscription */}
      <div className="border-t pt-4 space-y-3">
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
        {canRegister && (
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
        {canUnregister && (
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
        {isLoggedIn && tournament.status === "registration_open" && !isRegistered && maxPlayers != null && players.length >= maxPlayers && (
          <p className="text-gray-600">Les inscriptions sont complètes.</p>
        )}
      </div>

      {/* Liste des joueurs */}
      <div className="border-t pt-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          Joueurs inscrits ({players.length})
        </h2>
        {players.length === 0 ? (
          <p className="text-gray-500">Aucun joueur inscrit pour le moment.</p>
        ) : (
          <ul className="list-none p-0 m-0 space-y-2">
            {players.map((p, index) => (
              <li
                key={p.id ?? (p.user as { id?: number })?.id ?? index}
                className="py-2 px-3 bg-gray-100 rounded"
              >
                {getPlayerDisplayName(p)}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default TournamentDetail;
