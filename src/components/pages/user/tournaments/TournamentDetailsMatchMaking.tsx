import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import api_aw from "@/api/api_aw";
import PaginationTableHead from "@/components/generic/pagination/PaginationTableHead";
import { TournamentDropDown } from "./TournamentDropDown";
import { TOURNAMENT_MATCH_STATUS } from "@/utils/trad/tournamentStatus";
import {
  getWinsNeeded,
  resolveMatchOutcome,
  type MatchResolutionMode,
} from "@/utils/tournament/bestOfScore";
import { matchHasReportedResult } from "@/utils/tournament/matchResult";

interface Props {
  tournamentId: string;
}

// Données renvoyées par GET /api/tournaments/:id
export interface Match {
  id: number;
  round_id: number;
  tournament_id: number;
  player1_tournament_player_id: number;
  player2_tournament_player_id: number | null; // null = bye
  player1_games_won: number;
  player2_games_won: number;
  winner_tournament_player_id: number | null;
  status: "pending" | "in_progress" | "completed";
  result_reported_at?: string | null;
}

export interface Round {
  id: number;
  tournament_id: number;
  round_number: number;
  status: "pending" | "in_progress" | "completed";
  matches: Match[];
}

export interface TournamentDetail {
  id: number;
  name: string;
  current_round: number;
  max_number_of_rounds: number;
  matches_per_round?: number;
  match_resolution_mode?: MatchResolutionMode;
  status: string;
  rounds: Round[];
}

// Données renvoyées par GET /api/tournaments/:id/standings
export interface Standing {
  rank: number;
  tournament_player_id: number;
  user_id: number;
  username: string | null;
  match_wins: number;
  match_losses: number;
  match_draws: number;
  games_won: number;
  games_played: number;
}

type StandingMap = Record<number, Standing | undefined>; // key = tournament_player_id

const computeRoundPointsByRoundId = (rounds: Round[]) => {
  const pointsByRoundId: Record<number, Record<number, number>> = {};
  const cumulativePoints: Record<number, number> = {};

  const sortedRounds = [...rounds].sort(
    (a, b) => a.round_number - b.round_number
  );

  for (const round of sortedRounds) {
    for (const match of round.matches) {
      if (match.status !== "completed") continue;

      const p1Id = match.player1_tournament_player_id;
      const p2Id = match.player2_tournament_player_id;
      const isBye = p2Id == null;

      if (cumulativePoints[p1Id] === undefined) cumulativePoints[p1Id] = 0;
      if (!isBye && cumulativePoints[p2Id] === undefined) cumulativePoints[p2Id] = 0;

      if (isBye) {
        if (match.winner_tournament_player_id === p1Id) {
          cumulativePoints[p1Id] += 3;
        }
      } else {
        if (match.winner_tournament_player_id === p1Id) {
          cumulativePoints[p1Id] += 3;
        } else if (match.winner_tournament_player_id === p2Id) {
          cumulativePoints[p2Id] += 3;
        } else {
          cumulativePoints[p1Id] += 1;
          cumulativePoints[p2Id] += 1;
        }
      }
    }

    pointsByRoundId[round.id] = { ...cumulativePoints };
  }

  return pointsByRoundId;
};

