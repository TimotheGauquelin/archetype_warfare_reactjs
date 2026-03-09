import React from "react";
import type { DeckCard } from "@/types";

interface DeckCardsGridProps {
  cards: DeckCard[];
  onCardClick?: (deckCard: DeckCard) => void;
}

const DeckCardsGrid: React.FC<DeckCardsGridProps> = ({ cards, onCardClick }) => {
  return (
    <div className="grid grid-cols-12 lscreen:grid-cols-10 gap-1 p-1 mt-2 bg-white">
      {cards.map((deckCard, cardIndex) => {
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
            className="col-span-6 lscreen:col-span-1 relative cursor-pointer hover:opacity-80 transition-opacity group"
            onClick={() => onCardClick?.(deckCard)}
            title="Cliquez pour retirer un exemplaire"
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
            <div className="absolute inset-0 bg-red-500 bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
              {/* <span className="text-white text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                -
              </span> */}
            </div>
          </div>
        ));
      })}
    </div>
  );
};

export default DeckCardsGrid;

