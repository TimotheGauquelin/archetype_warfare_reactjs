const CACHE_NAME = "aw-card-images-v1";
const META_KEY = "aw-card-images-meta-v1";
const TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

type CacheMeta = Record<string, number>;

const canUseCaches = (): boolean =>
  typeof window !== "undefined" && typeof caches !== "undefined";

const readMeta = (): CacheMeta => {
  try {
    const raw = localStorage.getItem(META_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as CacheMeta;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
};

const writeMeta = (meta: CacheMeta): void => {
  try {
    localStorage.setItem(META_KEY, JSON.stringify(meta));
  } catch {
    // quota / private mode
  }
};

const pruneExpired = async (cache: Cache, meta: CacheMeta): Promise<CacheMeta> => {
  const now = Date.now();
  let changed = false;
  for (const [url, savedAt] of Object.entries(meta)) {
    if (now - savedAt > TTL_MS) {
      await cache.delete(url);
      delete meta[url];
      changed = true;
    }
  }
  if (changed) writeMeta(meta);
  return meta;
};

/**
 * Résout une URL image via Cache API (TTL 30j).
 * Fallback sur l'URL d'origine si CORS / Cache indisponible.
 */
export const resolveCachedImageUrl = async (url: string): Promise<string> => {
  if (!url || !canUseCaches()) return url;

  try {
    const cache = await caches.open(CACHE_NAME);
    let meta = await pruneExpired(cache, readMeta());

    const cached = await cache.match(url);
    if (cached && cached.ok) {
      const blob = await cached.blob();
      return URL.createObjectURL(blob);
    }

    const response = await fetch(url, {
      mode: "cors",
      credentials: "omit",
      cache: "force-cache",
    });
    if (!response.ok) return url;

    await cache.put(url, response.clone());
    meta = { ...meta, [url]: Date.now() };
    writeMeta(meta);

    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch {
    return url;
  }
};
