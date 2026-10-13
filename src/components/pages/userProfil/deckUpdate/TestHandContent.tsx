import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import Button from "@/components/generic/buttons/classicButton/Button";
import type { Card } from "@/types";

const shuffleCards = (cards: Card[]): Card[] => {
  const shuffled = [...cards];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

interface TestHandContentProps {
  deckCards: Card[];
  initialHandSize?: number;
}

const TestHandContent: React.FC<TestHandContentProps> = ({
  deckCards,
  initialHandSize = 5,
}) => {
  const { t } = useTranslation();

  const [drawState, setDrawState] = useState(() => {
    const shuffled = shuffleCards(deckCards);
    return {
      hand: shuffled.slice(0, initialHandSize),
      remaining: shuffled.slice(initialHandSize),
    };
  });

  const drawOneCard = useCallback(() => {
    setDrawState((prev) => {
      if (prev.remaining.length === 0) return prev;
      const [nextCard, ...rest] = prev.remaining;
      return {
        hand: [...prev.hand, nextCard],
        remaining: rest,
      };
    });
  }, []);

  return (
    <div>
      <div className="grid grid-cols-10 gap-1 p-2">
        {drawState.hand.map((card, index) => (
          <img
            key={`${card.id}-${index}`}
            className="col-span-2"
            src={card.img_url}
            alt={card.name}
            loading="lazy"
          />
        ))}
      </div>
      <div className="flex justify-center p-2">
        <Button
          className="bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded font-semibold shadow-sm"
          buttonText={t("profile.addCardToHand")}
          action={drawOneCard}
          disabled={drawState.remaining.length === 0}
        />
      </div>
    </div>
  );
};

export default TestHandContent;
