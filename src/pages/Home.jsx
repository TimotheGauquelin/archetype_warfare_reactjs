import React, { useEffect, useState } from "react";
import Header from "../components/generic/header/Header";
import Slider from "../components/generic/Slider";

import "../styles/Home.scss";
import PageContentBlock from "../components/generic/PageContentBlock";
import { SwiperSlide } from "swiper/react";
import Slide from "../components/pages/home/Slide";
import ArchetypeList from "../components/pages/home/ArchetypeList";
import {
  getEightMostRecentArchetypes,
  getFiveMostFamousArchetypes,
  getFiveRandomHighlightedArchetypes,
} from "../services/archetype";

const Home = () => {
  const [fiveMostFamousArchetypes, setFiveMostFamousArchetypes] = useState([]);
  const [eightMostRecentArchetypes, setEightMostRecentArchetypes] = useState(
    []
  );
  const [archetypesForSlider, setArchetypesForSlider] = useState([]);

  const noHighlightedArchetype = {
    id: 1,
    name: "Magicien Sombre",
    sliderInfo: "Maitrisez la magie des cartes de Yugi",
  };

  useEffect(() => {
    getFiveMostFamousArchetypes(setFiveMostFamousArchetypes);
    getEightMostRecentArchetypes(setEightMostRecentArchetypes);
    getFiveRandomHighlightedArchetypes(setArchetypesForSlider)
  }, []);

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
      </PageContentBlock>
    </div>
  );
};

export default Home;
