import type { TFunction } from "i18next";

const KNOWN_CODES = [
  "warning",
  "game_loss",
  "match_loss",
  "disqualification",
] as const;

export type KnownPenaltyCode = (typeof KNOWN_CODES)[number];

export function translatePenaltyType(
  t: TFunction,
  code?: string | null,
  fallbackLabel?: string | null
): string {
  if (code && (KNOWN_CODES as readonly string[]).includes(code)) {
    return t(`penaltyTypes.${code}`);
  }
  return fallbackLabel?.trim() || t("profile.penalty");
}

export function translatePenaltyRound(
  t: TFunction,
  round?: { round_number?: number | null } | number | null
): string {
  if (round == null) {
    return t("profile.penaltyRoundBefore");
  }
  const number =
    typeof round === "number" ? round : round.round_number ?? null;
  if (number == null) {
    return t("profile.penaltyRoundUnknown");
  }
  return t("profile.penaltyRoundN", { number });
}
