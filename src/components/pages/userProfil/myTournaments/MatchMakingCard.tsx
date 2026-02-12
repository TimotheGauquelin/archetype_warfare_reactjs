import React, { useState } from "react";
import type { MyTournamentRound } from "@/services/tournament";
import { TOURNAMENT_ROUND_STATUS } from "@/utils/trad/tournamentStatus";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { MatchScoreProps } from "@/types/match";


interface MatchMakingCardProps {
    round: MyTournamentRound;
    maxWinningDuelPerPlayer: number;
    onSubmitScore: (matchId: number, playersScore: MatchScoreProps) => void;
}

export const MatchMakingCard: React.FC<MatchMakingCardProps> = ({ round, maxWinningDuelPerPlayer, onSubmitScore }) => {

    const [playersScore, setPlayersScore] = useState<MatchScoreProps>({
        player1_games_won: 0,
        player2_games_won: 0,
    });

    const matchId = round.match?.id;
    const user = useSelector((state: RootState) => state.user);
    const roundMatch = round.match ?? null;
    const isBye = roundMatch.player2 == null;

    const isUserOfTheMatch = () => {
        const uid = user.id;
        if (uid == null) return false;
        const expected = String(uid);
        const p1 = roundMatch?.player1?.id != null ? String(roundMatch.player1.id) : null;
        const p2 = roundMatch?.player2?.id != null ? String(roundMatch.player2.id) : null;
        return p1 === expected || p2 === expected;
    }

    const canEdit = isUserOfTheMatch() && roundMatch.status !== "completed" && !isBye;
    const player1Username = roundMatch?.player1?.username ? String(roundMatch?.player1?.username) : 'Inconnu';
    const player2Username = roundMatch?.player2?.username ? String(roundMatch?.player2?.username) : 'Inconnu';

    return (
        <div className="bg-white rounded-md p-3">
            <h3 className="font-semibold mb-2">
                Ronde {round.round_number} ({TOURNAMENT_ROUND_STATUS(round.status)})
            </h3>

            <ul className="space-y-2">
                <li key={round.id} className="border rounded p-2">
                    <div className="flex flex-col gap-1">
                        <div className="flex justify-between">
                            <span className="font-medium">
                                {player1Username} vs {player2Username}
                            </span>
                        </div>

                        {canEdit ? (
                            <form
                                className="mt-2 flex flex-wrap items-center gap-2"
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    onSubmitScore(matchId, playersScore);
                                }}
                            >
                                <label className="flex items-center gap-1">
                                    <span>{player1Username}</span>
                                    <input
                                        type="number"
                                        min={0}
                                        max={maxWinningDuelPerPlayer}
                                        className="w-14 border rounded px-1 py-0.5 text-right"
                                        value={playersScore.player1_games_won}
                                        onChange={(e) =>
                                            setPlayersScore({
                                                ...playersScore,
                                                player1_games_won: Number(e.target.value)
                                            })
                                        }
                                    />
                                </label>
                                <span>-</span>
                                <label className="flex items-center gap-1">
                                    <span>{player2Username}</span>
                                    <input
                                        type="number"
                                        min={0}
                                        max={maxWinningDuelPerPlayer}
                                        className="w-14 border rounded px-1 py-0.5 text-right"
                                        value={playersScore.player2_games_won}
                                        onChange={(e) =>
                                            setPlayersScore({
                                                ...playersScore,
                                                player2_games_won: Number(e.target.value),
                                            })
                                        }
                                    />
                                </label>
                                <button
                                    type="submit"
                                    className="ml-auto inline-flex items-center px-2 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
                                >
                                    Enregistrer le score
                                </button>
                            </form>
                        ) : (
                            <>
                                {isBye ? (
                                    <p className="text-gray-600 mt-1">Victoire par BYE</p>
                                ) : roundMatch.player1.gamesWon === roundMatch.player2.gamesWon ? (
                                    <p className="text-gray-600 mt-1">Égalité</p>
                                ) : (
                                    <p className="text-gray-600 mt-1">
                                        Match gagné par{" "}
                                        <span className="font-bold">
                                            {roundMatch.player1.gamesWon > roundMatch.player2.gamesWon ? player1Username : player2Username}
                                        </span>
                                    </p>
                                )}
                                {!isBye && (
                                    <p className="text-gray-600 mt-1">
                                        Score : {player1Username} {roundMatch.player1.gamesWon} - {roundMatch.player2.gamesWon}{" "}
                                        {player2Username}
                                    </p>
                                )}
                            </>
                        )}
                    </div>
                </li>

            </ul>
        </div>
    );
};
