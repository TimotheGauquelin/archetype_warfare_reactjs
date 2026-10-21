import { useEffect, useState } from "react";
import api_aw from "@/api/api_aw";
import type { Card } from "@/types";

export type ChoiceCard = {
  text: string;
  cardId: string | null;
  name: string | null;
  artworkUrl: string | null;
};

export const emptyChoiceCard = (): ChoiceCard => ({
  text: "",
  cardId: null,
  name: null,
  artworkUrl: null,
});

interface QuizChoiceCardPickerProps {
  value: ChoiceCard;
  onChange: (next: ChoiceCard) => void;
  label?: string;
  labelClassName?: string;
  placeholder?: string;
  helperText?: string | null;
  disabled?: boolean;
}

const artworkOf = (card: Card): string | null => {
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

/** Autocomplétion carte : une proposition n'est valide qu'après sélection. */
const QuizChoiceCardPicker = ({
  value,
  onChange,
  label,
  labelClassName,
  placeholder = "Rechercher une carte puis sélectionner…",
  helperText = "Sélectionnez une carte dans la liste pour valider cette proposition.",
  disabled = false,
}: QuizChoiceCardPickerProps) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Card[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const needle = query.trim();
    // Dès 1 caractère : permet de trouver une carte nommée "7", etc.
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

  const selectCard = (card: Card) => {
    onChange({
      text: card.name,
      cardId: String(card.id),
      name: card.name ?? null,
      artworkUrl: artworkOf(card),
    });
    setQuery("");
    setResults([]);
  };

  const clearSelection = () => {
    onChange({
      text: "",
      cardId: null,
      name: null,
      artworkUrl: null,
    });
    setQuery("");
    setResults([]);
  };

  return (
    <div className="flex-1 space-y-2">
      {label ? (
        <p className={labelClassName ?? "text-sm font-medium text-gray-800"}>
          {label}
        </p>
      ) : null}

      {value.cardId ? (
        <div className="flex items-center gap-3 bg-white rounded border border-green-300 p-2">
          {value.artworkUrl && (
            <img
              src={value.artworkUrl}
              alt={value.name ?? ""}
              className="h-16 w-16 object-cover rounded"
            />
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">
              {value.name ?? value.text}
            </p>
            <p className="text-xs text-gray-500">ID {value.cardId}</p>
          </div>
          {!disabled && (
            <button
              type="button"
              className="text-sm text-red-600 hover:underline shrink-0"
              onClick={clearSelection}
            >
              Changer
            </button>
          )}
        </div>
      ) : (
        <div>
          <input
            type="text"
            disabled={disabled}
            className="w-full p-2 rounded text-sm border border-amber-300 bg-amber-50 disabled:opacity-50"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
          />
          {helperText ? (
            <p className="text-xs text-amber-700 mt-1">{helperText}</p>
          ) : null}
          {loading && (
            <p className="text-xs text-gray-500 mt-1">Recherche…</p>
          )}
          {results.length > 0 && (
            <ul className="mt-1 max-h-48 overflow-y-auto bg-white border border-gray-200 rounded divide-y">
              {results.map((card) => (
                <li key={String(card.id)}>
                  <button
                    type="button"
                    className="w-full flex items-center gap-2 px-2 py-1.5 text-left hover:bg-slate-100"
                    onClick={() => selectCard(card)}
                  >
                    <img
                      src={artworkOf(card) ?? card.img_url}
                      alt=""
                      className="h-10 w-10 object-cover rounded"
                    />
                    <span className="text-sm truncate">{card.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default QuizChoiceCardPicker;
