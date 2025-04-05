import React, { useEffect, useState } from "react";
import { FaTrashAlt } from "react-icons/fa";
import AddCard from "../../../generic/AddCard";
import { getCardTypes } from "../../../../services/cardtype";
import { getCardStatus } from "../../../../services/cardStatus";

const AdminArchetypeUpdateFormikCardData = ({
  newArchetype,
  setNewArchetype,
}) => {
  const [cardsRefresh, setCardsRefresh] = useState(false);
  const [cardTypes, setCardTypes] = useState([]);
  const [cardStatus, setCardStatus] = useState([]);

  const deleteCard = (cardId) => {
    const updatedCards = newArchetype.cards.filter(
      (card) => card.card.id !== cardId
    );

    setNewArchetype((prevState) => ({
      ...prevState,
      cards: updatedCards,
    }));
  };

  useEffect(() => {
    setCardsRefresh(false);
    getCardTypes(setCardTypes);
    getCardStatus(setCardStatus);
  }, [cardsRefresh, newArchetype]);

  return (
    <div className="bg-gray-300 mt-4 rounded p-2">
      <h2 className="font-bold text-xl">Cartes de l'archetypes :</h2>
      {/* Afficher les cartes déjà dans l'archetype */}
      <div className="bg-gray-300 grid grid-cols-12 gap-2">
        <div className="bg-gray-400 col-span-8 mt-2 p-3 rounded">
          <div
            className={`overflow-y-auto h-full grid gap-2 ${
              newArchetype.cards.length > 0 && "grid-cols-12"
            } bg-white p-2 rounded`}
          >
            {newArchetype.cards.length > 0
              ? newArchetype.cards
                  .sort(function (a, b) {
                    const cardTypeOrder = new Map(
                      cardTypes.map((type, index) => [type.label, index])
                    );
                    const orderA = cardTypeOrder.get(a.card.card_type);
                    const orderB = cardTypeOrder.get(b.card.card_type);
                    return orderA - orderB || a.card.level - b.card.level;
                  })
                  .map((card, index) => {
                    const cardIndex = newArchetype.cards.findIndex(
                      (archCard) => archCard.card.id === card.card.id
                    );

                    return (
                      <div
                        key={index}
                        className="lscreen:col-span-3 sscreen:col-span-3 col-span-4"
                      >
                        <div className="relative">
                          <img
                            className="hover:saturate-150 pointer-cursor"
                            src={`${card?.card.img_url}`}
                            alt=""
                          />
                          <div
                            style={{ width: `30px`, height: "30px" }}
                            className="absolute top-0 shadow-md shadow-gray-800 left-0 bg-red-500 cursor-pointer border border-red-800 border-2 flex justify-center items-center rounded-full text-white p-2"
                            onClick={() => {
                              console.log(card.card.id);
                              deleteCard(card.card.id);
                            }}
                          >
                            <FaTrashAlt />
                          </div>
                        </div>
                        <input
                          type="text"
                          value={card.explanation_text}
                          onChange={(e) => {
                            setNewArchetype((prevState) => {
                              const updatedCards = [...prevState.cards];
                              updatedCards[cardIndex] = {
                                ...updatedCards[cardIndex],
                                explanation_text: e.target.value
                              };
                              return { ...prevState, cards: updatedCards };
                            });
                          }}
                        />
                        <div>
                          <select
                            defaultValue={""}
                            className="w-full mt-2 p-1"
                            value={card.card_status.id}
                            onChange={(e) => {
                              setNewArchetype((prevState) => {
                                const updatedCards = [...prevState.cards];
                                updatedCards[cardIndex] = {
                                  ...updatedCards[cardIndex],
                                  card_status: {
                                    id: Number(e.target.value),
                                  },
                                };
                                return { ...prevState, cards: updatedCards };
                              });
                            }}
                          >
                            <option value="" disabled>
                              ------
                            </option>
                            {cardStatus?.map((option, index) => {
                              return (
                                <option key={index} value={option.id}>
                                  {option.label}
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
        <AddCard
          newArchetype={newArchetype}
          setNewArchetype={setNewArchetype}
        />
      </div>
    </div>
  );
};

export default AdminArchetypeUpdateFormikCardData;
