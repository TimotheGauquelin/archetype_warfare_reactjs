import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { findCardByExactName } from "../../../services/card";

type CacheEntry = { artworkUrl: string } | "miss";

const artworkCache = new Map<string, CacheEntry>();

type QuizCardNameHoverProps = {
  name: string;
};

/**
 * Texte en gras : si le nom matche exactement une carte (FR),
 * affiche l'artwork cropped au survol.
 */
const QuizCardNameHover = ({ name }: QuizCardNameHoverProps) => {
  const label = name;
  const cacheKey = label.trim().toLowerCase();
  const [artworkUrl, setArtworkUrl] = useState<string | null>(() => {
    const cached = artworkCache.get(cacheKey);
    return cached && cached !== "miss" ? cached.artworkUrl : null;
  });
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(
    null
  );
  const spanRef = useRef<HTMLElement | null>(null);
  const hoveringRef = useRef(false);
  const abortRef = useRef<AbortController | null>(null);

  const updateCoords = useCallback(() => {
    const el = spanRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setCoords({
      top: rect.top - 8,
      left: rect.left + rect.width / 2,
    });
  }, []);

  const resolveArtwork = useCallback(async () => {
    if (!cacheKey) return;
    const cached = artworkCache.get(cacheKey);
    if (cached === "miss") {
      setArtworkUrl(null);
      return;
    }
    if (cached) {
      setArtworkUrl(cached.artworkUrl);
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    const card = await findCardByExactName(label, "fr", controller.signal);
    if (controller.signal.aborted) return;

    if (card?.artwork_url) {
      artworkCache.set(cacheKey, { artworkUrl: card.artwork_url });
      setArtworkUrl(card.artwork_url);
    } else if (card?.id) {
      const url = `https://images.ygoprodeck.com/images/cards_cropped/${card.id}.jpg`;
      artworkCache.set(cacheKey, { artworkUrl: url });
      setArtworkUrl(url);
    } else {
      artworkCache.set(cacheKey, "miss");
      setArtworkUrl(null);
    }
  }, [cacheKey, label]);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  const handleEnter = () => {
    hoveringRef.current = true;
    updateCoords();
    setOpen(true);
    void resolveArtwork().then(() => {
      if (hoveringRef.current) {
        updateCoords();
        setOpen(true);
      }
    });
  };

  const handleLeave = () => {
    hoveringRef.current = false;
    setOpen(false);
  };

  const showTooltip = open && Boolean(artworkUrl) && coords;

  return (
    <>
      <strong
        ref={spanRef}
        className={
          artworkUrl
            ? "cursor-pointer underline decoration-dotted underline-offset-2"
            : "cursor-pointer"
        }
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        onFocus={handleEnter}
        onBlur={handleLeave}
      >
        {label}
      </strong>
      {showTooltip &&
        createPortal(
          <div
            role="tooltip"
            className="pointer-events-none fixed z-[200] -translate-x-1/2 -translate-y-full rounded-md border border-slate-200 bg-white p-1.5 shadow-xl"
            style={{ top: coords.top, left: coords.left }}
          >
            <img
              src={artworkUrl!}
              alt={label}
              className="h-28 w-28 object-cover rounded"
            />
          </div>,
          document.body
        )}
    </>
  );
};

export default QuizCardNameHover;
