import { useEffect, useState } from "react";
import { searchCards } from "../../services/card";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import type { Archetype, Card, BanlistCard } from "../../types";

interface AddCardModuleProps {
  newArchetype: Archetype;
  setNewArchetype: React.Dispatch<React.SetStateAction<Archetype>>;
}

const AddCardModule: React.FC<AddCardModuleProps> = ({ newArchetype, setNewArchetype }) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
    currentPage: 1,
    pageSize: 30,
  });
  const [filters, setFilters] = useState({
    name: "",
    page: 1,
    size: 30,
  });

  const increasePage = () => {
    if (pagination.currentPage < pagination.totalPages) {
      setFilters(prev => ({
        ...prev,
        page: prev.page + 1
      }));
    }
  };

  const decreasePage = () => {
    if (pagination.currentPage > 1) {
      setFilters(prev => ({
        ...prev,
        page: prev.page - 1
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
    searchCards(setCards, setPagination, filters.size, filters.page, filters.name);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  return (
    <div className="col-span-4 grid grid-cols-12 mt-2">
      <div className="bg-gray-400 col-span-12 ml-1 p-2 rounded">
        <div className="grid grid-cols-12 gap-1 mb-2">
          <input
            className={`w-full p-1 col-span-8`}
            value={filters.name}
            type="text"
            placeholder="Quelle carte recherchez-vous ?"
            onChange={(e) => {
              setFilters(prev => ({
                ...prev,
                name: e.target.value,
                page: 1
              }));
            }}
          />
          <div
            className="text-sm bg-yellow-300 hover:bg-yellow-400 shadow-md col-span-4 rounded text-white font-bold text-center cursor-pointer"
            onClick={addAllCardsToArchetype}
          >
            Ajouter tout
          </div>
        </div>
        <div
          className="overflow-y-auto bg-white grid grid-cols-12 gap-1 p-1"
          style={{ maxHeight: "400px" }}
        >
          {cards && cards.length > 0 ? cards.map((card, index) => {
            const archetypeCards = (newArchetype.cards as BanlistCard[] | undefined) || [];
            const isCardAlreadyInArchetype = archetypeCards.some(
              (archCard) => archCard.card?.id === card.id
            );

            return (
              <div className="col-span-3 relative" key={index}>
                <img
                  className={`hover:saturate-150 cursor-pointer ${isCardAlreadyInArchetype ? 'opacity-50' : ''
                    }`}
                  src={`${card?.img_url}`}
                  alt=""
                  onClick={() => !isCardAlreadyInArchetype && addCardToArchetype(card)}
                />
                {isCardAlreadyInArchetype && (
                  <p
                    style={{ fontSize: "8px", padding: "2px" }}
                    className="absolute top-20 left-0 text-center w-full text-sm bg-yellow-500 text-white rounded"
                  >
                    Déjà ajoutée
                  </p>
                )}
              </div>
            );
          }) : null}
        </div>

        <div className="flex justify-around items-center">
          <FaAngleLeft
            className={`h-8 cursor-pointer ${pagination.currentPage <= 1 && "invisible"}`}
            onClick={() => decreasePage()}
          />
          <p>{pagination.currentPage}</p>
          <FaAngleRight
            className={`h-8 cursor-pointer ${pagination.currentPage >= pagination.totalPages && "invisible"
              }`}
            onClick={() => {
              increasePage();
            }}
          />
        </div>
      </div>
    </div>
  )
};

export default AddCardModule;
