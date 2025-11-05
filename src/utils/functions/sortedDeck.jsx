export const sortedDeck = (deckCards, cardTypes) => {
    if (!deckCards || !cardTypes || !cardTypes.length) return deckCards || [];

    return [...deckCards].sort((a, b) => {
        const cardTypeA = cardTypes.find(
            (type) => type.label === (a.card?.card_type || a.card?.cardType?.label || "")
        );
        const cardTypeB = cardTypes.find(
            (type) => type.label === (b.card?.card_type || b.card?.cardType?.label || "")
        );

        if (cardTypeA && cardTypeB) {
            const typeComparison = cardTypeA.num_order - cardTypeB.num_order;
            if (typeComparison !== 0) return typeComparison;

            const atkComparison = (b.card.atk || 0) - (a.card.atk || 0);
            if (atkComparison !== 0) return atkComparison;

            return (b.card.level || 0) - (a.card.level || 0);
        }
        
        return 0;
    });
};