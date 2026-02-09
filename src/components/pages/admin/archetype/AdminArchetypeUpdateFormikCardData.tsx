import { useEffect, useState, useMemo } from "react";
import { FaTrashAlt } from "react-icons/fa";
import AddCardModule from "../../../generic/AddCardModule";
import { getCardStatus } from "../../../../services/cardStatus";
import { getCardTypes } from "../../../../services/cardtype";
import { cardStatusToFrench } from "../../../../utils/trad/cardStatus";
import type { Archetype } from "../../../../types";

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
            className={`overflow-y-auto h-full grid gap-1 ${sortedCards.length > 0 && "grid-cols-12"
              } bg-white p-2 rounded`}
          >
            {sortedCards.length > 0
              ? sortedCards.map((card, index) => {
                const cardIndex = newArchetype?.cards?.findIndex(
                  (archCard: { card: { id: number } }) => archCard.card.id === card.card.id
                );
                return (
                  <div
                    key={index}
                    className="lscreen:col-span-3 sscreen:col-span-3 col-span-4"
                  >
                    <div className="relative">
                      <img
                        className="hover:saturate-150 pointer-cursor"
                        src={`${card?.card?.img_url}`}
                        alt={(card?.card as { name?: string; card_name?: string } | undefined)?.name ?? (card?.card as { card_name?: string })?.card_name ?? ''}
                      />
                      <div
                        style={{ width: `30px`, height: "30px" }}
                        className="absolute top-0 shadow-md shadow-gray-800 left-0 bg-red-500 cursor-pointer border border-red-800 border-2 flex justify-center items-center rounded-full text-white p-2"
                        onClick={() => {
                          deleteCard(card.card.id);
                        }}
                      >
                        <FaTrashAlt />
                      </div>
                    </div>
                    <input
                      type="text"
                        value={(card.explanation_text as string | undefined) ?? ''}
                      onChange={(e) => {
                        if (cardIndex !== undefined && cardIndex >= 0) {
                          setNewArchetype((prevState: Archetype) => {
                            const updatedCards = [...(prevState.cards || [])];
                            if (updatedCards[cardIndex]) {
                              updatedCards[cardIndex] = {
                                ...updatedCards[cardIndex],
                                explanation_text: e.target.value
                              };
                            }
                            return { ...prevState, cards: updatedCards };
                          });
                        }
                      }}
                    />
                    <div>
                      <select
                        className="w-full mt-2 p-1"
                        value={card.card_status.id}
                        onChange={(e) => {
                          if (cardIndex !== undefined && cardIndex >= 0) {
                            setNewArchetype((prevState: Archetype) => {
                              const updatedCards = [...(prevState.cards || [])];
                              if (updatedCards[cardIndex]) {
                                updatedCards[cardIndex] = {
                                  ...updatedCards[cardIndex],
                                  card_status: {
                                    id: Number(e.target.value),
                                    label: ''
                                  }
                                };
                              }
                              return { ...prevState, cards: updatedCards };
                            });
                          }
                        }}
                      >
                        <option value="" disabled>
                          ------
                        </option>
                        {cardStatus?.map((option: CardStatus, index: number) => {
                          return (
                            <option key={index} value={option.id}>
                              {cardStatusToFrench(option.label)}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  </div>
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