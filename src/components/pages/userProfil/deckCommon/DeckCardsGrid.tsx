import React from "react";
import { useTranslation } from "react-i18next";
import type { DeckCard } from "@/types";
import {
  getForeignArchetypesForDeckCard,
  isDeckCardLegalForArchetype,
} from "@/utils/deck/deckCardLegality";

interface DeckCardsGridProps {
  cards: DeckCard[];
  archetypeId?: number | string | null;
  onCardClick?: (deckCard: DeckCard) => void;
}

const DeckCardsGrid: React.FC<DeckCardsGridProps> = ({
  cards,
  archetypeId,
  onCardClick,
}) => {
  const { t } = useTranslation();

  return (
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
          <div
            key={copy.uniqueKey}
            className={`col-span-6 lscreen:col-span-1 relative cursor-pointer hover:opacity-80 transition-opacity group ${
              isLegal ? "" : "grayscale opacity-50"
            }`}
            onClick={() => onCardClick?.(deckCard)}
            title={
              isLegal
                ? t("profile.clickToRemove")
                : foreignNames
                  ? t("profile.cardNotLegalForDeckNamed", { name: foreignNames })
                  : t("profile.cardNotLegalForDeck")
            }
          >
            <img
              src={copy.img_url || copy.card?.img_url}
              alt={copy.card?.name || "Carte"}
              className="w-full h-auto"
              loading="lazy"
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
            <div className="absolute inset-0 bg-red-500 bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center" />
          </div>
        ));
      })}
    </div>
  );
};

export default DeckCardsGrid;
