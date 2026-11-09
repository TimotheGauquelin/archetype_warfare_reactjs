import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Button from "../../../generic/buttons/classicButton/Button";
import type { Tournament, TournamentPlayer } from "../../../../types";
import { URL_FRONT_LOGIN, URL_FRONT_TOURNAMENTS } from "../../../../constant/urlsFront";
import { TOURNAMENT_STATUS } from "@/utils/trad/tournamentStatus";
import { verbalDate } from "@/utils/date/verbalDate";
import { deadlineWindow } from "@/utils/functions/deadlineWindow/deadlineWindow";
import { getWinsNeeded } from "@/utils/tournament/bestOfScore";
import TournamentLocationMap from "@/components/pages/user/tournaments/TournamentLocationMap";
import { renderFormattedText } from "@/utils/quiz/renderFormattedText";

function getStatusBadgeClass(status: string | undefined): string {
  switch (status) {
    case "tournament_finished":
      return "bg-blue-500 text-white";
    case "registration_open":
      return "bg-green-500 text-white";
    case "registration_closed":
      return "bg-red-500 text-white";
    case "tournament_beginning":
    case "tournament_is_beginning":
    case "tournament_in_progress":
      return "bg-orange-500 text-white";
    case "tournament_cancelled":
    case "tournament_did_not_happen":
      return "bg-red-500 text-white";
    default:
      return "bg-slate-500 text-white";
  }
}

interface TournamentDetailProps {
  tournament: Tournament;
  isLoggedIn: boolean;
  currentUserId: string | null;
  onRegister: () => void;
  isRegistering: boolean;
  registerSuccessMessage: string | null;
  registerErrorMessage: React.ReactNode | null;
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
  const { t } = useTranslation();
  const registrationCloseHours =
    Number(tournament.registration_close_hours_before) > 0
      ? Number(tournament.registration_close_hours_before)
      : 48;
  const players = tournament.players ?? [];
  const withinWindow = deadlineWindow(
    tournament.event_date,
    registrationCloseHours
  );
  const isRegistered = players.some(
    (player: TournamentPlayer) =>
      (player.user_id ?? (player.user as { id?: string })?.id) === currentUserId
  );

  const canRegisterToTournament =
    isLoggedIn &&
    tournament.status === "registration_open" &&
    !isRegistered &&
    (tournament.max_players == null || players.length < tournament.max_players) &&
    withinWindow;

  const canUnregisterToTournament =
    isLoggedIn &&
    isRegistered &&
    withinWindow &&
    tournament.status === "registration_open";
  const showRegistrationClosedMessage =
    isLoggedIn &&
    tournament.status === "registration_open" &&
    !withinWindow &&
    !isRegistered;
  const showUnregisterClosedMessage =
    isLoggedIn && isRegistered && !withinWindow;

  const hasDates =
    tournament.event_date != null || tournament.event_date_end != null;

  const getMatchTypeLabel = (matchType: number | undefined): string => {
    if (matchType === 3) return t("tournamentDetail.matchTypeBo3");
    if (matchType === 5) return t("tournamentDetail.matchTypeBo5");
    return t("tournamentDetail.matchTypeSingle");
  };

  const getResolutionModeDescription = (
    mode: string | undefined,
    matchesPerRound: number | undefined
  ): string => {
    const winsNeeded = getWinsNeeded(matchesPerRound ?? 1);
    const matchLabel = getMatchTypeLabel(matchesPerRound);

    if (mode === "highest_score") {
      return t("tournamentDetail.resolutionHighestScore");
    }

    return t("tournamentDetail.resolutionStrictWins", {
      count: winsNeeded,
      matchType: matchLabel,
    });
  };

  const infoFields = (
    <>
      <div>
        <dt className="text-gray-500">{t("tournamentDetail.registeredPlayers")}</dt>
        <dd className="font-medium text-gray-900">
          {players.length}
          {tournament.max_players != null ? ` / ${tournament.max_players}` : ""}
        </dd>
      </div>
      <div>
        <dt className="text-gray-500">{t("tournamentDetail.location")}</dt>
        <dd className="font-medium text-gray-900">
          {tournament.location?.trim()
            ? tournament.location
            : t("tournamentDetail.online")}
        </dd>
      </div>
      {hasDates && (
        <div className={tournament.location?.trim() ? undefined : "col-span-2"}>
          <dt className="text-gray-500">{t("tournamentDetail.dates")}</dt>
          <dd className="font-medium text-gray-900 flex flex-wrap items-center gap-x-2 gap-y-1">
            {tournament.event_date != null && (
              <span>
                <span className="text-gray-500 font-normal">
                  {t("tournamentDetail.start")}{" "}
                </span>
                {verbalDate(tournament.event_date, true)}
              </span>
            )}
            {tournament.event_date != null && tournament.event_date_end != null && (
              <span className="text-gray-400" aria-hidden>
                —
              </span>
            )}
            {tournament.event_date_end != null && (
              <span>
                <span className="text-gray-500 font-normal">
                  {t("tournamentDetail.end")}{" "}
                </span>
                {verbalDate(tournament.event_date_end, true)}
              </span>
            )}
          </dd>
        </div>
      )}
      {tournament.max_number_of_rounds != null && (
        <div>
          <dt className="text-gray-500">{t("tournamentDetail.roundsCount")}</dt>
          <dd className="font-medium text-gray-900">
            {tournament.max_number_of_rounds}
          </dd>
        </div>
      )}
      <div>
        <dt className="text-gray-500">{t("tournamentDetail.matchType")}</dt>
        <dd className="font-medium text-gray-900">
          {getMatchTypeLabel(tournament.matches_per_round)}
        </dd>
      </div>
      <div className={tournament.location?.trim() ? undefined : "col-span-2"}>
        <dt className="text-gray-500">{t("tournamentDetail.resolution")}</dt>
        <dd className="font-medium text-gray-900">
          {getResolutionModeDescription(
            tournament.match_resolution_mode,
            tournament.matches_per_round
          )}
        </dd>
      </div>
      <div>
        <dt className="text-gray-500">{t("tournamentDetail.requireDeckList")}</dt>
        <dd className="font-medium text-gray-900">
          {tournament.require_deck_list ? t("common.yes") : t("common.no")}
        </dd>
      </div>
    </>
  );

