import React, { useEffect, useState, useCallback } from "react";
import Header from "../components/generic/header/Header";
import Slider from "../components/generic/Slider";

import "../styles/Home.scss";
import PageContentBlock from "../components/generic/PageContentBlock";
import { SwiperSlide } from "swiper/react";
import Slide from "../components/pages/home/Slide";
import ArchetypeList from "../components/pages/home/ArchetypeList";
import {
  getEightMostRecentArchetypes,
  getEightMostFamousArchetypes,
  getFiveRandomHighlightedArchetypes,
} from "../services/archetype";

const Home = () => {
  const [fiveMostFamousArchetypes, setFiveMostFamousArchetypes] = useState([]);
  const [eightMostRecentArchetypes, setEightMostRecentArchetypes] = useState([]);
  const [archetypesForSlider, setArchetypesForSlider] = useState([]);
  const [hasError, setHasError] = useState(false);
  const [errorMessages, setErrorMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const noHighlightedArchetype = {
    id: 1,
    name: "Magicien Sombre",
    sliderInfo: "Maitrisez la magie des cartes de Yugi",
  };

  const loadData = useCallback(async () => {    
    try {
      setIsLoading(true);
      setHasError(false);
      
      await Promise.all([
        getEightMostFamousArchetypes(setFiveMostFamousArchetypes, setErrorMessages),
        getEightMostRecentArchetypes(setEightMostRecentArchetypes, setErrorMessages),
        getFiveRandomHighlightedArchetypes(setArchetypesForSlider, setErrorMessages)
      ]).catch((error) => {
        setHasError(true);
      });
    } catch (error) {
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const HomePageContent = () => {
    return (
      <>
        <ArchetypeList
          dataArray={fiveMostFamousArchetypes}
          subTitleDividerText="Archétypes Populaires"
          haveMedal
          isLoading={isLoading}
          skeletonItemCount={8}
        />
        <ArchetypeList
          dataArray={eightMostRecentArchetypes}
          subTitleDividerText="Nouveaux Archétypes"
          isLoading={isLoading}
          skeletonItemCount={8}
        />
      </>
    );
  };

  return (
    <div className="flex flex-col">
      <div id="headBlock" className="imgBackground">
        <Header />
        {archetypesForSlider.length > 0 ? (
          <Slider>
            {archetypesForSlider.map((archetype, index) => {
              return (
                archetype.is_highlighted && (
                  <SwiperSlide key={index}>
                    <Slide archetype={archetype} />
                  </SwiperSlide>
                )
              );
            })}
          </Slider>
        ) : (
          <Slide archetype={noHighlightedArchetype} />
        )}
      </div>
      <PageContentBlock>
        <HomePageContent />
      </PageContentBlock>
    </div>
  );
};

export default Home;