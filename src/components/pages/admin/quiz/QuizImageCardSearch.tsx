import { useEffect, useState } from "react";
import api_aw from "@/api/api_aw";
import type { Card } from "@/types";

export const cardArtworkUrl = (card: Card): string | null => {
  const fromField =
    typeof card.artwork_url === "string" && card.artwork_url.trim()
      ? card.artwork_url.trim()
      : null;
  if (fromField) return fromField;
  const id = String(card.id);
  return id
    ? `https://images.ygoprodeck.com/images/cards_cropped/${id}.jpg`
    : null;
};

interface QuizImageCardSearchProps {
  selectedName: string | null;
  onSelect: (artworkUrl: string, cardName: string) => void;
  onClear: () => void;
}

const QuizImageCardSearch = ({
  selectedName,
  onSelect,
  onClear,
}: QuizImageCardSearchProps) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Card[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const needle = query.trim();
    if (needle.length < 1) {
      setResults([]);
      return;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          size: "15",
          page: "1",
          name: needle,
        });
        const response = await api_aw.get(`/cards/search?${params}`, {
          signal: controller.signal,
        });
        setResults((response.data?.data ?? []) as Card[]);
      } catch {
        if (!controller.signal.aborted) setResults([]);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 250);

    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [query]);

  if (selectedName) {
    return (
      <div className="flex items-center justify-between gap-2 bg-white rounded p-2">
        <p className="text-sm font-medium truncate">{selectedName}</p>
        <button
          type="button"
          className="text-sm text-red-600 hover:underline shrink-0"
          onClick={onClear}
        >
          Changer
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <input
        type="text"
        className="w-full p-2 rounded text-sm border border-gray-300"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Rechercher une carte (artwork croppé)…"
      />
      {loading && <p className="text-xs text-gray-500">Recherche…</p>}
      {results.length > 0 && (
        <ul className="max-h-48 overflow-y-auto bg-white border border-gray-200 rounded divide-y">
          {results.map((card) => {
            const artwork = cardArtworkUrl(card);
            return (
              <li key={String(card.id)}>
                <button
                  type="button"
                  className="w-full flex items-center gap-2 px-2 py-1.5 text-left hover:bg-slate-100"
                  onClick={() => {
                    if (!artwork) return;
                    onSelect(artwork, card.name);
                    setQuery("");
                    setResults([]);
                  }}
                >
                  {artwork && (
                    <img
                      src={artwork}
                      alt=""
                      className="h-10 w-10 object-cover rounded"
                    />
                  )}
                  <span className="text-sm truncate">{card.name}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default QuizImageCardSearch;
