import React, { useCallback, useMemo, useState } from "react";
import DeckCardsSearcher from "./DeckCardsSearcher";
import { EXTRA_DECK_LABELS } from "../../../../utils/const/extraDeckConst";
import { useAttributes } from "../../../../hooks/useAttributes";
import { useCardTypes } from "../../../../hooks/useCardTypes";
import AdminCardsFilter from "../../admin/cards/AdminCardsFilter";
import DeckCardsGrid from "../deckCommon/DeckCardsGrid";
import DeckSection from "../deckCommon/DeckSection";
import { sortedDeck } from "../../../../utils/functions/sortedDeck";
import type { Deck, DeckCard, CardSearchCriteria } from "../../../../types";

interface DeckCreatorProps {
  myDeck: Deck;
  setMyDeck: React.Dispatch<React.SetStateAction<Deck>>;
}

const DeckCreator: React.FC<DeckCreatorProps> = ({
  myDeck,
  setMyDeck,
}) => {

  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
    currentPage: 1,
    pageSize: 30,
  });
  const [filters, setFilters] = useState<CardSearchCriteria>({
    name: "",
    level: undefined,
    min_atk: undefined,
    max_atk: undefined,
    min_def: undefined,
    max_def: undefined,
    attribute: "",
    card_type: "",
    page: 1,
    size: 30,
  });
  const { attributes } = useAttributes();
  const { cardTypes } = useCardTypes();

  const { mainDeckCards, extraDeckCards, mainDeckTotal, extraDeckTotal } = useMemo(() => {
    if (!myDeck?.deck_cards) {
      return { mainDeckCards: [], extraDeckCards: [], mainDeckTotal: 0, extraDeckTotal: 0 };
    }

    const main: DeckCard[] = [];
    const extra: DeckCard[] = [];

    myDeck.deck_cards.forEach((deckCard: DeckCard) => {
      const cardType = deckCard.card?.card_type || deckCard.card?.cardType?.label || "";
      const isExtraDeck = EXTRA_DECK_LABELS.includes(cardType);

      if (isExtraDeck) {
        extra.push(deckCard);
      } else {
        main.push(deckCard);
      }
    });

    const mainTotal = main.reduce((acc, card) => acc + card.quantity, 0);
    const extraTotal = extra.reduce((acc, card) => acc + card.quantity, 0);

    return { mainDeckCards: main, extraDeckCards: extra, mainDeckTotal: mainTotal, extraDeckTotal: extraTotal };
  }, [myDeck?.deck_cards, EXTRA_DECK_LABELS]);

  const removeCardFromDeck = useCallback((deckCard: DeckCard) => {
    if (!myDeck?.deck_cards) return;

    const cardIndex = myDeck.deck_cards.findIndex(
      (card: DeckCard) =>
        card.card.id === deckCard.card.id && card.img_url === deckCard.img_url
    );

    if (cardIndex === -1) return;

    const existingCard = myDeck.deck_cards[cardIndex];

    // Si la quantité est supérieure à 1, décrémenter
    if (existingCard.quantity > 1) {
      setMyDeck((prev) => ({
        ...prev,
        deck_cards: (prev.deck_cards ?? []).map((card: DeckCard, index: number) =>
          index === cardIndex
            ? { ...card, quantity: card.quantity - 1 }
            : card
        ),
      }));
    } else {
      // Si la quantité est à 1, retirer la carte du tableau
      setMyDeck((prev) => ({
        ...prev,
        deck_cards: (prev.deck_cards ?? []).filter((_: DeckCard, index: number) => index !== cardIndex),
      }));
    }
  }, [myDeck, setMyDeck]);

  const resetAllFilters = () => {
    setFilters({
      name: "",
      level: undefined,
      min_atk: undefined,
      max_atk: undefined,
      min_def: undefined,
      max_def: undefined,
      attribute: "",
      card_type: "",
      page: 1,
      size: 30,
    });
    setPagination({
      total: 0,
      totalPages: 0,
      currentPage: 1,
      pageSize: 30,
    });
  };

  const sortedMainDeckCards = useMemo(() => {
    return sortedDeck(mainDeckCards, cardTypes);
  }, [mainDeckCards, cardTypes]);

  const sortedExtraDeckCards = useMemo(() => {
    return sortedDeck(extraDeckCards, cardTypes);
  }, [extraDeckCards, cardTypes]);

  if (!myDeck.archetype_id) {
    return (
      <div className="mt-2 p-4 bg-gray-300 rounded-lg">
        <p className="text-center py-4 text-gray-500">
          Veuillez sélectionner un archetype pour ajouter des cartes au deck
        </p>
      </div>
    )
  } else {
    return (
      <div className="mt-2 p-4 bg-gray-300 rounded-lg">
        <p className="font-bold text-lg mb-2">
          Ajout de cartes au deck
        </p>
        {mainDeckTotal < 40 && (
          <div className="mb-2 p-2 bg-yellow-100 text-yellow-800 rounded-md">
            <p className="font-semibold">
              ⚠️ Attention : Le deck n'est pas jouable. Le MainDeck doit contenir au minimum 40 cartes.
            </p>
          </div>
        )}

        <AdminCardsFilter
          cardTypes={cardTypes}
          criteria={filters}
          setCriteria={setFilters}
          resetAllFilters={resetAllFilters}
          attributes={attributes}
        />

        <div className="grid grid-cols-12 gap-1 mt-2">
          <div className="col-span-9">
            <DeckSection
              title="Cartes du MainDeck"
              badges={[
                {
                  label: "Monstre",
                  value: mainDeckCards
                    .filter((card) => card.card?.card_type?.includes("Monster"))
                    .reduce((acc, card) => acc + card.quantity, 0),
                  className: "bg-orange-200 text-orange-700 p-1 rounded-md",
                },
                {
                  label: "Magie",
                  value: mainDeckCards
                    .filter((card) => card.card?.card_type?.includes("Spell"))
                    .reduce((acc, card) => acc + card.quantity, 0),
                  className: "bg-green-200 text-green-700 p-1 rounded-md",
                },
                {
                  label: "Piège",
                  value: mainDeckCards
                    .filter((card) => card.card?.card_type?.includes("Trap"))
                    .reduce((acc, card) => acc + card.quantity, 0),
                  className: "bg-purple-200 text-purple-700 p-1 rounded-md",
                },
                {
                  label: "Total MainDeck",
                  value: `${mainDeckTotal}/60`,
                  className: `p-1 rounded-md ${mainDeckTotal >= 60 ? "bg-red-200 text-red-700" : "bg-red-200 text-red-700"}`,
                },
              ]}
            >
              <DeckCardsGrid cards={sortedMainDeckCards} onCardClick={removeCardFromDeck} />
            </DeckSection>
            <div className="mt-2">
              <DeckSection
                title="Cartes de l'ExtraDeck"
                badges={[
                  {
                    label: "Total ExtraDeck",
                    value: `${extraDeckTotal}/15`,
                    className: `p-1 rounded-md ${extraDeckTotal >= 15 ? "bg-red-200 text-red-700" : "bg-gray-300 text-gray-700"}`,
                  },
                ]}
              >
                <DeckCardsGrid cards={sortedExtraDeckCards} onCardClick={removeCardFromDeck} />
              </DeckSection>
            </div>
          </div>
          <DeckCardsSearcher
            myDeck={myDeck}
            setMyDeck={setMyDeck}
            filters={filters}
            setFilters={setFilters}
            pagination={pagination}
            setPagination={setPagination}
          />
        </div>
      </div>
    );
  }
};

export default DeckCreator;
