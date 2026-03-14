import { useEffect, useState, useMemo } from "react";
import AddCardModule from "../../../generic/AddCardModule";
import { getCardStatus } from "../../../../services/cardStatus";
import { getCardTypes } from "../../../../services/cardtype";
import type { Archetype } from "../../../../types";
import BanlistCardComponent from "../../../generic/BanlistCard";

interface CardStatus {
  id: number;
  label: string;
  limit?: number;
  [key: string]: unknown;
}

interface CardType {
  id: number;
  label: string;
  num_order?: number;
  [key: string]: unknown;
}

interface AdminArchetypeUpdateFormikCardDataProps {
  newArchetype: Archetype;
  setNewArchetype: React.Dispatch<React.SetStateAction<Archetype>>;
  activeTab: string;
}

const AdminArchetypeUpdateFormikCardData: React.FC<AdminArchetypeUpdateFormikCardDataProps> = ({
  newArchetype,
  setNewArchetype,
  activeTab,
}) => {
  const [cardsRefresh, setCardsRefresh] = useState(false);
  const [cardStatus, setCardStatus] = useState<CardStatus[]>([]);
  const [cardTypes, setCardTypes] = useState<CardType[]>([]);

  const deleteCard = (cardId: number) => {
    const updatedCards = newArchetype?.cards?.filter(
      (card) => card.card.id !== cardId
    );

    setNewArchetype((prevState: Archetype) => ({
      ...prevState,
      cards: updatedCards,
    }));
  };

  const sortedCards = useMemo(() => {
    if (!newArchetype?.cards || !cardTypes.length) return [];

    return [...newArchetype.cards].sort((a, b) => {
      const cardTypeA = cardTypes.find(
        (type) => type.label === a.card.card_type
      );
      const cardTypeB = cardTypes.find(
        (type) => type.label === b.card.card_type
      );

      if (cardTypeA && cardTypeB && cardTypeA.num_order !== undefined && cardTypeB.num_order !== undefined) {
        // Tri par type de carte
        const typeComparison = cardTypeA.num_order - cardTypeB.num_order;
        if (typeComparison !== 0) return typeComparison;

        // Tri par ATK (décroissant)
        const atkComparison = (b.card.atk || 0) - (a.card.atk || 0);
        if (atkComparison !== 0) return atkComparison;

        // Tri par niveau (décroissant)
        return (b.card.level || 0) - (a.card.level || 0);
      }
      
      return 0;
    });
  }, [newArchetype?.cards, cardTypes]);

  useEffect(() => {
    setCardsRefresh(false);
    getCardStatus(setCardStatus);
    getCardTypes(setCardTypes);
  }, [cardsRefresh, newArchetype]);

  return (
    <div className={`bg-gray-300 rounded p-2 ${activeTab === "cards" ? "" : "hidden"}`}>
      <h2 className="font-bold text-xl">Cartes de l'archetypes :</h2>
      {/* Afficher les cartes déjà dans l'archetype */}
      <div className="bg-gray-300 grid grid-cols-12 gap-1">
        <div className="bg-gray-400 col-span-8 mt-2 p-3 rounded">
          <div
            className={`overflow-y-auto h-full grid gap-1 ${sortedCards.length > 0 && "grid-cols-3"
              } bg-white p-2 rounded`}
          >
            {sortedCards.length > 0
              ? sortedCards.map((card) => {
                const cardIndex = newArchetype?.cards?.findIndex(
                  (archCard: { card: { id: number } }) => archCard.card.id === card.card.id
                );
                return (
                    <BanlistCardComponent
                      key={card.card.id}
                      card={card as any}
                      cardStatus={cardStatus}
                      deleteCard={deleteCard}
                      canBeUnlimited={true}
                      updateCardStatus={(_, statusId) => {
                        if (cardIndex !== undefined && cardIndex >= 0) {
                          setNewArchetype((prevState: Archetype) => {
                            const updatedCards = [...(prevState.cards || [])];
                            if (updatedCards[cardIndex]) {
                              updatedCards[cardIndex] = {
                                ...updatedCards[cardIndex],
                                card_status: {
                                  id: Number(statusId),
                                  label: '',
                                },
                              };
                            }
                            return { ...prevState, cards: updatedCards };
                          });
                        }
                      }}
                      updateCardExplanation={(_, explanation) => {
                        if (cardIndex !== undefined && cardIndex >= 0) {
                          setNewArchetype((prevState: Archetype) => {
                            const updatedCards = [...(prevState.cards || [])];
                            if (updatedCards[cardIndex]) {
                              updatedCards[cardIndex] = {
                                ...updatedCards[cardIndex],
                                explanation_text: explanation,
                              };
                            }
                            return { ...prevState, cards: updatedCards };
                          });
                        }
                      }}
                    />
                );
              })
              : "Cet archétype ne possède aucune carte"}
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

export default AdminArchetypeUpdateFormikCardData;