export type ImagePreset = "slider" | "jumbotron" | "card" | "thumb";

const PRESET_WIDTH: Record<ImagePreset, number> = {
  slider: 800,
  jumbotron: 800,
  card: 280,
  thumb: 160,
};

/**
 * Injecte f_auto,q_auto:eco et une largeur adaptée dans une URL Cloudinary.
 * Laisse intactes les URLs non-Cloudinary (ex. ygoprodeck, assets locaux).
 */
export const optimizeImageUrl = (
  url?: string | null,
  preset: ImagePreset = "card"
): string => {
  if (!url) return "";

  if (!url.includes("res.cloudinary.com") || !url.includes("/upload/")) {
    return url;
  }

  // Déjà transformée
  if (/\/upload\/(?:[^/]+,)?f_auto/.test(url)) {
    return url;
  }

  const width = PRESET_WIDTH[preset];
  const quality = preset === "card" || preset === "thumb" ? "q_auto:low" : "q_auto:eco";
  const transform = `f_auto,${quality},c_limit,w_${width}`;
  return url.replace("/upload/", `/upload/${transform}/`);
};
