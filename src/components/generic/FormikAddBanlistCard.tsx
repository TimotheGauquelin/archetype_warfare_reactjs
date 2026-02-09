import React, { useEffect, useState } from "react";
import api_aw from "../../api/api_aw";
import { FaTrashAlt } from "react-icons/fa";
import AdminResearcherBanlistCards from "../pages/admin/AdminResearcherBanlistCards";
import { toast } from "react-toastify";
import { getCardsByIds, searchCardsByName, getCardsCountByName } from "../../services/yugiohApi";
import type { YGOProDeckCard } from "../../services/yugiohApi";
import type { CardWithBanlistStatus } from "../../types";

interface FormikAddBanlistCardProps {
  cardTypesOrdered: string[];
  cards: CardWithBanlistStatus[];
  form: {
    setFieldValue: (field: string, value: CardWithBanlistStatus[]) => void;
  };
  field: {
    name: string;
    value: CardWithBanlistStatus[];
  };
}

const FormikAddBanlistCard: React.FC<FormikAddBanlistCardProps> = ({
  cardTypesOrdered,
  cards,
  form: { setFieldValue },
  field: { name, value: fieldValue },
}) => {
  const [previewCards, setPreviewCards] = useState<CardWithBanlistStatus[]>([]);
  const [previewCardsFromDB, setPreviewCardsFromDB] = useState<(YGOProDeckCard & { cardData?: CardWithBanlistStatus })[]>([]);
  const [researchedCardsFromInput, setResearchedCardsFromInput] = useState<YGOProDeckCard[]>([]);
  const [researchedCardsLength, setResearchedCardsLength] = useState(0);
  const [researchedCardsLabel, setResearchedCardsLabel] = useState("");
  const [researchedCurrentPage, setResearchedCurrentPage] = useState(0);
  const [isLoad, setIsLoad] = useState(false);
  const [cardStatusLabels, setCardStatusLabels] = useState<Array<{ id: number; label: string; limit?: number }>>([]);

  const value = cards?.length > 0 ? cards : fieldValue;

  const getPreviewCardsFromDB = async () => {
    const idArray = previewCards
      ?.map((previewCard) => previewCard?.cardData?.card?.id)
      .filter((id): id is number => typeof id === 'number');

    if (idArray.length > 0) {
      const cardsFromYgo = await getCardsByIds(idArray, 'fr');
      const cardsWithData = cardsFromYgo.map((cardFromYgo) => {
        const matchingPreviewCard = previewCards.find(
          (previewCard) => previewCard?.cardData?.card?.id === cardFromYgo.id
        );
        return {
          ...cardFromYgo,
          cardData: matchingPreviewCard,
        };
      });
      setPreviewCardsFromDB(cardsWithData);
    }
  };

  const getCardStatus = async () => {
    try {
      const response = await api_aw.get<Array<{ id: number; label: string; limit?: number }>>(`/public/cardStatus`);
      if (response.status === 200) {
        setCardStatusLabels(response.data.slice(0, 3));
      }
    } catch (error) {
      console.error('Error fetching card status:', error);
    }
  };

  const checkIfCardAlreadyExistsInDB = () => {
    previewCards?.forEach((c) => {
      if (!c.cardData?.card?.id) return;
      
      const cardData = c.cardData;
      if (!cardData.card) return;
      
      api_aw
        .get(`/public/cards/${cardData.card.id}/checkIfExists`)
        .then((response) => {
          if (response.status === 200) {
            if (response.data === true) {
    
              if (
                typeof cardData.card.id !== "undefined" &&
                typeof cardData.card.cardType !== "undefined"
              ) {
                const isInValue =
                  value.length !== 0 &&
                  value?.find(
                    (cFind) =>
                      Number(cardData.card.id) ===
                      Number(cFind.cardData?.card?.id)
                  );

                const isInCards =
                  value.length !== 0 &&
                  cards?.find(
                    (cFind) =>
                      Number(cardData.card.id) ===
                      Number(cFind.cardData?.card?.id)
                  );
                if (isInValue || isInCards) {
                } else {
                  const newPreviewCards = [...previewCards, c];
                  const newValue = [...value, c];
                  setFieldValue(name, newValue);
                  setPreviewCards(newPreviewCards);
                }
              } else {
              }
            } else {
              if (
                typeof cardData.card.id !== "undefined" &&
                typeof cardData.card.cardType !== "undefined"
              ) {
                const cardToSendInDB = {
                  id: cardData.card.id,
                  cardType: {
                    label: cardData.card.cardType.label,
                  },
                };
                api_aw
                  .post(`/public/cards`, cardToSendInDB)
                  .then((response) => {
                    if (response.status === 201) {
                      //Après avoir créer la carte, l'envoyer dans cards
                      const newPreviewCards = [...previewCards, c];
                      const newValue = [...value, c];
                      setFieldValue(name, newValue);
                      setPreviewCards(newPreviewCards);
                    }
                  });
              } else {
                console.log("Il manque l'ID ou le type de la carte");
              }
            }
          }
        });
    });

    toast.success("Les cartes ont été ajouté à l'archetype");
  };

  const getCardsNumberFromResearch = async () => {
    if (researchedCardsLabel) {
      const count = await getCardsCountByName(researchedCardsLabel, 'fr');
      setResearchedCardsLength(count);
    }
  };

  const getCardsFromResearchInput = async () => {
    if (researchedCardsLabel) {
      const cards = await searchCardsByName(researchedCardsLabel, 'fr', 20, researchedCurrentPage);
      setResearchedCardsFromInput(cards);
      setIsLoad(true);
    }
  };

  const deleteCardInsidePreviewCards = (cardId: number) => {
    const newPreviewCards = previewCards.filter((card) => card.cardData?.card?.id !== cardId);
    setPreviewCards(newPreviewCards);
  };

  const increasePage = () => {
    if (researchedCurrentPage < researchedCardsLength) {
      setResearchedCurrentPage(researchedCurrentPage + 20);
    }
  };

  const decreasePage = () => {
    if (researchedCurrentPage > 0) {
      setResearchedCurrentPage(researchedCurrentPage - 20);
    }
  };

  useEffect(() => {
    previewCards.length >= 1 && getPreviewCardsFromDB();
    getCardsNumberFromResearch();
    getCardsFromResearchInput();
    getCardStatus();
  }, [previewCards.length, researchedCardsLabel, researchedCurrentPage]);

  return isLoad ? (
    <div className="grid grid-cols-12 mt-2">
      <div className="bg-gray-400 col-span-9 mr-1 p-3 rounded">
        <div
          className={`overflow-y-auto bg-white grid ${
            previewCardsFromDB.length > 0 && "grid-cols-12"
          } gap-4 p-2`}
          style={{ height: "432px" }}
        >
          {previewCardsFromDB.length > 0
            ? previewCardsFromDB
                .sort(function (a, b) {
                  return (
                    cardTypesOrdered.indexOf(a.type) -
                    cardTypesOrdered.indexOf(b.type)
                  );
                })
                .map((c, index) => {
                  return (
                    <div key={index} className="col-span-2">
                      <div className="relative">
                        <img
                          className="hover:saturate-150"
                          src={c?.card_images[0].image_url}
                          alt=""
                        />
                        <div
                          style={{ width: `30px`, height: "30px" }}
                          className="absolute top-0 shadow-md shadow-gray-800 right-0 bg-red-500 cursor-pointer border border-red-800 border-2 flex justify-center items-center rounded-full text-white p-2"
                          onClick={() => {
                            deleteCardInsidePreviewCards(c.id);
                          }}
                        >
                          <FaTrashAlt />
                        </div>
                      </div>
                      <select
                        className="text-black mt-1 w-full"
                        id="input-form"
                        value={c?.cardData?.card_status?.label || ''}
                        onChange={(e) => {
                          const newPreviewCards = [...previewCards];
                          const cardIndex = newPreviewCards.findIndex(card => card.cardData?.card?.id === c.id);
                          if (cardIndex >= 0) {
                            const currentCardData = newPreviewCards[cardIndex].cardData;
                            if (currentCardData) {
                              newPreviewCards[cardIndex] = {
                                ...newPreviewCards[cardIndex],
                                cardData: {
                                  ...currentCardData,
                                  card_status: {
                                    ...(currentCardData.card_status || {}),
                                    label: e.target.value,
                                  },
                                },
                              };
                              setPreviewCards(newPreviewCards);
                            }
                          }
                        }}
                      >
                        <option className="w-full" value="">
                          Aucun
                        </option>
                        {cardStatusLabels &&
                          cardStatusLabels.map((op, opIndex) => (
                            <option
                              className="w-full"
                              key={opIndex}
                              value={op.label}
                            >
                              {op.label}
                            </option>
                          ))}
                      </select>
                      <textarea
                        className="w-full border"
                        rows={2}
                        value={c?.cardData?.explanation_text || ''}
                        onChange={(e) => {
                          const newPreviewCards = [...previewCards];
                          const cardIndex = newPreviewCards.findIndex(card => card.cardData?.card?.id === c.id);
                          if (cardIndex >= 0) {
                            const currentCardData = newPreviewCards[cardIndex].cardData;
                            if (currentCardData) {
                              newPreviewCards[cardIndex] = {
                                ...newPreviewCards[cardIndex],
                                cardData: {
                                  ...currentCardData,
                                  explanation_text: e.target.value,
                                },
                              };
                              setPreviewCards(newPreviewCards);
                            }
                          }
                        }}
                      ></textarea>
                    </div>
                  );
                })
            : "Il n'y a aucune carte actuellement"}
        </div>
        {/* {previewCards.length > 0 && ( */}
        <div className="flex justify-center">
          <button
            id="notForm"
            type="button"
            disabled={
              previewCards.length === 0 || undefined || null ? true : false
            }
            className={`${
              previewCards.length === 0
                ? "bg-gray-100 text-gray-300"
                : "bg-gray-800 hover:bg-gray-900 text-white"
            }  rounded p-2 w-1/2 mt-4`}
            onClick={() => {
              checkIfCardAlreadyExistsInDB();
            }}
          >
            Ajouter {previewCards.length > 1 ? "les cartes" : "la carte"} à
            l'archétype
          </button>
        </div>
      </div>
      <AdminResearcherBanlistCards
        researchedCards={researchedCardsFromInput}
        researchedCurrentPage={researchedCurrentPage}
        setResearchedCardsLabel={setResearchedCardsLabel}
        previewCards={previewCards}
        setPreviewCards={setPreviewCards}
        increasePage={increasePage}
        decreasePage={decreasePage}
      />
    </div>
  ) : (
    <div>
      <p>En chargement</p>
    </div>
  );
};

export default FormikAddBanlistCard;
