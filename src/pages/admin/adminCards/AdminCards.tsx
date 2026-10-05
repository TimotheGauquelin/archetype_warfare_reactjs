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
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../../types";

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

  const [cardTypes, setCardTypes] = useState<CardType[]>([]);
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [databaseUpdateLoader, setDatabaseUpdateLoader] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const locale = useSelector((state: RootState) => state.locale?.value ?? "fr");

  const navigate = useNavigate();

  const mapApiCardToPayload = (
    card: ApiCard,
    frCard?: ApiCard
  ) => {
    const translations = [
      {
        locale: "en",
        name: card.name,
        description: card.desc ?? null,
      },
    ];

    if (frCard?.name) {
      translations.push({
        locale: "fr",
        name: frCard.name,
        description: frCard.desc ?? null,
      });
    }

    return {
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
      translations,
    };
  };

  const updateDatabase = async () => {
    setDatabaseUpdateLoader(true);

    try {
      const [enResponse, frResponse] = await Promise.all([
        axios.get(`https://db.ygoprodeck.com/api/v7/cardinfo.php`),
        axios.get(`https://db.ygoprodeck.com/api/v7/cardinfo.php?language=fr`),
      ]);

      const enCards: ApiCard[] = enResponse?.data?.data || [];
      const frCards: ApiCard[] = frResponse?.data?.data || [];
      const frById = new Map<number, ApiCard>(
        frCards.map((card) => [card.id, card])
      );

      const cardsSchema = enCards
        .filter(
          (card) => card.frameType !== "skill" && card.frameType !== "token"
        )
        .map((card) => mapApiCardToPayload(card, frById.get(card.id)));

      const response = await api_aw.post(`/cards`, cardsSchema);

      if (response.status === 201 || response.status === 207) {
        setRefresh(true);
        toast.success(
          response.data?.message ?? "Base de données des cartes mise à jour"
        );
        if (response.data?.errors?.length) {
          toast.warn(
            `${response.data.errors.length} erreur(s) — détail dans la console`
          );
          console.table(response.data.errors);
        }
      }
    } catch (err: unknown) {
      const axiosError = err as {
        response?: { data?: { message?: string; errors?: unknown[] } };
      };
      const message =
        axiosError.response?.data?.message ?? "Erreur de la mise à jour";
      const errors = axiosError.response?.data?.errors;
      toast.error(message);
      if (errors?.length) {
        toast.warn(`${errors.length} erreur(s) — détail dans la console`);
        console.table(errors);
      }
    } finally {
      setDatabaseUpdateLoader(false);
    }
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
    setRefresh(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [criteria, page, refresh, locale]);

  return (
    <AdminStructure>
      <AdminBodyHeader
        label="Cartes"
        catchphrase="Vérifiez toutes les cartes"
        actionButton={() => {
          updateDatabase();
        }}
        actionButtonColor={`h-fit ${databaseUpdateLoader ? "bg-gray-200" : "bg-green-500 hover:bg-green-600"
          } p-2 rounded text-white font-bold cursor-pointer`}
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
              <div className="grid grid-cols-10 gap-1">
                {cards?.map((card) => {
                  return (
                    <div
                      key={card.id}
                      className="col-span-1 cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => {
                        navigate(`/admin/cards/${card.id}`);
                      }}
                    >
                      <img
                        className="w-full"
                        src={card.img_url}
                        alt={card.name}
                      />
                      <span className="text-xs line-clamp-1">
                        {card.name}
                      </span>
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
