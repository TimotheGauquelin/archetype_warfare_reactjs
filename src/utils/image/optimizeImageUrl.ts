export type ImagePreset = "slider" | "jumbotron" | "card" | "thumb";

/**
 * Résout une URL image pour l'affichage.
 * On conserve la résolution d'origine (pas de q_auto:low / w_280 / cards_small).
 * Le paramètre `preset` est conservé pour compatibilité d'appel.
 */
export const optimizeImageUrl = (
  url?: string | null,
  _preset: ImagePreset = "card"
): string => {
  if (!url) return "";
  return url;
};
