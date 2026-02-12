import React, { useCallback, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import UserBasicLayout from "../layout";
import { getTournamentById, getTournamentStandings, registerToTournament, unregisterFromTournament, type TournamentStanding } from "../../../services/tournament";
import type { Tournament, TournamentPlayer } from "../../../types";
import type { RootState } from "../../../redux/store";
import { URL_FRONT_TOURNAMENTS } from "../../../constant/urlsFront";
import { TournamentDetailsMatchMaking } from "@/components/pages/user/tournaments/TournamentDetailsMatchMaking";
import TournamentDetailsPlayers from "../../../components/pages/user/tournaments/TournamentDetailsPlayers";
import TournamentDetailsMainInfo from "../../../components/pages/user/tournaments/TournamentDetailsMainInfo";
import { TournamentDetailsStanding } from "@/components/pages/user/tournaments/TournamentDetailsStanding";

const TournamentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const user = useSelector((state: RootState) => state.user);
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [registerSuccessMessage, setRegisterSuccessMessage] = useState<string | null>(null);
  const [registerErrorMessage, setRegisterErrorMessage] = useState<string | null>(null);
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
      setError("Tournoi introuvable.");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  const loadStandings = useCallback(async () => {
    if (!id) return;
    setIsLoadingStandings(true);
    setStandingsError(null);
    try {
      const data = await getTournamentStandings(id);
      setStandings(data);
    } catch (err) {
      setStandingsError(err instanceof Error ? err.message : "Impossible de charger le classement final.");
    } finally {
      setIsLoadingStandings(false);
    }
  }, [id]);

  const handleRegister = async () => {
    if (!id || !user.token) return;
    setRegisterErrorMessage(null);
    setRegisterSuccessMessage(null);
    setIsRegistering(true);
    try {
      await registerToTournament(id, user.token);
      setRegisterSuccessMessage("Inscription enregistrée.");
      await loadTournament();
    } catch (err) {
      setRegisterErrorMessage(err instanceof Error ? err.message : "Inscription impossible.");
    } finally {
      setIsRegistering(false);
    }
  }

  const handleUnregister = async () => {
    if (!id || !user.token) return;
    setUnregisterErrorMessage(null);
    setIsUnregistering(true);
    try {
      await unregisterFromTournament(id, user.token);
      await loadTournament();
    } catch (err) {
      setUnregisterErrorMessage(err instanceof Error ? err.message : "Désinscription impossible.");
    } finally {
      setIsUnregistering(false);
    }
  }


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
      <UserBasicLayout mainTitle="Tournoi" subTitle="">
        <div className="px-4 py-6 max-w-4xl mx-auto">
          <p className="text-gray-600">Identifiant de tournoi manquant.</p>
          <Link to={URL_FRONT_TOURNAMENTS} className="text-blue-600 hover:underline mt-2 inline-block">
            Retour à la liste des tournois
          </Link>
        </div>
      </UserBasicLayout>
    );
  }

  if (isLoading) {
    return (
      <UserBasicLayout mainTitle="Tournoi" subTitle="">
        <div className="px-4 py-6 max-w-4xl mx-auto text-center text-gray-500">
          Chargement du tournoi…
        </div>
      </UserBasicLayout>
    );
  }

  if (error || !tournament) {
    return (
      <UserBasicLayout mainTitle="Tournoi" subTitle="">
        <div className="px-4 py-6 max-w-4xl mx-auto">
          <p className="text-red-600" role="alert">{error ?? "Tournoi introuvable."}</p>
          <Link to={URL_FRONT_TOURNAMENTS} className="text-blue-600 hover:underline mt-2 inline-block">
            Retour à la liste des tournois
          </Link>
        </div>
      </UserBasicLayout>
    );
  }

  return (
    <UserBasicLayout
      mainTitle={tournament.name}
      subTitle="Détail du tournoi"
    >
      <div className="px-4 py-6 max-w-4xl mx-auto">
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
          <>
            {isLoadingStandings && (
              <p className="mt-4 text-gray-500 text-sm">
                Chargement du classement final…
              </p>
            )}
            {standingsError && (
              <p className="mt-4 text-red-600 text-sm" role="alert">
                {standingsError}
              </p>
            )}
            {standings && standings.length > 0 && (
              <TournamentDetailsStanding standings={standings} />
            )}
          </>
        )}

        {
          !tournament.status.includes("tournament_finished") && (
            <TournamentDetailsPlayers
              players={tournament.players ?? [] as TournamentPlayer[]}
            />)
        }

        {
          !tournament.status.includes("registration") && (
            <TournamentDetailsMatchMaking
              tournamentId={Number(id)}
            />)
        }

      </div>
    </UserBasicLayout>
  );
};

export default TournamentDetailPage;
