import React, { useEffect, useState } from "react";
import { FaTrashAlt } from "react-icons/fa";
import AdminBanlistFormikData from "./AdminBanlistFormikData";

const AdminBanlistFormik = ({
  banlist,
  banlistCardsLength,
  setBanlist,
  newBanlist,
  setNewBanlist,
  addBanlist,
  orderedCardTypes,
  setDataIsLoaded,
  location,
}) => {
  
  const [cardsRefresh, setCardsRefresh] = useState(false);

  const deleteCard = (cardId) => {
    var banlistCopy = banlist;

    const findIndex = banlistCopy?.cards?.findIndex(
      (card) => card.card.id === cardId
    );

    banlistCopy.cards.splice(findIndex, 1);
    setBanlist(banlistCopy);
    setCardsRefresh(true);
  };

  useEffect(() => {
    if (location?.state?.request !== "put") {
      setDataIsLoaded(true);
    }
    setCardsRefresh(false);
  }, [cardsRefresh, location?.state?.request, setDataIsLoaded]);

  return (
    <>
      <AdminBanlistFormikData newBanlist={newBanlist} setNewBanlist={setNewBanlist} />
      <div className="bg-gray-300 mt-4 rounded p-2">
        <h2 className="font-bold text-xl">Cartes de la banlist :</h2>
        <div className="bg-gray-300 grid grid-cols-12 gap-2">
          <div className="bg-gray-400 col-span-9 mt-2 p-3 rounded">
            <div
              // className={`overflow-y-auto col-span-8 grid bg-white p-2 rounded ${
              //   banlistCardsLength > 0 && "grid-cols-12"
              // } gap-4 ${banlistCardsLength === 0 && "text-red-500 my-2"}`}
              style={{ maxHeight: "400px" }}
            >
              {banlistCardsLength > 0
                ? banlist?.cards
                  .filter((card) => card.archetype === null)
                  .sort(function (a, b) {
                    return (
                      orderedCardTypes.indexOf(a?.card?.cardType?.label) -
                      orderedCardTypes.indexOf(b?.card?.cardType?.label) ||
                      a.level - b.level
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
                            const findIndex = banlistCopy.cards.findIndex(
                              (cardIndex) =>
                                cardIndex.card.id === card.card.id
                            );

                            banlistCopy.cards[findIndex].cardStatus.label =
                              e.target.value;
                            setBanlist(banlistCopy);
                            setCardsRefresh(true);
                          }}
                        >
                          {/* {cardStatusLabels
                              .filter((status) => status.label !== "Illimité")
                              .map((cardStatus, index) => {
                                return (
                                  <option key={index} value={cardStatus.label}>
                                    {cardStatus.label}
                                  </option>
                                );
                              })} */}
                        </select>
                        <textarea
                          className="w-full px-2 border rounded"
                          value={card.explanationText}
                          onChange={(e) => {
                            const banlistCopy = banlist;
                            const findIndex = banlistCopy.cards.findIndex(
                              (cardIndex) =>
                                cardIndex.card.id === card.card.id
                            );
                            banlistCopy.cards[findIndex].explanationText =
                              e.target.value;
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
        </div>
      </div>
      <button
        id="form"
        className="bg-gray-800 hover:bg-gray-900 text-white mt-2 p-2 px-4 rounded"
        onClick={() => { addBanlist() }}
      >
        {`${location?.state?.request === "put" ? `Modifier` : "Créer"
          } l'archétype`}
      </button>
    </>
  );
};

export default AdminBanlistFormik;
