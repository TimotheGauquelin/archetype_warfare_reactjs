import React, { useEffect, useState } from "react";
import api_aw from "@/api/api_aw";
import { TournamentDropDown } from "./TournamentDropDown";
import { TOURNAMENT_MATCH_STATUS } from "@/utils/trad/tournamentStatus";
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
  const [tournament, setTournament] = useState<TournamentDetail | null>(null);
  const [standings, setStandings] = useState<StandingMap>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  if (loading) return <div>Chargement des rounds...</div>;
  if (error) return <div>Erreur : {error}</div>;
  if (!tournament) return <div>Aucun tournoi trouvé.</div>;

  const sortedRounds = [...(tournament.rounds || [])].sort(
    (a, b) => a.round_number - b.round_number
  );

  const roundPointsByRoundId = computeRoundPointsByRoundId(
    tournament.rounds || []
  );

  return (
    <TournamentDropDown title="Matchmakings">

      {sortedRounds.length === 0 && (
        <p>Aucune ronde créée pour l&apos;instant.</p>
      )}

      {sortedRounds
        .sort((a, b) => b.round_number - a.round_number)
        .map((round) => {
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
                  Ronde {round.round_number}{" "}
                  <span className="font-medium text-red-500">
                    ({statusLabel})
                  </span>
                </>
              }
            >
              {round.matches.length === 0 ? (
                <p>Aucun match dans cette ronde.</p>
              ) : (
                <div className="overflow-x-auto border border-gray-200 rounded-lg">
                  <table className="w-full border-collapse text-sm">
                    <thead className="bg-gray-100 text-gray-700">
                      <tr>
                        <th className="p-2 border-b text-left">Table</th>
                        <th className="p-2 border-b text-left">Joueur 1</th>
                        <th className="p-2 border-b text-left">Joueur 2</th>
                        <th className="p-2 border-b text-center">Score</th>
                        <th className="p-2 border-b text-center">Statut</th>
                      </tr>
                    </thead>
                    <tbody>
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
                            roundPoints[match.player1_tournament_player_id] ??
                            0;
                          const p2Points = isBye
                            ? null
                            : (roundPoints[
                                match.player2_tournament_player_id!
                              ] ?? 0);

                          const hasResult = matchHasReportedResult(match);

                          return (
                            <tr
                              key={match.id}
                              className={`border-b ${
                                hasResult
                                  ? "bg-emerald-50"
                                  : "odd:bg-gray-100 bg-white"
                              } ${isBye ? "border-l-4 border-l-amber-400" : ""}`}
                            >
                              <td className="p-2 text-center">
                                Table {index + 1}
                              </td>
                              <td className="block p-2 text-center flex flex-col lscreen:flex-row justify-center items-center">
                                <span className="font-bold">{p1Name}</span>
                                <span>({p1Points} pts)</span>
                              </td>
                              <td className="p-2 text-center">
                                <span className="font-bold">{p2Name}</span>
                                <span>
                                  {p2Points !== null
                                    ? ` (${p2Points} pts)`
                                    : ""}
                                </span>
                              </td>
                              <td className="p-2 text-center">
                                {hasResult ? (
                                  `${match.player1_games_won} - ${match.player2_games_won}`
                                ) : (
                                  <span className="text-gray-400 italic">
                                    —
                                  </span>
                                )}
                              </td>
                              <td
                                className={`p-2 text-center ${
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
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              )}
            </TournamentDropDown>
          );
        })}
    </TournamentDropDown>
  );
};