const MEDAL_BY_RANK: Record<number, "gold" | "silver" | "bronze"> = {
  1: "gold",
  2: "silver",
  3: "bronze",
};

export const getSeasonMedalSrc = (rank: number): string | null => {
  const medal = MEDAL_BY_RANK[rank];
  if (!medal) return null;
  return `${import.meta.env.BASE_URL}assets/medalIcon/${medal}_medal.webp`;
};
