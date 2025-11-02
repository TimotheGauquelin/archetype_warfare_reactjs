import React, { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { searchCards, searchCardsWithoutArchetypeAndByOneArchetypeId } from "../../../../services/card";
import { debounce } from "../../../../utils/functions/debounce";

const DeckCardsSearcher = ({ myDeck, setMyDeck }) => {
  const [researchedCards, setResearchedCards] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
    currentPage: 1,
    pageSize: 30,
  });
  const [filters, setFilters] = useState({
    name: "",
    page: 1,
    size: 30,
  });

  // Ref pour stocker l'AbortController actuel
  const abortControllerRef = useRef(null);

  // Fonction de recherche avec gestion d'annulation
  const performSearch = useCallback((name, page, size) => {
    // Annuler la requête précédente si elle existe
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Créer un nouveau AbortController
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
      null, // card_type
      null, // level
      null, // min_atk
      null, // max_atk
      null, // min_def
      null, // max_def
      null, // attribute
      signal // Passer le signal pour l'annulation
    );
  }, []);

  // Debounce de la recherche avec 500ms de délai
  const debouncedSearch = useMemo(
    () => debounce((name, page, size) => {
      performSearch(name, page, size);
    }, 500),
    [performSearch]
  );

  // Effet pour la recherche avec debounce
  useEffect(() => {
    // Si le nom est vide et qu'on est sur la page 1, charger la première page
    if (filters.name === "" && filters.page === 1) {
      performSearch("", 1, filters.size);
    } else {
      debouncedSearch(filters.name, filters.page, filters.size);
    }

    // Cleanup : annuler la requête en cours si le composant se démonte
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [filters.name, filters.page, filters.size, debouncedSearch, performSearch]);

  const increasePage = useCallback(() => {
    if (pagination.currentPage < pagination.totalPages && !isLoading) {
      setFilters(prev => ({
        ...prev,
        page: prev.page + 1
      }));
    }
  }, [pagination.currentPage, pagination.totalPages, isLoading]);

  const decreasePage = useCallback(() => {
    if (pagination.currentPage > 1 && !isLoading) {
      setFilters(prev => ({
        ...prev,
        page: prev.page - 1
      }));
    }
  }, [pagination.currentPage, isLoading]);

  // Handler pour la recherche avec reset de la page
  const handleSearchChange = useCallback((e) => {
    const value = e.target.value;
    setFilters(prev => ({
      ...prev,
      name: value,
      page: 1 // Reset à la page 1 lors d'une nouvelle recherche
    }));
  }, []);

  const addCardsIntoDeck = useCallback((card) => {

    console.log("card=============", card);

    if (card?.card_status?.label === "Forbidden" || card?.card_status?.label === "Interdit") {
      return; // Ne pas ajouter de carte interdite
    }

    // Obtenir la limite depuis card_status.limit (par défaut 3 si non défini)
    const cardLimit = card?.card_status?.limit || 3;

    // S'assurer que myDeck.cards existe
    if (!myDeck?.cards) {
      setMyDeck((prev) => ({
        ...prev,
        cards: [{ card: card, img_url: card.img_url, quantity: 1 }],
      }));
      return;
    }

    // Trouver l'index de la carte dans le deck
    const cardIndex = myDeck.cards.findIndex(
      (deckCard) =>
        deckCard.card.id === card.id && deckCard.img_url === card.img_url
    );

    // Si la carte est déjà dans le deck
    if (cardIndex >= 0) {
      const existingCard = myDeck.cards[cardIndex];

      // Vérifier si on a déjà atteint la limite définie par card_status.limit
      if (existingCard.quantity >= cardLimit) {
        // Limite atteinte, ne pas ajouter
        return;
      }

      // Incrémenter la quantité (maximum défini par card_status.limit)
      const newQuantity = Math.min(existingCard.quantity + 1, cardLimit);

      setMyDeck((prev) => ({
        ...prev,
        cards: prev.cards.map((deckCard, index) =>
          index === cardIndex
            ? { ...deckCard, quantity: newQuantity }
            : deckCard
        ),
      }));
    } else {
      // Nouvelle carte, l'ajouter avec quantité 1
      setMyDeck((prev) => ({
        ...prev,
        cards: [...prev.cards, { card: card, img_url: card.img_url, quantity: 1 }],
      }));
    }
  }, [myDeck, setMyDeck]);

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

      // Vérifier si la carte est déjà dans le deck et sa quantité
      const deckCard = myDeck?.cards?.find(
        (deckCard) =>
          deckCard.card.id === card.id && deckCard.img_url === card.img_url
      );

      // Obtenir la limite depuis card_status.limit (par défaut 3 si non défini)
      const cardLimit = card?.card_status?.limit || 3;

      const isInDeck = !!deckCard;
      const hasReachedLimit = deckCard?.quantity >= cardLimit;
      const isForbidden = card?.card_status?.label === "Forbidden" || card?.card_status?.label === "Interdit";
      const shouldDisable = hasReachedLimit || isForbidden;
      const cardStatusLabel = card?.card_status?.label ? card?.card_status?.label?.toLowerCase() : "unlimited";

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
                  : isInDeck
                    ? `${deckCard.quantity}/${cardLimit} exemplaire(s) dans le deck`
                    : "Cliquez pour ajouter au deck"
            }
          >
            <img
              src={card?.img_url || ""}
              alt={card?.name || "Carte"}
              loading="lazy"
              className="w-full h-auto"
              onError={(e) => {
                e.target.src = `${process.env.PUBLIC_URL}/assets/waiting_archetype_image.jpg`;
              }}
            />
            {isInDeck && (
              <div className="absolute bottom-0 left-0 bg-black bg-opacity-70 text-white text-xs px-1 rounded">
                {deckCard.quantity}/{cardLimit}
              </div>
            )}
          </div>
          {cardStatusLabel && (
            <div className="absolute top-0 right-0 w-1/3">
              <img
                src={`${process.env.PUBLIC_URL}/assets/banlistCardStatusIcon/${cardStatusLabel}.png`}
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
    <div className="bg-gray-400 col-span-3 ml-1 p-3 rounded">
      <div className="grid grid-cols-12 gap-2">
        <div className="col-span-12 relative">
          <input
            className="w-full p-1"
            type="text"
            placeholder="Quelle carte recherchez-vous ?"
            onChange={handleSearchChange}
            disabled={isLoading}
          />
          {isLoading && (
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
            </div>
          )}
        </div>
      </div>
      <div
        className="overflow-y-auto bg-white grid grid-cols-12 mt-2"
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
