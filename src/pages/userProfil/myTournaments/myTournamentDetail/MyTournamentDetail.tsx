import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import UserProfileLayoutTitle from "@/components/generic/UserProfileLayoutTitle";
import UserProfilLayout from "../../layout";
import type { RootState } from "@/types";
import {
    getMyTournamentDetail,
    getTournamentStandings,
    dropFromTournament,
    reportMatchResult,
    type MyTournamentDetail as MyTournamentDetailType,
    type MyTournamentRound,
    type TournamentStanding,
} from "@/services/tournament";
import { TOURNAMENT_STATUS } from "@/utils/trad/tournamentStatus";
import NoItemMessage from "@/components/generic/NoItemMessage";
import {
    MatchMakingCard,
} from "@/components/pages/userProfil/myTournaments/MatchMakingCard";
import type { MatchScoreProps } from "@/types/match";

const MyTournamentDetail: React.FC = () => {
    const { tournamentId } = useParams<{ tournamentId: string }>();
    const [tournament, setTournament] = useState<MyTournamentDetailType | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [myStanding, setMyStanding] = useState<TournamentStanding | null>(null);
    const [isDropping, setIsDropping] = useState(false);

    const user = useSelector((state: RootState) => state.user);
    
    const maxWinningDuelPerPlayer = tournament ? Math.ceil(tournament.matches_per_round / 2) : 1;
    const isTournamentPhase = tournament?.status?.includes("tournament") ?? false;
    const isTournamentInProgress = tournament?.status === "tournament_in_progress";
    const haveCompletedAllMatches = tournament?.rounds.every((round) => {
        return round.match?.status === "completed"
    });

    const loadTournament = useCallback(async () => {
        if (!tournamentId || !user.token) return;
        setIsLoading(true);
        setError(null);
        try {
            const data = await getMyTournamentDetail(tournamentId, user.token);
            setTournament(data);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Impossible de charger les détails du tournoi.");
        } finally {
            setIsLoading(false);
        }
    }, [tournamentId, user.token]);

    const handleSubmitScore = async (matchId: number, playersScore: MatchScoreProps) => {
        try {
            if (!user.token) return;
            await reportMatchResult(matchId, playersScore, user.token);
            await loadTournament();
        } catch {
        }

    }

    const handleDrop = async () => {
        if (!tournamentId || !user.token) return;
        setIsDropping(true);
        try {
            await dropFromTournament(tournamentId, user.token);
            await loadTournament();
        } catch {
            // erreurs toastées dans le service
        } finally {
            setIsDropping(false);
        }
    }

    useEffect(() => {
        loadTournament();
    }, [loadTournament]);

    useEffect(() => {
        if (!tournamentId || !tournament?.status?.includes("finished")) {
            setMyStanding(null);
            return;
        }
        let cancelled = false;
        getTournamentStandings(tournamentId)
            .then((standings) => {
                if (cancelled || user.id == null) return;
                const mine = standings.find(
                    (s) => String(s.user_id) === String(user.id)
                );
                if (!cancelled) setMyStanding(mine ?? null);
            })
            .catch(() => {
                if (!cancelled) setMyStanding(null);
            });
        return () => {
            cancelled = true;
        };
    }, [tournamentId, tournament?.status, user.id]);

    return (
        <UserProfilLayout>
            <div className="bg-white rounded-lg sh p-4 mb-2">
                <UserProfileLayoutTitle title={`Détails: ${tournament?.name ?? ""}`} returnButton={true} />

                {isLoading && (
                    <p className="text-gray-500 mb-3">Chargement des informations du tournoi…</p>
                )}

                {error && (
                    <p className="text-red-600 mb-3" role="alert">
                        {error}
                    </p>
                )}

                {!isLoading && !tournament && !error && (
                    <NoItemMessage message="Aucun tournoi trouvé." />
                )}

                {tournament && (
                    <div className="space-y-4 flex flex-col ITEM">
                        <section className="p-2 bg-gray-100 rounded-md">
                            <div className="text-gray-700 space-y-1">
                                <p>
                                    <span className="font-semibold">Statut :</span> {TOURNAMENT_STATUS(tournament.status)}
                                </p>
                                <p>
                                    <span className="font-semibold">Date de début :</span>{" "}
                                    {new Date(tournament.event_date).toLocaleString("fr-FR")}
                                </p>
                                <p>
                                    <span className="font-semibold">Nombre de rondes :</span> {tournament.number_of_rounds}
                                </p>
                            </div>
                        </section>

                        {isTournamentInProgress && !tournament.tournament_player.dropped && (
                            <section className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={handleDrop}
                                    disabled={!haveCompletedAllMatches || !tournament.tournament_player.dropped}
                                    className="cursor-pointer mt-2 inline-block w-fit items-center px-3 py-1.5 rounded bg-red-600 text-white text-sm hover:bg-red-700 disabled:opacity-60"
                                >
                                    {isDropping ? "Abandon en cours…" : "Drop du tournoi"}
                                </button>
                            </section>
                        )}


                        {!isTournamentPhase && (
                            <NoItemMessage message="Ce tournoi n'a pas encore commencé, merci de patienter." />
                        )}

                        {tournament?.status?.includes("finished") && myStanding != null && (
                            <section className="p-2 bg-gray-100 rounded-md">
                                <p className="font-semibold text-green-700">
                                    Vous avez fini {myStanding.rank}{myStanding.rank === 1 ? "er" : "e"}
                                </p>
                            </section>
                        )}

                        {isTournamentPhase && (
                            <section className="p-2 bg-gray-100 rounded-md space-y-4">
                                <h2 className="text-lg font-bold">Mes matchmakings</h2>
                                {tournament.rounds.length === 0 ? (
                                    <NoItemMessage message="Aucune ronde n'a encore été générée pour ce tournoi." />
                                ) : (
                                    <div className="space-y-4">
                                        {tournament.tournament_player.dropped && (
                                            <p className="text-base font-bold text-red-600">Vous avez abandonné le tournoi</p>
                                        )}
                                        {tournament.rounds
                                            .sort((a, b) => b.round_number - a.round_number)
                                            .map((round: MyTournamentRound) => {
                                                if (round.match !== null) {
                                                    return (
                                                        < MatchMakingCard
                                                            key={round.id}
                                                            round={round}
                                                            maxWinningDuelPerPlayer={maxWinningDuelPerPlayer}
                                                            onSubmitScore={handleSubmitScore}
                                                        />
                                                    )
                                                }
                                            }
                                            )
                                        }
                                    </div>
                                )}
                            </section>
                        )}
                    </div>
                )}
            </div>
        </UserProfilLayout>
    );
};

export default MyTournamentDetail;