  return (
    <section className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            {t("tournamentDetail.generalInfo")}
          </h2>
        </div>
        <Link
          to={URL_FRONT_TOURNAMENTS}
          className="text-sm text-blue-600 hover:underline"
        >
          ← {t("tournamentDetail.backToList")}
        </Link>
      </div>

      <p>
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold ${getStatusBadgeClass(
            tournament.status as string
          )}`}
        >
          {TOURNAMENT_STATUS(tournament.status as string)}
        </span>
      </p>

      {typeof tournament.description === "string" &&
        tournament.description.trim() && (
          <div className="text-sm text-gray-800 bg-slate-50 border border-slate-200 rounded-lg p-3">
            <p className="text-gray-500 mb-1 font-medium">
              {t("tournamentDetail.description")}
            </p>
            <div className="leading-relaxed">
              {renderFormattedText(tournament.description.trim())}
            </div>
          </div>
        )}

      {tournament.location?.trim() ? (
        <div className="grid grid-cols-1 sscreen:grid-cols-2 gap-4 sscreen:gap-6 items-start">
          <dl className="space-y-3 text-sm">{infoFields}</dl>
          <TournamentLocationMap location={tournament.location} />
        </div>
      ) : (
        <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">{infoFields}</dl>
      )}

      <div className="border-t border-gray-200 pt-4 space-y-3">
        {!isLoggedIn && tournament.status === "registration_open" && (
          <p className="text-sm text-gray-600">
            <Link to={URL_FRONT_LOGIN} className="text-blue-600 hover:underline">
              {t("tournamentDetail.loginLink")}
            </Link>{" "}
            {t("tournamentDetail.loginToRegister")}
          </p>
        )}
        {showRegistrationClosedMessage && (
          <p className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded px-3 py-2">
            {t("tournamentDetail.registrationClosedHours", {
              hours: registrationCloseHours,
            })}
          </p>
        )}
        {canRegisterToTournament && (
          <div>
            <Button
              buttonText={
                isRegistering
                  ? t("tournamentDetail.registering")
                  : t("tournamentDetail.register")
              }
              disabled={isRegistering}
              action={onRegister}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-semibold"
            />
            {registerErrorMessage && (
              <p className="mt-2 text-red-600 text-sm">{registerErrorMessage}</p>
            )}
            {registerSuccessMessage && (
              <p className="mt-2 text-green-600 text-sm">
                {registerSuccessMessage}
              </p>
            )}
          </div>
        )}
        {showUnregisterClosedMessage &&
          !tournament.status.includes("tournament") && (
            <p className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded px-3 py-2">
              {t("tournamentDetail.unregisterClosedHours", {
                hours: registrationCloseHours,
              })}
            </p>
          )}
        {canUnregisterToTournament && (
          <div>
            <Button
              buttonText={
                isUnregistering
                  ? t("tournamentDetail.unregistering")
                  : t("tournamentDetail.unregister")
              }
              disabled={isUnregistering}
              action={onUnregister}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 font-semibold"
            />
            {unregisterErrorMessage && (
              <p className="mt-2 text-red-600 text-sm">
                {unregisterErrorMessage}
              </p>
            )}
          </div>
        )}
        {isLoggedIn &&
          tournament.status === "registration_open" &&
          isRegistered &&
          withinWindow && (
            <p className="text-sm text-green-700 font-medium">
              {t("tournamentDetail.alreadyRegistered")}
            </p>
          )}
        {isLoggedIn &&
          tournament.status === "registration_open" &&
          !isRegistered &&
          tournament.max_players != null &&
          players.length >= tournament.max_players && (
            <p className="text-sm text-gray-600">
              {t("tournamentDetail.registrationFull")}
            </p>
          )}
      </div>
    </section>
  );
};

export default TournamentDetailsMainInfo;
