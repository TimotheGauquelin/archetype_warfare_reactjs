import React, { useState } from "react";
import { cardStatusToFrench } from "../../utils/trad/cardStatus";
import type { CardWithBanlistStatus } from "../../types";

interface CardProps {
  card: CardWithBanlistStatus;
}

const Card: React.FC<CardProps> = ({ card }) => {
  const [cardPopUp, setCardPopUp] = useState(false);
  const isUnlimited = card.card_status?.label.toLowerCase() === "unlimited";

  return (
    <div
      className={`relative lscreen:col-span-2 sscreen:col-span-3 col-span-6 ${!isUnlimited ? "cursor-pointer" : ""}`}
      onMouseOver={!isUnlimited ? () => setCardPopUp(true) : undefined}
      onMouseOut={!isUnlimited ? () => setCardPopUp(false) : undefined}
    >
      <div className="relative border-text">
        <img
          src={card.card.img_url}
          alt={card?.card.name}
          loading="lazy"
          style={{ boxShadow: "rgba(0, 0, 0, 0.75) 1.95px 1.95px 2.6px" }}
        />
        {card.card_status && (
          <img
            className="absolute"
            style={{
              top: "-13px",
              right: "-10px",
              width: "30px",
            }}
            loading="lazy"
            src={
              import.meta.env.BASE_URL +
              `assets/banlistCardStatusIcon/${card.card_status.label.toLowerCase()}.png`
            }
            alt=""
          />
        )}
        {cardPopUp && !isUnlimited && (
          <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 z-50 w-max max-w-[400px] animate-fadeIn pointer-events-none">
            <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 shadow-lg">
              {card?.archetype?.name && (
                <p className="mb-1">
                  <span className="text-red-400 font-bold">Archetype : </span>
                  {card.archetype.name}
                </p>
              )}
              <p className="text-red-400 font-bold mb-1">
                Pourquoi cette carte est {cardStatusToFrench(card.card_status.label).toLowerCase()} :
              </p>
              <p className="text-gray-200">{card.explanation_text || ''}</p>
            </div>
            <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-[6px] border-x-transparent border-t-[6px] border-t-gray-900" />
          </div>
        )}
      </div>
    </div>
  );
};

export default Card;
