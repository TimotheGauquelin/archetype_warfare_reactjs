import { useCallback, useState } from "react";
import Button from "@/components/generic/buttons/classicButton/Button";
import PopUp from "@/components/generic/PopUp";
import PaginationTableHead from "@/components/generic/pagination/PaginationTableHead";
import { reportMatchResult, rollbackTournamentRound } from "@/services/tournament";
import type {
  TournamentDetailMatch,
  TournamentDetailRound,
  TournamentStanding,
} from "@/services/tournament";
import { TOURNAMENT_MATCH_STATUS, TOURNAMENT_ROUND_STATUS } from "@/utils/trad/tournamentStatus";
import NoItemMessage from "@/components/generic/NoItemMessage";

interface AdminTournamentMatchmakingProps {
  rounds: TournamentDetailRound[];
  standings: TournamentStanding[];
  tournamentId: number | string;
  token: string;
  onMatchUpdated: () => void | Promise<void>;
  matchesPerRound: number;
}

const TABLE_HEAD_ITEMS = [
  { colspan: "col-span-1", label: "Table" },
  { colspan: "col-span-4 lscreen:col-span-3", label: "Joueur 1" },
  { colspan: "col-span-2 lscreen:col-span-2", label: "Score" },
  { colspan: "col-span-3 lscreen:col-span-3", label: "Joueur 2" },
  { colspan: "col-span-2 lscreen:col-span-1", label: "Statut" },
  { colspan: "hidden lscreen:flex lscreen:col-span-2", label: "Actions" },
];

const idToName = (
  tournamentPlayerId: number,
  standings: TournamentStanding[]
): string => {
  const s = standings.find(
    (x) => Number(x.tournament_player_id) === tournamentPlayerId
  );
  return s?.username ?? `#${tournamentPlayerId}`;
};

