/** Extrait YYYY-MM-DD depuis datetime-local ou ISO. */
export const toDateKey = (value: string | null | undefined): string => {
  if (!value) return "";
  return String(value).trim().slice(0, 10);
};

/** Bornes datetime-local pour une saison (journée entière). */
export const seasonToDatetimeBounds = (
  startDate: string,
  endDate: string
): { min: string; max: string } => ({
  min: `${startDate}T00:00`,
  max: `${endDate}T23:59`,
});

/**
 * Le tournoi est entièrement dans la saison ssi début et fin
 * sont inclus dans [seasonStart, seasonEnd] (jours calendaires).
 * Tout débordement (même partiel) → false.
 */
export const isTournamentFullyWithinSeason = (
  eventStart: string | null | undefined,
  eventEnd: string | null | undefined,
  seasonStart: string,
  seasonEnd: string
): boolean => {
  const start = toDateKey(eventStart);
  const end = toDateKey(eventEnd || eventStart);
  if (!start || !end || !seasonStart || !seasonEnd) return false;
  if (end < start) return false;
  return start >= seasonStart && end <= seasonEnd;
};

export const clampDatetimeLocal = (
  value: string,
  min: string,
  max: string
): string => {
  if (!value) return min;
  if (value < min) return min;
  if (value > max) return max;
  return value;
};

/** Clamp début/fin dans la saison, en gardant fin >= début. */
export const clampTournamentDatesToSeason = (
  eventStart: string,
  eventEnd: string,
  seasonStart: string,
  seasonEnd: string
): { event_date: string; event_date_end: string } => {
  const { min, max } = seasonToDatetimeBounds(seasonStart, seasonEnd);
  let start = clampDatetimeLocal(eventStart || min, min, max);
  let end = clampDatetimeLocal(eventEnd || start, min, max);
  if (end < start) end = start;
  return { event_date: start, event_date_end: end };
};
