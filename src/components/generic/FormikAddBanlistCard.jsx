import axios from "axios";
import React, { useEffect, useState } from "react";
import api_aw from "../../api/api_aw";
import { FaTrashAlt } from "react-icons/fa";
import AdminResearcherBanlistCards from "../pages/admin/AdminResearcherBanlistCards";
import { toast } from "react-toastify";

const FormikAddBanlistCard = ({
  cardTypesOrdered,
  cards,
  form: { setFieldValue },
  field: { name, value },
}) => {
  const [previewCards, setPreviewCards] = useState([]);
  const [previewCardsFromDB, setPreviewCardsFromDB] = useState([]);
  const [researchedCardsFromInput, setResearchedCardsFromInput] = useState([]);
  const [researchedCardsLength, setResearchedCardsLength] = useState(0);
  const [researchedCardsLabel, setResearchedCardsLabel] = useState("");
  const [researchedCurrentPage, setResearchedCurrentPage] = useState(0);
  const [isLoad, setIsLoad] = useState(false);
  const [cardStatusLabels, setCardStatusLabels] = useState([]);

  value = cards?.length > 0 ? cards : [];

  const getPreviewCardsFromDB = () => {
    const idArray = previewCards?.map((previewCard) => {
      return previewCard?.cardData.card?.id;
    });

    idArray.length > 0 &&
      axios
        .get(
          `https://db.ygoprodeck.com/api/v7/cardinfo.php?id=${idArray.join()}&language=fr`
        )
        .then((resp) => {
          if (resp.status === 200) {
            resp?.data?.data.forEach((cardFromYgoProDB) => {
              previewCards.find((cardFromOwnDB) => {
                if (cardFromYgoProDB.id === cardFromOwnDB.cardData.card.id) {
                  cardFromYgoProDB["cardData"] = cardFromOwnDB;
                }
              });
            });
            setPreviewCardsFromDB(resp?.data?.data);
          }
        });
  };

  const getCardStatus = () => {
    api_aw.get(`/public/cardStatus`).then((response) => {
      if (response.status === 200) {
        setCardStatusLabels(response.data.slice(0, 3));
      }
    });
  };

  const checkIfCardAlreadyExistsInDB = () => {
    previewCards?.forEach((c) => {
      api_aw
        .get(`/public/cards/${c.cardData.card.id}/checkIfExists`)
        .then((response) => {
          if (response.status === 200) {
            if (response.data === true) {
              //Si déjà en BDD, ne pas l'ajouter à l'archetype
              console.log("La carte est déjà en BDD !");
              //Pas besoin de créer la carte. Envoyer directement dans banlistCards
              if (
                typeof c?.cardData.card.id !== "undefined" &&
                typeof c?.cardData.card.cardType !== "undefined"
              ) {
                //Après avoir créer la carte, l'envoyer dans banlistCards
                /*Mettre une condition si elle n'existe pas déjà dans la banlist */

                const isInValue =
                  value.length !== 0 &&
                  value?.find(
                    (cFind) =>
                      Number(c.cardData.card.id) ===
                      Number(cFind.cardData.card.id)
                  );

                const isInCards =
                  value.length !== 0 &&
                  cards?.find(
                    (cFind) =>
                      Number(c.cardData.card.id) ===
                      Number(cFind.cardData.card.id)
                  );

                if (isInValue || isInCards) {
                  console.log("Existe déjà dans value");
                } else {
                  console.log("Ajouter dans value");
                  previewCards.push(c);
                  value.push(c);
                  setFieldValue(name, value);
                  setPreviewCards({
                    ...c,
                    id: "",
                  });
                }
              } else {
                console.log("C'pas bon ! Il manque un truc");
              }
            } else {
              //Sinon, l'ajouter
              console.log("Ajout dans la BDD !");
              if (
                typeof c?.cardData.card.id !== "undefined" ||
                (null && typeof c?.cardData.card.cardType !== "undefined") ||
                null
              ) {
                console.log("C'est tout bon !");
                const cardToSendInDB = {
                  id: c.cardData.card.id,
                  cardType: {
                    label: c.cardData.card.cardType.label,
                  },
                };
                api_aw
                  .post(`/public/cards`, cardToSendInDB)
                  .then((response) => {
                    if (response.status === 201) {
                      //Après avoir créer la carte, l'envoyer dans cards
                      previewCards.push(c);
                      value.push(c);
                      setFieldValue(name, value);
                      setPreviewCards({
                        ...c,
                        id: "",
                      });
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

  const getCardsNumberFromResearch = () => {};

  const getCardsFromResearchInput = () => {
    axios
      .get(
        `https://db.ygoprodeck.com/api/v7/cardinfo.php?fname=${researchedCardsLabel}&language=fr`
      )
      .then((response) => {
        if (response.status === 200) {
          setResearchedCardsLength(response.data.data.length);
        }
      });

    axios
      .get(
        `https://db.ygoprodeck.com/api/v7/cardinfo.php?fname=${researchedCardsLabel}&language=fr&num=20&offset=${researchedCurrentPage}`
      )
      .then((response) => {
        if (response.status === 200) {
          setResearchedCardsFromInput(response.data.data);
          setIsLoad(true);
        }
      });
  };

  const deleteCardInsidePreviewCards = (cardId) => {
    let newPreviewCards = [...previewCards];
    const cardIndex = newPreviewCards.findIndex((card) => card.id === cardId);
    newPreviewCards.splice(cardIndex, 1);
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
                        value={c?.cardData?.cardStatus?.label}
                        onChange={(e) => {
                          const newPreviewCards = [...previewCards];
                          newPreviewCards[index].cardData.cardStatus.label =
                            e.target.value;
                          setPreviewCards(newPreviewCards);
                          console.log(previewCards);
                        }}
                      >
                        <option className="w-full" value="">
                          Aucun
                        </option>
                        {cardStatusLabels &&
                          cardStatusLabels.map((op, index) => (
                            <option
                              className="w-full"
                              key={index}
                              value={op.label}
                              //   selected={op.label === "Interdit" ? true : false}
                            >
                              {op.label}
                            </option>
                          ))}
                      </select>
                      <textarea
                        className="w-full border"
                        rows="2"
                        value={c?.cardData?.explanationText}
                        onChange={(e) => {
                          const newPreviewCards = [...previewCards];
                          newPreviewCards[index].cardData.explanationText =
                            e.target.value;
                          setPreviewCards(newPreviewCards);
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
