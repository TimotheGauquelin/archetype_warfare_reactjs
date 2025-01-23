import { Field, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { FaTrashAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import api_aw from "../../../../api/api_aw";
import FormikAddCard from "../../../generic/FormikAddCard";
import AdminBanlistFormikData from "./AdminBanlistFormikData";

const AdminBanlistFormik = ({
  cardTypes,
  banlist,
  setBanlist,
  orderedCardTypes,
  dataIsLoaded,
  setDataIsLoaded,
  location,
  requestPut,
}) => {
  const history = useNavigate();

  const [cardsRefresh, setCardsRefresh] = useState(false);
  const [cardStatusLabels, setCardStatusLabels] = useState([]);
  const banlistCardsLength = banlist?.cards?.filter(
    (card) => card.archetype === null
  ).length;

  const getCardStatus = () => {
    api_aw.get(`/public/cardStatus`).then((response) => {
      if (response.status === 200) {
        setCardStatusLabels(response.data);
        // setCardStatusLabels(response.data.slice(0, 3));
      }
    });
  };

  const onSubmit = (values) => {
    console.log(values);

    const banlistSchema = {
      id: values?.id,
      label: values?.label,
      releaseDate: values?.releaseDate,
      description: values?.description,
      active: values?.active,
      cards: values?.cards,
    };

    console.log(banlistSchema);
    banlistSchema.cards.forEach((card) => {
      if (card.archetype === null) {
        console.log(card);
      }
    });
    requestPut
      ? api_aw.put(`/public/banlists`, banlistSchema).then((response) => {
          if (response.status === 201) {
            history(-1);
          }
        })
      : api_aw.post(`/public/banlists`, banlistSchema).then((response) => {
          if (response.status === 201) {
            history(-1);
          }
        });
  };

  const deleteCard = (cardId) => {
    var banlistCopy = banlist;
    console.log(banlist);

    const findIndex = banlistCopy?.cards?.findIndex(
      (card) => card.card.id === cardId
    );

    banlistCopy.cards.splice(findIndex, 1);
    setBanlist(banlistCopy);
    setCardsRefresh(true);
  };

  useEffect(() => {
    location?.state?.request !== "put" && setDataIsLoaded(true);
    getCardStatus();
    setCardsRefresh(false);
  }, [cardsRefresh]);

  return (
    <>
      {dataIsLoaded && (
        <Formik
          initialValues={{
            id: requestPut ? banlist.id : null,
            label: requestPut ? banlist.label : "",
            releaseDate: requestPut ? banlist.releaseDate : "",
            description: requestPut ? banlist.description : "",
            active: requestPut ? banlist.active : false,
            cards: requestPut ? banlist.cards : [],
          }}
          onSubmit={(values) => onSubmit(values)}
        >
          <Form id="form" className="">
            <AdminBanlistFormikData />
            <div className="bg-gray-300 mt-4 rounded p-2">
              <h2 className="font-bold text-xl">Cartes de la banlist :</h2>
              <div className="bg-gray-300 grid grid-cols-12 gap-2">
                <div className="bg-gray-400 col-span-9 mt-2 p-3 rounded">
                  <div
                    className={`overflow-y-auto col-span-8 grid bg-white p-2 rounded ${
                      banlistCardsLength > 0 && "grid-cols-12"
                    } gap-4 ${banlistCardsLength === 0 && "text-red-500 my-2"}`}
                    style={{ height: "400px" }}
                  >
                    {banlistCardsLength > 0
                      ? banlist?.cards
                          .filter((card) => card.archetype === null)
                          .sort(function (a, b) {
                            return (
                              orderedCardTypes.indexOf(
                                a?.card?.cardType?.label
                              ) -
                                orderedCardTypes.indexOf(
                                  b?.card?.cardType?.label
                                ) || a.level - b.level
                            );
                          })
                          .map((card, index) => {
                            return (
                              <div
                                key={index}
                                className="lscreen:col-span-2 sscreen:col-span-3 col-span-4"
                              >
                                <div className="relative">
                                  <img
                                    className="hover:saturate-150"
                                    src={`${card?.card?.imageUrl}`}
                                    alt=""
                                  />
                                  <div
                                    style={{ width: `30px`, height: "30px" }}
                                    className="absolute top-0 shadow-md shadow-gray-800 right-0 bg-red-500 cursor-pointer border border-red-800 border-2 flex justify-center items-center rounded-full text-white p-2"
                                    onClick={() => {
                                      deleteCard(card?.card?.id);
                                    }}
                                  >
                                    <FaTrashAlt />
                                  </div>
                                </div>
                                <select
                                  value={card.cardStatus.label}
                                  className="w-full px-2 border rounded"
                                  onChange={(e) => {
                                    const banlistCopy = banlist;
                                    const findIndex =
                                      banlistCopy.cards.findIndex(
                                        (cardIndex) =>
                                          cardIndex.card.id === card.card.id
                                      );

                                    banlistCopy.cards[
                                      findIndex
                                    ].cardStatus.label = e.target.value;
                                    setBanlist(banlistCopy);
                                    setCardsRefresh(true);
                                  }}
                                >
                                  {cardStatusLabels
                                    .filter(
                                      (status) => status.label !== "Illimité"
                                    )
                                    .map((cardStatus, index) => {
                                      return (
                                        <option
                                          key={index}
                                          value={cardStatus.label}
                                        >
                                          {cardStatus.label}
                                        </option>
                                      );
                                    })}
                                </select>
                                <textarea
                                  className="w-full px-2 border rounded"
                                  value={card.explanationText}
                                  onChange={(e) => {
                                    const banlistCopy = banlist;
                                    const findIndex =
                                      banlistCopy.cards.findIndex(
                                        (cardIndex) =>
                                          cardIndex.card.id === card.card.id
                                      );
                                    banlistCopy.cards[
                                      findIndex
                                    ].explanationText = e.target.value;
                                    setBanlist(banlistCopy);
                                    setCardsRefresh(true);
                                  }}
                                ></textarea>
                              </div>
                            );
                          })
                      : "Cet archétype ne possède aucune carte"}
                  </div>
                </div>
                <Field
                  type="number"
                  name="cards"
                  cardTypes={cardTypes}
                  cardTypesOrdered={orderedCardTypes}
                  cards={banlist?.cards}
                  archetypeCards={banlist}
                  setArchetypeCards={setBanlist}
                  banlist
                  component={FormikAddCard}
                  setCardsRefresh={setCardsRefresh}
                />
              </div>
            </div>

            <button
              id="form"
              type="submit"
              className="bg-gray-800 hover:bg-gray-900 text-white mt-2 p-2 px-4 rounded"
            >
              {`${
                location?.state?.request === "put" ? `Modifier` : "Créer"
              } l'archétype`}
            </button>
          </Form>
        </Formik>
      )}
    </>
  );
};

export default AdminBanlistFormik;
