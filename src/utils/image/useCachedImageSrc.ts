import { useEffect, useState } from "react";
import { resolveCachedImageUrl } from "./cachedImageUrl";

/** Src image avec Cache API (blob URL) + fallback URL réseau. */
export const useCachedImageSrc = (url?: string | null): string => {
  const [src, setSrc] = useState(url ?? "");

  useEffect(() => {
    let cancelled = false;
    let blobUrl: string | null = null;

    if (!url) {
      setSrc("");
      return;
    }

    setSrc(url);

    void (async () => {
      const next = await resolveCachedImageUrl(url);
      if (cancelled) {
        if (next.startsWith("blob:")) URL.revokeObjectURL(next);
        return;
      }
      if (next.startsWith("blob:")) blobUrl = next;
      setSrc(next);
    })();

    return () => {
      cancelled = true;
      if (blobUrl) URL.revokeObjectURL(blobUrl);
    };
  }, [url]);

  return src;
};
