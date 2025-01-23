import React, { useState } from "react";

const Card = ({ cardIndex, card, status }) => {
  const [cardPopUp, setCardPopUp] = useState(false);

  return (
    <div
      key={cardIndex}
      style={{
        display: status ? "flex" : "none",
      }}
      className="relative lscreen:col-span-2 sscreen:col-span-3 col-span-4"
      onMouseOver={() => setCardPopUp(true)}
      onMouseOut={() => setCardPopUp(false)}
    >
      <div className="relative">
        <img src={card?.imageUrl} alt={card?.name} />
        {status && (
          <img
            className="absolute"
            style={{
              top: "-13px",
              right: "-10px",
              width: "40px",
            }}
            loading="lazy"
            src={
              process.env.PUBLIC_URL +
              `/assets/banlistCardStatusIcon/${status}e.png`
            }
            alt=""
          />
        )}
      </div>
      {cardPopUp && (
        <div className="absolute bottom-0 right-0 w-full bg-gray-100 p-1">
          ABC
        </div>
      )}
    </div>
  );
};

export default Card;
