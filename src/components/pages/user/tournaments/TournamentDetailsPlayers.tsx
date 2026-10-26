import { TournamentDropDown } from "@/components/pages/user/tournaments/TournamentDropDown";
import { TournamentPlayer } from "@/types";

const TournamentDetailsPlayers = ({
  players,
}: {
  players: TournamentPlayer[];
}) => {
  return (
    <TournamentDropDown title="Joueurs inscrits">
      {players.length === 0 ? (
        <p className="text-sm text-gray-500">
          Aucun joueur inscrit pour le moment
        </p>
      ) : (
        <ul className="list-none p-0 m-0 divide-y divide-gray-100 border border-gray-200 rounded-lg overflow-hidden">
          {[...players]
            .sort(
              (a, b) =>
                a.user?.username?.localeCompare(b.user?.username ?? "") ?? 0
            )
            .map((player, index) => (
              <li
                key={
                  player.id ??
                  (player.user as { id?: number })?.id ??
                  index
                }
                className="py-2.5 px-3 bg-gray-50 text-sm text-gray-800"
              >
                {player?.user?.username}
              </li>
            ))}
        </ul>
      )}
    </TournamentDropDown>
  );
};

export default TournamentDetailsPlayers;
