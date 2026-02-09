import React, { useEffect, useMemo, useState, useCallback } from "react";
import { FaTrashAlt } from "react-icons/fa";
import AddCardModule from "../../../generic/AddCardModule";
import { getCardStatus } from "../../../../services/cardStatus";
import { getCardTypes } from "../../../../services/cardtype";
import { cardStatusToFrench } from "../../../../utils/trad/cardStatus";
import { sortedDeck } from "../../../../utils/functions/sortedDeck";
import type { Archetype, BanlistCard } from "../../../../types";

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
          ? { ...card, card_status_id: Number(statusId) }
          : card
      ) || [];
      return { ...prevState, cards: updatedCards };
    });
  }, [setNewArchetype]);

  const sortedCards = useMemo(() => {
    console.log("ici", newArchetype?.cards);
    console.log("cardTypes", cardTypes);
    if (!newArchetype?.cards || !cardTypes.length) return [];
    // Convertir BanlistCard[] en DeckCard[] pour sortedDeck
    const deckCards = newArchetype.cards.map((banlistCard) => ({
      card: banlistCard.card,
      quantity: 1,
    }));
    const sortedDeckCards = sortedDeck(deckCards, cardTypes);
    // Reconvertir en BanlistCard[] en préservant les données originales
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
    <div className="bg-gray-300 rounded p-2">
      <h2 className="font-bold text-xl">Cartes de l'archetype :</h2>
      <div className="bg-gray-300 grid grid-cols-12 gap-1">
        <div className="bg-gray-400 col-span-8 mt-2 p-3 rounded">
          <div
            className={`overflow-y-auto h-full grid gap-1 ${
              sortedCards.length > 0 && "grid-cols-12"
            } bg-white p-2 rounded`}
            style={{ maxHeight: "600px" }}
          >
            {sortedCards.length > 0 ? (
              sortedCards.map((card: BanlistCard) => (
                <div
                  key={card.card.id}
                  className="lscreen:col-span-3 sscreen:col-span-3 col-span-3 bg-gray-200 p-1 rounded text-center"
                >
                  <div className="relative">
                      <img
                        src={card?.card?.img_url}
                        alt={card?.card?.name || "Carte"}
                        className="w-full h-auto"
                        loading="lazy"
                      />
                    <div
                      style={{ width: "30px", height: "30px" }}
                      className="absolute top-0 shadow-md shadow-gray-800 left-0 bg-red-500 cursor-pointer border border-red-800 border-2 flex justify-center items-center rounded-full text-white p-2 hover:bg-red-600 transition-colors"
                      onClick={() => deleteCard(card.card.id)}
                      title="Supprimer la carte"
                    >
                      <FaTrashAlt size={12} />
                    </div>
                  </div>
                  <textarea
                    className="w-full mt-2 p-2 border border-gray-300 rounded"
                    rows={3}
                    placeholder="Explication..."
                    value={card.explanation_text || ""}
                    onChange={(e) => updateCardExplanation(card.card.id, e.target.value)}
                  />
                  <div className="mt-2">
                    <select
                      className="w-full p-2 border border-gray-300 rounded"
                      value={String(card.card_status_id || card.card_status?.id || "")}
                      onChange={(e) => updateCardStatus(card.card.id, Number(e.target.value))}
                    >
                      <option value="" disabled>
                        ------
                      </option>
                      {cardStatus?.map((option) => (
                        <option key={option.id} value={option.id}>
                          {cardStatusToFrench(option.label)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
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
