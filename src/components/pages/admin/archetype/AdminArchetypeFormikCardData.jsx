import { Field } from "formik";
import React, { useEffect, useState } from "react";
import { FaTrashAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import FormikAddCard from "../../../generic/FormikAddCard";

const AdminArchetypeFormikCardData = ({
  archetypeCards,
  setArchetypeCards,
  orderedCardTypes,
  archetype,
  cardTypes,
}) => {
  const [cardsRefresh, setCardsRefresh] = useState(false);

  const deleteCard = (cardId, cardName) => {
    var archetypeCardsCopy = archetypeCards;
    const findex = archetypeCardsCopy.findIndex(
      (archetypeCard) => archetypeCard.id === cardId
    );

    archetypeCardsCopy.splice(findex, 1);
    setArchetypeCards(archetypeCardsCopy);
    setCardsRefresh(true);
    toast.success(`${cardName} a été supprimé de l'archétype`);
  };

  useEffect(() => {
    setCardsRefresh(false);
  }, [cardsRefresh]);

  return (
    <div className="bg-gray-300 mt-4 rounded p-2">
      <h2 className="font-bold text-xl">Cartes de l'archetypes :</h2>
      {/* Afficher les cartes déjà dans l'archetype */}
      <div className="bg-gray-300 grid grid-cols-12 gap-2">
        <div className="bg-gray-400 col-span-9 mt-2 p-3 rounded">
          <div
            className={`overflow-y-auto col-span-8 grid bg-white p-2 rounded ${
              archetypeCards.length > 0 && "grid-cols-12"
            } gap-4 ${archetypeCards.length === 0 && "text-red-500 my-2"}`}
            style={{ height: "400px" }}
          >
            {archetypeCards.length > 0
              ? archetypeCards
                  .sort(function (a, b) {
                    return (
                      orderedCardTypes.indexOf(a.cardType?.label) -
                        orderedCardTypes.indexOf(b.cardType?.label) ||
                      a.level - b.level
                    );
                  })
                  .map((card, index) => {
                    return (
                      <div
                        key={index}
                        className="lscreen:col-span-2 sscreen:col-span-3 col-span-4"
                      >
                        <div className="relative">
                          <img
                            className="hover:saturate-150"
                            src={`${card?.imageUrl}`}
                            alt=""
                          />
                          <div
                            style={{ width: `30px`, height: "30px" }}
                            className="absolute top-0 shadow-md shadow-gray-800 right-0 bg-red-500 cursor-pointer border border-red-800 border-2 flex justify-center items-center rounded-full text-white p-2"
                            onClick={() => {
                              deleteCard(card.id, card.name);
                            }}
                          >
                            <FaTrashAlt />
                          </div>
                        </div>
                      </div>
                    );
                  })
              : "Cet archétype ne possède aucune carte"}
          </div>
        </div>

        <Field
          type="number"
          name="cards"
          researcherLabel="Archetype"
          cardTypes={cardTypes}
          cardTypesOrdered={orderedCardTypes}
          cards={archetype?.cards}
          archetypeCards={archetypeCards}
          setArchetypeCards={setArchetypeCards}
          component={FormikAddCard}
        />
      </div>
    </div>
  );
};

export default AdminArchetypeFormikCardData;
