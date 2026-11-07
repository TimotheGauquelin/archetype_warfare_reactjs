import React, { useCallback, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import UserBasicLayout from "../layout";
import { getOverlappingTournament, getTournamentById, getTournamentStandings, registerToTournament, unregisterFromTournament, type TournamentStanding } from "../../../services/tournament";
import type { Tournament, TournamentPlayer } from "../../../types";
import type { RootState } from "../../../redux/store";
import { URL_FRONT_TOURNAMENT, URL_FRONT_TOURNAMENTS } from "../../../constant/urlsFront";
import { AppError } from "../../../utils/errorHandler";
import { TournamentDetailsMatchMaking } from "@/components/pages/user/tournaments/TournamentDetailsMatchMaking";
import TournamentDetailsPlayers from "../../../components/pages/user/tournaments/TournamentDetailsPlayers";
import TournamentDetailsMainInfo from "../../../components/pages/user/tournaments/TournamentDetailsMainInfo";
import { TournamentDetailsStanding } from "@/components/pages/user/tournaments/TournamentDetailsStanding";

const TournamentDetailPage: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const user = useSelector((state: RootState) => state.user);
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [registerSuccessMessage, setRegisterSuccessMessage] = useState<string | null>(null);
  const [registerErrorMessage, setRegisterErrorMessage] = useState<React.ReactNode | null>(null);
  const [isUnregistering, setIsUnregistering] = useState(false);
  const [unregisterErrorMessage, setUnregisterErrorMessage] = useState<string | null>(null);
  const [standings, setStandings] = useState<TournamentStanding[] | null>(null);
  const [isLoadingStandings, setIsLoadingStandings] = useState(false);
  const [standingsError, setStandingsError] = useState<string | null>(null);

  const loadTournament = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await getTournamentById(id);
      setTournament(data);
    } catch {
      setError(t("tournamentDetail.notFound"));
    } finally {
      setIsLoading(false);
    }
  }, [id, t]);

  const loadStandings = useCallback(async () => {
    if (!id) return;
    setIsLoadingStandings(true);
    setStandingsError(null);
    try {
      const data = await getTournamentStandings(id);
      setStandings(data);
    } catch (err) {
      setStandingsError(
        err instanceof Error ? err.message : t("tournamentDetail.standingsError")
      );
    } finally {
      setIsLoadingStandings(false);
    }
  }, [id, t]);

  const handleRegister = async () => {
    if (!id || !user.token) return;
    setRegisterErrorMessage(null);
    setRegisterSuccessMessage(null);
    setIsRegistering(true);
    try {
      await registerToTournament(id, user.token);
      setRegisterSuccessMessage(t("tournamentDetail.registerSuccess"));
      await loadTournament();
    } catch (err) {
      const overlapping = getOverlappingTournament(err);
      if (overlapping) {
        setRegisterErrorMessage(
          <>
            {t("tournamentDetail.overlapWarningBefore")}{" "}
            <Link
              to={URL_FRONT_TOURNAMENT(overlapping.id)}
              className="underline font-semibold text-red-700 hover:text-red-800"
            >
              {overlapping.name}
            </Link>
            {t("tournamentDetail.overlapWarningAfter")}
          </>
        );
      } else {
        setRegisterErrorMessage(
          err instanceof AppError || err instanceof Error
            ? err.message
            : t("tournamentDetail.registerError")
        );
      }
    } finally {
      setIsRegistering(false);
    }
  };

  const handleUnregister = async () => {
    if (!id || !user.token) return;
    setUnregisterErrorMessage(null);
    setIsUnregistering(true);
    try {
      await unregisterFromTournament(id, user.token);
      await loadTournament();
    } catch (err) {
      setUnregisterErrorMessage(
        err instanceof Error ? err.message : t("tournamentDetail.unregisterError")
      );
    } finally {
      setIsUnregistering(false);
    }
  };

  useEffect(() => {
    loadTournament();
  }, [loadTournament]);

  useEffect(() => {
    if (!tournament) return;
    if (!tournament.status || !tournament.status.toString().includes("finished")) return;
    if (standings && standings.length > 0) return;
    void loadStandings();
  }, [tournament, standings, loadStandings]);

  if (!id) {
    return (
      <UserBasicLayout mainTitle={t("tournamentDetail.pageTitle")} subTitle="">
        <div className="px-4 py-6 max-w-4xl mx-auto">
          <p className="text-gray-600">{t("tournamentDetail.missingId")}</p>
          <Link to={URL_FRONT_TOURNAMENTS} className="text-blue-600 hover:underline mt-2 inline-block">
            {t("tournamentDetail.backToList")}
          </Link>
        </div>
      </UserBasicLayout>
    );
  }

  if (isLoading) {
    return (
      <UserBasicLayout mainTitle={t("tournamentDetail.pageTitle")} subTitle="">
        <div className="px-4 py-6 max-w-4xl mx-auto text-center text-gray-500">
          {t("tournamentDetail.loading")}
        </div>
      </UserBasicLayout>
    );
  }

  if (error || !tournament) {
    return (
      <UserBasicLayout mainTitle={t("tournamentDetail.pageTitle")} subTitle="">
        <div className="px-4 py-6 max-w-4xl mx-auto">
          <p className="text-red-600" role="alert">
            {error ?? t("tournamentDetail.notFound")}
          </p>
          <Link to={URL_FRONT_TOURNAMENTS} className="text-blue-600 hover:underline mt-2 inline-block">
            {t("tournamentDetail.backToList")}
          </Link>
        </div>
      </UserBasicLayout>
    );
  }

  return (
    <UserBasicLayout
      mainTitle={tournament.name}
      subTitle={t("tournamentDetail.pageSubtitle")}
    >
      <div className="px-4 py-6 max-w-4xl mx-auto space-y-6">
        <TournamentDetailsMainInfo
          tournament={tournament}
          isLoggedIn={user.isAuthenticated}
          currentUserId={user.id}
          onRegister={handleRegister}
          isRegistering={isRegistering}
          registerSuccessMessage={registerSuccessMessage}
          registerErrorMessage={registerErrorMessage}
          onUnregister={handleUnregister}
          isUnregistering={isUnregistering}
          unregisterErrorMessage={unregisterErrorMessage}
        />

        {tournament.status.includes("finished") && (
          <section className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm space-y-3">
            <h2 className="text-xl font-semibold text-gray-900">
              {t("tournamentDetail.finalStandings")}
            </h2>
            {isLoadingStandings && (
              <p className="text-gray-500 text-sm">
                {t("tournamentDetail.standingsLoading")}
              </p>
            )}
            {standingsError && (
              <p className="text-red-600 text-sm" role="alert">
                {standingsError}
              </p>
            )}
            {standings && standings.length > 0 && (
              <TournamentDetailsStanding
                standings={standings}
                matchResolutionMode={
                  tournament.match_resolution_mode ?? "strict_wins"
                }
              />
            )}
          </section>
        )}

        {!tournament.status.includes("tournament_finished") && (
          <TournamentDetailsPlayers
            players={(tournament.players ?? []) as TournamentPlayer[]}
          />
        )}

        {!tournament.status.includes("registration") && (
          <TournamentDetailsMatchMaking tournamentId={id} />
        )}
      </div>
    </UserBasicLayout>
  );
};

export default TournamentDetailPage;
