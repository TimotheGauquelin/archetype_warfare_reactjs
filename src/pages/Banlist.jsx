import React, { useCallback, useEffect, useState, useMemo } from "react";
import AbsoluteInput from "../components/generic/AbsoluteInput";
import PageContentBlock from "../components/generic/PageContentBlock";
import Header from "../components/generic/header/Header";
import Jumbotron from "../components/generic/Jumbotron";
import CardsSection from "../components/generic/CardsSection";
import { getCardTypes } from "../services/cardtype";
import { getCurrentBanlist } from "../services/banlist";
import Footer from "../components/generic/footer/Footer";
import { STATUS_FORBIDDEN, STATUS_LIMITED, STATUS_SEMI_LIMITED, STATUS_UNLIMITED } from "../utils/const/banlistConst";
import "../styles/Archetypes.scss";

const Banlist = () => {
  const [banlistSearchInput, setBanlistSearchInput] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [banlist, setBanlist] = useState(null);
  const [cardTypes, setCardTypes] = useState([]);
  const [error, setError] = useState(null);

  const loadBanlistData = useCallback(async () => {
    setIsFetching(true);
    setError(null);

    try {
      await Promise.all([
        getCurrentBanlist(setBanlist, setIsFetching),
        getCardTypes(setCardTypes)
      ]);
    } catch (err) {
      setError("Aucune banlist trouvée");
      console.error("Erreur:", err);
    } finally {
      setIsFetching(false);
    }
  }, []);

  const handleSearchChange = useCallback((e) => {
    setBanlistSearchInput(e.target.value);
  }, []);

  
  const sortedBanlistCards = useMemo(() => {
    console.log("banlist?.banlist_archetype_cards", banlist?.banlist_archetype_cards);
    console.log("cardTypes", cardTypes);
    if (!banlist?.banlist_archetype_cards || !cardTypes.length) return [];

    const sortedCards = [...banlist.banlist_archetype_cards].sort((a, b) => {
      const cardTypeA = cardTypes.find(
        (type) => type.label === a?.card?.card_type
      );
      const cardTypeB = cardTypes.find(
        (type) => type.label === b?.card?.card_type
      );

      if (cardTypeA && cardTypeB) {
        const typeComparison = cardTypeA.num_order - cardTypeB.num_order;
        if (typeComparison !== 0) return typeComparison;

        const atkComparison = (b.card.atk || 0) - (a.card.atk || 0);
        if (atkComparison !== 0) return atkComparison;

        return (b.card.level || 0) - (a.card.level || 0);
      }

      return 0;
    });

    console.log("sortedCards", sortedCards);
    return sortedCards;
  }, [banlist?.banlist_archetype_cards, cardTypes]);

  const cardsByStatus = useMemo(() => {
    const forbidden = [];
    const limited = [];
    const semiLimited = [];

    console.log("sortedBanlistCards", sortedBanlistCards);

    sortedBanlistCards.forEach(card => {

      const cardStatus = card.card_status?.label.toLowerCase();
      console.log("card", card);
      console.log("card.card_status?.label", cardStatus);
      switch (cardStatus) {
        case STATUS_FORBIDDEN.toLowerCase():
          forbidden.push(card);
          break;
        case STATUS_LIMITED.toLowerCase():
          limited.push(card);
          break;
        case STATUS_SEMI_LIMITED.toLowerCase():
          semiLimited.push(card);
          break;
      }
    });

    console.log("forbidden", forbidden);
    console.log("limited", limited);
    console.log("semiLimited", semiLimited);

    return { forbidden, limited, semiLimited };
  }, [sortedBanlistCards, banlistSearchInput]);

  useEffect(() => {
    loadBanlistData();
  }, [loadBanlistData]);

  return (
    <div className="flex flex-col">
      <div id="headBlock" className="imageBackground">
        <Header />
        <div className="relative p-3 lscreen:max-w-containerSize m-auto">
          <Jumbotron
            mainTitle="Faîtes attention aux cartes interdites !"
            subTitle="Archetype Warfare propose une toute nouvelle banlist de cartes génériques, en plus de celles des archétypes"
          />
          <AbsoluteInput>
            <input
              type="text"
              className="col-span-12 bg-gray-100 rounded-md p-2"
              placeholder="Quelle carte recherchez-vous ?"
              value={banlistSearchInput}
              onChange={handleSearchChange}
              aria-label="Rechercher une carte"
            />
          </AbsoluteInput>
        </div>
      </div>

      <PageContentBlock>
        <div className="flex flex-col w-full justify-center max-w-containerSize m-auto">

          <CardsSection
            title="Cartes Interdites"
            cards={cardsByStatus.forbidden}
            isFetching={isFetching}
          />

          <CardsSection
            title="Cartes Limitées"
            cards={cardsByStatus.limited}
            isFetching={isFetching}
          />

          <CardsSection
            title="Cartes Semi-Limitées"
            cards={cardsByStatus.semiLimited}
            isFetching={isFetching}
          />
        </div>
      </PageContentBlock>
      <Footer />
    </div>
  );
};

export default Banlist;
