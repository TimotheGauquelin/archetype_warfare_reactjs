import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  getMyQuizStats,
  type MyQuizTypeStats,
} from "@/services/quiz";
import {
  getMyArchetypeRankings,
  type MyArchetypeRankingEntry,
  type MyArchetypeTournamentResult,
} from "@/services/archetypeRanking";
import {
  getTournamentPlayerDeckSnapshot,
  type TournamentPlayerDeckSnapshot,
} from "@/services/tournament";
import { getArchetypePublicPath, URL_FRONT_MY_TOURNAMENT_DETAIL } from "@/constant/urlsFront";
import NoItemMessage from "@/components/generic/NoItemMessage";
import PopUp from "@/components/generic/PopUp";
import type { DeckCard, RootState } from "@/types";
import { useCardTypes } from "@/hooks/useCardTypes";
import { sortedDeck } from "@/utils/functions/sortedDeck";
import { EXTRA_DECK_LABELS } from "@/utils/const/extraDeckConst";
import DeckSection from "@/components/pages/userProfil/deckCommon/DeckSection";
import DeckCardsGrid from "@/components/pages/userProfil/deckCommon/DeckCardsGrid";

const MyProfileRankingTab = () => {
  const { t } = useTranslation();
  const token = useSelector((state: RootState) => state.user.token);
  const { cardTypes } = useCardTypes();
  const [isLoading, setIsLoading] = useState(true);
  const [quizPoints, setQuizPoints] = useState(0);
  const [byType, setByType] = useState<MyQuizTypeStats[]>([]);
  const [archetypeTotal, setArchetypeTotal] = useState(0);
  const [archetypes, setArchetypes] = useState<MyArchetypeRankingEntry[]>([]);
  const [selectedDeck, setSelectedDeck] = useState<TournamentPlayerDeckSnapshot | null>(null);
  const [deckLoading, setDeckLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    Promise.all([getMyQuizStats(), getMyArchetypeRankings()])
      .then(([quizStats, archetypeStats]) => {
        if (cancelled) return;
        setQuizPoints(quizStats.quizPoints ?? 0);
        setByType(quizStats.byType ?? []);
        setArchetypeTotal(archetypeStats.totalPoints ?? 0);
        setArchetypes(archetypeStats.archetypes ?? []);
      })
      .catch(() => {
        if (cancelled) return;
        setByType([]);
        setArchetypes([]);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleOpenDeck = async (tournament: MyArchetypeTournamentResult) => {
    if (!token) return;
    setDeckLoading(true);
    try {
      const snapshot = await getTournamentPlayerDeckSnapshot(
        tournament.tournamentPlayerId,
        token
      );
      setSelectedDeck(snapshot);
    } catch {
      setSelectedDeck(null);
    } finally {
      setDeckLoading(false);
    }
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
        deckCard.card?.card_type ||
        (deckCard.card as { cardType?: { label?: string } })?.cardType?.label ||
        "";
      if (EXTRA_DECK_LABELS.includes(cardType)) {
        extra.push(deckCard);
      } else {
        main.push(deckCard);
      }
    });
    return { mainDisplayCards: main, extraDisplayCards: extra };
  }, [sortedDeckCards]);

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-24 bg-gray-100 rounded-lg" />
        <div className="h-32 bg-gray-100 rounded-lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section>
        <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3">
          <h3 className="text-lg font-bold text-gray-900">
            {t("profile.rankingQuizTitle")}
          </h3>
          <p className="text-sm text-gray-600">
            {t("profile.rankingQuizTotal", { count: quizPoints })}
          </p>
        </div>
        {byType.length > 0 ? (
          <ul className="divide-y divide-gray-200 border border-gray-200 rounded-lg overflow-hidden">
            {byType.map((row) => (
              <li
                key={row.type}
                className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 bg-gray-50"
              >
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900">
                    {t(`quiz.types.${row.type}`, { defaultValue: row.type })}
                  </p>
                  <p className="text-sm text-gray-600">
                    {t("profile.rankingQuizAccuracy", {
                      accuracy: row.accuracy,
                      correct: row.correctCount,
                      total: row.answersCount,
                    })}
                  </p>
                </div>
                <p className="text-sm font-medium text-gray-800 shrink-0">
                  {t("profile.rankingPoints", { count: row.points })}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <NoItemMessage
            message={t("profile.rankingQuizEmpty")}
            textPosition="center"
          />
        )}
      </section>

      <section>
        <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3">
          <h3 className="text-lg font-bold text-gray-900">
            {t("profile.rankingArchetypesTitle")}
          </h3>
          <p className="text-sm text-gray-600">
            {t("profile.rankingArchetypesTotal", { count: archetypeTotal })}
          </p>
        </div>
        {archetypes.length > 0 ? (
          <ul className="space-y-3">
            {archetypes.map((row) => {
              const path = getArchetypePublicPath({
                id: row.archetypeId,
                slug: row.slug,
              });
              return (
                <li
                  key={row.archetypeId}
                  className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 border-b border-gray-200 bg-white">
                    <div className="min-w-0">
                      {path ? (
                        <Link
                          to={path}
                          className="font-semibold text-blue-800 hover:underline"
                        >
                          {row.archetypeName}
                        </Link>
                      ) : (
                        <span className="font-semibold text-gray-900">
                          {row.archetypeName}
                        </span>
                      )}
                      <p className="text-sm text-gray-600">
                        {t("profile.rankingArchetypeRank", {
                          rank: row.rank,
                          total: row.playersCount,
                        })}
                      </p>
                    </div>
                    <p className="text-sm font-medium text-gray-800 shrink-0">
                      {t("profile.rankingPoints", { count: row.points })}
                    </p>
                  </div>

                  {(row.tournaments ?? []).length > 0 ? (
                    <ul className="divide-y divide-gray-200">
                      {(row.tournaments ?? []).map((tournament) => (
                        <li
                          key={`${row.archetypeId}-${tournament.tournamentId}`}
                          className="px-4 py-3 text-sm space-y-1"
                        >
                          <div className="flex flex-wrap items-baseline justify-between gap-2">
                            <Link
                              to={URL_FRONT_MY_TOURNAMENT_DETAIL(
                                tournament.tournamentId
                              )}
                              className="font-medium text-gray-900 hover:underline"
                            >
                              {tournament.tournamentName}
                            </Link>
                            <span className="text-gray-800 shrink-0 font-medium">
                              {t("profile.rankingPoints", {
                                count: tournament.points,
                              })}
                            </span>
                          </div>
                          <p className="text-gray-600">
                            {t("profile.rankingArchetypeTournamentPlace", {
                              place: tournament.place,
                              total: tournament.playersCount,
                            })}
                          </p>
                          <p className="text-gray-600">
                            {t("profile.rankingArchetypeTournamentDeck")}{" "}
                            {tournament.deckLabel ? (
                              <button
                                type="button"
                                onClick={() => void handleOpenDeck(tournament)}
                                disabled={deckLoading}
                                className="text-blue-700 hover:underline font-medium disabled:opacity-50"
                              >
                                {tournament.deckLabel}
                              </button>
                            ) : (
                              <span className="italic text-gray-500">
                                {t("profile.rankingArchetypeTournamentNoDeck")}
                              </span>
                            )}
                          </p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="px-4 py-3 text-sm text-gray-500">
                      {t("profile.rankingArchetypeTournamentsEmpty")}
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
        ) : (
          <NoItemMessage
            message={t("profile.rankingArchetypesEmpty")}
            textPosition="center"
          />
        )}
      </section>

      <PopUp
        isOpen={selectedDeck != null || deckLoading}
        onClose={() => {
          if (!deckLoading) setSelectedDeck(null);
        }}
        title={selectedDeck?.label ?? t("profile.rankingArchetypeDeckTitle")}
        className="max-w-3xl w-full"
      >
        {deckLoading ? (
          <p className="text-sm text-gray-500 animate-pulse">
            {t("profile.rankingArchetypeDeckLoading")}
          </p>
        ) : selectedDeck && sortedDeckCards ? (
          <div className="space-y-3">
            {selectedDeck.archetype?.name && (
              <p className="font-semibold">
                {t("profile.rankingArchetypeDeckArchetype", {
                  name: selectedDeck.archetype.name,
                })}
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
                {t("profile.rankingArchetypeDeckEmpty")}
              </p>
            )}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">
            {t("profile.rankingArchetypeDeckMissing")}
          </p>
        )}
      </PopUp>
    </div>
  );
};

export default MyProfileRankingTab;
