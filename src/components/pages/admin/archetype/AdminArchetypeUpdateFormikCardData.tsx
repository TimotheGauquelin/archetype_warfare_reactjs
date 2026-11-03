import { useCallback, useEffect, useMemo, useState } from "react";
import AddCardModule from "../../../generic/AddCardModule";
import BanlistCardComponent, {
  type BanlistCardLayout,
} from "../../../generic/BanlistCard";
import PopUp from "../../../generic/PopUp";
import AdminListedCardsToolbar, {
  matchesListedCardFilters,
  type ListedCardStatusFilter,
} from "../banlist/AdminListedCardsToolbar";
import { getCardStatus } from "../../../../services/cardStatus";
import { getCardTypes } from "../../../../services/cardtype";
import { getBanlistReasons } from "../../../../services/banlistReason";
import usePopup from "../../../../hooks/usePopup";
import type { Archetype, BanlistReason } from "../../../../types";

interface CardStatus {
  id: number;
  label: string;
  limit?: number;
  [key: string]: unknown;
}

interface CardType {
  id: number;
  label: string;
  num_order?: number;
  [key: string]: unknown;
}

interface AdminArchetypeUpdateFormikCardDataProps {
  newArchetype: Archetype;
  setNewArchetype: React.Dispatch<React.SetStateAction<Archetype>>;
  activeTab: string;
}

const AdminArchetypeUpdateFormikCardData: React.FC<
  AdminArchetypeUpdateFormikCardDataProps
