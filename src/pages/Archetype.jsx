import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useParams } from "react-router-dom";

import Header from "../components/generic/header/Header";
import SubtitleDivider from "../components/generic/SubtitleDivider";
import MainInformationsBlock from "../components/pages/archetype/MainInformationsBlock";
import Jumbotron from "../components/pages/archetype/Jumbotron";
import { performancesLabel } from "../constant/genericData";
import "../styles/Archetype.scss";
import PageContentBlock from "../components/generic/PageContentBlock";
import ErrorText from "../components/generic/ErrorText";
import Loader from "../components/generic/Loader";
import { getArchetypeById } from "../services/archetype";
import Card from "../components/generic/Card";
import { getCardTypes } from "../services/cardtype";
import SkeletonArchetypePage from "../components/skeletons/SkeletonArchetypePage";
import Footer from "../components/generic/footer/Footer";

const Archetype = () => {
  const [archetype, setArchetype] = useState({});
  const [cardTypes, setCardTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  const loadArchetypeData = useCallback(async () => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      await Promise.all([
        getArchetypeById(id, setArchetype),
        getCardTypes(setCardTypes)
      ]);
    } catch (err) {
      setError("Erreur lors du chargement de l'archétype");
      console.error("Erreur:", err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadArchetypeData();
  }, [loadArchetypeData]);

  const sortedCards = useMemo(() => {
    if (!archetype?.cards || !cardTypes.length) return [];

    return [...archetype.cards].sort((a, b) => {
      const cardTypeA = cardTypes.find(
        (type) => type.label === a.card.card_type
      );
      const cardTypeB = cardTypes.find(
        (type) => type.label === b.card.card_type
      );

      if (cardTypeA && cardTypeB) {
        // Tri par type de carte
        const typeComparison = cardTypeA.num_order - cardTypeB.num_order;
        if (typeComparison !== 0) return typeComparison;

        // Tri par ATK (décroissant)
        const atkComparison = (b.card.atk || 0) - (a.card.atk || 0);
        if (atkComparison !== 0) return atkComparison;

        // Tri par niveau (décroissant)
        return (b.card.level || 0) - (a.card.level || 0);
      }
      
      return 0;
    });
  }, [archetype?.cards, cardTypes]);

  if (loading || !archetype.id) {
    return (
      <SkeletonArchetypePage />
    );
  }

  return (
    <div>
      <div id="headBlock" className="imgBackground">
        <Header />
        <Jumbotron
          itemMainTitle={archetype.name}
          itemSubTitle={archetype.main_info}
          itemImg={archetype.slider_img_url}
        />
        <div className="relative px-3 pb-3 sscreen:p-0 lscreen:max-w-containerSize m-auto">
          <MainInformationsBlock
            archetype={archetype}
            performancesLabel={performancesLabel}
          />
        </div>
      </div>
      
      <PageContentBlock>
        <div className="flex flex-col w-full justify-center max-w-containerSize m-auto">
          {archetype.comment && (
            <div className="bg-blue-100 flex-col text-blue-500 p-3 font-medium rounded-lg flex mb-4">
              <span>{`Information : ${archetype.comment}`}</span>
              <p className="text-right text-sm">Le Staff AW</p>
            </div>
          )}
          <div className="py-5">
            <SubtitleDivider 
              label={`Toutes les cartes (${sortedCards.length})`} 
              displayDivider 
            />
          </div>
          
          <div className="bg-gray-100 p-4 grid grid-cols-12 gap-4 mb-4 border border-gray-200 rounded-lg">
            {sortedCards.length > 0 ? (
              sortedCards.map((card, index) => (
                <Card key={`${card.card.id}-${index}`} card={card} />
              ))
            ) : (
              <div className="col-span-12 flex justify-center py-8">
                <ErrorText errorText="Il n'y a pas de carte dans cet archétype." />
              </div>
            )}
          </div>
        </div>
      </PageContentBlock>
      <Footer />
    </div>
  );
};

export default Archetype;
