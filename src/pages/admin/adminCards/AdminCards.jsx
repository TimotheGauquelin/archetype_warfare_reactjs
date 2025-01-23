import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import api_aw from "../../../api/api_aw";
import Loader from "../../../components/generic/Loader";
import AdminBodyHeader from "../../../components/pages/admin/AdminBodyHeader";
import AdminStructure from "../../../components/pages/admin/AdminStructure";
import AdminCardsFilter from "../../../components/pages/admin/cards/AdminCardsFilter";
import AdminCardsPagination from "../../../components/pages/admin/cards/AdminCardsPagination";
import {
  switchEngToFrenchType,
  switchEngToFrenchAttribute,
} from "../../../constant/genericMethod";
import {
  URL_BACK_GET_CARD_ATTRIBUTES,
  URL_BACK_GET_CARD_TYPES,
  URL_BACK_GET_MONSTER_TYPES,
} from "../../../constant/urlsBack";

const AdminCards = () => {
  const [cardsTotalCount, setCardsTotalCount] = useState(0);
  const [cards, setCards] = useState([]);
  const [cardTypes, setCardTypes] = useState([]);
  const [displayingNumberSize, setDisplayingNumberSize] = useState(30);
  const [monsterTypes, setMonsterTypes] = useState([]);
  const [monsterAttributes, setMonsterAttributes] = useState([]);
  const [pagination, setPagination] = useState(0);
  const [criteriaName, setCriteriaName] = useState("");
  const [criteriaAtk, setCriteriaAtk] = useState("");
  const [criteriaDef, setCriteriaDef] = useState("");
  const [criteriaLevel, setCriteriaLevel] = useState("");
  const [criteriaCardTypes, setCriteriaCardTypes] = useState("");
  const [criteriaMonsterType, setCriteriaMonsterType] = useState("");
  const [criteriaMonsterAttribute, setCriteriaMonsterAttribute] = useState("");
  const [databaseUpdateLoader, setDatabaseUpdateLoader] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const [apiCards, setApiCards] = useState([]);

  const getCards = () => {
    api_aw
      .get(
        `/public/cardsWithCriteria?size=${displayingNumberSize}&page=${pagination}&name=${criteriaName}&cardType=${criteriaCardTypes}${
          criteriaCardTypes.includes("Monster")
            ? `&atk=${criteriaAtk}&def=${criteriaDef}&attribute=${criteriaMonsterAttribute}&type=${criteriaMonsterType}&level=${criteriaLevel}`
            : ""
        }
        `
      )
      .then((response) => {
        if (response.status === 200) {
          console.log(response);
          setCards(
            response?.data.sort(function (a, b) {
              return (a?.name).localeCompare(b?.name);
            })
          );
          setCardsTotalCount(response.headers["x-total-count"]);
        }
      });
  };

  const getCardTypes = () => {
    api_aw.get(URL_BACK_GET_CARD_TYPES).then((response) => {
      if (response.status === 200) {
        setCardTypes(response?.data);
      }
    });
  };

  const getMonsterTypes = () => {
    api_aw.get(URL_BACK_GET_MONSTER_TYPES).then((response) => {
      if (response.status === 200) {
        setMonsterTypes(response?.data);
      }
    });
  };

  const getMonsterAttributes = () => {
    api_aw.get(URL_BACK_GET_CARD_ATTRIBUTES).then((response) => {
      if (response.status === 200) {
        setMonsterAttributes(response?.data);
      }
    });
  };

  const getApiCards = () => {
    axios
      .get(`https://db.ygoprodeck.com/api/v7/cardinfo.php?language=fr`)
      .then((response) => {
        if (response.status === 200) {
          setApiCards(response?.data.data);
        }
      });
  };

  const updateDatabase = () => {
    setDatabaseUpdateLoader(true);
    const cardsSchema = [];

    apiCards.forEach((card) => {
      if (card.frameType !== "skill" && card.frameType !== "token") {
        const selectedCard = {
          id: card.id,
          name: card.name,
          level: card.level ? card.level : null,
          atk: card.atk === 0 ? 0 : card.atk > 0 ? card.atk : null,
          def: card.def === 0 ? 0 : card.def > 0 ? card.def : null,
          attribute: card.attribute
            ? switchEngToFrenchAttribute(card.attribute)
            : null,
          type: card.type.includes("Monster")
            ? switchEngToFrenchType(card.race)
            : null,
          effect: card.desc ? card.desc : null,
          imageUrl: card?.card_images[0]?.image_url,
          cardType: card.type.includes("Monster")
            ? card.type
            : card.type.includes("Spell") || card.type.includes("Trap")
            ? `${card.race} ${card.type.replace(" Card", "")}`
            : null,
        };
        cardsSchema.push(selectedCard);
      }
    });

    api_aw
      .post(`/public/updateDatabase`, cardsSchema)
      .then((response) => {
        if (response.status === 201) {
          setRefresh(true);
          toast.success("Base de données des cartes mise à jour");
          setDatabaseUpdateLoader(false);
        }
      })
      .catch((error) => {
        toast.error("Erreur de la mise à jour");
        setDatabaseUpdateLoader(false);
      });
  };

  const resetAllFilters = () => {
    setCriteriaName("");
    setCriteriaCardTypes("");
    setPagination(0);
    toast.success("Vous avez mis les filtres à leur état d'origine.");
  };

  useEffect(() => {
    getCards();
    getCardTypes();
    getMonsterAttributes();
    getMonsterTypes();
    getApiCards();
    setRefresh(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    criteriaName,
    criteriaCardTypes,
    pagination,
    criteriaAtk,
    criteriaDef,
    criteriaLevel,
    criteriaMonsterAttribute,
    criteriaMonsterType,
    refresh,
  ]);

  return (
    <AdminStructure>
      <AdminBodyHeader
        label="Cartes"
        catchphrase="Vérifiez toutes les cartes"
        actionButton={() => {
          updateDatabase();
        }}
        actionButtonColor={`${
          databaseUpdateLoader ? "bg-gray-200" : "bg-green-500"
        } p-2 rounded text-white font-bold`}
        actionButtonText="Mettre à jour la BDD"
        actionButtonDisabled={databaseUpdateLoader}
      />

      {databaseUpdateLoader === false ? (
        <div>
          <AdminCardsFilter
            pagination={pagination}
            setPagination={setPagination}
            criteriaName={criteriaName}
            setCriteriaName={setCriteriaName}
            criteriaAtk={criteriaAtk}
            setCriteriaAtk={setCriteriaAtk}
            criteriaDef={criteriaDef}
            setCriteriaDef={setCriteriaDef}
            criteriaLevel={criteriaLevel}
            setCriteriaLevel={setCriteriaLevel}
            criteriaMonsterAttribute={criteriaMonsterAttribute}
            setCriteriaMonsterAttribute={setCriteriaMonsterAttribute}
            criteriaMonsterType={criteriaMonsterType}
            setCriteriaMonsterType={setCriteriaMonsterType}
            cardTypes={cardTypes}
            criteriaCardTypes={criteriaCardTypes}
            setCriteriaCardTypes={setCriteriaCardTypes}
            monsterAttributes={monsterAttributes}
            setMonsterAttributes={setMonsterAttributes}
            monsterTypes={monsterTypes}
            setMonsterTypes={setMonsterTypes}
            resetAllFilters={() => resetAllFilters()}
          ></AdminCardsFilter>

          {cards.length > 0 && (
            <div className="bg-slate-200 rounded p-2 ">
              <div className="grid grid-cols-12 gap-2">
                {cards.map((card) => {
                  return (
                    <div key={card.id} className="col-span-2 ">
                      <img
                        className="w-full"
                        src={card.imageUrl}
                        alt={card.name}
                      />
                      {card.name}
                    </div>
                  );
                })}{" "}
              </div>{" "}
            </div>
          )}
          <AdminCardsPagination
            setRefresh={setRefresh}
            cards={cards}
            pagination={pagination}
            setPagination={setPagination}
            cardsTotalCount={cardsTotalCount}
            displayingNumberSize={displayingNumberSize}
          />
        </div>
      ) : (
        <Loader />
      )}

      <ToastContainer />
    </AdminStructure>
  );
};

export default AdminCards;
