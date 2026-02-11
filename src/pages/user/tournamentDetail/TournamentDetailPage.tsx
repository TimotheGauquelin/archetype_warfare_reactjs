import React, { useCallback, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import UserBasicLayout from "../layout";
import { getTournamentById, registerToTournament, unregisterFromTournament } from "../../../services/tournament";
import type { Tournament, TournamentPlayer } from "../../../types";
import type { RootState } from "../../../redux/store";
import { URL_FRONT_TOURNAMENTS } from "../../../constant/urlsFront";
import { TournamentDetailsMatchMaking } from "@/components/pages/user/tournaments/TournamentDetailsMatchMaking";
import TournamentDetailsPlayers from "../../../components/pages/user/tournaments/TournamentDetailsPlayers";
import TournamentDetailsMainInfo from "../../../components/pages/user/tournaments/TournamentDetailsMainInfo";

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

  const handleRegister = useCallback(async () => {
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
  }, [id, user.token, loadTournament]);

  const handleUnregister = useCallback(async () => {
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
  }, [id, user.token, loadTournament]);


  useEffect(() => {
    loadTournament();
  }, [loadTournament]);

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
        <TournamentDetailsPlayers
          players={tournament.players ?? [] as TournamentPlayer[]}
        />

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
