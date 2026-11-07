import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import PopUp from "@/components/generic/PopUp";
import type { TournamentStanding, TournamentPlayerDeckSnapshot } from "@/services/tournament";
import type { DeckCard } from "@/types";
import { useCardTypes } from "@/hooks/useCardTypes";
import { sortedDeck } from "@/utils/functions/sortedDeck";
import { EXTRA_DECK_LABELS } from "@/utils/const/extraDeckConst";
import DeckSection from "@/components/pages/userProfil/deckCommon/DeckSection";
import DeckCardsGrid from "@/components/pages/userProfil/deckCommon/DeckCardsGrid";
import type { MatchResolutionMode } from "@/utils/tournament/bestOfScore";

interface TournamentDetailsStandingProps {
  standings: TournamentStanding[];
  matchResolutionMode?: MatchResolutionMode;
}

export const TournamentDetailsStanding: React.FC<TournamentDetailsStandingProps> = ({
  standings,
  matchResolutionMode = "strict_wins",
}) => {
  const { t } = useTranslation();
  const [selectedDeck, setSelectedDeck] = useState<TournamentPlayerDeckSnapshot | null>(null);
  const { cardTypes } = useCardTypes();
  const showDrawsColumn = matchResolutionMode === "highest_score";

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
      <p className="text-gray-600 text-sm">
        {t("tournamentDetail.standingsEmpty")}
      </p>
    );
  }

  return (
    <div>
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-3 py-2 border-b text-left">
                {t("tournamentDetail.standingsColRank")}
              </th>
              <th className="px-3 py-2 border-b text-left">
                {t("tournamentDetail.standingsColPlayer")}
              </th>
              <th className="px-2 py-2 border-b text-center">
                {t("tournamentDetail.standingsColWins")}
              </th>
              <th className="px-2 py-2 border-b text-center">
                {t("tournamentDetail.standingsColLosses")}
              </th>
              {showDrawsColumn && (
                <th className="px-2 py-2 border-b text-center">
                  {t("tournamentDetail.standingsColDraws")}
                </th>
              )}
              <th className="px-1 py-2 border-b text-center">
                {t("tournamentDetail.standingsColDrop")}
              </th>
              <th className="px-1 py-2 border-b text-center">
                {t("tournamentDetail.standingsColDeck")}
              </th>
            </tr>
          </thead>
          <tbody>
            {standings.map((standing) => (
              <tr key={standing.tournament_player_id} className="odd:bg-white even:bg-gray-50">
                <td className="px-3 py-2 border-b font-semibold">
                  #{standing.rank}
                </td>
                <td className="px-3 py-2 border-b">
                  {standing.username &&
                    t("tournamentDetail.standingsPts", {
                      name: standing.username,
                      pts:
                        standing.matches_breakdown.wins.total_points +
                        standing.matches_breakdown.draws.total_points,
                    })}
                </td>
                <td className="px-2 py-2 border-b text-center">{standing.matches_breakdown.wins.count}</td>
                <td className="px-2 py-2 border-b text-center">{standing.matches_breakdown.losses.count}</td>
                {showDrawsColumn && (
                  <td className="px-2 py-2 border-b text-center">{standing.matches_breakdown.draws.count}</td>
                )}
                <td className="px-1 py-2 border-b text-center">{standing.matches_breakdown.hasDropped ? t("common.yes") : t("common.no")}</td>
                <td className="px-1 py-2 border-b text-center">
                  {standing.deck ? (
                    <button
                      type="button"
                      className="text-blue-600 hover:underline cursor-pointer text-xs"
                      onClick={() => handleOpenDeck(standing)}
                    >
                      {t("tournamentDetail.showDeck")}
                    </button>
                  ) : (
                    <span className="text-gray-400 text-xs">
                      {t("tournamentDetail.noDeck")}
                    </span>
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
        title={selectedDeck?.label ?? t("tournamentDetail.playerDeckTitle")}
        className="max-w-3xl w-full"
      >
        {selectedDeck && sortedDeckCards ? (
          <div className="space-y-3">
            {selectedDeck.archetype?.name && (
              <p className="font-semibold">
                {t("tournamentDetail.archetypeLabel", {
                  name: selectedDeck.archetype.name,
                })}
              </p>
            )}
            {mainDisplayCards.length > 0 && (
              <DeckSection
                title={t("tournamentDetail.mainDeck")}
                badges={[
                  {
                    label: t("tournamentDetail.totalMainDeck"),
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
                title={t("tournamentDetail.extraDeck")}
                badges={[
                  {
                    label: t("tournamentDetail.totalExtraDeck"),
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
                {t("tournamentDetail.deckEmpty")}
              </p>
            )}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">
            {t("tournamentDetail.deckNoneRecorded")}
          </p>
        )}
      </PopUp>
    </div>
  );
};