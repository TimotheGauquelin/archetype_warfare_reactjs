import React, { useState } from "react";
import { cardStatusToFrench } from "../../utils/trad/cardStatus";

const Card = ({ card }) => {
  const [cardPopUp, setCardPopUp] = useState(false);
  return (
    <div
      className={`relative lscreen:col-span-2 sscreen:col-span-3 col-span-6 cursor-pointer`}
      onMouseOver={() => setCardPopUp(true)}
      onMouseOut={() => setCardPopUp(false)}
    >
      <div className={`relative border-text`}>
        <img
          src={card.card.img_url}
          alt={card?.card.name}
          style={{ boxShadow: "rgba(0, 0, 0, 0.75) 1.95px 1.95px 2.6px" }}
          className={`transition-all duration-300 ease-in-out ${
            cardPopUp && card.card_status.label !== "Unlimited" 
              ? "grayscale blur-[2px] scale-105" 
              : "grayscale-0 blur-0 scale-100"
          }`}
        />
        {card.card_status && (
          <img
            className="absolute transition-all duration-300 ease-in-out"
            style={{
              top: "-13px",
              right: "-10px",
              width: "30px",
              transform: cardPopUp ? "scale(1.1)" : "scale(1)",
            }}
            loading="lazy"
            src={
              process.env.PUBLIC_URL +
              `/assets/banlistCardStatusIcon/${card.card_status.label}.png`
            }
            alt=""
          />
        )}
        {cardPopUp && card.card_status.label !== "Unlimited" && (
          <div className="absolute -translate-y-1/2 top-1/2 left-0 right-0 flex flex-col text-white p-4 transform transition-all duration-300 ease-in-out animate-fadeIn">
            <p className="text-red-500 font-bold mb-2">Pourquoi cette carte est {cardStatusToFrench(card.card_status.label).toLowerCase()} :</p>
            <p className="text-sm">{card.explanation_text}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Card;
