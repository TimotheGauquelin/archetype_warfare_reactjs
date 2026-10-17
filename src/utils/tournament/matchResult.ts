/** Un résultat est considéré renseigné si l'API a horodaté, ou fallback statut/BYE. */
export const matchHasReportedResult = (match: {
  status?: string | null;
  result_reported_at?: string | Date | null;
  player2_tournament_player_id?: number | null;
  player2?: unknown | null;
}): boolean => {
  if (match.result_reported_at != null) return true;
  if (match.status === "completed") return true;
  if (match.player2_tournament_player_id === null) return true;
  if (match.player2 === null) return true;
  return false;
};
