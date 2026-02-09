/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { getCardsByIds } from "../../services/yugiohApi";
import type { Archetype } from "../../types";
import type { YGOProDeckCard } from "../../services/yugiohApi";

interface FormikCardsInputProps {
  archetype: Archetype;
}

const FormikCardsInput: React.FC<FormikCardsInputProps> = ({ archetype }) => {
  const [archetypeCards, setArchetypeCards] = useState<YGOProDeckCard[]>([]);
  useEffect(() => {
    if (archetype?.cards && archetype.cards.length > 0) {
      const cardIds = archetype.cards.map((card) => card.id);
      getCardsByIds(cardIds, 'fr').then((cards) => {
        setArchetypeCards(cards);
      });
    }
  }, [archetype]);

  return (
    <div className="grid grid-cols-8 gap-4">
      {archetypeCards?.map((card, index) => {
        return (
          <div key={index}>
            <img src={card?.card_images[0].image_url} alt="" />
          </div>
        );
      })}
    </div>
  );
};

export default FormikCardsInput;
