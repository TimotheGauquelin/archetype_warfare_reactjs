import React from "react";

import { toast } from "react-toastify";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";

const AdminResearcherCards = ({
  researchedCards,
  pagination,
  setPagination,
  researcherLabel,
  setResearchedCardsLabel,
  name,
  banlist,
  setFieldValue,
  archetypeCards,
  setArchetypeCards,
  increasePage,
  decreasePage,
  researchedCardsLength,
  setCardsRefresh,
}) => {
  return (
    <div className="bg-gray-400 col-span-12 ml-1 p-3 rounded">
      <div className="grid grid-cols-12 gap-2">
        <input
          className={`w-full p-1 ${banlist ? `col-span-12` : `col-span-8`}`}
          type="text"
          placeholder="Quelle carte recherchez-vous ?"
          onChange={(e) => {
            setResearchedCardsLabel(e.target.value);
            setPagination(0);
          }}
        />
        {!banlist && (
          <div
            className="bg-yellow-300 hover:bg-yellow-400 col-span-4 rounded text-white font-bold text-center cursor-pointer"
            onClick={() => {
              var allCards = [];
              researchedCards?.forEach((card, index) => {
                const findex = archetypeCards?.find(
                  (archetypeCard) => archetypeCard?.id === card.id
                );
                if (!findex) {
                  allCards.push(card);
                }
              });

              setArchetypeCards([...archetypeCards, ...allCards]);
              setFieldValue(name, [...archetypeCards, ...allCards]);
              toast.success(
                "Vous avez ajouté toutes les cartes de la selection !"
              );
            }}
          >
            Ajouter tout
          </div>
        )}
      </div>
      <div
        className="overflow-y-auto bg-white grid grid-cols-12 mt-2"
        style={{ height: "400px" }}
      >
        {researchedCards?.map((card, index) => {
          const findex = banlist
            ? archetypeCards?.cards?.find(
                (banlistCard) => banlistCard?.card?.id === card.id
              )
            : archetypeCards?.find(
                (archetypeCard) => archetypeCard?.id === card.id
              );

          const insideArchetype = banlist
            ? ""
            : archetypeCards?.cards?.find(
                (ac) => ac?.card?.id === card.id && ac.archetype !== null
              );

          return (
            <div className="col-span-4 p-1 relative" key={index}>
              <img
                className={` hover:saturate-150  ${
                  findex ? "grayscale" : "cursor-pointer"
                } ${insideArchetype && "sepia"}`}
                src={`${card?.imageUrl}`}
                alt=""
                onClick={() => {
                  if (insideArchetype) {
                    toast.error(
                      `Deja dans l'archetype ${insideArchetype?.archetype?.name}`
                    );
                  }
                  if (!findex && !insideArchetype) {
                    console.log(card);
                    // eslint-disable-next-line no-unused-expressions
                    banlist
                      ? (archetypeCards?.cards.push({
                          archetype: null,
                          card: card,
                          cardStatus: { label: "Interdit" },
                          explanationText: "Aucune explication",
                        }),
                        console.log(archetypeCards),
                        setArchetypeCards(archetypeCards),
                        setCardsRefresh(true))
                      : (setArchetypeCards([...archetypeCards, card]),
                        setFieldValue(name, [...archetypeCards, card]));
                  } else if (findex && !insideArchetype) {
                    toast.error(
                      `Déjà dans ${banlist ? "la banlist" : "l'archétype"}`
                    );
                  }
                }}
              />
              {insideArchetype && (
                <p
                  style={{ fontSize: "8px", padding: "2px" }}
                  className="absolute top-20 left-0 text-center w-full text-sm bg-yellow-500 text-white rounded"
                >
                  {insideArchetype?.archetype?.name}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex justify-around items-center">
        <FaAngleLeft
          className={`h-8 cursor-pointer ${pagination < 1 && "invisible"}`}
          onClick={() => decreasePage()}
        />
        <p>{pagination + 1}</p>

        <FaAngleRight
          className={`h-8 cursor-pointer ${
            pagination >= researchedCardsLength / 20 - 1 && "invisible"
          }`}
          onClick={() => {
            increasePage();
          }}
        />
      </div>
    </div>
  );
};

export default AdminResearcherCards;
