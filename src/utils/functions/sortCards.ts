/**
 * Utility function to sort cards of an archetype
 * 
 * @param cards - Array of cards to sort
 * @param cardTypes - Array of card types with their order
 * @returns Array of sorted cards
 */

interface CardType {
  id: number;
  label: string;
  num_order?: number;
  [key: string]: unknown;
}

interface CardWithType {
  card: {
    id: number;
    card_type?: string;
    atk?: number;
    level?: number;
    [key: string]: unknown;
  };
  card_status?: {
    id: number;
    label: string;
    limit?: number;
  };
  [key: string]: unknown;
}

export const sortArchetypeCards = <T extends CardWithType>(
  cards: T[],
  cardTypes: CardType[]
): T[] => {
  if (!cards.length || !cardTypes.length) {
    return cards;
  }

  const cardTypeMap = new Map<string, number>();
  cardTypes.forEach((type) => {
    if (type.num_order !== undefined) {
      cardTypeMap.set(type.label, type.num_order);
    }
  });

  return [...cards].sort((a, b) => {
    const cardTypeA = a.card.card_type || "";
    const cardTypeB = b.card.card_type || "";
    const orderA = cardTypeMap.get(cardTypeA);
    const orderB = cardTypeMap.get(cardTypeB);

    // If both cards have a defined order, sort by order
    if (orderA !== undefined && orderB !== undefined) {
      const typeComparison = orderA - orderB;
      if (typeComparison !== 0) return typeComparison;

      // If same order, sort by ATK (descending)
      const atkComparison = (b.card.atk || 0) - (a.card.atk || 0);
      if (atkComparison !== 0) return atkComparison;

      // If same ATK, sort by level (descending)
      return (b.card.level || 0) - (a.card.level || 0);
    }

    if (orderA !== undefined) return -1;
    if (orderB !== undefined) return 1;

    return 0;
  });
};
