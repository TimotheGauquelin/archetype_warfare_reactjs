import React, { useState } from "react";

const Card = ({ card, status }) => {
  const [cardPopUp, setCardPopUp] = useState(false);
  console.log(card);
  return (
    <div
      // key={cardIndex}
      // style={{
      //   display: status ? "flex" : "none",
      // }}
      className={`relative lscreen:col-span-2 sscreen:col-span-3 col-span-4 cursor-pointer`}
      onMouseOver={() => setCardPopUp(true)}
      onMouseOut={() => setCardPopUp(false)}
    >
      <div className={`relative border-text`}>
        <img
          src={card.card.img_url}
          alt={card?.card.name}
          style={{boxShadow: "rgba(0, 0, 0, 0.75) 1.95px 1.95px 2.6px"}}
          className={`${cardPopUp && card.card_status.label !== "Unlimited" && "grayscale blur-[2px] scale-105"}`}
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
              process.env.PUBLIC_URL +
              `/assets/banlistCardStatusIcon/${card.card_status.label}.png`
            }
            alt=""
          />
        )}
        {cardPopUp && card.card_status.label !== "Unlimited" && (
          <div className="-translate-y-1/2 absolute flex flex-col text-white p-4 top-1/2 transform ">
            <p className="text-red-500 font-bold">Pourquoi {card.card_status.label}:</p>
            <p>{card.explanation_text }</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Card;
