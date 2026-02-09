import { useEffect, useState, useCallback } from "react";
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
import type { Archetype } from "../types";

const Home: React.FC = () => {
  const [fiveMostFamousArchetypes, setFiveMostFamousArchetypes] = useState<Archetype[]>([]);
  const [eightMostRecentArchetypes, setEightMostRecentArchetypes] = useState<Archetype[]>([]);
  const [archetypesForSlider, setArchetypesForSlider] = useState<Archetype[]>([]);
  const [, setHasError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const welcomeArchetypeBase: Archetype = {
    id: 0,
    name: "Bienvenue sur",
    nameSubtitle: "Archetype Battle",
    isWelcome: true,
    slider_img_url: import.meta.env.BASE_URL + "assets/yugi.png",
  };

  const welcomeArchetype: Archetype = {
    ...welcomeArchetypeBase,
    slider_info: isLoading
      ? "Chargement des données, veuillez patienter..."
      : "Faites des duels avec vos cartes préférées !",
  };

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      setHasError(false);

      await Promise.all([
        getEightMostFamousArchetypes(setFiveMostFamousArchetypes, () => { }),
        getEightMostRecentArchetypes(setEightMostRecentArchetypes, () => { }),
        getFiveRandomHighlightedArchetypes(setArchetypesForSlider, () => { })
      ]).catch(() => {
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
    <div>
      <div id="headBlock" className="imgBackground overflow-visible">
        <Header />
        <Slider array={slidesToDisplay} slidesPerView={1} />
      </div>
      <PageContentBlock>
        <ArchetypeList
          dataArray={fiveMostFamousArchetypes}
          subTitleDividerText="Archétypes Populaires"
          haveMedal
          isFetching={isLoading}
          skeletonItemCount={8}
        />
        <ArchetypeList
          dataArray={eightMostRecentArchetypes}
          subTitleDividerText="Nouveaux Archétypes"
          isFetching={isLoading}
          skeletonItemCount={8}
          displayDate
        />
      </PageContentBlock>
      <Footer />
    </div>
  );
};

export default Home;