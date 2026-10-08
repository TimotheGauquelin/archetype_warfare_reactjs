export type ImagePreset = "slider" | "jumbotron" | "card" | "thumb";

const PRESET_WIDTH: Record<ImagePreset, number> = {
  slider: 1200,
  jumbotron: 1200,
  card: 400,
  thumb: 200,
};

/**
 * Injecte f_auto,q_auto et une largeur adaptée dans une URL Cloudinary.
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
  const transform = `f_auto,q_auto,c_limit,w_${width}`;
  return url.replace("/upload/", `/upload/${transform}/`);
};
