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
import { matchHasReportedResult } from "@/utils/tournament/matchResult";

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
    const hasResult = matchHasReportedResult({
        status: roundMatch.status,
        result_reported_at: roundMatch.result_reported_at,
        player2: roundMatch.player2,
    });
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
    };

    const canEdit = isUserOfTheMatch() && roundMatch.status !== "completed" && !isBye;
    const player1Username = roundMatch?.player1?.username
        ? String(roundMatch.player1.username)
        : t("matchmaking.unknown");
    const player2Username = roundMatch?.player2?.username
        ? String(roundMatch.player2.username)
        : t("matchmaking.unknown");

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

    const renderResult = () => {
        if (canEdit) {
            return (
                <form
                    className="flex flex-wrap items-center gap-1.5"
                    onSubmit={(e) => {
                        e.preventDefault();
                        onSubmitScore(matchId, playersScore);
                    }}
                >
                    <label className="flex items-center gap-1">
                        <span className="truncate max-w-[5rem]">{player1Username}</span>
                        <input
                            type="number"
                            min={0}
                            max={maxP1}
                            className="w-12 border rounded px-1 py-0.5 text-right"
                            value={playersScore.player1_games_won}
                            onChange={(e) => handleP1Change(Number(e.target.value))}
                        />
                    </label>
                    <span>-</span>
                    <label className="flex items-center gap-1">
                        <input
                            type="number"
                            min={0}
                            max={maxP2}
                            className="w-12 border rounded px-1 py-0.5 text-right"
                            value={playersScore.player2_games_won}
                            onChange={(e) => handleP2Change(Number(e.target.value))}
                        />
                        <span className="truncate max-w-[5rem]">{player2Username}</span>
                    </label>
                    <button
                        type="submit"
                        className="inline-flex items-center px-2 py-1 rounded bg-blue-600 text-white text-xs hover:bg-blue-700"
                    >
                        {t("matchmaking.saveScore")}
                    </button>
                </form>
            );
        }

        if (!hasResult) {
            return (
                <span className="text-gray-400 italic">{t("matchmaking.scorePending")}</span>
            );
        }

        if (isBye) {
            return (
                <span className="text-green-700 font-medium">{t("matchmaking.byeWin")}</span>
            );
        }

        const outcome = resolveMatchOutcome(
            roundMatch.player1.gamesWon,
            roundMatch.player2!.gamesWon,
            winsNeeded,
            matchResolutionMode
        );

        let outcomeLabel: React.ReactNode;
        if (outcome === "draw") {
            outcomeLabel = t("matchmaking.draw");
        } else if (outcome === "double_loss") {
            outcomeLabel = t("matchmaking.doubleLoss");
        } else {
            outcomeLabel = (
                <>
                    {t("matchmaking.wonBy")}{" "}
                    <span className="font-bold">
                        {outcome === "p1_win" ? player1Username : player2Username}
                    </span>
                </>
            );
        }

        return (
            <div className="space-y-0.5">
                <div>{outcomeLabel}</div>
                {roundMatch.player2 && (
                    <div>
                        {t("matchmaking.score")} {player1Username}{" "}
                        {roundMatch.player1.gamesWon} - {roundMatch.player2.gamesWon}{" "}
                        {player2Username}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div
            className={`grid grid-cols-12 col-span-12 items-center border-b border-l border-r hover:bg-slate-200 ${
                hasResult ? "bg-emerald-50/60" : ""
            } ${isBye ? "border-l-4 border-l-amber-400" : ""}`}
        >
            <div className="col-span-2 sscreen:col-span-2 p-2 font-medium text-gray-900">
                {t("matchmaking.round", { number: round.round_number })}
            </div>
            <div className="col-span-3 sscreen:col-span-2 p-2">
                {TOURNAMENT_ROUND_STATUS(round.status)}
            </div>
            <div className="col-span-7 sscreen:col-span-3 p-2 font-medium text-gray-900 truncate">
                {player1Username} vs {isBye ? "BYE" : player2Username}
            </div>
            <div className="col-span-12 sscreen:col-span-5 p-2 border-t sscreen:border-t-0 sscreen:border-l bg-gray-50 sscreen:bg-transparent">
                {renderResult()}
            </div>
        </div>
    );
};
