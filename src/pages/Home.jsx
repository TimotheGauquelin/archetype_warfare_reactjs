import React, { useEffect, useState } from "react";
import Header from "../components/generic/header/Header";
import Slider from "../components/generic/Slider";

import "../styles/Home.scss";
import Loader from "../components/generic/Loader";
import api_aw from "../api/api_aw";
import PageContentBlock from "../components/generic/PageContentBlock";
import { SwiperSlide } from "swiper/react";
import Slide from "../components/pages/home/Slide";
import axios from "axios";
import ArchetypeList from "../components/pages/home/ArchetypeList";
import {
  URL_BACK_GET_ARCHETYPES,
  URL_BACK_GET_FOUR_MOST_FAMOUS_ARCHETYPES,
  URL_BACK_GET_EIGHT_MOST_RECENT_ARCHETYPES,
} from "../constant/urlsBack";

const Home = () => {
  const [fiveMostFamousArchetypes, setFiveMostFamousArchetypes] = useState([]);
  const [eightMostRecentArchetypes, setEightMostRecentArchetypes] = useState(
    []
  );
  const [archetypesForSlider, setArchetypesForSlider] = useState([]);
  const [dataIsLoaded, setDataIsLoaded] = useState(false);

  const noHighlightedArchetype = {
    id: 1,
    name: "Magicien Sombre",
    sliderInfo: "Maitrisez la magie des cartes de Yugi",
  };

  const getAllGenericData = () => {
    axios.all([api_aw.get(URL_BACK_GET_ARCHETYPES)]).then((respArr) => {
      if (respArr[0].status === 200) {
        setArchetypesForSlider(
          respArr[0].data.filter(
            (archetype) => archetype.highlighted & (archetype.isActive === true)
          )
        );
      }
      setDataIsLoaded(true);
    });
  };

  useEffect(() => {
    getAllGenericData();
  }, []);

  return (
    <div className="flex flex-col">
      <div id="headBlock" className="imgBackground">
        <Header />
        {archetypesForSlider.length > 0 ? (
          <Slider>
            {archetypesForSlider.map((archetype, index) => {
              return (
                archetype.highlighted && (
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
      {dataIsLoaded ? (
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
      ) : (
        <Loader />
      )}
    </div>
  );
};

export default Home;
