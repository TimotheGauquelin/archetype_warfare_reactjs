import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import type { Card, DeckCard } from "@/types";
import {
  getForeignArchetypesForDeckCard,
  isDeckCardLegalForArchetype,
} from "@/utils/deck/deckCardLegality";
import { useLongPress } from "@/hooks/useLongPress";
import DeckCardDetailPopUp from "./DeckCardDetailPopUp";

interface DeckCardsGridProps {
  cards: DeckCard[];
  archetypeId?: number | string | null;
  onCardClick?: (deckCard: DeckCard) => void;
}

interface DeckGridCardProps {
  deckCard: DeckCard;
  isLegal: boolean;
  foreignNames: string;
  onCardClick?: (deckCard: DeckCard) => void;
  onShowDetails: (card: Card) => void;
  /** Affiche le badge quantité (mode mobile empilé) */
  showQuantityBadge?: boolean;
  /** Classes de colonne responsive */
  colClassName?: string;
  uniqueKey: string;
}

const DeckGridCard: React.FC<DeckGridCardProps> = ({
  deckCard,
  isLegal,
  foreignNames,
  onCardClick,
  onShowDetails,
  showQuantityBadge = false,
  colClassName = "col-span-3 lscreen:col-span-1",
  uniqueKey,
}) => {
  const { t } = useTranslation();
  const quantity = deckCard.quantity || 1;
  const { handlers, wasLongPress } = useLongPress(
    useCallback(() => {
      onShowDetails(deckCard.card);
    }, [deckCard.card, onShowDetails])
  );

  return (
    <div
      key={uniqueKey}
      className={`${colClassName} relative cursor-pointer hover:opacity-80 transition-opacity group select-none touch-manipulation ${
        isLegal ? "" : "grayscale opacity-50"
      }`}
      {...handlers}
      onClick={() => {
        if (wasLongPress()) return;
        onCardClick?.(deckCard);
      }}
      title={
        isLegal
          ? `${t("profile.clickToRemove")} — ${t("profile.longPressForDetails")}`
          : foreignNames
            ? `${t("profile.cardNotLegalForDeckNamed", { name: foreignNames })} — ${t("profile.longPressForDetails")}`
            : `${t("profile.cardNotLegalForDeck")} — ${t("profile.longPressForDetails")}`
      }
    >
      <img
        src={deckCard.img_url || deckCard.card?.img_url}
        alt={deckCard.card?.name || "Carte"}
        className="w-full h-auto pointer-events-none"
        loading="lazy"
        draggable={false}
      />
      {showQuantityBadge && quantity > 1 && (
        <div className="absolute bottom-1 right-1 min-w-[1.25rem] h-5 px-1.5 flex items-center justify-center bg-black/80 text-white text-xs font-bold rounded-full shadow">
          {quantity}
        </div>
      )}
      {!isLegal && (
        <div className="absolute top-0 left-0 right-0 bg-red-700/80 text-white text-[10px] leading-tight px-0.5 py-0.5 text-center">
          {t("profile.cardNotLegalBadge")}
        </div>
      )}
      <div className="absolute inset-0 bg-red-500 bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center pointer-events-none" />
    </div>
  );
};

const DeckCardsGrid: React.FC<DeckCardsGridProps> = ({
  cards,
  archetypeId,
  onCardClick,
}) => {
  const [detailCard, setDetailCard] = useState<Card | null>(null);

  const handleShowDetails = useCallback((card: Card) => {
    setDetailCard(card);
  }, []);

  const cardMeta = (deckCard: DeckCard) => {
    const isLegal = isDeckCardLegalForArchetype(deckCard, archetypeId);
    const foreignArchetypes = getForeignArchetypesForDeckCard(
      deckCard,
      archetypeId
    );
    const foreignNames = foreignArchetypes.map((a) => a.name).join(", ");
    return { isLegal, foreignNames };
  };

  return (
    <>
      {/* Mobile : 4 par ligne, 1 vignette + badge quantité */}
      <div className="grid grid-cols-12 gap-1 p-1 mt-2 bg-white lscreen:hidden">
        {cards.map((deckCard, cardIndex) => {
          const { isLegal, foreignNames } = cardMeta(deckCard);
          return (
            <DeckGridCard
              key={`mobile-${deckCard.card.id}-${cardIndex}`}
              uniqueKey={`mobile-${deckCard.card.id}-${cardIndex}`}
              deckCard={deckCard}
              isLegal={isLegal}
              foreignNames={foreignNames}
              onCardClick={onCardClick}
              onShowDetails={handleShowDetails}
              showQuantityBadge
              colClassName="col-span-3"
            />
          );
        })}
      </div>

      {/* Desktop : un exemplaire par copie (comportement d'origine) */}
      <div className="hidden lscreen:grid grid-cols-10 gap-1 p-1 mt-2 bg-white">
        {cards.map((deckCard, cardIndex) => {
          const { isLegal, foreignNames } = cardMeta(deckCard);
          const quantity = deckCard.quantity || 1;

          return Array.from({ length: quantity }, (_, copyIndex) => (
            <DeckGridCard
              key={`desktop-${deckCard.card.id}-${cardIndex}-${copyIndex}`}
              uniqueKey={`desktop-${deckCard.card.id}-${cardIndex}-${copyIndex}`}
              deckCard={deckCard}
              isLegal={isLegal}
              foreignNames={foreignNames}
              onCardClick={onCardClick}
              onShowDetails={handleShowDetails}
              showQuantityBadge={false}
              colClassName="col-span-1"
            />
          ));
        })}
      </div>

      <DeckCardDetailPopUp
        card={detailCard}
        isOpen={detailCard != null}
        onClose={() => setDetailCard(null)}
      />
    </>
  );
};

export default DeckCardsGrid;