> = ({ newArchetype, setNewArchetype, activeTab }) => {
  const [cardsRefresh, setCardsRefresh] = useState(false);
  const [cardStatus, setCardStatus] = useState<CardStatus[]>([]);
  const [cardTypes, setCardTypes] = useState<CardType[]>([]);
  const [availableReasons, setAvailableReasons] = useState<BanlistReason[]>([]);
  const [cardsSearch, setCardsSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ListedCardStatusFilter>("all");
  const [viewMode, setViewMode] = useState<BanlistCardLayout>("grid");
  const { isOpen, popupConfig, closePopup, showConfirmDialog } = usePopup();

  const sameCardId = (left: unknown, right: unknown) =>
    String(left ?? "") === String(right ?? "");

  const deleteCard = useCallback(
    (cardId: string | number) => {
      setNewArchetype((prevState: Archetype) => ({
        ...prevState,
        cards: prevState?.cards?.filter(
          (card) => !sameCardId(card.card.id, cardId)
        ),
      }));
    },
    [setNewArchetype]
  );

  const deleteAllCards = useCallback(() => {
    setNewArchetype((prevState: Archetype) => ({
      ...prevState,
      cards: [],
    }));
    setCardsSearch("");
  }, [setNewArchetype]);

  const sortedCards = useMemo(() => {
    if (!newArchetype?.cards || !cardTypes.length) return [];

    return [...newArchetype.cards].sort((a, b) => {
      const cardTypeA = cardTypes.find((type) => type.label === a.card.card_type);
      const cardTypeB = cardTypes.find((type) => type.label === b.card.card_type);

      if (
        cardTypeA &&
        cardTypeB &&
        cardTypeA.num_order !== undefined &&
        cardTypeB.num_order !== undefined
      ) {
        const typeComparison = cardTypeA.num_order - cardTypeB.num_order;
        if (typeComparison !== 0) return typeComparison;

        const atkComparison = (b.card.atk || 0) - (a.card.atk || 0);
        if (atkComparison !== 0) return atkComparison;

        return (b.card.level || 0) - (a.card.level || 0);
      }

      return 0;
    });
  }, [newArchetype?.cards, cardTypes]);

  const sortedCardsCount = sortedCards.length;

  const filteredCards = useMemo(() => {
    return sortedCards.filter((card) =>
      matchesListedCardFilters(
        card.card?.name,
        card.card_status?.label,
        cardsSearch,
        statusFilter
      )
    );
  }, [sortedCards, cardsSearch, statusFilter]);

  const handleDeleteAll = useCallback(() => {
    if (sortedCardsCount === 0) return;
    showConfirmDialog({
      title: "Supprimer toutes les cartes",
      message: `Supprimer les ${sortedCardsCount} carte(s) de cet archétype ?`,
      confirmText: "Supprimer",
      cancelText: "Annuler",
      onConfirm: deleteAllCards,
    });
  }, [sortedCardsCount, deleteAllCards, showConfirmDialog]);

  useEffect(() => {
    setCardsRefresh(false);
    getCardStatus(setCardStatus);
    getCardTypes(setCardTypes);
    void getBanlistReasons(setAvailableReasons);
  }, [cardsRefresh, newArchetype]);

  return (
    <div
      className={`bg-gray-100 border border-gray-200 rounded p-2.5 tablet:p-3 space-y-3 ${
        activeTab === "cards" ? "" : "hidden"
      }`}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-semibold text-base tablet:text-lg text-gray-900">
          Cartes de l&apos;archétype
        </h2>
        <p className="text-sm text-gray-500">
          {sortedCardsCount} carte{sortedCardsCount > 1 ? "s" : ""}
        </p>
      </div>

      <div className="grid grid-cols-12 gap-3 tablet:gap-4 items-start">
        <div className="col-span-12 sscreen:col-span-7 lscreen:col-span-8 order-2 sscreen:order-1">
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <AdminListedCardsToolbar
              search={cardsSearch}
              onSearchChange={setCardsSearch}
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              includeUnlimited
              onDeleteAll={handleDeleteAll}
              deleteAllDisabled={sortedCardsCount === 0}
              searchAriaLabel="Rechercher une carte dans l'archétype"
            />
            <div
              className="overflow-y-auto p-2 tablet:p-3"
              style={{ maxHeight: "640px" }}
            >
              {sortedCardsCount > 0 ? (
                filteredCards.length > 0 ? (
                  <div
                    className={
                      viewMode === "grid"
                        ? "grid grid-cols-1 tablet:grid-cols-2 lscreen:grid-cols-3 gap-2"
                        : "flex flex-col gap-1.5"
                    }
                  >
                    {filteredCards.map((card) => (
                        <BanlistCardComponent
                          key={card.card.id}
                          card={card as any}
                          cardStatus={cardStatus}
                          availableReasons={availableReasons}
                          deleteCard={deleteCard}
                          canBeUnlimited={true}
                          layout={viewMode}
                          updateCardStatus={(cardId, statusId) => {
                            const selected = cardStatus.find(
                              (s) => Number(s.id) === Number(statusId)
                            );
                            const isUnlimited =
                              selected?.label?.toLocaleLowerCase() === "unlimited";
                            setNewArchetype((prevState: Archetype) => ({
                              ...prevState,
                              cards: (prevState.cards || []).map((archCard) =>
                                sameCardId(archCard.card.id, cardId)
                                  ? {
                                      ...archCard,
                                      card_status_id: Number(statusId),
                                      card_status: {
                                        id: Number(statusId),
                                        label: selected?.label || "",
                                      },
                                      ...(isUnlimited
                                        ? {
                                            reason_ids: [],
                                            reasons: [],
                                            explanation_text: undefined,
                                          }
                                        : {}),
                                    }
                                  : archCard
                              ),
                            }));
                          }}
                          updateCardReasons={(cardId, reasonIds) => {
                            const selectedReasons = availableReasons.filter((r) =>
                              reasonIds.includes(r.id)
                            );
                            setNewArchetype((prevState: Archetype) => ({
                              ...prevState,
                              cards: (prevState.cards || []).map((archCard) =>
                                sameCardId(archCard.card.id, cardId)
                                  ? {
                                      ...archCard,
                                      reason_ids: reasonIds,
                                      reasons: selectedReasons,
                                      explanation_text:
                                        selectedReasons
                                          .map((r) => r.label)
                                          .join(" · ") || undefined,
                                    }
                                  : archCard
                              ),
                            }));
                          }}
                        />
                    ))}
                  </div>
                ) : (
                  <div className="flex min-h-[160px] items-center justify-center text-center text-gray-500 px-4">
                    Aucune carte ne correspond aux filtres.
                  </div>
                )
              ) : (
                <div className="flex min-h-[220px] items-center justify-center text-center text-gray-500 px-4">
                  Aucune carte. Ajoute-en depuis le panneau de droite.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-span-12 sscreen:col-span-5 lscreen:col-span-4 order-1 sscreen:order-2 sscreen:sticky sscreen:top-4">
          <AddCardModule
            newArchetype={newArchetype}
            setNewArchetype={setNewArchetype}
          />
        </div>
      </div>

      <PopUp
        isOpen={isOpen}
        onClose={closePopup}
        title={popupConfig.title}
        className={popupConfig.className}
        showCloseButton={popupConfig.showCloseButton}
        closeOnBackdropClick={popupConfig.closeOnBackdropClick}
      >
        {popupConfig.content}
      </PopUp>
    </div>
  );
};

export default AdminArchetypeUpdateFormikCardData;
