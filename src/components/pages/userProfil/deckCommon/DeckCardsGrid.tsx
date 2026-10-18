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

interface DeckGridCardCopyProps {
  deckCard: DeckCard;
  copy: DeckCard & { uniqueKey: string };
  copyIndex: number;
  isLegal: boolean;
  foreignNames: string;
  archetypeId?: number | string | null;
  onCardClick?: (deckCard: DeckCard) => void;
  onShowDetails: (card: Card) => void;
}

const DeckGridCardCopy: React.FC<DeckGridCardCopyProps> = ({
  deckCard,
  copy,
  copyIndex,
  isLegal,
  foreignNames,
  onCardClick,
  onShowDetails,
}) => {
  const { t } = useTranslation();
  const { handlers, wasLongPress } = useLongPress(
    useCallback(() => {
      onShowDetails(deckCard.card);
    }, [deckCard.card, onShowDetails])
  );

  return (
    <div
      key={copy.uniqueKey}
      className={`col-span-6 lscreen:col-span-1 relative cursor-pointer hover:opacity-80 transition-opacity group select-none touch-manipulation ${
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
        src={copy.img_url || copy.card?.img_url}
        alt={copy.card?.name || "Carte"}
        className="w-full h-auto pointer-events-none"
        loading="lazy"
        draggable={false}
      />
      {copy.quantity > 1 && copyIndex === copy.quantity - 1 && (
        <div className="absolute bottom-0 right-0 bg-black bg-opacity-70 text-white text-xs px-1 rounded">
          x{copy.quantity}
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

  return (
    <>
      <div className="grid grid-cols-12 lscreen:grid-cols-10 gap-1 p-1 mt-2 bg-white">
        {cards.map((deckCard, cardIndex) => {
          const isLegal = isDeckCardLegalForArchetype(deckCard, archetypeId);
          const foreignArchetypes = getForeignArchetypesForDeckCard(
            deckCard,
            archetypeId
          );
          const foreignNames = foreignArchetypes.map((a) => a.name).join(", ");

          const cardCopies = Array.from(
            { length: deckCard.quantity || 1 },
            (_, index) => ({
              ...deckCard,
              uniqueKey: `${deckCard.card.id}-${cardIndex}-${index}`,
            })
          );

          return cardCopies.map((copy, copyIndex) => (
            <DeckGridCardCopy
              key={copy.uniqueKey}
              deckCard={deckCard}
              copy={copy}
              copyIndex={copyIndex}
              isLegal={isLegal}
              foreignNames={foreignNames}
              archetypeId={archetypeId}
              onCardClick={onCardClick}
              onShowDetails={handleShowDetails}
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
