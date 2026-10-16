import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import type { MyTournamentRound } from "@/services/tournament";
import { TOURNAMENT_ROUND_STATUS } from "@/utils/trad/tournamentStatus";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { MatchScoreProps } from "@/types/match";
import {
    clampScore,
    getMaxOpponentGamesWon,
    resolveMatchOutcome,
    type MatchResolutionMode,
} from "@/utils/tournament/bestOfScore";


interface MatchMakingCardProps {
    round: MyTournamentRound;
    maxWinningDuelPerPlayer: number;
    matchResolutionMode?: MatchResolutionMode;
    onSubmitScore: (matchId: number, playersScore: MatchScoreProps) => void;
}

export const MatchMakingCard: React.FC<MatchMakingCardProps> = ({
    round,
    maxWinningDuelPerPlayer,
    matchResolutionMode = "strict_wins",
    onSubmitScore,
}) => {
    const { t } = useTranslation();
    const [playersScore, setPlayersScore] = useState<MatchScoreProps>({
        player1_games_won: 0,
        player2_games_won: 0,
    });

    const matchId = round.match?.id;
    const user = useSelector((state: RootState) => state.user);
    const roundMatch = round.match ?? null;
    const isBye = roundMatch.player2 == null;
    const winsNeeded = Math.max(1, maxWinningDuelPerPlayer);
    const maxP1 = getMaxOpponentGamesWon(playersScore.player2_games_won, winsNeeded);
    const maxP2 = getMaxOpponentGamesWon(playersScore.player1_games_won, winsNeeded);

    const isUserOfTheMatch = () => {
        const uid = user.id;
        if (uid == null) return false;
        const expected = String(uid);
        const p1 = roundMatch?.player1?.id != null ? String(roundMatch.player1.id) : null;
        const p2 = roundMatch?.player2?.id != null ? String(roundMatch.player2.id) : null;
        return p1 === expected || p2 === expected;
    }

    const canEdit = isUserOfTheMatch() && roundMatch.status !== "completed" && !isBye;
    const player1Username = roundMatch?.player1?.username ? String(roundMatch?.player1?.username) : t("matchmaking.unknown");
    const player2Username = roundMatch?.player2?.username ? String(roundMatch?.player2?.username) : t("matchmaking.unknown");

    const handleP1Change = (raw: number) => {
        const nextP1 = clampScore(raw, winsNeeded);
        const nextMaxP2 = getMaxOpponentGamesWon(nextP1, winsNeeded);
        setPlayersScore({
            player1_games_won: nextP1,
            player2_games_won: clampScore(playersScore.player2_games_won, nextMaxP2),
        });
    };

    const handleP2Change = (raw: number) => {
        const nextP2 = clampScore(raw, winsNeeded);
        const nextMaxP1 = getMaxOpponentGamesWon(nextP2, winsNeeded);
        setPlayersScore({
            player1_games_won: clampScore(playersScore.player1_games_won, nextMaxP1),
            player2_games_won: nextP2,
        });
    };

    return (
        <div className="bg-white rounded-md p-3">
            <h3 className="font-semibold mb-2">
                {t("matchmaking.round", { number: round.round_number })} ({TOURNAMENT_ROUND_STATUS(round.status)})
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
                                        max={maxP1}
                                        className="w-14 border rounded px-1 py-0.5 text-right"
                                        value={playersScore.player1_games_won}
                                        onChange={(e) => handleP1Change(Number(e.target.value))}
                                    />
                                </label>
                                <span>-</span>
                                <label className="flex items-center gap-1">
                                    <span>{player2Username}</span>
                                    <input
                                        type="number"
                                        min={0}
                                        max={maxP2}
                                        className="w-14 border rounded px-1 py-0.5 text-right"
                                        value={playersScore.player2_games_won}
                                        onChange={(e) => handleP2Change(Number(e.target.value))}
                                    />
                                </label>
                                <button
                                    type="submit"
                                    className="ml-auto inline-flex items-center px-2 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
                                >
                                    {t("matchmaking.saveScore")}
                                </button>
                            </form>
                        ) : (
                            <>
                                {isBye ? (
                                    <p className="text-gray-600 mt-1">{t("matchmaking.byeWin")}</p>
                                ) : (() => {
                                    const outcome = resolveMatchOutcome(
                                        roundMatch.player1.gamesWon,
                                        roundMatch.player2.gamesWon,
                                        winsNeeded,
                                        matchResolutionMode
                                    );
                                    if (outcome === "draw") {
                                        return <p className="text-gray-600 mt-1">{t("matchmaking.draw")}</p>;
                                    }
                                    if (outcome === "double_loss") {
                                        return <p className="text-gray-600 mt-1">{t("matchmaking.doubleLoss")}</p>;
                                    }
                                    return (
                                        <p className="text-gray-600 mt-1">
                                            {t("matchmaking.wonBy")}{" "}
                                            <span className="font-bold">
                                                {outcome === "p1_win" ? player1Username : player2Username}
                                            </span>
                                        </p>
                                    );
                                })()}
                                {!isBye && (
                                    <p className="text-gray-600 mt-1">
                                        {t("matchmaking.score")} {player1Username} {roundMatch.player1.gamesWon} - {roundMatch.player2.gamesWon}{" "}
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
