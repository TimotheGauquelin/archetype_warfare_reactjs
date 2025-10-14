import React, { useEffect, useState, useCallback, Suspense } from "react";
import Header from "../components/generic/header/Header";
import Slider from "../components/generic/Slider";

import "../styles/Home.scss";
import PageContentBlock from "../components/generic/PageContentBlock";
import { SwiperSlide } from "swiper/react";
import Slide from "../components/pages/home/Slide";
import ArchetypeList from "../components/pages/home/ArchetypeList";
import HomePageSkeleton from "../components/skeletons/HomePageSkeleton";
import {
  getEightMostRecentArchetypes,
  getFiveMostFamousArchetypes,
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
        getFiveMostFamousArchetypes(setFiveMostFamousArchetypes, setErrorMessages),
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

  console.log("errorMESSAGE", errorMessages);

  const HomePageContent = () => {
    if (isLoading) {
      throw new Promise(resolve => {
        const checkLoading = () => {
          if (!isLoading) {
            resolve();
          } else {
            setTimeout(checkLoading, 100);
          }
        };
        checkLoading();
      });
    }

    if (hasError) {
      throw new Error("Erreur lors du chargement des données");
    }
    
    return (
      <>
        <ArchetypeList
          dataArray={fiveMostFamousArchetypes}
          subTitleDividerText="Archétypes Populaires"
          errorText="Il n'y a pas d'archetype dans cette selection."
          haveMedal
        />
        <ArchetypeList
          dataArray={eightMostRecentArchetypes}
          subTitleDividerText="Nouveaux Archétypes"
          errorText="Il n'y a pas d'archetype dans cette selection."
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
        <Suspense fallback={<HomePageSkeleton />}>
          <HomePageContent />
        </Suspense>
      </PageContentBlock>
    </div>
  );
};

export default Home;