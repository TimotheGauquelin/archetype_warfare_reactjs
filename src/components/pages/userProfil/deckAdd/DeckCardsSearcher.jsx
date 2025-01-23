import React, { useEffect } from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import api_aw from "../../../../api/api_aw";

const DeckCardsSearcher = ({
  setResearchedCardsLabel,
  researchedCardsLength,
  setResearchedCardsLength,
  researchedCards,
  archetypeCards,
  pagination,
  setPagination,
  deckCards,
  setDeckCards,
  extraDeck,
  researchedCardsLabel,
  currentArchetypeId,
}) => {
  const allCardsLength = () => {
    api_aw
      .get(
        researchedCardsLabel === ""
          ? "/public/cards/countNbOfCards"
          : `/public/cards/countNbOfCards/${researchedCardsLabel}`
      )
      .then((response) => {
        if (response.status === 200) {
          setResearchedCardsLength(response.data);
        }
      });
  };

  const addCardsIntoDeck = (card) => {
    const deckCopy = [...deckCards];

    //If card belongs to extra deck, return 1
    const isExtraDeck = extraDeck?.includes(card.cardType.label);

    const fIndex = deckCopy[isExtraDeck ? 1 : 0].cards.findIndex(
      (deckCard) => deckCard.card.id === card.id
    );

    var deckQuantity = 0;

    deckCopy[isExtraDeck ? 1 : 0].cards.forEach((card) => {
      deckQuantity = deckQuantity + card.quantity;
    });

    if (isExtraDeck ? deckQuantity < 15 : deckQuantity < 60) {
      if (fIndex >= 0) {
        //Si nombre de carte = 3, impossible d'en ajouter +
        if (
          deckCopy[isExtraDeck ? 1 : 0].cards[fIndex].quantity <
          //MODIFIER ! NB CARD ALLOWED
          card.cardStatus.nbCardsAllowed
        ) {
          deckCopy[isExtraDeck ? 1 : 0].cards[fIndex] = {
            ...deckCopy[isExtraDeck ? 1 : 0].cards[fIndex],
            quantity: deckCopy[isExtraDeck ? 1 : 0].cards[fIndex].quantity + 1,
          };
        }
      } else {
        if (card.cardStatus?.label !== "Interdit")
          deckCopy[isExtraDeck ? 1 : 0].cards.push({ card: card, quantity: 1 });
      }
    }

    // deckCopy[isExtraDeck ? 1 : 0].cards[fIndex]?.quantity

    setDeckCards(deckCopy);
  };

  const increasePage = () => {
    if (pagination < researchedCardsLength / 20 - 1) {
      setPagination(pagination + 1);
    }
  };

  const decreasePage = () => {
    if (pagination > 0) {
      setPagination(pagination - 1);
    }
  };

  useEffect(() => {
    allCardsLength();
  }, [researchedCardsLabel, pagination, currentArchetypeId]);

  return (
    <div className="bg-gray-400 col-span-3 ml-1 p-3 rounded">
      <div className="grid grid-cols-12 gap-2">
        <input
          className="w-full p-1 col-span-12"
          type="text"
          placeholder="Quelle carte recherchez-vous ?"
          onChange={(e) => {
            setResearchedCardsLabel(e.target.value);
            setPagination(0);
          }}
        />
      </div>
      <div
        className="overflow-y-auto bg-white grid grid-cols-12 mt-2"
        style={{ height: "400px" }}
      >
        {researchedCards?.map((card, index) => {
          const findex = archetypeCards?.find(
            (archetypeCard) => archetypeCard?.id === card.id
          );
          return (
            <div
              key={index}
              className={`col-span-4 p-1 hover:saturate-150 relative ${
                findex ? "grayscale" : "cursor-pointer"
              }`}
              onClick={() => addCardsIntoDeck(card)}
            >
              <img src={`${card?.imageUrl}`} alt="" />
              <div className="absolute top-0 right-0 w-1/3">
                <img
                  src={`${process.env.PUBLIC_URL}/assets/banlistCardStatusIcon/${card?.cardStatus?.label}e.png`}
                  alt=""
                />
              </div>
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

export default DeckCardsSearcher;
