import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { searchCards } from "../../services/card";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import type { Archetype, Card, BanlistCard, CardSearchCriteria, RootState } from "../../types";
import AdminCardsFilter from "../pages/admin/cards/AdminCardsFilter";
import { useCardTypes } from "@/hooks/useCardTypes";
import { useAttributes } from "@/hooks/useAttributes";

const defaultFilters: CardSearchCriteria = {
  name: "",
  page: 1,
  size: 30,
  card_type: "",
  attribute: "",
  level: undefined,
  min_atk: undefined,
  max_atk: undefined,
  min_def: undefined,
  max_def: undefined,
};

interface AddCardModuleProps {
  newArchetype: Archetype;
  setNewArchetype: React.Dispatch<React.SetStateAction<Archetype>>;
}

const AddCardModule: React.FC<AddCardModuleProps> = ({ newArchetype, setNewArchetype }) => {
  const [cards, setCards] = useState<Card[]>([]);
  const locale = useSelector((state: RootState) => state.locale?.value ?? "fr");
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
    currentPage: 1,
    pageSize: 30,
  });
  const [filters, setFilters] = useState<CardSearchCriteria>({ ...defaultFilters });

  const { cardTypes } = useCardTypes();
  const { attributes } = useAttributes();

  const increasePage = () => {
    if (pagination.currentPage < pagination.totalPages) {
      setFilters(prev => ({
        ...prev,
        page: (prev.page ?? 1) + 1
      }));
    }
  };

  const decreasePage = () => {
    if (pagination.currentPage > 1) {
      setFilters(prev => ({
        ...prev,
        page: (prev.page ?? 1) - 1
      }));
    }
  };

  const addCardToArchetype = (card: Card) => {
    // Vérifier si la carte n'est pas déjà dans l'archetype
    const isCardAlreadyInArchetype = (newArchetype.cards as BanlistCard[] | undefined)?.some(
      (archCard) => archCard.card?.id === card.id
    ) ?? false;

    if (!isCardAlreadyInArchetype) {
      const newCard: BanlistCard = {
        id: 0, // sera assigné par le backend
        banlist: {
          id: 1,
        },
        card: {
          id: card.id,
          name: card.name,
          img_url: card.img_url,
          card_type: card.card_type,
          atk: card.atk,
          def: card.def,
          level: card.level,
        },
        card_status: {
          id: 4,
          label: "",
        },
        card_status_id: 4,
        explanation_text: "Carte limitée dans cette banlist"
      };

      setNewArchetype((prevState) => ({
        ...prevState,
        cards: [...((prevState.cards as BanlistCard[]) || []), newCard],
      }));
    }
  };

  const addAllCardsToArchetype = () => {
    const allCards: BanlistCard[] = cards.map((card) => ({
      id: 0, // sera assigné par le backend
      banlist: { id: 1 },
      card: {
        id: card.id,
        name: card.name,
        img_url: card.img_url,
        card_type: card.card_type,
        atk: card.atk,
        def: card.def,
        level: card.level,
      },
      card_status: {
        id: 4,
        label: "",
      },
      card_status_id: 4,
      explanation_text: "Carte limitée dans cette banlist"
    }));

    // Filtrer les cartes qui ne sont pas déjà dans l'archetype
    const archetypeCards = (newArchetype.cards as BanlistCard[] | undefined) || [];
    const newCards = allCards.filter((card) =>
      !archetypeCards.some(
        (archCard) => archCard.card?.id === card.card.id
      )
    );

    if (newCards.length > 0) {
      setNewArchetype((prevState) => ({
        ...prevState,
        cards: [...archetypeCards, ...newCards],
      }));
    }
  };

  useEffect(() => {
    searchCards(
      setCards,
      setPagination,
      filters.size ?? 30,
      filters.page ?? 1,
      filters.name,
      filters.card_type,
      filters.level,
      filters.min_atk,
      filters.max_atk,
      filters.min_def,
      filters.max_def,
      filters.attribute,
    );
  }, [filters, locale]);

  return (
    <div className="w-full">
      <div className="bg-slate-700 p-2.5 tablet:p-3 rounded-lg space-y-2">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-sm font-semibold text-white">Ajouter des cartes</h3>
          <button
            type="button"
            className="text-sm bg-amber-300 hover:bg-amber-400 shadow-md px-3 py-1 rounded text-slate-900 font-bold text-center cursor-pointer"
            onClick={addAllCardsToArchetype}
          >
            Ajouter tout
          </button>
        </div>
        <AdminCardsFilter
          cardTypes={cardTypes}
          criteria={filters}
          setCriteria={setFilters}
          resetAllFilters={() => setFilters({ ...defaultFilters })}
          attributes={attributes}
          compact
        />
        <div
          className="overflow-y-auto bg-white grid grid-cols-12 gap-1 p-1 rounded"
          style={{ maxHeight: "420px" }}
        >
          {cards && cards.length > 0 ? cards.map((card, index) => {
            const archetypeCards = (newArchetype.cards as BanlistCard[] | undefined) || [];
            const isCardAlreadyInArchetype = archetypeCards.some(
              (archCard) => archCard.card?.id === card.id
            );

            return (
              <div className="col-span-4 tablet:col-span-3 relative" key={index}>
                <img
                  className={`w-full h-auto hover:saturate-150 cursor-pointer ${isCardAlreadyInArchetype ? 'opacity-50' : ''
                    }`}
                  src={`${card?.img_url}`}
                  alt=""
                  loading="lazy"
                  onClick={() => !isCardAlreadyInArchetype && addCardToArchetype(card)}
                />
                {isCardAlreadyInArchetype && (
                  <p
                    style={{ fontSize: "8px", padding: "2px" }}
                    className="absolute top-1/2 left-0 -translate-y-1/2 text-center w-full text-sm bg-yellow-500 text-white rounded"
                  >
                    Déjà ajoutée
                  </p>
                )}
              </div>
            );
          }) : null}
        </div>

        <div className="flex justify-around items-center text-white">
          <FaAngleLeft
            className={`h-8 cursor-pointer ${pagination.currentPage <= 1 && "invisible"}`}
            onClick={() => decreasePage()}
          />
          <p className="text-sm">
            {pagination.currentPage} / {Math.max(pagination.totalPages, 1)}
          </p>
          <FaAngleRight
            className={`h-8 cursor-pointer ${
              pagination.currentPage >= pagination.totalPages && "invisible"
            }`}
            onClick={() => {
              increasePage();
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default AddCardModule;
