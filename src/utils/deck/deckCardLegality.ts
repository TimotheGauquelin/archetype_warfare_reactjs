import type { DeckCard } from "../../types";

export type LinkedArchetypeInfo = {
  id: number;
  name: string;
};

/**
 * Une carte est jouable dans un deck d'archétype A si :
 * - elle n'appartient à aucun archétype (générique), ou
 * - elle est liée à A via banlist_archetype_card.
 */
export const isDeckCardLegalForArchetype = (
  deckCard: DeckCard,
  archetypeId?: number | string | null
): boolean => {
  if (archetypeId == null || archetypeId === "") {
    return true;
  }

  const selectedId = Number(archetypeId);
  if (Number.isNaN(selectedId)) {
    return true;
  }

  const linked = deckCard.linked_archetypes;
  if (Array.isArray(linked)) {
    if (linked.length === 0) {
      return true;
    }
    return linked.some((a) => Number(a.id) === selectedId);
  }

  if (typeof deckCard.is_legal_for_deck === "boolean") {
    return deckCard.is_legal_for_deck;
  }

  return true;
};

export const getForeignArchetypesForDeckCard = (
  deckCard: DeckCard,
  archetypeId?: number | string | null
): LinkedArchetypeInfo[] => {
  if (Array.isArray(deckCard.foreign_archetypes) && deckCard.foreign_archetypes.length > 0) {
    return deckCard.foreign_archetypes;
  }

  const linked = deckCard.linked_archetypes ?? [];
  if (archetypeId == null || archetypeId === "") {
    return linked;
  }

  const selectedId = Number(archetypeId);
  return linked.filter((a) => Number(a.id) !== selectedId);
};

export const withRecomputedDeckCardLegality = (
  deckCards: DeckCard[] | undefined,
  archetypeId?: number | string | null
): DeckCard[] => {
  return (deckCards ?? []).map((deckCard) => {
    const isLegal = isDeckCardLegalForArchetype(deckCard, archetypeId);
    return {
      ...deckCard,
      is_legal_for_deck: isLegal,
      foreign_archetypes: getForeignArchetypesForDeckCard(deckCard, archetypeId),
    };
  });
};
