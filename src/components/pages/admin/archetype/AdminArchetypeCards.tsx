import React, { useEffect, useMemo, useState, useCallback } from "react";
import AddCardModule from "../../../generic/AddCardModule";
import { getCardStatus } from "../../../../services/cardStatus";
import { getCardTypes } from "../../../../services/cardtype";
import { sortedDeck } from "../../../../utils/functions/sortedDeck";
import type { Archetype, BanlistCard } from "../../../../types";
import BanlistCardComponent from "../../../generic/BanlistCard";

interface AdminArchetypeCardsProps {
  newArchetype: Archetype;
  setNewArchetype: React.Dispatch<React.SetStateAction<Archetype>>;
}

const AdminArchetypeCards: React.FC<AdminArchetypeCardsProps> = ({ newArchetype, setNewArchetype }) => {
  const [cardsRefresh, setCardsRefresh] = useState(false);
  const [cardStatus, setCardStatus] = useState<Array<{ id: number; label: string; limit?: number }>>([]);
  const [cardTypes, setCardTypes] = useState<Array<{ id: number; label: string }>>([]);

  const deleteCard = useCallback((cardId: number) => {
    setNewArchetype((prevState) => ({
      ...prevState,
      cards: prevState?.cards?.filter((card) => card.card.id !== cardId) || [],
    }));
  }, [setNewArchetype]);

  const updateCardExplanation = useCallback((cardId: number, explanation: string) => {
    setNewArchetype((prevState) => {
      const updatedCards = prevState?.cards?.map((card) =>
        card.card.id === cardId
          ? { ...card, explanation_text: explanation }
          : card
      ) || [];
      return { ...prevState, cards: updatedCards };
    });
  }, [setNewArchetype]);

  const updateCardStatus = useCallback((cardId: number, statusId: string | number) => {
    setNewArchetype((prevState) => {
      const updatedCards = prevState?.cards?.map((card) =>
        card.card.id === cardId
          ? {
              ...card,
              card_status_id: Number(statusId),
              // `BanlistCard` lit `card.card_status.id` pour piloter le <select>.
              card_status: {
                ...card.card_status,
                id: Number(statusId),
              },
            }
          : card
      ) || [];
      return { ...prevState, cards: updatedCards };
    });
  }, [setNewArchetype]);

  const sortedCards = useMemo(() => {
    if (!newArchetype?.cards || !cardTypes.length) return [];
    const deckCards = newArchetype.cards.map((banlistCard) => ({
      card: banlistCard.card,
      quantity: 1,
    }));
    const sortedDeckCards = sortedDeck(deckCards, cardTypes);
    return sortedDeckCards.map((deckCard) => {
      const originalBanlistCard = newArchetype.cards?.find(
        (bc) => bc.card.id === deckCard.card.id
      );
      return originalBanlistCard || {
        id: 0,
        card: deckCard.card,
        card_status: { id: 4, label: "" },
        card_status_id: 4,
      };
    });
  }, [newArchetype?.cards, cardTypes]);

  useEffect(() => {
    setCardsRefresh(false);
    getCardStatus(setCardStatus);
    getCardTypes(setCardTypes);
  }, [cardsRefresh, newArchetype]);

  return (
    <div className="bg-gray-100 border border-gray-200 rounded p-2.5 tablet:p-3 space-y-3">
      <h2 className="font-semibold text-base tablet:text-lg text-gray-900">
        Cartes de l&apos;archétype
      </h2>
      <div className="grid grid-cols-12 gap-2 tablet:gap-4">
        <div className="bg-white border border-gray-200 col-span-12 sscreen:col-span-8 p-2 tablet:p-3 rounded-lg order-2 sscreen:order-1">
          <div
            className={`overflow-y-auto grid gap-1 ${
              sortedCards.length > 0 && "grid-cols-2 tablet:grid-cols-3"
            } bg-white p-1 tablet:p-2 rounded`}
            style={{ maxHeight: "600px" }}
          >
            {sortedCards.length > 0 ? (
              sortedCards.map((card: BanlistCard) => (
                <BanlistCardComponent
                  key={card.card.id}
                  card={card}
                  cardStatus={cardStatus}
                  deleteCard={deleteCard}
                  canBeUnlimited={true}
                  updateCardStatus={(_, statusId) => updateCardStatus(card.card.id, statusId)}
                  updateCardExplanation={(_, explanation) =>
                    updateCardExplanation(card.card.id, explanation)
                  }
                />
              ))
            ) : (
              <div className="col-span-12 text-center text-gray-500 py-8">
                Cet archétype ne possède aucune carte
              </div>
            )}
          </div>
        </div>
        <AddCardModule
          newArchetype={newArchetype}
          setNewArchetype={setNewArchetype}
        />
      </div>
    </div>
  );
};

export default AdminArchetypeCards;
