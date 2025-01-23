import React from "react";

import { toast } from "react-toastify";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";

const AdminResearcherBanlistCards = ({
  researchedCards,
  researchedCurrentPage,
  setResearchedCardsLabel,
  previewCards,
  setPreviewCards,
  increasePage,
  decreasePage,
}) => {
  const addCardInsidePreview = (card) => {
    console.log(card);

    let previewCard = {
      archetype: null,
      card: {
        cardType: {
          label: card.type.includes("Monster")
            ? card.type
            : `${card.race} ${card.type.replace(" Card", "")}`,
        },
        id: card.id,
      },
      cardStatus: {
        label: "Interdit",
      },
      explanationText: "Aucun commentaire",
    };

    card["cardData"] = previewCard;

    setPreviewCards([...previewCards, card]);
    toast(`La carte ${card.name} a été ajouté à la preview !`);
  };

  return (
    <div className="bg-gray-400 col-span-3 ml-1 p-3 rounded">
      <input
        className="w-full p-1"
        type="text"
        placeholder="Quelle carte recherchez-vous ?"
        onChange={(e) => setResearchedCardsLabel(e.target.value)}
      />
      <div
        className="overflow-y-auto bg-white grid grid-cols-12 mt-2"
        style={{ height: "400px" }}
      >
        {researchedCards?.slice(0, 20).map((card, index) => {
          return (
            <img
              key={index}
              className="col-span-6 p-1 hover:saturate-150 cursor-pointer"
              src={`${card?.card_images[0]?.image_url}`}
              alt=""
              onClick={() => {
                addCardInsidePreview(card);
              }}
            />
          );
        })}
      </div>

      <div className="flex justify-around items-center">
        <FaAngleLeft className="h-8" onClick={() => decreasePage()} />
        <p>{researchedCurrentPage / 20 + 1}</p>
        <FaAngleRight
          className="h-8"
          onClick={() => {
            increasePage();
          }}
        />
      </div>
    </div>
  );
};

export default AdminResearcherBanlistCards;
