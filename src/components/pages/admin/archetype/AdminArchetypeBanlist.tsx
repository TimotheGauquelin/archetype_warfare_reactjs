import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api_aw from "../../../../api/api_aw";

interface CardStatus {
  id: number;
  label: string;
  limit?: number;
}

interface BanlistCardWithArchetype {
  id?: number;
  card: {
    imageUrl?: string;
    img_url?: string;
    cardType?: { label: string };
    card_type?: string;
    level?: number;
    [key: string]: unknown;
  };
  cardStatus?: {
    id?: number;
    label: string;
    [key: string]: unknown;
  };
  card_status?: {
    id?: number;
    label: string;
    [key: string]: unknown;
  };
  explanationText?: string;
  explanation_text?: string;
  archetype?: {
    id: number;
    [key: string]: unknown;
  };
  banlist?: { id: number };
  [key: string]: unknown;
}

interface AdminArchetypeBanlistProps {
  banlists?: Array<{ id: number; label?: string; [key: string]: unknown }>;
  orderedCardTypes: string[];
  activeBanlistId: number | string;
  setActiveBanlistId: (id: number | string) => void;
  currentBanlistCards: BanlistCardWithArchetype[];
  setCurrentBanlistCards: React.Dispatch<React.SetStateAction<BanlistCardWithArchetype[]>>;
}

const AdminArchetypeBanlist: React.FC<AdminArchetypeBanlistProps> = ({
  banlists,
  orderedCardTypes,
  activeBanlistId,
  setActiveBanlistId,
  currentBanlistCards,
  setCurrentBanlistCards,
}) => {
  const [cardStatus, setCardStatus] = useState<CardStatus[]>([]);
  const [refresh, setRefresh] = useState(false);

  const history = useNavigate();

  const getCardStatus = () => {
    api_aw.get<CardStatus[]>(`/public/cardStatus`).then((response) => {
      if (response.status === 200) {
        setCardStatus(response.data);
      }
    });
  };

  const updateBanlistCard = () => {
    currentBanlistCards.forEach((element: BanlistCardWithArchetype) => {
      const elementToSend = {
        ...element,
        banlist: { id: typeof activeBanlistId === 'string' ? Number(activeBanlistId) : activeBanlistId },
      };
      api_aw.put(`/public/banlistCards`, elementToSend).then(() => { });
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
              setActiveBanlistId(Number(e.target.value));
            }}
          >
            {banlists &&
              banlists.map((op: { id: number; label?: string }, index: number) => (
                <option key={index} value={op.id}>
                  {op.label || `Banlist ${op.id}`}
                </option>
              ))}
          </select>
        </div>
        <div className="grid grid-cols-12"></div>
        <div className="bg-white grid grid-cols-12 p-2 gap-1 rounded">
          {currentBanlistCards
            .sort(function (a: BanlistCardWithArchetype, b: BanlistCardWithArchetype) {
              const aLabel = a?.card?.cardType?.label || a?.card?.card_type || '';
              const bLabel = b?.card?.cardType?.label || b?.card?.card_type || '';
              const aIndex = orderedCardTypes.indexOf(aLabel);
              const bIndex = orderedCardTypes.indexOf(bLabel);
              if (aIndex !== bIndex) {
                return aIndex - bIndex;
              }
              return (a?.card?.level || 0) - (b?.card?.level || 0);
            })
            .map((blCard: BanlistCardWithArchetype, index: number) => {
              return (
                <div key={index} className="col-span-2">
                  <img src={blCard?.card?.imageUrl || blCard?.card?.img_url || ''} alt="" />
                  <select
                    value={
                      blCard.cardStatus?.label || blCard.card_status?.label || ""
                    }
                    className="mt-2 p-2 w-full bg-gray-300 rounded"
                    onChange={(e) => {
                      const newCurrentBanlistCards = currentBanlistCards.map((card: BanlistCardWithArchetype) => {
                        if (card.archetype?.id === blCard.archetype?.id) {
                          return {
                            ...card,
                            cardStatus: {
                              ...card.cardStatus,
                              label: e.target.value,
                            },
                            card_status: {
                              ...card.card_status,
                              label: e.target.value,
                            },
                          };
                        }
                        return card;
                      });

                      setCurrentBanlistCards(newCurrentBanlistCards);
                      setRefresh(true);
                    }}
                  >
                    {cardStatus.map((sm: CardStatus, index: number) => {
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
                      blCard?.explanationText || blCard?.explanation_text || "Donnée non complété"
                    }
                    onChange={(e) => {
                      const newCurrentBanlistCards = currentBanlistCards.map((card: BanlistCardWithArchetype) => {
                        if (card.archetype?.id === blCard.archetype?.id) {
                          return {
                            ...card,
                            explanationText: e.target.value,
                            explanation_text: e.target.value,
                          };
                        }
                        return card;
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
