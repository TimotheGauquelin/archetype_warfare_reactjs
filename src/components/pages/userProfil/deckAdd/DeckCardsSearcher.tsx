import React, { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { searchCardsWithoutArchetypeAndByOneArchetypeId } from "../../../../services/card";
import { debounce } from "../../../../utils/functions/debounce";
import { toast } from "react-toastify";
import { EXTRA_DECK_LABELS } from "../../../../utils/const/extraDeckConst";
import { STATUS_FORBIDDEN, STATUS_UNLIMITED } from "../../../../utils/const/banlistConst";
import type { Deck, Card, Pagination, CardSearchCriteria } from "../../../../types";

interface DeckCardsSearcherProps {
  myDeck: Deck;
  setMyDeck: React.Dispatch<React.SetStateAction<Deck>>;
  filters: CardSearchCriteria;
  setFilters: React.Dispatch<React.SetStateAction<CardSearchCriteria>>;
  pagination: Pagination;
  setPagination: React.Dispatch<React.SetStateAction<Pagination>>;
}

const DeckCardsSearcher: React.FC<DeckCardsSearcherProps> = ({ myDeck, setMyDeck, filters, setFilters, pagination, setPagination }) => {

  const [researchedCards, setResearchedCards] = useState<Card[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const abortControllerRef = useRef<AbortController | null>(null);

  const performSearch = useCallback((name: string, page: number, size: number, card_type?: string, level?: number, min_atk?: number, max_atk?: number, min_def?: number, max_def?: number, attribute?: string) => {
    if (myDeck.archetype_id == null) return;
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    setIsLoading(true);
    searchCardsWithoutArchetypeAndByOneArchetypeId(
      myDeck.archetype_id,
      (data) => {
        if (!signal.aborted) {
          setResearchedCards(data);
          setIsLoading(false);
        }
      },
      (paginationData) => {
        if (!signal.aborted) {
          setPagination(paginationData);
        }
      },
      size,
      page,
      name,
      card_type,
      level,
      min_atk,
      max_atk,
      min_def,
      max_def,
      attribute,
      signal // Passer le signal pour l'annulation
    );
  }, [myDeck.archetype_id, setPagination]);

  // Debounce de la recherche avec 500ms de délai
  const debouncedSearch = useMemo(
    () => debounce((name: string, page: number, size: number, card_type?: string, level?: number, min_atk?: number, max_atk?: number, min_def?: number, max_def?: number, attribute?: string) => {
      performSearch(name, page, size, card_type, level, min_atk, max_atk, min_def, max_def, attribute);
    }, 500),
    [performSearch]
  );

  // Effet pour la recherche avec debounce
  useEffect(() => {
    const size = filters.size ?? 30;
    const page = filters.page ?? 1;
    // Si le nom est vide et qu'on est sur la page 1, charger la première page
    if (filters.name === "" && page === 1) {
      performSearch("", 1, size, filters.card_type, filters.level, filters.min_atk, filters.max_atk, filters.min_def, filters.max_def, filters.attribute);
    } else {
      debouncedSearch(filters.name ?? "", page, size, filters.card_type, filters.level, filters.min_atk, filters.max_atk, filters.min_def, filters.max_def, filters.attribute);
    }

    // Cleanup : annuler la requête en cours si le composant se démonte
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [
    filters.name, 
    filters.page, 
    filters.size, 
    filters.card_type, 
    filters.level, 
    filters.min_atk, 
    filters.max_atk, 
    filters.min_def, 
    filters.max_def, 
    filters.attribute,
    debouncedSearch, 
    performSearch
  ]);

  const increasePage = useCallback(() => {
    if (pagination.currentPage < pagination.totalPages && !isLoading) {
      setFilters(prev => ({
        ...prev,
        page: (prev.page ?? 1) + 1
      }));
    }
  }, [pagination.currentPage, pagination.totalPages, isLoading, setFilters]);

  const decreasePage = useCallback(() => {
    if (pagination.currentPage > 1 && !isLoading) {
      setFilters(prev => ({
        ...prev,
        page: (prev.page ?? 1) - 1
      }));
    }
  }, [pagination.currentPage, isLoading, setFilters]);

  const addCardsIntoDeck = useCallback((card: Card) => {

    if (card?.card_status?.label.toLowerCase() === STATUS_FORBIDDEN.toLowerCase()) {
      return;
    }

    const cardType = card?.card_type || card?.cardType?.label || "";
    const isExtraDeck = EXTRA_DECK_LABELS.includes(cardType);

    const currentCards = myDeck?.deck_cards || [];
    const mainDeckCards = currentCards.filter(
      (deckCard) => {
        const deckCardType = deckCard.card?.card_type || deckCard.card?.cardType?.label || "";
        return !EXTRA_DECK_LABELS.includes(deckCardType);
      }
    );
    const extraDeckCards = currentCards.filter(
      (deckCard) => {
        const deckCardType = deckCard.card?.card_type || deckCard.card?.cardType?.label || "";
        return EXTRA_DECK_LABELS.includes(deckCardType);
      }
    );

    const mainDeckTotal = mainDeckCards.reduce((acc, card) => acc + card.quantity, 0);
    const extraDeckTotal = extraDeckCards.reduce((acc, card) => acc + card.quantity, 0);

    // Vérifier les limites du deck
    if (isExtraDeck && extraDeckTotal >= 15) {
      toast.error("L'ExtraDeck ne peut contenir que maximum 15 cartes.");
      return;
    }

    if (!isExtraDeck && mainDeckTotal >= 60) {
      toast.error("Le MainDeck ne peut contenir que maximum 60 cartes.");
      return;
    }

    // Obtenir la limite depuis card_status.limit (par défaut 3 si non défini)
    const cardLimit = card?.card_status?.limit || 3;

    // S'assurer que myDeck.cards existe
    if (!myDeck?.deck_cards) {
      setMyDeck((prev) => ({
        ...prev,
        deck_cards: [{ card: card, img_url: card.img_url, quantity: 1 }],
      }));
      return;
    }

    const totalQuantityInDeck = myDeck.deck_cards
      .filter((deckCard) => deckCard.card.id === card.id)
      .reduce((acc, deckCard) => acc + deckCard.quantity, 0);

    if (totalQuantityInDeck >= cardLimit) {
      toast.error(`Limite de ${cardLimit} exemplaire(s) atteinte pour cette carte.`);
      return;
    }

    const cardIndex = myDeck.deck_cards.findIndex(
      (deckCard) =>
        deckCard.card.id === card.id && deckCard.img_url === card.img_url
    );

    if (cardIndex >= 0) {
      const existingCard = myDeck.deck_cards[cardIndex];

      const wouldAddToMainDeck = !isExtraDeck;
      const wouldAddToExtraDeck = isExtraDeck;

      if (wouldAddToExtraDeck && extraDeckTotal >= 15) {
        toast.error("L'ExtraDeck ne peut contenir que maximum 15 cartes.");
        return;
      }

      if (wouldAddToMainDeck && mainDeckTotal >= 60) {
        toast.error("Le MainDeck ne peut contenir que maximum 60 cartes.");
        return;
      }

      const newQuantity = Math.min(existingCard.quantity + 1, cardLimit - (totalQuantityInDeck - existingCard.quantity));

      setMyDeck((prev) => ({
        ...prev,
        deck_cards: (prev.deck_cards ?? []).map((deckCard, index) =>
          index === cardIndex
            ? { ...deckCard, quantity: newQuantity }
            : deckCard
        ),
      }));
    } else {
      if (totalQuantityInDeck >= cardLimit) {
        toast.error(`Limite de ${cardLimit} exemplaire(s) atteinte pour cette carte.`);
        return;
      }

      setMyDeck((prev) => ({
        ...prev,
        deck_cards: [...(prev.deck_cards ?? []), { card: card, img_url: card.img_url, quantity: 1 }],
      }));
    }
  }, [myDeck, setMyDeck, EXTRA_DECK_LABELS]);

  // Mémoriser le rendu des cartes pour éviter les re-rendus inutiles
  const renderedCards = useMemo(() => {
    if (!researchedCards || researchedCards.length === 0) {
      return (
        <div className="col-span-12 text-center py-8 text-gray-500">
          {isLoading ? "Chargement..." : "Aucune carte trouvée"}
        </div>
      );
    }

    return researchedCards.map((card) => {
      if (!card?.id) return null;

      const totalQuantityInDeck = myDeck?.deck_cards
        ?.filter((deckCard) => deckCard.card.id === card.id)
        .reduce((acc, deckCard) => acc + deckCard.quantity, 0) || 0;

      const cardLimit = card?.card_status?.limit || 3;

      const hasReachedLimit = totalQuantityInDeck >= cardLimit;
      const isForbidden = card?.card_status?.label.toLowerCase() === STATUS_FORBIDDEN.toLowerCase();
      const shouldDisable = hasReachedLimit || isForbidden;
      const cardStatusLabel = card?.card_status?.label ? card?.card_status?.label?.toLowerCase() : STATUS_UNLIMITED.toLowerCase();

      return (
        <div key={card.id} className="col-span-4 relative">
          <div
            key={card.id}
            className={`p-1 hover:saturate-150 relative transition-opacity ${shouldDisable ? "grayscale opacity-50 cursor-not-allowed" : "cursor-pointer"
              }`}
            onClick={() => {
              if (!shouldDisable) {
                addCardsIntoDeck(card);
              }
            }}
            title={
              isForbidden
                ? "Cette carte est interdite"
                : hasReachedLimit
                  ? `Limite de ${cardLimit} exemplaire(s) atteinte`
                  : totalQuantityInDeck > 0
                    ? `${totalQuantityInDeck}/${cardLimit} exemplaire(s) dans le deck`
                    : "Cliquez pour ajouter au deck"
            }
          >
            <img
              src={card?.img_url || ""}
              alt={card?.name || "Carte"}
              loading="lazy"
              className="w-full h-auto"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `${import.meta.env.BASE_URL}assets/waiting_archetype_image.jpg`;
              }}
            />
            {totalQuantityInDeck > 0 && (
              <div className="absolute bottom-0 left-0 bg-black bg-opacity-70 text-white text-xs px-1 rounded">
                {totalQuantityInDeck}/{cardLimit}
              </div>
            )}
          </div>
          {cardStatusLabel && (
            <div className="absolute top-0 right-0 w-1/3">
              <img
                src={`${import.meta.env.BASE_URL}assets/banlistCardStatusIcon/${cardStatusLabel}.png`}
                alt={cardStatusLabel}
                loading="lazy"
              />
            </div>
          )}
        </div>
      );
    });
  }, [researchedCards, isLoading, myDeck, addCardsIntoDeck]);

  return (
    <div className="bg-gray-200 col-span-3 p-2 rounded">
      <div className="grid grid-cols-12 gap-1">
        <div className="col-span-12 relative">
          {isLoading && (
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
            </div>
          )}
        </div>
      </div>
      <div
        className="overflow-y-auto bg-white grid grid-cols-12"
        style={{ height: "400px" }}
      >
        {renderedCards}
      </div>

      <div className="flex justify-around items-center mt-2">
        <FaAngleLeft
          className={`h-8 transition-opacity ${pagination.currentPage <= 1 || isLoading
            ? "invisible opacity-0 cursor-not-allowed"
            : "cursor-pointer hover:opacity-70"
            }`}
          onClick={decreasePage}
          aria-label="Page précédente"
        />
        <p className="font-medium">
          {pagination.currentPage} / {pagination.totalPages || 1}
        </p>
        <FaAngleRight
          className={`h-8 transition-opacity ${pagination.currentPage >= pagination.totalPages || isLoading
            ? "invisible opacity-0 cursor-not-allowed"
            : "cursor-pointer hover:opacity-70"
            }`}
          onClick={increasePage}
          aria-label="Page suivante"
        />
      </div>
    </div>
  );
};

export default DeckCardsSearcher;
