import axios from "axios";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import api_aw from "../../../api/api_aw";
import Loader from "../../../components/generic/Loader";
import AdminBodyHeader from "../../../components/pages/admin/AdminBodyHeader";
import AdminStructure from "../adminLayout";
import AdminCardsFilter from "../../../components/pages/admin/cards/AdminCardsFilter";
import AdminCardsPagination from "../../../components/pages/admin/cards/AdminCardsPagination";
import { getCardTypes } from "../../../services/cardtype";
import { getAttributes } from "../../../services/attribute";
import { searchCards } from "../../../services/card";
import type { Card, CardSearchCriteria, Pagination } from "../../../types";

interface ApiCard {
  id: number;
  name: string;
  level?: number;
  atk?: number;
  def?: number;
  attribute?: string;
  desc?: string;
  card_images?: Array<{ image_url: string }>;
  type: string;
  race?: string;
  frameType?: string;
}

interface CardType {
  id: number;
  label: string;
  [key: string]: unknown;
}

interface Attribute {
  id: number;
  label: string;
  [key: string]: unknown;
}

const AdminCards = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [criteria, setCriteria] = useState<CardSearchCriteria>({
    name: "",
    card_type: "",
    level: undefined,
    min_atk: undefined,
    max_atk: undefined,
    min_def: undefined,
    max_def: undefined,
    attribute: "",
  });

  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    totalPages: 0,
    currentPage: 1,
    pageSize: 30,
  });
  const [size] = useState(30);
  const [page, setPage] = useState(1);

  const [apiCards, setApiCards] = useState<ApiCard[]>([]);
  const [cardTypes, setCardTypes] = useState<CardType[]>([]);
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [databaseUpdateLoader, setDatabaseUpdateLoader] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const getApiCards = () => {
    axios
      .get(`https://db.ygoprodeck.com/api/v7/cardinfo.php`)
      .then((response) => {
        if (response.status === 200) {
          setApiCards(response?.data.data || []);
        }
      });
  };

  const updateDatabase = () => {
    setDatabaseUpdateLoader(true);
    const cardsSchema: Array<{
      id: number;
      name: string;
      level: number | null;
      atk: number | null;
      def: number | null;
      attribute: string | null;
      description: string | null;
      img_url: string | undefined;
      card_type: string | null;
    }> = [];

    apiCards.forEach((card) => {
      if (card.frameType !== "skill" && card.frameType !== "token") {
        const selectedCard = {
          id: card.id,
          name: card.name,
          level: card.level ? card.level : null,
          atk: card.atk === 0 ? 0 : card.atk && card.atk > 0 ? card.atk : null,
          def: card.def === 0 ? 0 : card.def && card.def > 0 ? card.def : null,
          attribute: card.attribute ? card.attribute : null,
          description: card.desc ? card.desc : null,
          img_url: card?.card_images?.[0]?.image_url,
          card_type: card.type.includes("Monster")
            ? card.type
            : card.type.includes("Spell") || card.type.includes("Trap")
              ? `${card.race || ""} ${card.type.replace(" Card", "")}`
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
      .catch(() => {
        toast.error("Erreur de la mise à jour");
        setDatabaseUpdateLoader(false);
      });
  };

  const resetAllFilters = () => {
    setCriteria({
      name: "",
      min_atk: undefined,
      max_atk: undefined,
      min_def: undefined,
      max_def: undefined,
      level: undefined,
      card_type: "",
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
            cardTypes={cardTypes}
            criteria={criteria}
            setCriteria={setCriteria}
            resetAllFilters={resetAllFilters}
            attributes={attributes}
          />

          {cards?.length > 0 && (
            <div className="bg-slate-200 rounded p-2 ">
              <div className="grid grid-cols-12 gap-1">
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
