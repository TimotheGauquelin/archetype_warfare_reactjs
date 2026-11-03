import type { Tournament, TournamentPlayer } from "@/types";

export const HIGHLIGHT_WINDOW_DAYS = 7;
export const COUNTDOWN_WINDOW_HOURS = 48;

const FINISHED_STATUSES = new Set([
  "tournament_finished",
  "tournament_cancelled",
  "tournament_did_not_happen",
]);

const IN_PROGRESS_STATUSES = new Set([
  "tournament_beginning",
  "tournament_in_progress",
  "tournament_is_beginning",
]);

export function isTournamentInProgressStatus(status: string | undefined): boolean {
  return Boolean(status && IN_PROGRESS_STATUSES.has(status));
}

export function isOfficialTournamentHighlightVisible(
  tournament: Tournament,
  nowMs: number = Date.now()
): boolean {
  if (!tournament.is_official) return false;
  if (!tournament.event_date) return false;
  if (tournament.status === "not_visible") return false;
  if (FINISHED_STATUSES.has(tournament.status)) return false;

  const startMs = new Date(tournament.event_date).getTime();
  if (Number.isNaN(startMs)) return false;

  if (isTournamentInProgressStatus(tournament.status)) {
    return true;
  }

  const windowStartMs = startMs - HIGHLIGHT_WINDOW_DAYS * 24 * 60 * 60 * 1000;
  if (nowMs < windowStartMs) return false;

  // Après le début : garder jusqu'à fin de fenêtre événement si le statut n'a pas encore bougé
  const endMs = tournament.event_date_end
    ? new Date(tournament.event_date_end).getTime()
    : startMs + 12 * 60 * 60 * 1000;
  if (nowMs >= startMs) {
    return nowMs <= endMs;
  }

  return true;
}

export function shouldShowHighlightCountdown(
  tournament: Tournament,
  nowMs: number = Date.now()
): boolean {
  if (!tournament.event_date) return false;
  if (isTournamentInProgressStatus(tournament.status)) return false;
  if (FINISHED_STATUSES.has(tournament.status)) return false;

  const startMs = new Date(tournament.event_date).getTime();
  if (Number.isNaN(startMs) || nowMs >= startMs) return false;

  const msLeft = startMs - nowMs;
  return msLeft <= COUNTDOWN_WINDOW_HOURS * 60 * 60 * 1000;
}

export function formatCountdown(msLeft: number): string {
  const totalSeconds = Math.max(0, Math.floor(msLeft / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

export function isUserRegisteredToTournament(
  tournament: Tournament,
  userId: string | null | undefined
): boolean {
  if (!userId) return false;
  const players = tournament.players ?? [];
  return players.some((player: TournamentPlayer) => {
    if (player.dropped) return false;
    const pid =
      player.user_id ?? (player.user as { id?: string } | undefined)?.id;
    return pid === userId;
  });
}

/** Tournois officiels éligibles au highlight, prochaines dates d'abord. */
export function selectOfficialTournamentHighlights(
  tournaments: Tournament[],
  nowMs: number = Date.now()
): Tournament[] {
  return tournaments
    .filter((t) => isOfficialTournamentHighlightVisible(t, nowMs))
    .sort((a, b) => {
      const aStart = new Date(a.event_date).getTime();
      const bStart = new Date(b.event_date).getTime();
      return aStart - bStart;
    });
}
