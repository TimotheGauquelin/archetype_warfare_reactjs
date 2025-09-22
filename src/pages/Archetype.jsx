import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Header from "../components/generic/header/Header";
import SubtitleDivider from "../components/generic/SubtitleDivider";
import MainInformationsBlock from "../components/pages/archetype/MainInformationsBlock";
import Jumbotron from "../components/pages/archetype/Jumbotron";
import { performancesLabel } from "../constant/genericData";
import "../styles/Archetype.scss";
import PageContentBlock from "../components/generic/PageContentBlock";
import ErrorText from "../components/generic/ErrorText";
import { getArchetypeById } from "../services/archetype";
import Card from "../components/generic/Card";
import { getCardTypes } from "../services/cardtype";

const Archetype = () => {
  const [archetype, setArchetype] = useState({});
  const [cardTypes, setCardTypes] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    getArchetypeById(id, setArchetype);
    getCardTypes(setCardTypes);
  }, [id]);

  return (
    <div>
      <div id="headBlock" className="imgBackground">
        <Header />
        <Jumbotron
          itemMainTitle={archetype.name}
          itemSubTitle={archetype.slider_info}
          itemImg={archetype.jumbotronImg}
        />
        <div className="relative px-3 pb-3 sscreen:p-0 lscreen:max-w-containerSize m-auto">
          <MainInformationsBlock
            archetype={archetype}
            performancesLabel={performancesLabel}
          />
        </div>
      </div>
      <div>
        <PageContentBlock>
          <div className="flex flex-col w-full justify-center max-w-containerSize m-auto">
            {archetype.comment && (
              <div className="bg-blue-100 flex-col text-blue-500 p-3 font-medium rounded-lg flex">
                {`Information : ${archetype.comment}`}
                <p className="text-right">Le Staff AW</p>
              </div>
            )}

            <div className="py-5">
              <SubtitleDivider label="Toutes les cartes" displayDivider />
            </div>
            <div
              className="bg-gray-100 p-4 grid grid-cols-12 gap-4 mb-4"
              style={{ border: "1px solid #EDEDFE" }}
            >
              {archetype?.cards?.length > 0 ? (
                archetype?.cards
                  ?.sort((a, b) => {
                    const cardTypeA = cardTypes?.find(
                      (type) => type.label === a.card.card_type
                    );
                    const cardTypeB = cardTypes?.find(
                      (type) => type.label === b.card.card_type
                    );

                    if (cardTypeA && cardTypeB) {
                      const numOrderComparison =
                        cardTypeA.num_order - cardTypeB.num_order;
                      if (numOrderComparison !== 0) {
                        return numOrderComparison;
                      }

                      const atkA = a.card.atk;
                      const atkB = b.card.atk;
                      if (atkA !== atkB) {
                        return atkB - atkA;
                      }

                      const levelA = a.card.level || 0;
                      const levelB = b.card.level || 0;
                      return levelB - levelA;
                    }
                    return 0;
                  })
                  ?.map((card, index) => {
                    return <Card key={index} card={card} />;
                  })
              ) : (
                <ErrorText errorText="Il n'y a pas de carte dans cette archétype." />
              )}
            </div>
          </div>
        </PageContentBlock>
      </div>
    </div>
  );
};

export default Archetype;
