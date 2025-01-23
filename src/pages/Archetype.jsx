import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import Header from "../components/generic/header/Header";
import SubtitleDivider from "../components/generic/SubtitleDivider";
import MainInformationsBlock from "../components/pages/archetype/MainInformationsBlock";
import Jumbotron from "../components/pages/archetype/Jumbotron";
import { performancesLabel, extraDeckLabels } from "../constant/genericData";

import { closestIndexTo } from "date-fns";

import api_aw from "../api/api_aw";
import "../styles/Archetype.scss";
import PageContentBlock from "../components/generic/PageContentBlock";
import ErrorText from "../components/generic/ErrorText";
import {
  URL_BACK_GET_ARCHETYPE,
  URL_BACK_GET_BANLISTS,
  URL_BACK_GET_CARD_TYPES,
} from "../constant/urlsBack";
import { URL_FRONT_ARCHETYPES } from "../constant/urlsFront";
import LazyArchetype from "../components/pages/archetype/LazyArchetype";
import axios from "axios";

const Archetype = () => {
  const [banlistCards, setBanlistCards] = useState([]);
  const [banlists, setBanlists] = useState([]);
  const [activeBanlistId, setActiveBanlistId] = useState();
  const [cardTypes, setCardTypes] = useState([]);
  const [archetype, setArchetype] = useState({});
  const [archetypeCards, setArchetypeCards] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  const checkIfIdFromPathnameIsANumber = Number.isFinite(Number(id));

  const getAllData = () => {
    axios
      .all([
        api_aw.get(URL_BACK_GET_ARCHETYPE(id)),
        api_aw.get(URL_BACK_GET_BANLISTS),
        api_aw.get(URL_BACK_GET_CARD_TYPES),
      ])
      .then((respArr) => {
        if (respArr[0].status === 200) {
          setArchetype(respArr[0].data);

          const archetypeCards = respArr[0]?.data?.cards;

          const emptyFullDeckSchema = [
            {
              label: "Main Deck",
              colorItem: "rgba(254, 183, 77, 0.15)",
              colorText: "#E89E2E",
              cards: [],
            },
            {
              label: "Extra Deck",
              colorItem: "rgba(219, 115, 255, 0.15)",
              colorText: "#DB73FF",
              cards: [],
            },
          ];

          archetypeCards.sort(function (a, b) {
            return (
              cardTypes.indexOf(a?.cardType?.label) -
              cardTypes.indexOf(b?.cardType?.label)
            );
          });

          archetypeCards.forEach((element) => {
            if (
              extraDeckLabels.some((el) =>
                element?.cardType?.label.includes(el)
              )
            ) {
              emptyFullDeckSchema[1].cards.push(element);
            } else {
              emptyFullDeckSchema[0].cards.push(element);
            }
          });

          setArchetypeCards(emptyFullDeckSchema);
        }
        if (respArr[1].status === 200) {
          setBanlists(respArr[1].data);
          var today = new Date();
          var dateArray = respArr[1].data.map((date) => {
            return new Date(date.releaseDate);
          });

          const closestBanlistIndex = closestIndexTo(today, dateArray);
          const closestBanlistId = respArr[1].data[closestBanlistIndex].id;
          activeBanlistId === undefined && setActiveBanlistId(closestBanlistId);

          var banlistCardsOfArchetype = [];

          respArr[1].data.forEach((banlist) => {
            if (banlist.id === activeBanlistId) {
              banlist?.cards.forEach((card) => {
                if (Number(card?.archetype?.id) === Number(id)) {
                  banlistCardsOfArchetype.push(card);
                }
              });
            }
          });
          setBanlistCards(banlistCardsOfArchetype);
        }
        if (respArr[2].status === 200) {
          var cardTypesOrdered = [];

          respArr[2].data.forEach((cardType) => {
            cardTypesOrdered.push(cardType.label);
          });

          setCardTypes(cardTypesOrdered);
        }
        setRefresh(true);
      });
  };

  useEffect(() => {
    if (checkIfIdFromPathnameIsANumber) {
      getAllData();
    } else {
      navigate(URL_FRONT_ARCHETYPES);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, activeBanlistId, refresh]);

  return (
    <div>
      <div id="headBlock" className="imgBackground">
        <Header />
        <Jumbotron
          itemMainTitle={archetype.name}
          itemSubTitle={archetype.sliderInfo}
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

            <div className="flex justify-between py-5">
              <SubtitleDivider label="Toutes les cartes jouables" />
            </div>

            {archetype?.cards?.length > 0 ? (
              <div>
                {archetypeCards.map((arch, index) => {
                  return (
                    arch.cards.length > 0 && (
                      <LazyArchetype
                        key={index}
                        arch={arch}
                        banlistCards={banlistCards}
                        cardTypes={cardTypes}
                      />
                    )
                  );
                })}
              </div>
            ) : (
              <ErrorText errorText="Il n'y a pas de carte dans cette archétype." />
            )}
          </div>
        </PageContentBlock>
      </div>
    </div>
  );
};

export default Archetype;