const AdminTournamentMatchmaking: React.FC<AdminTournamentMatchmakingProps> = ({
  rounds,
  standings,
  tournamentId,
  token,
  onMatchUpdated,
  matchesPerRound,
}) => {
  const [editMatchId, setEditMatchId] = useState<number | null>(null);
  const [editP1Games, setEditP1Games] = useState(0);
  const [editP2Games, setEditP2Games] = useState(0);
  const [savingResult, setSavingResult] = useState(false);
  const [rollbackRoundId, setRollbackRoundId] = useState<number | null>(null);
  const [rollbackLoading, setRollbackLoading] = useState(false);

  const maxWinningDuelPerPlayer = Math.max(
    0,
    Math.ceil((Number(matchesPerRound) || 0) / 2)
  );

  const openEditMatch = useCallback((m: TournamentDetailMatch) => {
    setEditMatchId(m.id);
    setEditP1Games(m.player1_games_won);
    setEditP2Games(m.player2_games_won);
  }, []);

  const saveMatchResult = useCallback(
    async (matchId: number) => {
      if (!token) return;
      setSavingResult(true);
      try {
        await reportMatchResult(
          matchId,
          { player1_games_won: editP1Games, player2_games_won: editP2Games },
          token
        );
        await onMatchUpdated();
        setEditMatchId(null);
      } finally {
        setSavingResult(false);
      }
    },
    [token, editP1Games, editP2Games, onMatchUpdated]
  );

  const cancelEdit = useCallback(() => {
    setEditMatchId(null);
  }, []);

  const handleConfirmRollback = useCallback(async () => {
    if (!token || !tournamentId || rollbackRoundId == null) return;
    setRollbackLoading(true);
    try {
      await rollbackTournamentRound(tournamentId, token);
      await onMatchUpdated();
      setRollbackRoundId(null);
    } finally {
      setRollbackLoading(false);
    }
  }, [token, tournamentId, rollbackRoundId, onMatchUpdated]);

  if (!rounds?.length) {
    return <NoItemMessage message="Aucune ronde pour l'instant" />;
  }

  const sortedRounds = [...rounds].sort(
    (a, b) => {
      const byRound = b.round_number - a.round_number;
      return byRound !== 0 ? byRound : a.id - b.id;
    }
  );

  return (
    <div className="space-y-4">
      {sortedRounds.map((round) => {
        const sortedMatches = [...(round.matches ?? [])].sort((ma, mb) => ma.id - mb.id);
        return (
        <div key={round.id} className="border border-gray-200 rounded p-2 space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="font-medium">
              Ronde {round.round_number} <span className="font-bold text-red-500">({TOURNAMENT_ROUND_STATUS(round.status)})</span>
            </h3>
            {round.status === "in_progress" && (
              <button
                type="button"
                className="bg-red-600 text-white rounded px-2 py-1 text-sm hover:underline"
                onClick={() => setRollbackRoundId(round.id)}
              >
                Annuler la ronde
              </button>
            )}
          </div>
          <div className="overflow-x-auto">
            <div className="min-w-full text-sm text-left text-gray-500">
              <PaginationTableHead tableHeadItem={TABLE_HEAD_ITEMS} />
              <div className="grid grid-cols-12">
                {sortedMatches.map((m, index) => {
                  const isEditing = editMatchId === m.id;
                  const tableNumber = index + 1;
                  return (
                    <div
                      key={m.id}
                      className="grid grid-cols-12 col-span-12 items-center border-b border-l border-r hover:bg-slate-50"
                    >
                      <div className="col-span-1 px-2 py-1 border-r border-gray-200 font-medium">
                        {tableNumber}
                      </div>
                      <div className="col-span-4 lscreen:col-span-3 px-2 py-1 border-r border-gray-200">
                        {idToName(m.player1_tournament_player_id, standings)}
                      </div>
                      <div className="col-span-2 lscreen:col-span-2 px-2 py-1 text-center border-r border-gray-200">
                        {isEditing ? (
                          <span className="inline-flex items-center gap-1">
                            <input
                              type="number"
                              min={0}
                              max={maxWinningDuelPerPlayer}
                              className="w-14 border border-gray-300 rounded px-1 py-0.5 text-right"
                              value={editP1Games}
                              onChange={(e) =>
                                setEditP1Games(Number(e.target.value) || 0)
                              }
                              aria-label="Score joueur 1"
                            />
                            <span className="text-gray-400">–</span>
                            <input
                              type="number"
                              min={0}
                              max={maxWinningDuelPerPlayer}
                              className="w-14 border border-gray-300 rounded px-1 py-0.5 text-right"
                              value={editP2Games}
                              onChange={(e) =>
                                setEditP2Games(Number(e.target.value) || 0)
                              }
                              aria-label="Score joueur 2"
                            />
                          </span>
                        ) : (
                          `${m.player1_games_won} – ${m.player2_games_won}`
                        )}
                      </div>
                      <div className="col-span-3 lscreen:col-span-3 px-2 py-1 border-r border-gray-200">
                        {m.player2_tournament_player_id != null
                          ? idToName(m.player2_tournament_player_id, standings)
                          : "BYE"}
                      </div>
                      <div className="col-span-2 lscreen:col-span-1 px-2 py-1 text-center border-r border-gray-200">
                        {TOURNAMENT_MATCH_STATUS(m.status) ?? m.status}
                      </div>
                      <div className="hidden lscreen:col-span-2 px-2 py-1 text-center lscreen:block">
                        {isEditing ? (
                          <span className="inline-flex items-center gap-2">
                            <Button
                              buttonText={
                                savingResult ? "Enregistrement…" : "Enregistrer"
                              }
                              action={() => saveMatchResult(m.id)}
                              disabled={savingResult}
                              className="px-2 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                            />
                            <button
                              type="button"
                              onClick={cancelEdit}
                              disabled={savingResult}
                              className="text-gray-600 hover:underline text-sm"
                            >
                              Annuler
                            </button>
                          </span>
                        ) : round.status === "in_progress" && m.player2_tournament_player_id != null ? (
                          <button
                            type="button"
                            onClick={() => openEditMatch(m)}
                            className="text-blue-600 hover:underline"
                          >
                            Modifier les scores
                          </button>
                        ) : null}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        );
      })}

      <PopUp
        isOpen={rollbackRoundId != null}
        onClose={() => {
          if (!rollbackLoading) setRollbackRoundId(null);
        }}
        title="Annuler la ronde"
        className="max-w-md w-full"
      >
        <p className="mb-4 text-sm text-gray-700">
          Voulez-vous vraiment annuler cette ronde ? Cette action va revenir à l&apos;état précédent du tournoi.
        </p>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => {
              if (!rollbackLoading) setRollbackRoundId(null);
            }}
            disabled={rollbackLoading}
            className="px-3 py-1 border rounded text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50"
          >
            Annuler
          </button>
          <Button
            buttonText={rollbackLoading ? "Annulation…" : "Confirmer"}
            action={handleConfirmRollback}
            disabled={rollbackLoading}
            className="px-3 py-1 bg-red-600 text-white rounded text-sm"
          />
        </div>
      </PopUp>
    </div>
  );
};

export default AdminTournamentMatchmaking;
