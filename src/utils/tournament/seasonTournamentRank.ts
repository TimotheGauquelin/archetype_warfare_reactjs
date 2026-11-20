export type SeasonTournamentTier =
  | "novice"
  | "bronze"
  | "argent"
  | "or"
  | "platine"
  | "diamant"
  | "master";

export const SEASON_TOURNAMENT_TIERS: Array<{
  id: SeasonTournamentTier;
  minPoints: number;
}> = [
  { id: "novice", minPoints: 0 },
  { id: "bronze", minPoints: 5 },
  { id: "argent", minPoints: 10 },
  { id: "or", minPoints: 20 },
  { id: "platine", minPoints: 35 },
  { id: "diamant", minPoints: 50 },
  { id: "master", minPoints: 100 },
];

export const SEASON_TOURNAMENT_TIER_I18N_KEY: Record<
  SeasonTournamentTier,
  string
> = {
  novice: "quiz.seasonTierNovice",
  bronze: "quiz.seasonTierBronze",
  argent: "quiz.seasonTierArgent",
  or: "quiz.seasonTierOr",
  platine: "quiz.seasonTierPlatine",
  diamant: "quiz.seasonTierDiamant",
  master: "quiz.seasonTierMaster",
};

export const getSeasonTournamentTierIconSrc = (
  tier: SeasonTournamentTier | null | undefined
): string => {
  const id = tier && tier in SEASON_TOURNAMENT_TIER_I18N_KEY ? tier : "novice";
  return `${import.meta.env.BASE_URL}assets/tierIcon/${id}.svg`;
};
