import axios from "axios";
import React, { useEffect, useState } from "react";
import api_aw from "../../../../api/api_aw";
import DeckCards from "./DeckCards";
import DeckCardsSearcher from "./DeckCardsSearcher";

const DeckCreator = ({
  deckCards,
  setDeckCards,
  cardTypes,
  archetypeCards,
  currentArchetypeId,
  currentBanlistId,
  researchedCardsLabel,
  setResearchedCardsLabel,
  researchedCardsLength,
  setResearchedCardsLength,
}) => {
  const [researchedCards, setResearchedCards] = useState([]);
  const [pagination, setPagination] = useState(0);

  const extraDeck = [
    "Fusion Monster",
    "Pendulum Effect Fusion Monster",
    "Synchro Monster",
    "Synchro Tuner Monster",
    "Synchro Pendulum Effect Monster",
    "XYZ Monster",
    "XYZ Pendulum Effect Monster",
    "Link Monster",
  ];

  const allCards = () => {
    axios
      .all([
        api_aw.get(
          `http://localhost:8080/api/public/cardsWithCriteria?size=20&page=${pagination}`
        ),
        api_aw.get(
          `http://localhost:8080/api/public/banlistCards/banlist/${currentBanlistId}`
        ),
      ])
      .then((respArr) => {
        if (respArr[0].status === 200 || respArr[1].status === 200) {
          var allTheCards = respArr[0]?.data;

          var banlistCards = respArr[1]?.data;

          setResearchedCards(allTheCards);
        }
      });
  };

  useEffect(() => {
    allCards();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [researchedCardsLabel, pagination, currentArchetypeId, currentBanlistId]);

  return (
    <div className="bg-blue-200 w-full grid grid-cols-12 flex flex-row">
      <DeckCards
        deckCards={deckCards}
        setDeckCards={setDeckCards}
        cardTypes={cardTypes}
        extraDeck={extraDeck}
      />
      {/* Cards Searcher */}
      <DeckCardsSearcher
        setResearchedCardsLabel={setResearchedCardsLabel}
        researchedCardsLength={researchedCardsLength}
        researchedCards={researchedCards}
        archetypeCards={archetypeCards}
        pagination={pagination}
        setPagination={setPagination}
        deckCards={deckCards}
        setDeckCards={setDeckCards}
        extraDeck={extraDeck}
        researchedCardsLabel={researchedCardsLabel}
        setResearchedCardsLength={setResearchedCardsLength}
        currentArchetypeId={currentArchetypeId}
      />
    </div>
  );
};

export default DeckCreator;
