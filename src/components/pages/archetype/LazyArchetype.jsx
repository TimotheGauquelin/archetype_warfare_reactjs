import React, { useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { sortingCardsFromCardTypeLabelAndLevelAndName } from "../../../constant/genericMethod";
import Card from "../../generic/Card";

const LazyArchetype = ({ arch, banlistCards, cardTypes }) => {
  const [cardPopUp, setCardPopUp] = useState(false);

  return (
    <div>
      <div
        className="inline-block p-2"
        style={{
          borderRadius: "10px 10px 0px 0px",
          background: arch.colorItem,
          color: arch.colorText,
        }}
      >
        {arch.label}
      </div>
      <div className="bg-white p-4 grid grid-cols-12 gap-4 mb-4">
        {arch?.cards
          ?.sort(function (a, b) {
            return sortingCardsFromCardTypeLabelAndLevelAndName(
              cardTypes,
              a,
              b
            );
          })
          .map((card, cardIndex) => {
            let findIndex = banlistCards.findIndex(
              (bc) => bc.card.id === card.id
            );
            let status = banlistCards[findIndex]?.cardStatus.label;

            return <Card cardIndex={cardIndex} card={card} status={status} />;
          })}
      </div>
    </div>
  );
};

export default LazyArchetype;
