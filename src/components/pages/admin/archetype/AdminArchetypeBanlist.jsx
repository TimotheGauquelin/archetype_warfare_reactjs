import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api_aw from "../../../../api/api_aw";

const AdminArchetypeBanlist = ({
  banlists,
  orderedCardTypes,
  activeBanlistId,
  setActiveBanlistId,
  currentBanlistCards,
  setCurrentBanlistCards,
}) => {
  const [cardStatus, setCardStatus] = useState([]);
  const [refresh, setRefresh] = useState(false);

  const history = useNavigate();

  const getCardStatus = () => {
    api_aw.get(`/public/cardStatus`).then((response) => {
      if (response.status === 200) {
        setCardStatus(response.data);
      }
    });
  };

  const updateBanlistCard = () => {
    currentBanlistCards.forEach((element) => {
      element["banlist"] = { id: activeBanlistId };
      api_aw.put(`/public/banlistCards`, element).then((response) => { });
    });
    history(-1);
  };

  useEffect(() => {
    getCardStatus();
    setRefresh(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeBanlistId, refresh]);

  return (
    <div className="bg-gray-300 p-2">
      <div className="bg-gray-400 p-2 rounded">
        <div className="flex justify-between mb-5">
          <h2 className="font-bold text-xl">Les Cartes de la Banlist :</h2>
          <select
            className="text-black rounded"
            id="input-form"
            value={activeBanlistId}
            onChange={(e) => {
              setActiveBanlistId(e.target.value);
            }}
          >
            {banlists &&
              banlists.map((op, index) => (
                <option key={index} value={op.id}>
                  {op.label}
                </option>
              ))}
          </select>
        </div>
        <div className="grid grid-cols-12"></div>
        <div className="bg-white grid grid-cols-12 p-2 gap-1 rounded">
          {currentBanlistCards
            .sort(function (a, b) {
              return (
                orderedCardTypes.indexOf(a?.card?.cardType?.label) -
                orderedCardTypes.indexOf(b?.card?.cardType?.label) ||
                a?.card?.level - b?.card?.level
              );
            })
            .map((blCard, index) => {
              return (
                <div key={index} className="col-span-2">
                  <img src={blCard?.card.imageUrl} alt="" />
                  <select
                    value={
                      blCard.cardStatus.label ? blCard?.cardStatus.label : ""
                    }
                    className="mt-2 p-2 w-full bg-gray-300 rounded"
                    onChange={(e) => {
                      let newCurrentBanlistCards = currentBanlistCards;
                      blCard.cardStatus.label = e.target.value;

                      newCurrentBanlistCards.forEach((card) => {
                        if (card.archetype.id === blCard.archetype.id) {
                          card = blCard;
                        }
                      });

                      setCurrentBanlistCards(newCurrentBanlistCards);
                      setRefresh(true);
                    }}
                  >
                    {cardStatus.map((sm, index) => {
                      return (
                        <option key={index} value={sm.id}>
                          {sm.label}
                        </option>
                      );
                    })}
                  </select>
                  <textarea
                    className="w-full mt-2 p-2 bg-gray-300"
                    value={
                      blCard?.explanationText
                        ? blCard?.explanationText
                        : "Donnée non complété"
                    }
                    onChange={(e) => {
                      let newCurrentBanlistCards = currentBanlistCards;
                      blCard.explanationText = e.target.value;

                      newCurrentBanlistCards.forEach((card) => {
                        if (card.archetype.id === blCard.archetype.id) {
                          card = blCard;
                        }
                      });

                      setCurrentBanlistCards(newCurrentBanlistCards);
                      setRefresh(true);
                    }}
                  />
                </div>
              );
            })}
        </div>
        <button
          className="bg-gray-800 text-white font-bold p-2 mt-2 rounded"
          onClick={() => updateBanlistCard()}
        >
          Mettre à jour
        </button>
      </div>
    </div>
  );
};

export default AdminArchetypeBanlist;
