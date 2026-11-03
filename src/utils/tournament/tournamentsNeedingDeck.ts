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

/** Tournois actifs où le deck est obligatoire et pas encore choisi par l'utilisateur. */
export function tournamentsNeedingDeckSelection(
  tournaments: Tournament[],
  userId: string | null | undefined
): Tournament[] {
  if (!userId) return [];

  return tournaments.filter((tournament) => {
    if (!tournament.require_deck_list) return false;
    if (INACTIVE_STATUSES.has(tournament.status)) return false;

    const me = (tournament.players ?? []).find(
      (player) => playerUserId(player) === userId && !player.dropped
    );
    if (!me) return false;
    return me.deck_id == null || me.deck_id === "";
  });
}
