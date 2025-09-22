import axios from "axios";
import React, { useEffect, useState, useCallback } from "react";
import { FaAngleDown } from "react-icons/fa";
import api_aw from "../api/api_aw";
import AbsoluteInput from "../components/generic/AbsoluteInput";
import PageContentBlock from "../components/generic/PageContentBlock";
import Header from "../components/generic/header/Header";
import Jumbotron from "../components/generic/Jumbotron";
import Loader from "../components/generic/Loader";
import NoItemMessage from "../components/generic/NoItemMessage";
import SubtitleDivider from "../components/generic/SubtitleDivider";
import { extraDeckLabels } from "../constant/genericData";
import {
  URL_BACK_GET_BANLIST,
  URL_BACK_GET_BANLISTS,
  URL_BACK_GET_CARD_TYPES,
} from "../constant/urlsBack";

const Banlist = () => {
  const [banlists, setBanlists] = useState([]);
  const [allTypesOfCard, setAllTypesOfCard] = useState([]);
  const [activeBanlistId, setActiveBanlistId] = useState();
  const [banlistSearchInput, setBanlistSearchInput] = useState("");
  const [sortedBanlistCards, setSortedBanlistCards] = useState([]);
  const [statusLabelBlock, setStatusLabelBlock] = useState([]);
  const [nbTotalCards, setNbTotalCards] = useState(0);
  const [dataIsLoaded, setDataIsLoaded] = useState(false);

  const [refresh, setRefresh] = useState(false);

  const getAllGenericData = () => {
    axios
      .all([
        api_aw.get(URL_BACK_GET_BANLISTS),
        api_aw.get(URL_BACK_GET_CARD_TYPES),
      ])
      .then((respArr) => {
        if (respArr[0].status === 200) {
          setBanlists(respArr[0].data);
        }
        if (respArr[1].status === 200) {
          var cardTypesOrdered = [];

          respArr[1].data.forEach((cardType) => {
            cardTypesOrdered.push(cardType.label);
          });
          setAllTypesOfCard(cardTypesOrdered);
        }
        setRefresh(true);
      });
  };

  const getBanlist = useCallback(() => {
    api_aw
      .get(
        banlistSearchInput === ""
          ? URL_BACK_GET_BANLIST(activeBanlistId ? activeBanlistId : 1)
          : `/public/banlistCards/name/${banlistSearchInput}/archetypeIsNull/banlist/${
              activeBanlistId ? activeBanlistId : 1
            }`
      )
      .then((response) => {
        if (response.status === 200) {
          const cardsArray =
            banlistSearchInput === "" ? response.data.cards : response.data;
          let banlistCards = [];

          let orderedCards = [
            { label: "Interdit", decks: [] },
            { label: "Limité", decks: [] },
            { label: "Semi-Limité", decks: [] },
          ];

          orderedCards.forEach((statusObject) => {
            statusObject.decks = [
              {
                label: "Main Deck",
                colorItem: "rgba(219, 115, 255, 0.15)",
                colorText: "#DB73FF",
                cards: [],
              },
              {
                label: "Extra Deck",
                colorItem: "rgba(219, 115, 255, 0.15)",
                colorText: "#DB73FF",
                cards: [],
              },
            ];
          });
          cardsArray.forEach((card) => {
            if (card?.archetype === null) {
              banlistCards.push(card);
            }
          });

          var nbTotalCards = 0;

          banlistCards.forEach((card) => {
            orderedCards.forEach((status) => {
              if (card?.cardStatus?.label === status.label) {
                nbTotalCards = +1;
                if (extraDeckLabels.includes(card?.card.cardType.label)) {
                  status?.decks[1].cards.push(card);
                } else {
                  status?.decks[0].cards.push(card);
                }
              }
            });
          });

          setNbTotalCards(nbTotalCards);
          setSortedBanlistCards(orderedCards);
          setDataIsLoaded(true);
        }
      });
  }, [banlistSearchInput, activeBanlistId]);

  const statusLabelBlockDisplaying = (index, fIndex) => {
    let addArray = [...statusLabelBlock];
    statusLabelBlock.includes(index)
      ? addArray.splice(fIndex, 1)
      : addArray.push(index);
    setStatusLabelBlock(addArray);
  };

  useEffect(() => {
    getAllGenericData();
    refresh && getBanlist();
  }, [refresh, activeBanlistId, banlistSearchInput, getBanlist]);

  return (
    <div className="flex flex-col">
      <div id="headBlock" className="imageBackground">
        <Header />
        <div className="relative p-3 lscreen:max-w-containerSize m-auto">
          <Jumbotron
            mainTitle="Faîtes attention aux cartes interdites !"
            subTitle=" Archetype Warfare propose une toute nouvelle banlist de cartes
              génériques, en plus de celles des archétypes"
          />
          <AbsoluteInput>
            <select
              className="col-span-5 m-2 p-2"
              value={activeBanlistId}
              onChange={(e) => {
                setActiveBanlistId(e.target.value);
              }}
            >
              {banlists
                .filter(
                  (banlist) =>
                    banlist.cards.map((card) => card.archetype === null)
                      .length > 0
                )
                .map((banlist, index) => {
                  return (
                    <option key={index} value={banlist.id}>
                      {banlist.label}
                    </option>
                  );
                })}
            </select>
            <input
              type="text"
              className="col-span-7 m-2 p-2"
              placeholder="Quelle carte recherchez-vous ?"
              value={banlistSearchInput}
              onChange={(e) => {
                setBanlistSearchInput(e.target.value);
              }}
            />
          </AbsoluteInput>
        </div>
      </div>
      {/*  */}
      {dataIsLoaded ? (
        <PageContentBlock>
          <div className="flex flex-col justify-center w-full">
            {nbTotalCards > 0 ? (
              sortedBanlistCards.map((statusObject, index) => {
                const totalCards =
                  statusObject?.decks[0].cards.length +
                  statusObject?.decks[1].cards.length;
                return (
                  <div
                    key={index}
                    className={`w-full my-2 py-2 rounded-md p-1 ${
                      totalCards === 0 && "hidden"
                    }`}
                  >
                    <div
                      className={`flex flex-row justify-between items-center w-full ${
                        !statusLabelBlock?.includes(index)
                          ? "sscreen:pb-5 bg-gray-100 sscreen:bg-transparent p-1 sscreen:p-0 rounded-xl"
                          : "pb-5"
                      }`}
                    >
                      <SubtitleDivider
                        leftIcon={
                          process.env.PUBLIC_URL +
                          `/assets/banlistCardStatusIcon/${statusObject.label}e.png`
                        }
                        label={`Carte${totalCards > 1 ? "s" : ""} ${
                          statusObject.label
                        }e${totalCards > 1 ? "s" : ""} (${totalCards})`}
                        statusDisplayed={statusLabelBlock?.includes(index)}
                      />
                      <FaAngleDown
                        className="sscreen:hidden h-5"
                        onClick={() => {
                          const findex = statusLabelBlock.findIndex(
                            (id) => id === index
                          );
                          statusLabelBlockDisplaying(index, findex);
                        }}
                      />
                    </div>
                    <div
                      className={`${
                        statusLabelBlock?.includes(index)
                          ? "flex flex-col"
                          : "hidden sscreen:flex flex-col"
                      }`}
                    >
                      {statusObject?.decks?.map((deckType, deckTypeIndex) => {
                        return (
                          deckType.cards.length > 0 && (
                            <div key={deckTypeIndex}>
                              <div
                                className="inline-block p-2"
                                style={{
                                  borderRadius: "10px 10px 0px 0px",
                                  background: deckType.colorItem,
                                  color: deckType.colorText,
                                }}
                              >
                                {deckType.label}
                              </div>
                              <div className="bg-white p-4 grid grid-cols-12 gap-4 mb-4">
                                {deckType.cards
                                  .filter((card) =>
                                    banlistSearchInput?.length > 0
                                      ? card?.card?.name.includes(
                                          banlistSearchInput
                                        )
                                      : card
                                  )
                                  .sort(function (a, b) {
                                    return (
                                      allTypesOfCard.indexOf(
                                        a.card.cardType.label
                                      ) -
                                        allTypesOfCard.indexOf(
                                          b.card.cardType.label
                                        ) || a.card.atk - b.card.atk
                                    );
                                  })
                                  .map((card, indexCard) => {
                                    return (
                                      <div
                                        key={indexCard}
                                        className="hvrbox lscreen:col-span-2 sscreen:col-span-3 col-span-4"
                                      >
                                        <img
                                          src={`${card?.card?.imageUrl}`}
                                          alt=""
                                          style={{ backgroundColor: "gray" }}
                                        />
                                        <div className="hvrbox-layer_top">
                                          <div className="hvrbox-text">
                                            <b>Explication: </b>
                                            <p>{card.explanationText}</p>
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })}
                              </div>
                            </div>
                          )
                        );
                      })}
                    </div>
                  </div>
                );
              })
            ) : (
              <NoItemMessage message="Il n'y a aucune carte dans cette banlist avec ce nom." />
            )}
          </div>
        </PageContentBlock>
      ) : (
        <Loader />
      )}
    </div>
  );
};

export default Banlist;
