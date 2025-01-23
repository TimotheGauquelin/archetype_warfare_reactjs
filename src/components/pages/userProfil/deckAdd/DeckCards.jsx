import React from "react";

const DeckCards = ({ deckCards, setDeckCards, cardTypes, extraDeck }) => {
  const calcNumberCardsInsideDeck = (deckInstance, cardsOfDeck, type) => {
    let total = 0;

    deckCards[deckInstance]?.cards?.forEach((card) => {
      console.log(card);
      switch (cardsOfDeck) {
        case "total":
          return (total = total + card.quantity);
        case "byCardType":
          if (card?.cardType?.label.includes(type)) {
            return (total = total + card.quantity);
          }
          break;
        default:
          return (total = total + card.quantity);
      }
    });

    return total;
  };

  const removeCardFromDeck = (deckIndex, card) => {
    let deckCardsCopy = [...deckCards];

    const findex = deckCardsCopy[deckIndex].cards.findIndex(
      (c) => c.card.id === card.card.id
    );

    deckCardsCopy[deckIndex].cards[findex].quantity--;

    if (deckCardsCopy[deckIndex].cards[findex].quantity === 0) {
      deckCardsCopy[deckIndex].cards.splice(findex, 1);
    }
    setDeckCards(deckCardsCopy);
  };

  return (
    <div className="col-span-9 bg-green-200 mr-2">
      <div className="flex flex-row justify-between border border-black">
        <div className="flex flex-row">
          <p>Deck : </p>
          <p>{calcNumberCardsInsideDeck(0, "total")}</p>
        </div>
        <div className="flex flex-row">
          <div className="flex flex-row">
            <p>Monstre : </p>
            <p>{calcNumberCardsInsideDeck(0, "byCardType", "Monster")}</p>
          </div>
          <div className="flex flex-row">
            <p>Magie : </p>
            <p>{calcNumberCardsInsideDeck(0, "byCardType", "Spell")}</p>
          </div>
          <div className="flex flex-row">
            <p>Piège : </p>
            <p> {calcNumberCardsInsideDeck(0, "byCardType", "Trap")}</p>
          </div>
        </div>
      </div>
      <div
        id="mainDeckCards"
        className="border border-black grid grid-cols-10 p-1 gap-2"
      >
        {deckCards[0]?.cards
          ?.sort(function (a, b) {
            return (
              cardTypes.indexOf(a?.card?.cardType?.label) -
              cardTypes.indexOf(b?.card?.cardType?.label)
            );
          })
          .map((card, cardIndex) => {
            return Array.apply(null, { length: card.quantity }).map((e, i) => {
              return (
                <div key={(cardIndex, i)} className="col-span-1 relative">
                  <img
                    src={card.card.imageUrl}
                    alt=""
                    onClick={() => removeCardFromDeck(0, card)}
                  />
                  {card.card.cardStatus && (
                    <img
                      className="absolute"
                      style={{
                        top: "0px",
                        left: "0px",
                        width: "20px",
                      }}
                      src={
                        process.env.PUBLIC_URL +
                        `/assets/banlistCardStatusIcon/${card.card.cardStatus.label}e.png`
                      }
                      alt=""
                    />
                  )}
                </div>
              );
            });
          })}
      </div>
      <div className="flex flex-row justify-between border border-black">
        <div className="flex flex-row">
          <p>Extra Deck : </p>
          <p>{calcNumberCardsInsideDeck(1, "total")} / 15</p>
        </div>
        <div className="flex flex-row">
          <div className="flex flex-row">
            <p>Fusion : </p>
            <p>{calcNumberCardsInsideDeck(1, "byCardType", "Fusion")}</p>
          </div>
          <div className="flex flex-row">
            <p>Synchro : </p>
            <p>{calcNumberCardsInsideDeck(1, "byCardType", "Synchro")}</p>
          </div>
          <div className="flex flex-row">
            <p>XYZ : </p>
            <p>{calcNumberCardsInsideDeck(1, "byCardType", "XYZ")}</p>
          </div>
          <div className="flex flex-row">
            <p>Link : </p>
            <p>{calcNumberCardsInsideDeck(1, "byCardType", "Link")}</p>
          </div>
        </div>
      </div>
      <div
        id="extraDeckCards"
        className="border border-black grid grid-cols-10 p-1 gap-2"
      >
        {deckCards[1]?.cards
          ?.sort(function (a, b) {
            return (
              extraDeck.indexOf(a?.card?.cardType?.label) -
              extraDeck.indexOf(b?.card?.cardType?.label)
            );
          })
          ?.map((card, cardIndex) => {
            return Array.apply(null, { length: card.quantity }).map((e, i) => {
              return (
                <div key={(cardIndex, i)} className="col-span-1 relative">
                  <img
                    src={card?.card?.imageUrl}
                    alt=""
                    onClick={() => removeCardFromDeck(1, card)}
                  />
                  {card.card.cardStatus && (
                    <img
                      className="absolute"
                      style={{
                        top: "0px",
                        left: "0px",
                        width: "20px",
                      }}
                      src={
                        process.env.PUBLIC_URL +
                        `/assets/banlistCardStatusIcon/${card?.card?.cardStatus?.label}e.png`
                      }
                      alt=""
                    />
                  )}
                </div>
              );
            });
          })}
      </div>
    </div>
  );
};

export default DeckCards;
