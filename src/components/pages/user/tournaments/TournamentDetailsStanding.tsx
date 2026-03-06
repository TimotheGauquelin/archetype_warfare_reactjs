import { useMemo, useState } from "react";
import PopUp from "@/components/generic/PopUp";
import type { TournamentStanding, TournamentPlayerDeckSnapshot } from "@/services/tournament";
import type { DeckCard } from "@/types";
import { useCardTypes } from "@/hooks/useCardTypes";
import { sortedDeck } from "@/utils/functions/sortedDeck";
import { EXTRA_DECK_LABELS } from "@/utils/const/extraDeckConst";
import DeckSection from "@/components/pages/userProfil/deckCommon/DeckSection";
import DeckCardsGrid from "@/components/pages/userProfil/deckCommon/DeckCardsGrid";

interface TournamentDetailsStandingProps {
  standings: TournamentStanding[];
}

export const TournamentDetailsStanding: React.FC<TournamentDetailsStandingProps> = ({
  standings,
}) => {
  const [selectedDeck, setSelectedDeck] = useState<TournamentPlayerDeckSnapshot | null>(null);
  const { cardTypes } = useCardTypes();

  const handleOpenDeck = (standing: TournamentStanding) => {
    if (!standing.deck) return;
    setSelectedDeck(standing.deck);
  };

  const handleCloseDeck = () => {
    setSelectedDeck(null);
  };

  const sortedDeckCards = useMemo((): DeckCard[] | null => {
    if (!selectedDeck?.cards) return null;

    const baseDeckCards: DeckCard[] = selectedDeck.cards.map((entry) => ({
      card: {
        id: Number(entry.card_id),
        name: entry.card?.name ?? "",
        img_url: entry.card?.img_url,
        card_type: entry.card?.card_type ?? undefined,
        level: entry.card?.level ?? undefined,
        atk: entry.card?.atk ?? undefined,
        def: entry.card?.def ?? undefined,
      },
      quantity: entry.quantity,
    }));

    if (!cardTypes.length) return baseDeckCards;

    return sortedDeck(baseDeckCards, cardTypes);
  }, [selectedDeck?.cards, cardTypes]);

  const { mainDisplayCards, extraDisplayCards } = useMemo(() => {
    if (!sortedDeckCards) {
      return { mainDisplayCards: [] as DeckCard[], extraDisplayCards: [] as DeckCard[] };
    }
    const main: DeckCard[] = [];
    const extra: DeckCard[] = [];

    sortedDeckCards.forEach((deckCard) => {
      const cardType =
        deckCard.card?.card_type || (deckCard.card as any)?.cardType?.label || "";
      const isExtra = EXTRA_DECK_LABELS.includes(cardType);
      if (isExtra) {
        extra.push(deckCard);
      } else {
        main.push(deckCard);
      }
    });

    return { mainDisplayCards: main, extraDisplayCards: extra };
  }, [sortedDeckCards]);

  if (!standings || standings.length === 0) {
    return (
      <section className="mt-6">
        <h2 className="text-lg font-semibold mb-2">Classement final</h2>
        <p className="text-gray-600 text-sm">
          Aucun classement disponible pour ce tournoi.
        </p>
      </section>
    );
  }

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-3 py-2 border-b text-left">Rang</th>
              <th className="px-3 py-2 border-b text-left">Joueur (Pts totaux)</th>
              <th className="px-2 py-2 border-b text-center">Nb matchs gagnés (3pts)</th>
              <th className="px-2 py-2 border-b text-center">Nb matchs perdu (0pts)</th>
              <th className="px-2 py-2 border-b text-center">Nb matchs égalité (1pts)</th>
              <th className="px-1 py-2 border-b text-center">Abandon</th>
              <th className="px-1 py-2 border-b text-center">Deck</th>
            </tr>
          </thead>
          <tbody>
            {standings.map((standing) => (
              <tr key={standing.tournament_player_id} className="odd:bg-white even:bg-gray-50">
                <td className="px-3 py-2 border-b font-semibold">
                  #{standing.rank}
                </td>
                <td className="px-3 py-2 border-b">
                  {standing.username && `${standing.username} (${standing.matches_breakdown.wins.total_points + standing.matches_breakdown.draws.total_points} pts)`}
                </td>
                <td className="px-2 py-2 border-b text-center">{standing.matches_breakdown.wins.count}</td>
                <td className="px-2 py-2 border-b text-center">{standing.matches_breakdown.losses.count}</td>
                <td className="px-2 py-2 border-b text-center">{standing.matches_breakdown.draws.count}</td>
                <td className="px-1 py-2 border-b text-center">{standing.matches_breakdown.hasDropped ? "Oui" : "Non"}</td>
                <td className="px-1 py-2 border-b text-center">
                  {standing.deck ? (
                    <button
                      type="button"
                      className="text-blue-600 hover:underline cursor-pointer text-xs"
                      onClick={() => handleOpenDeck(standing)}
                    >
                      Afficher le deck
                    </button>
                  ) : (
                    <span className="text-gray-400 text-xs">Aucun deck</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <PopUp
        isOpen={!!selectedDeck}
        onClose={handleCloseDeck}
        title={selectedDeck?.label ?? "Deck du joueur"}
        className="max-w-3xl w-full"
      >
        {selectedDeck && sortedDeckCards ? (
          <div className="space-y-3">
            {selectedDeck.archetype?.name && (
              <p className="font-semibold">
                Archétype : {selectedDeck.archetype.name}
              </p>
            )}
            {mainDisplayCards.length > 0 && (
              <DeckSection
                title="Main Deck"
                badges={[
                  {
                    label: "Total MainDeck",
                    value: `${mainDisplayCards.reduce(
                      (acc, card) => acc + card.quantity,
                      0
                    )}`,
                    className: "p-1 rounded-md bg-gray-200 text-gray-700",
                  },
                ]}
              >
                <DeckCardsGrid cards={mainDisplayCards} />
              </DeckSection>
            )}
            {extraDisplayCards.length > 0 && (
              <DeckSection
                title="Extra Deck"
                badges={[
                  {
                    label: "Total ExtraDeck",
                    value: `${extraDisplayCards.reduce(
                      (acc, card) => acc + card.quantity,
                      0
                    )}`,
                    className: "p-1 rounded-md bg-gray-200 text-gray-700",
                  },
                ]}
              >
                <DeckCardsGrid cards={extraDisplayCards} />
              </DeckSection>
            )}
            {mainDisplayCards.length === 0 && extraDisplayCards.length === 0 && (
              <p className="text-gray-500 text-sm">
                Aucune carte dans ce deck.
              </p>
            )}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">
            Aucun deck enregistré pour ce joueur.
          </p>
        )}
      </PopUp>
    </div>
  );
};