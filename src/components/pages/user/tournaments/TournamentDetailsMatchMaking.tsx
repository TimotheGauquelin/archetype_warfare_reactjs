import React, { useEffect, useState } from "react";
import api_aw from "@/api/api_aw";
import { TournamentDropDown } from "./TournamentDropDown";
import { TOURNAMENT_MATCH_STATUS } from "@/utils/trad/tournamentStatus";

interface Props {
  tournamentId: number;
}

// Données renvoyées par GET /api/tournaments/:id
export interface Match {
  id: number;
  round_id: number;
  tournament_id: number;
  player1_tournament_player_id: number;
  player2_tournament_player_id: number;
  player1_games_won: number;
  player2_games_won: number;
  winner_tournament_player_id: number | null;
  status: "pending" | "in_progress" | "completed";
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
  number_of_rounds: number;
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

export const TournamentDetailsMatchMaking: React.FC<Props> = ({ tournamentId }) => {
  const [tournament, setTournament] = useState<TournamentDetail | null>(null);
  const [standings, setStandings] = useState<StandingMap>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRound, setSelectedRound] = useState<number | null>(null);

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

  // petite fonction pour calculer des « points » (par ex. 3 par victoire, 1 par nul)
  const getPoints = (st?: Standing) => {
    if (!st) return 0;
    return st.match_wins * 3 + st.match_draws * 1;
  };

  const sortedRounds = [...(tournament.rounds || [])].sort(
    (a, b) => a.round_number - b.round_number
  );

  return (
    <TournamentDropDown title="Matchmakings">

      {sortedRounds.length === 0 && (
        <p>Aucune ronde créée pour l&apos;instant.</p>
      )}

      {sortedRounds
        .sort((a, b) => b.round_number - a.round_number)
        .map((round) => (
          <div key={round.id} className="mb-2">
            <h3 className="text-lg font-medium mb-2">
              Ronde {round.round_number} ( {round.status === "pending" ? "En attente" : round.status === "in_progress" ? "En cours" : "Terminée"} )
            </h3>

            {round.matches.length === 0 ? (
              <p>Aucun match dans cette ronde.</p>
            ) : (
              <table className="w-full border-collapse text-base boder">
                <thead className="bg-gray-500 text-white">
                  <tr>
                    <th className="p-2 border-b">
                      Table
                    </th>
                    <th className="p-2 border-b">
                      Joueur 1
                    </th>
                    <th className="p-2 border-b">
                      Joueur 2
                    </th>
                    <th className="p-2 border-b">
                      Score
                    </th>
                    <th className="p-2 border-b">
                      Statut
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {round.matches.map((match, index) => {
                    const p1 = standings[match.player1_tournament_player_id];
                    const p2 = standings[match.player2_tournament_player_id];

                    const p1Name =
                      p1?.username ?? `TP#${match.player1_tournament_player_id}`;
                    const p2Name =
                      p2?.username ?? `TP#${match.player2_tournament_player_id}`;

                    const p1Points = getPoints(p1);
                    const p2Points = getPoints(p2);

                    const isCompleted = match.status === "completed";

                    return (
                      <tr key={match.id} className="border-b odd:bg-gray-200 bg-white">
                        <td className="p-2 text-center">Table {index + 1}</td>
                        <td className="p-2 text-center">
                          {p1Name} ({p1Points} pts)
                        </td>
                        <td className="p-2 text-center">
                          {p2Name} ({p2Points} pts)
                        </td>
                        <td className="p-2 text-center">
                          {isCompleted
                            ? `${match.player1_games_won} - ${match.player2_games_won}`
                            : "—"}
                        </td>
                        <td className={`p-2 text-center ${match.status === "completed" ? "text-green-500" : match.status === "in_progress" ? "text-yellow-500" : "text-red-500"}`}>{TOURNAMENT_MATCH_STATUS(match.status)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        ))}
    </TournamentDropDown>
  );
};