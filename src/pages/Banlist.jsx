import React, { useCallback, useEffect, useState, useMemo } from "react";
import AbsoluteInput from "../components/generic/AbsoluteInput";
import PageContentBlock from "../components/generic/PageContentBlock";
import Header from "../components/generic/header/Header";
import Jumbotron from "../components/generic/Jumbotron";
import Loader from "../components/generic/Loader";
import ErrorText from "../components/generic/ErrorText";
import SubtitleDivider from "../components/generic/SubtitleDivider";
import Card from "../components/generic/Card";
import { getCardTypes } from "../services/cardtype";
import { getCurrentBanlist } from "../services/banlist";

const Banlist = () => {
  const [banlistSearchInput, setBanlistSearchInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [banlist, setBanlist] = useState(null);
  const [cardTypes, setCardTypes] = useState([]);
  const [error, setError] = useState(null);

  const loadBanlistData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      await Promise.all([
        getCurrentBanlist(setBanlist, setLoading),
        getCardTypes(setCardTypes)
      ]);
    } catch (err) {
      setError("Erreur lors du chargement de la banlist");
      console.error("Erreur:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBanlistData();
  }, [loadBanlistData]);

  const sortedBanlistCards = useMemo(() => {
    if (!banlist?.banlist_archetype_cards || !cardTypes.length) return [];

    return [...banlist.banlist_archetype_cards].sort((a, b) => {
      const cardTypeA = cardTypes.find(
        (type) => type.label === a.card.card_type
      );
      const cardTypeB = cardTypes.find(
        (type) => type.label === b.card.card_type
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
  }, [banlist?.banlist_archetype_cards, cardTypes]);

  const handleSearchChange = useCallback((e) => {
    setBanlistSearchInput(e.target.value);
  }, []);

  // Séparation des cartes par statut
  const cardsByStatus = useMemo(() => {
    const forbidden = [];
    const limited = [];
    const semiLimited = [];
    const unlimited = [];

    sortedBanlistCards.forEach(card => {
      const cardName = card.card.name.toLowerCase();
      const searchTerm = banlistSearchInput.toLowerCase();
      
      // Filtrer par recherche si nécessaire
      if (banlistSearchInput.trim() && !cardName.includes(searchTerm)) {
        return;
      }

      switch (card.card_status?.label) {
        case "Forbidden":
          forbidden.push(card);
          break;
        case "Limited":
          limited.push(card);
          break;
        case "Semi-Limited":
          semiLimited.push(card);
          break;
        case "Unlimited":
        default:
          unlimited.push(card);
          break;
      }
    });

    return { forbidden, limited, semiLimited, unlimited };
  }, [sortedBanlistCards, banlistSearchInput]);

  // Composant pour afficher une section de cartes
  const CardSection = ({ title, cards, statusColor }) => (
    <div className="mb-8">
      <SubtitleDivider 
        label={`${title} (${cards.length})`} 
        displayDivider 
      />
      <div className="bg-gray-100 p-4 grid grid-cols-12 gap-4 border border-gray-200 rounded-lg">
        {cards.length > 0 ? (
          cards.map((card, index) => (
            <Card key={`${card.card.id}-${index}`} card={card} />
          ))
        ) : (
          <div className="col-span-12 flex justify-center py-8">
            <ErrorText errorText={`Aucune carte ${title.toLowerCase()} trouvée.`} />
          </div>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <ErrorText errorText={error} />
      </div>
    );
  }

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
          {/* Section des cartes interdites */}
          <CardSection 
            title="Cartes Interdites" 
            cards={cardsByStatus.forbidden}
            statusColor="text-red-600"
          />

          {/* Section des cartes limitées */}
          <CardSection 
            title="Cartes Limitées" 
            cards={cardsByStatus.limited}
            statusColor="text-orange-600"
          />

          {/* Section des cartes semi-limitées */}
          <CardSection 
            title="Cartes Semi-Limitées" 
            cards={cardsByStatus.semiLimited}
            statusColor="text-yellow-600"
          />

          {/* Message si aucune carte trouvée */}
          {banlistSearchInput.trim() && 
           cardsByStatus.forbidden.length === 0 && 
           cardsByStatus.limited.length === 0 && 
           cardsByStatus.semiLimited.length === 0 && 
           cardsByStatus.unlimited.length === 0 && (
            <div className="flex justify-center py-8">
              <ErrorText errorText="Aucune carte trouvée avec ce nom." />
            </div>
          )}
        </div>
      </PageContentBlock>
    </div>
  );
};

export default Banlist;