export const TournamentDetailsMatchMaking: React.FC<Props> = ({ tournamentId }) => {
  const { t } = useTranslation();
  const [tournament, setTournament] = useState<TournamentDetail | null>(null);
  const [standings, setStandings] = useState<StandingMap>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const tableHead = [
    { colspan: "col-span-2", label: t("matchmaking.colTable") },
    { colspan: "col-span-2", label: t("matchmaking.colStatus") },
    { colspan: "col-span-2", label: t("matchmaking.colPlayer1") },
    { colspan: "col-span-2", label: t("matchmaking.colPlayer2") },
    { colspan: "col-span-4", label: t("matchmaking.colResult") },
  ];

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    const fetchData = async () => {
      try {
        const [tRes, sRes] = await Promise.all([
          api_aw.get<TournamentDetail>(`/tournaments/${tournamentId}`),
          api_aw.get<Standing[]>(`/tournaments/${tournamentId}/standings`),
        ]);

        const tournamentJson = tRes.data;
        const standingsJson = sRes.data;

        if (!isMounted) return;

        const map: StandingMap = {};
        for (const st of standingsJson) {
          map[st.tournament_player_id] = st;
        }

        setTournament(tournamentJson);
        setStandings(map);
        setLoading(false);
      } catch (e: any) {
        if (!isMounted) return;
        setError(e?.message ?? "Erreur inconnue");
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [tournamentId]);

  if (loading) return <div>{t("matchmaking.loadingRounds")}</div>;
  if (error) return <div>Erreur : {error}</div>;
  if (!tournament) return <div>Aucun tournoi trouvé.</div>;

  const roundPointsByRoundId = computeRoundPointsByRoundId(
    tournament.rounds || []
  );
  const winsNeeded = getWinsNeeded(tournament.matches_per_round ?? 1);
  const matchResolutionMode: MatchResolutionMode =
    tournament.match_resolution_mode === "highest_score"
      ? "highest_score"
      : "strict_wins";

  const sortedRounds = [...(tournament.rounds || [])].sort(
    (a, b) => b.round_number - a.round_number
  );

  return (
    <TournamentDropDown title={t("matchmaking.title")}>
      {sortedRounds.length === 0 && (
        <p>{t("matchmaking.noRoundsYet")}</p>
      )}

      {sortedRounds.map((round) => {
        const statusLabel =
          round.status === "pending"
            ? "En attente"
            : round.status === "in_progress"
              ? "En cours"
              : "Terminée";

        return (
          <TournamentDropDown
            key={round.id}
            nested
            defaultCollapsed={round.status !== "in_progress"}
            title={
              <>
                {t("matchmaking.round", { number: round.round_number })}{" "}
                <span className="font-medium text-red-500">
                  ({statusLabel})
                </span>
              </>
            }
          >
            {round.matches.length === 0 ? (
              <p>{t("matchmaking.noMatchesInRound")}</p>
            ) : (
              <div className="w-full text-sm text-left text-gray-500 overflow-x-auto">
                <PaginationTableHead tableHeadItem={tableHead} />
                <div className="grid grid-cols-12">
                  {[...round.matches]
                    .sort((a, b) => a.id - b.id)
                    .map((match, index) => {
                      const isBye =
                        match.player2_tournament_player_id == null;
                      const p1Standing =
                        standings[match.player1_tournament_player_id];
                      const p2Standing = isBye
                        ? undefined
                        : standings[match.player2_tournament_player_id!];

                      const p1Name =
                        p1Standing?.username ??
                        `TP#${match.player1_tournament_player_id}`;
                      const p2Name = isBye
                        ? "BYE"
                        : p2Standing?.username ??
                          `TP#${match.player2_tournament_player_id}`;

                      const roundPoints =
                        roundPointsByRoundId[round.id] || {};
                      const p1Points =
                        roundPoints[match.player1_tournament_player_id] ?? 0;
                      const p2Points = isBye
                        ? null
                        : (roundPoints[
                            match.player2_tournament_player_id!
                          ] ?? 0);

                      const hasResult = matchHasReportedResult(match);

                      return (
                        <div
                          key={match.id}
                          className={`grid grid-cols-12 col-span-12 items-center border-b border-l border-r hover:bg-slate-200 ${
                            hasResult ? "bg-emerald-50/60" : ""
                          } ${isBye ? "border-l-4 border-l-amber-400" : ""}`}
                        >
                          <div className="col-span-2 p-2 font-medium text-gray-900">
                            {t("matchmaking.table", { number: index + 1 })}
                          </div>
                          <div
                            className={`col-span-2 p-2 ${
                              hasResult
                                ? "text-green-600 font-medium"
                                : match.status === "in_progress"
                                  ? "text-amber-600"
                                  : "text-red-500"
                            }`}
                          >
                            {TOURNAMENT_MATCH_STATUS(match.status, {
                              isBye,
                            })}
                          </div>
                          <div className="col-span-2 p-2 min-w-0">
                            <span className="font-medium text-gray-900">
                              {p1Name}
                            </span>
                            <span className="text-gray-500">
                              {" "}
                              ({t("matchmaking.points", { count: p1Points })})
                            </span>
                          </div>
                          <div className="col-span-2 p-2 min-w-0">
                            <span className="font-medium text-gray-900">
                              {p2Name}
                            </span>
                            {p2Points !== null && (
                              <span className="text-gray-500">
                                {" "}
                                ({t("matchmaking.points", { count: p2Points })})
                              </span>
                            )}
                          </div>
                          <div className="col-span-4 p-2 text-gray-800">
                            {!hasResult ? (
                              <span className="text-gray-400 italic">—</span>
                            ) : isBye ? (
                              <span className="font-medium text-green-700">
                                {t("matchmaking.byeWin")}
                              </span>
                            ) : (
                              (() => {
                                const outcome = resolveMatchOutcome(
                                  match.player1_games_won,
                                  match.player2_games_won,
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
                                        {outcome === "p1_win"
                                          ? p1Name
                                          : p2Name}
                                      </span>
                                    </>
                                  );
                                }
                                return (
                                  <div className="space-y-0.5">
                                    <div>{outcomeLabel}</div>
                                    <div>
                                      {t("matchmaking.score")} {p1Name}{" "}
                                      {match.player1_games_won} -{" "}
                                      {match.player2_games_won} {p2Name}
                                    </div>
                                  </div>
                                );
                              })()
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}
          </TournamentDropDown>
        );
      })}
    </TournamentDropDown>
  );
};
