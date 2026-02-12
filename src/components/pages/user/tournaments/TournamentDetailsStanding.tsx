import type { TournamentStanding } from "@/services/tournament";

interface TournamentDetailsStandingProps {
  standings: TournamentStanding[];
}

export const TournamentDetailsStanding: React.FC<TournamentDetailsStandingProps> = ({
  standings,
}) => {
  if (!standings || standings.length === 0) {
    return (
      <section className="mt-6">
        <h2 className="text-lg font-semibold mb-2">Classement final</h2>
        <p className="text-gray-600 text-sm">
          Aucun classement disponible pour ce tournoi.
        </p>
      </section>
    );
  }

  return (
    <section className="mt-6">
      <h2 className="text-lg font-semibold mb-3">Classement final</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-3 py-2 border-b text-left">Rang</th>
              <th className="px-3 py-2 border-b text-left">Joueur (Pts totaux)</th>
              <th className="px-2 py-2 border-b text-center">Nb matchs gagnés (3pts)</th>
              <th className="px-2 py-2 border-b text-center">Nb matchs perdu (0pts)</th>
              <th className="px-2 py-2 border-b text-center">Nb matchs égalité (1pts)</th>
              <th className="px-1 py-2 border-b text-center">Abandon</th>
            </tr>
          </thead>
          <tbody>
            {standings.map((standing) => (
              <tr key={standing.tournament_player_id} className="odd:bg-white even:bg-gray-50">
                <td className="px-3 py-2 border-b font-semibold">
                  #{standing.rank}
                </td>
                <td className="px-3 py-2 border-b">
                  {standing.username && `${standing.username} (${standing.matches_breakdown.wins.total_points + standing.matches_breakdown.draws.total_points} pts)`}
                </td>
                <td className="px-2 py-2 border-b text-center">{standing.matches_breakdown.wins.count}</td>
                <td className="px-2 py-2 border-b text-center">{standing.matches_breakdown.losses.count}</td>
                <td className="px-2 py-2 border-b text-center">{standing.matches_breakdown.draws.count}</td>
                <td className="px-1 py-2 border-b text-center">{standing.matches_breakdown.hasDropped ? "Oui" : "Non"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};