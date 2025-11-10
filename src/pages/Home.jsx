import React, { useEffect, useState, useCallback } from "react";
import Header from "../components/generic/header/Header";
import Slider from "../components/generic/Slider";

import "../styles/Home.scss";
import PageContentBlock from "../components/generic/PageContentBlock";
import ArchetypeList from "../components/pages/home/ArchetypeList";
import {
  getEightMostRecentArchetypes,
  getEightMostFamousArchetypes,
  getFiveRandomHighlightedArchetypes,
} from "../services/archetype";
import Footer from "../components/generic/footer/Footer";

const Home = () => {
  const [fiveMostFamousArchetypes, setFiveMostFamousArchetypes] = useState([]);
  const [eightMostRecentArchetypes, setEightMostRecentArchetypes] = useState([]);
  const [archetypesForSlider, setArchetypesForSlider] = useState([]);
  const [hasError, setHasError] = useState(false);
  const [errorMessages, setErrorMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const welcomeArchetype = {
    name: "Bienvenue sur",
    nameSubtitle: "Archetype Battle",
    slider_info: "Chargement des données, veuillez patienter...",
    isWelcome: true,
    slider_img_url: process.env.PUBLIC_URL + "/assets/yugi.png",
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

  const slidesToDisplay = archetypesForSlider.length > 0
    ? archetypesForSlider.filter((archetype) => archetype.is_highlighted)
    : [welcomeArchetype];

  return (
    <div className="flex flex-col">
      <div id="headBlock" className="imgBackground">
        <Header />
        <Slider array={slidesToDisplay} slidesPerView={1} />
      </div>
      <PageContentBlock>
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
          displayDate
        />
      </PageContentBlock>
      <Footer />
    </div>
  );
};

export default Home;