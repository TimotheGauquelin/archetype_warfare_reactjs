import React from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";

const AdminResearcherCards = ({
  researchedCards,
  setPage,
  researchName,
  setResearchName,
  increasePage,
  decreasePage,
  currentPage,
  totalPages,
  newArchetype,
  setNewArchetype,
}) => {
  return (
    <div className="bg-gray-400 col-span-12 ml-1 p-3 rounded">
      <div className="grid grid-cols-12 gap-2">
        <input
          className={`w-full p-1 col-span-8`}
          value={researchName}
          // className={`w-full p-1 ${banlist ? `col-span-12` : `col-span-8`}`}
          type="text"
          placeholder="Quelle carte recherchez-vous ?"
          onChange={(e) => {
            setResearchName(e.target.value);
            setPage(1);
          }}
        />
        <div
          className="bg-yellow-300 hover:bg-yellow-400 shadow-md col-span-4 rounded text-white font-bold text-center cursor-pointer"
          onClick={() => {
            var allCards = [];
            researchedCards.cards.forEach((card, index) => {
              card = {
                card: card,
                explanation_text: "",
                card_status: { id: 4 },
                banlist_id: 1,
              };

              const isInsideArchetype = newArchetype.cards.some(
                (naCard) => card.card.id === naCard.card.id
              );
              // card = {
              //   ...card,
              //   explanation_text: "",
              //   card_status_id: 4,
              //   banlist_id: 1,
              // };

              // const isInsideArchetype = newArchetype.cards.some(
              //   (naCard) => card.id === naCard.id
              // );

              if (!isInsideArchetype) {
                allCards.push(card);
              }
            });

            setNewArchetype((prevState) => ({
              ...prevState,
              cards: [...prevState.cards, ...allCards],
            }));
            // toast.success(
            //   "Vous avez ajouté toutes les cartes de la selection !"
            // );
          }}
        >
          Ajouter tout
        </div>
      </div>
      <div
        className="overflow-y-auto bg-white grid grid-cols-12 mt-2"
        style={{ height: "400px" }}
      >
        {researchedCards?.cards?.map((card, index) => {
          /*  card = {
            ...card,
            explanation_text: "",
            card_status_id: 4,
            banlist_id: 1,
          };

          const isInsideArchetype = newArchetype.cards.some(
            (naCard) => card.id === naCard.id
          ); */

          card = {
            card: card,
            explanation_text: "",
            card_status: { id: 4 },
            banlist_id: 1,
          };

          const isInsideArchetype = newArchetype.cards.some(
            (naCard) => card.card.id === naCard.card.id
          );

          return (
            <div className="col-span-3 p-1 relative" key={index}>
              <img
                className={` hover:saturate-150  ${
                  isInsideArchetype ? "grayscale" : "cursor-pointer"
                }`}
                src={`${card?.card.img_url}`}
                alt=""
                onClick={() =>
                  !isInsideArchetype &&
                  setNewArchetype((prevState) => ({
                    ...prevState,
                    cards: [...prevState.cards, card],
                  }))
                }
              />
              {/* {insideArchetype && (
                <p
                  style={{ fontSize: "8px", padding: "2px" }}
                  className="absolute top-20 left-0 text-center w-full text-sm bg-yellow-500 text-white rounded"
                >
                  {insideArchetype?.archetype?.name}
                </p>
              )} */}
            </div>
          );
        })}
      </div>

      <div className="flex justify-around items-center">
        <FaAngleLeft
          className={`h-8 cursor-pointer ${currentPage <= 1 && "invisible"}`}
          onClick={() => decreasePage()}
        />
        <p>{currentPage}</p>
        <FaAngleRight
          className={`h-8 cursor-pointer ${
            currentPage >= totalPages && "invisible"
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
