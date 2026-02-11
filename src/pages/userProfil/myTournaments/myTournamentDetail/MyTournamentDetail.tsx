import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import UserProfileLayoutTitle from "@/components/generic/UserProfileLayoutTitle";
import UserProfilLayout from "../../layout";
import type { RootState } from "@/types";
import {
    getMyTournamentDetail,
    reportMatchResult,
    type MyTournamentDetail as MyTournamentDetailType,
    type MyTournamentMatch,
    type MyTournamentRound,
} from "@/services/tournament";

interface MatchScoreForm {
    player1_games_won: string;
    player2_games_won: string;
}

type MatchScoreState = Record<number, MatchScoreForm>;

const MyTournamentDetail: React.FC = () => {
    const { tournamentId } = useParams<{ tournamentId: string }>();
    const user = useSelector((state: RootState) => state.user);

    const [tournament, setTournament] = useState<MyTournamentDetailType | null>(null);
    const [scores, setScores] = useState<MatchScoreState>({});
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!tournamentId || !user.token) {
            return;
        }

        const idAsNumber = Number(tournamentId);
        if (Number.isNaN(idAsNumber)) {
            setError("Identifiant de tournoi invalide.");
            return;
        }

        let isMounted = true;
        setIsLoading(true);
        setError(null);

        const load = async () => {
            try {
                const detail = await getMyTournamentDetail(idAsNumber, user.token as string);
                if (!isMounted) return;
                setTournament(detail);

                // Pré-remplir les scores pour la ronde actuelle (si présente)
                const initialScores: MatchScoreState = {};
                const currentRoundNumber = detail.current_round;
                if (currentRoundNumber != null) {
                    const current = detail.rounds.find((r) => r.round_number === currentRoundNumber);
                    if (current) {
                        current.matches.forEach((m) => {
                            initialScores[m.id] = {
                                player1_games_won: String(m.player1_games_won ?? 0),
                                player2_games_won: String(m.player2_games_won ?? 0),
                            };
                        });
                    }
                }
                setScores(initialScores);
            } catch (e: any) {
                if (!isMounted) return;
                setError(e?.message ?? "Impossible de charger les détails du tournoi.");
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        void load();

        return () => {
            isMounted = false;
        };
    }, [tournamentId, user.token]);

    const hasStarted = useMemo(() => {
        if (!tournament) return false;
        if (!tournament.rounds || tournament.rounds.length === 0) return false;
        return true;
    }, [tournament]);

    const currentRound: MyTournamentRound | undefined = useMemo(() => {
        if (!tournament || !tournament.rounds || tournament.rounds.length === 0) return undefined;
        if (tournament.current_round != null) {
            const found = tournament.rounds.find((r) => r.round_number === tournament.current_round);
            if (found) return found;
        }
        // fallback: dernière ronde
        return [...tournament.rounds].sort((a, b) => a.round_number - b.round_number)[
            tournament.rounds.length - 1
        ];
    }, [tournament]);

    const maxGamesPerPlayer = useMemo(() => {
        return tournament?.matches_per_round ?? 1;
    }, [tournament?.matches_per_round]);

    const isUserInMatch = (match: MyTournamentMatch): boolean => {
        const currentUserId = user.id;
        if (!currentUserId) return false;
        const expectedId = String(currentUserId);

        const p1UserId =
            match.player1?.user?.id != null
                ? String(match.player1.user.id)
                : match.player1?.user_id != null
                    ? String(match.player1.user_id)
                    : null;
        const p2UserId =
            match.player2?.user?.id != null
                ? String(match.player2.user.id)
                : match.player2?.user_id != null
                    ? String(match.player2.user_id)
                    : null;

        return p1UserId === expectedId || p2UserId === expectedId;
    };

    const handleScoreChange = (
        matchId: number,
        field: keyof MatchScoreForm,
        value: string
    ): void => {
        const num = Number(value);
        if (Number.isNaN(num)) {
            // On ignore les entrées non numériques
            return;
        }
        const clamped = Math.max(0, Math.min(num, maxGamesPerPlayer));
        const nextValue = String(clamped);

        setScores((prev) => ({
            ...prev,
            [matchId]: {
                player1_games_won: prev[matchId]?.player1_games_won ?? "0",
                player2_games_won: prev[matchId]?.player2_games_won ?? "0",
                [field]: nextValue,
            },
        }));
    };

    const handleSubmitScore = async (match: MyTournamentMatch): Promise<void> => {
        const form = scores[match.id];
        if (!form) return;

        if (!user.token) {
            setError("Vous devez être connecté pour enregistrer un score.");
            return;
        }

        const p1 = Number(form.player1_games_won);
        const p2 = Number(form.player2_games_won);

        if (Number.isNaN(p1) || Number.isNaN(p2)) {
            setError("Le score doit être un nombre valide.");
            return;
        }
        try {
            await reportMatchResult(
                match.id,
                {
                    player1_games_won: p1,
                    player2_games_won: p2
                },
                user.token as string
            );

            // Mise à jour locale optimiste
            setTournament((prev) => {
                if (!prev) return prev;
                return {
                    ...prev,
                    rounds: prev.rounds.map((round) => ({
                        ...round,
                        matches: round.matches.map((m) =>
                            m.id === match.id
                                ? {
                                    ...m,
                                    player1_games_won: p1,
                                    player2_games_won: p2,
                                    status: "completed",
                                }
                                : m
                        ),
                    })),
                };
            });
        } catch {
            // les erreurs sont déjà gérées/toastées dans le service
        }
    };

    return (
        <UserProfilLayout>
            <div className="bg-white rounded-lg sh p-4 mb-2">
                <UserProfileLayoutTitle title={`Détails: ${tournament?.name ?? ""}`} />

                {isLoading && (
                    <p className="text-gray-500  mb-3">Chargement des informations du tournoi…</p>
                )}

                {error && (
                    <p className="text-red-600  mb-3" role="alert">
                        {error}
                    </p>
                )}

                {!isLoading && !tournament && !error && (
                    <p className="text-gray-500 ">Aucun tournoi trouvé.</p>
                )}

                {tournament && (
                    <>
                        <section className="mb-6">
                            <div className=" text-gray-700 space-y-1">
                                <p>
                                    <span className="font-medium">Statut :</span> {tournament.status}
                                </p>
                                <p>
                                    <span className="font-medium">Lieu :</span> {tournament.location}
                                </p>
                                <p>
                                    <span className="font-medium">Date de début :</span>{" "}
                                    {new Date(tournament.event_date).toLocaleString("fr-FR")}
                                </p>
                                {tournament.event_date_end && (
                                    <p>
                                        <span className="font-medium">Date de fin :</span>{" "}
                                        {new Date(tournament.event_date_end).toLocaleString("fr-FR")}
                                    </p>
                                )}
                                <p>
                                    <span className="font-medium">Format :</span>{" "}
                                    {tournament.is_online ? "En ligne" : "Sur place"}
                                </p>
                                <p>
                                    <span className="font-medium">Nombre de rondes :</span>{" "}
                                    {tournament.number_of_rounds}
                                </p>
                                <p>
                                    <span className="font-medium">Nombre de places max :</span>{" "}
                                    {tournament.max_players}
                                </p>
                                {tournament.current_round != null && (
                                    <p>
                                        <span className="font-medium">Ronde actuelle :</span>{" "}
                                        {tournament.current_round}
                                    </p>
                                )}
                            </div>
                        </section>

                        {!hasStarted && (
                            <p className="text-gray-600 ">
                                Ce tournoi n&apos;a pas encore commencé, merci de patienter.
                            </p>
                        )}

                        {hasStarted && (
                            <section className="mt-4">
                                <h2 className="text-lg font-semibold mb-3">Mes matchmakings</h2>

                                {tournament.rounds.length === 0 && (
                                    <p className="text-gray-500 ">
                                        Aucune ronde n&apos;a encore été générée pour ce tournoi.
                                    </p>
                                )}

                                {tournament.rounds.length > 0 && (
                                    <div className="space-y-4">
                                        {tournament.rounds
                                            .slice()
                                            .sort((a, b) => b.round_number - a.round_number)
                                            .map((round) => (
                                                <div key={round.id} className="border rounded-md p-3">
                                                    <h3 className="font-semibold  mb-2">
                                                        Ronde {round.round_number} ({round.status})
                                                    </h3>

                                                    {round.matches.length === 0 ? (
                                                        <p className="text-gray-500 ">
                                                            Aucun match pour cette ronde.
                                                        </p>
                                                    ) : (
                                                        <ul className="space-y-2">
                                                            {round.matches.map((match) => {
                                                                const isCurrentRound =
                                                                    currentRound && match.round_id === currentRound.id;
                                                                const isMine = isUserInMatch(match);
                                                                const form = scores[match.id] ?? {
                                                                    player1_games_won: "",
                                                                    player2_games_won: "",
                                                                };

                                                                const p1Name =
                                                                    match.player1?.user?.username ??
                                                                    match.player1?.user_id ??
                                                                    `Joueur #${match.player1_tournament_player_id}`;
                                                                const p2Name =
                                                                    match.player2?.user?.username ??
                                                                    match.player2?.user_id ??
                                                                    `Joueur #${match.player2_tournament_player_id}`;

                                                                return (
                                                                    <li key={match.id} className="border rou p-2 ">
                                                                        <div className="flex flex-col gap-1">
                                                                            <div className="flex justify-between">
                                                                                <span className="font-medium">
                                                                                    {p1Name} vs {p2Name}
                                                                                </span>
                                                                                <span className=" text-gray-500">
                                                                                    Statut : {match.status}
                                                                                </span>
                                                                            </div>

                                                                            {isCurrentRound && isMine && match.status !== "completed" ? (
                                                                                <form
                                                                                    className="mt-2 flex flex-wrap items-center gap-2 "
                                                                                    onSubmit={(e) => {
                                                                                        e.preventDefault();
                                                                                        handleSubmitScore(match);
                                                                                    }}
                                                                                >
                                                                                    <label className="flex items-center gap-1">
                                                                                        <span>{p1Name}</span>
                                                                                        <input
                                                                                            type="number"
                                                                                            min={0}
                                                                                            max={maxGamesPerPlayer}
                                                                                            className="w-14 border rounded px-1 py-0.5 text-right"
                                                                                            value={form.player1_games_won}
                                                                                            onChange={(e) =>
                                                                                                handleScoreChange(
                                                                                                    match.id,
                                                                                                    "player1_games_won",
                                                                                                    e.target.value
                                                                                                )
                                                                                            }
                                                                                        />
                                                                                    </label>

                                                                                    <span>-</span>

                                                                                    <label className="flex items-center gap-1">
                                                                                        <span>{p2Name}</span>
                                                                                        <input
                                                                                            type="number"
                                                                                            min={0}
                                                                                            max={maxGamesPerPlayer}
                                                                                            className="w-14 border rounded px-1 py-0.5 text-right"
                                                                                            value={form.player2_games_won}
                                                                                            onChange={(e) =>
                                                                                                handleScoreChange(
                                                                                                    match.id,
                                                                                                    "player2_games_won",
                                                                                                    e.target.value
                                                                                                )
                                                                                            }
                                                                                        />
                                                                                    </label>

                                                                                    <button
                                                                                        type="submit"
                                                                                        className="ml-auto inline-flex items-center px-2 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 "
                                                                                    >
                                                                                        Enregistrer le score
                                                                                    </button>
                                                                                </form>
                                                                            ) : (
                                                                                <>
                                                                                    {match.player1_games_won === match.player2_games_won ? (
                                                                                        <p className=" text-gray-600 mt-1">
                                                                                            Égalité
                                                                                        </p>
                                                                                    ) : (
                                                                                        <p className=" text-gray-600 mt-1">
                                                                                            Match gagné par <span className="font-bold">{match.player1_games_won > match.player2_games_won ? p1Name : p2Name}</span>
                                                                                        </p>
                                                                                    )}
                                                                                    <p className=" text-gray-600 mt-1">
                                                                                        Score : {p1Name} {match.player1_games_won} - {match.player2_games_won} {p2Name}
                                                                                    </p>
                                                                                </>
                                                                            )}
                                                                        </div>
                                                                    </li>
                                                                );
                                                            })}
                                                        </ul>
                                                    )}
                                                </div>
                                            ))}
                                    </div>
                                )}
                            </section>
                        )}
                    </>
                )}
            </div>
        </UserProfilLayout>
    );
};

export default MyTournamentDetail;