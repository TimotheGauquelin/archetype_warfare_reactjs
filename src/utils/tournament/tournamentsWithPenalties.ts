import type { Tournament, TournamentPlayer } from "@/types";

const INACTIVE_STATUSES = new Set([
  "tournament_finished",
  "tournament_cancelled",
  "tournament_did_not_happen",
]);

function playerUserId(player: TournamentPlayer): string | undefined {
  return (
    player.user_id ??
    (player.user as { id?: string } | undefined)?.id ??
    undefined
  );
}

export type TournamentPenaltyReminder = {
  tournament: Tournament;
  penaltiesCount: number;
  lateDeck: boolean;
};

/** Tournois actifs où le joueur a au moins une pénalité ou un flag deck tardif. */
export function tournamentsWithPlayerPenalties(
  tournaments: Tournament[],
  userId: string | null | undefined
): TournamentPenaltyReminder[] {
  if (!userId) return [];

  return tournaments
    .filter((tournament) => {
      if (INACTIVE_STATUSES.has(tournament.status)) return false;
      const me = (tournament.players ?? []).find(
        (player) => playerUserId(player) === userId && !player.dropped
      );
      if (!me) return false;
      const penalties = Array.isArray(me.penalties) ? me.penalties : [];
      return penalties.length > 0 || Boolean(me.late_deck_penalty);
    })
    .map((tournament) => {
      const me = (tournament.players ?? []).find(
        (player) => playerUserId(player) === userId
      )!;
      const penalties = Array.isArray(me.penalties) ? me.penalties : [];
      return {
        tournament,
        penaltiesCount: penalties.length,
        lateDeck: Boolean(me.late_deck_penalty),
      };
    });
}
