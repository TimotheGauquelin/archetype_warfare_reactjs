import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import api_aw from "../../../api/api_aw";
import Loader from "../../../components/generic/Loader";
import AdminBodyHeader from "../../../components/pages/admin/AdminBodyHeader";
import AdminStructure from "../../../components/pages/admin/AdminStructure";
import AdminCardsFilter from "../../../components/pages/admin/cards/AdminCardsFilter";
import AdminCardsPagination from "../../../components/pages/admin/cards/AdminCardsPagination";
import { getCardTypes } from "../../../services/cardtype";
import { getAttributes } from "../../../services/attribute";
import { searchCards } from "../../../services/card";
import { convertBase64 } from "../../../utils/img/convertBase";

const AdminCards = () => {
  const [cards, setCards] = useState([]);
  const [criteria, setCriteria] = useState({
    name: "",
    card_type: "",
    level: "",
    min_atk: "",
    max_atk: "",
    min_def: "",
    max_def: "",
    attribute: "",
  });

  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
    currentPage: 1,
    pageSize: 30,
  });
  const [size] = useState(30);
  const [page, setPage] = useState(1);

  const [apiCards, setApiCards] = useState([]);
  const [cardTypes, setCardTypes] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [databaseUpdateLoader, setDatabaseUpdateLoader] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const getApiCards = () => {
    axios
      .get(`https://db.ygoprodeck.com/api/v7/cardinfo.php`)
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
          attribute: card.attribute ? card.attribute : null,
          // type: card.type.includes("Monster")
          //   ? card.race
          //   : null,
          description: card.desc ? card.desc : null,
          img_url: card?.card_images[0]?.image_url,
          card_type: card.type.includes("Monster")
            ? card.type
            : card.type.includes("Spell") || card.type.includes("Trap")
              ? `${card.race} ${card.type.replace(" Card", "")}`
              : null,
        };
        cardsSchema.push(selectedCard);
      }
    });

    api_aw
      .post(`/cards`, cardsSchema)
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
    setCriteria({
      name: "",
      min_atk: "",
      max_atk: "",
      min_def: "",
      max_def: "",
      level: "",
      card_type: "",
      type: "",
      attribute: "",
    });
    setPage(1);
    toast.success("Vous avez mis les filtres à leur état d'origine.");
  };

  useEffect(() => {
    searchCards(
      setCards,
      setPagination,
      size,
      page,
      criteria.name,
      criteria.card_type,
      criteria.level,
      criteria.min_atk,
      criteria.max_atk,
      criteria.min_def,
      criteria.max_def,
      criteria.attribute
    );
    getCardTypes(setCardTypes);
    getAttributes(setAttributes);
    getApiCards();
    setRefresh(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [criteria, page, refresh]);

  return (
    <AdminStructure>
      <AdminBodyHeader
        label="Cartes"
        catchphrase="Vérifiez toutes les cartes"
        actionButton={() => {
          updateDatabase();
        }}
        actionButtonColor={`${databaseUpdateLoader ? "bg-gray-200" : "bg-green-500"
          } p-2 rounded text-white font-bold`}
        actionButtonText="Mettre à jour la BDD"
        actionButtonDisabled={databaseUpdateLoader}
      />

      {databaseUpdateLoader === false ? (
        <div>
          <AdminCardsFilter
            setPagination={setPage}
            cardTypes={cardTypes}
            criteria={criteria}
            setCriteria={setCriteria}
            resetAllFilters={resetAllFilters}
            attributes={attributes}
          />

          {cards?.length > 0 && (
            <div className="bg-slate-200 rounded p-2 ">
              <div className="grid grid-cols-12 gap-2">
                {cards?.map((card) => {
                  return (
                    <div key={card.id} className="col-span-2 ">
                      <img
                        className="w-full"
                        src={card.img_url}
                        alt={card.name}
                      />
                      {card.name}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <AdminCardsPagination
            currentPage={pagination.currentPage}
            setPagination={setPage}
            setRefresh={setRefresh}
            itemsTotalCount={pagination.total}
            totalPages={pagination.totalPages}
            pageSize={pagination.pageSize}
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
