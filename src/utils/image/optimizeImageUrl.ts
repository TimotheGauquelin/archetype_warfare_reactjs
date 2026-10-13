export type ImagePreset = "slider" | "jumbotron" | "card" | "thumb";

const PRESET_WIDTH: Record<ImagePreset, number> = {
  slider: 800,
  jumbotron: 800,
  card: 280,
  thumb: 160,
};

/**
 * Optimise une URL image :
 * - Cloudinary : f_auto, q_auto, w_*
 * - YGOProDeck : variante cards_small (beaucoup plus légère que /cards/)
 */
export const optimizeImageUrl = (
  url?: string | null,
  preset: ImagePreset = "card"
): string => {
  if (!url) return "";

  if (url.includes("images.ygoprodeck.com")) {
    if (preset === "card" || preset === "thumb") {
      return url
        .replace("/images/cards/", "/images/cards_small/")
        .replace("/images/cards_cropped/", "/images/cards_small/");
    }
    return url;
  }

  if (!url.includes("res.cloudinary.com") || !url.includes("/upload/")) {
    return url;
  }

  if (/\/upload\/(?:[^/]+,)?f_auto/.test(url)) {
    return url;
  }

  const width = PRESET_WIDTH[preset];
  const quality = preset === "card" || preset === "thumb" ? "q_auto:low" : "q_auto:eco";
  const transform = `f_auto,${quality},c_limit,w_${width}`;
  return url.replace("/upload/", `/upload/${transform}/`);
};
