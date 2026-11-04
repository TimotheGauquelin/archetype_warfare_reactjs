import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { FaChevronDown, FaTrophy } from "react-icons/fa";
import {
  getMyQuizStats,
  getUserQuizStats,
  type MyQuizSeasonStats,
} from "@/services/quiz";
import {
  getMyArchetypeRankings,
  getUserArchetypeRankings,
  type MyArchetypeRankingEntry,
  type MyArchetypeTournamentResult,
} from "@/services/archetypeRanking";
import {
  getTournamentPlayerDeckSnapshot,
  type TournamentPlayerDeckSnapshot,
} from "@/services/tournament";
import {
  getArchetypePublicPath,
  getQuizSeasonRankingPath,
  URL_FRONT_MY_TOURNAMENT_DETAIL,
  URL_FRONT_TOURNAMENT,
} from "@/constant/urlsFront";
import NoItemMessage from "@/components/generic/NoItemMessage";
import PopUp from "@/components/generic/PopUp";
import PaginationTableHead from "@/components/generic/pagination/PaginationTableHead";
import type { DeckCard, RootState } from "@/types";
import { useCardTypes } from "@/hooks/useCardTypes";
import { sortedDeck } from "@/utils/functions/sortedDeck";
import { EXTRA_DECK_LABELS } from "@/utils/const/extraDeckConst";
import DeckSection from "@/components/pages/userProfil/deckCommon/DeckSection";
import DeckCardsGrid from "@/components/pages/userProfil/deckCommon/DeckCardsGrid";
import { optimizeImageUrl } from "@/utils/image/optimizeImageUrl";

type MyProfileRankingTabProps = {
  /** Sans bordures d’onglet (carte profil). */
  embedded?: boolean;
  /** Profil public d’un autre joueur (`/users/:id`). */
  userId?: string | null;
};

const formatShortDate = (iso: string, locale: string) => {
  try {
    return new Date(`${iso}T12:00:00`).toLocaleDateString(locale, {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
};

const todayIsoLocal = () => {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const seasonStatusFromDates = (
  startDate: string,
  endDate: string,
): "past" | "current" | "upcoming" => {
  const today = todayIsoLocal();
  if (endDate < today) return "past";
  if (startDate <= today && endDate >= today) return "current";
  return "upcoming";
};

const seasonStatusBadgeClass = (status: "past" | "current" | "upcoming") => {
  if (status === "current") return "bg-emerald-100 text-emerald-800";
  if (status === "past") return "bg-slate-100 text-slate-600";
  return "bg-amber-100 text-amber-800";
};

const MyProfileRankingTab = ({
  embedded = false,
  userId = null,
}: MyProfileRankingTabProps) => {
  const { t, i18n } = useTranslation();
  const token = useSelector((state: RootState) => state.user.token);
  const currentUserId = useSelector((state: RootState) => state.user.id);
  const isOwnProfile =
    !userId || String(userId) === String(currentUserId);
  const { cardTypes } = useCardTypes();
  const [isLoading, setIsLoading] = useState(true);
  const [quizPoints, setQuizPoints] = useState(0);
  const [quizSeasons, setQuizSeasons] = useState<MyQuizSeasonStats[]>([]);
  const [archetypeTotal, setArchetypeTotal] = useState(0);
  const [archetypes, setArchetypes] = useState<MyArchetypeRankingEntry[]>([]);
  const [openArchetypeId, setOpenArchetypeId] = useState<number | null>(null);
  const [selectedDeck, setSelectedDeck] = useState<TournamentPlayerDeckSnapshot | null>(null);
  const [deckLoading, setDeckLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    const quizPromise = isOwnProfile
      ? getMyQuizStats()
      : getUserQuizStats(userId!);
    const archetypePromise = isOwnProfile
      ? getMyArchetypeRankings()
      : getUserArchetypeRankings(userId!);
    Promise.all([quizPromise, archetypePromise])
      .then(([quizStats, archetypeStats]) => {
        if (cancelled) return;
        setQuizPoints(quizStats.quizPoints ?? 0);
        setQuizSeasons(quizStats.seasons ?? []);
        setArchetypeTotal(archetypeStats.totalPoints ?? 0);
        setArchetypes(archetypeStats.archetypes ?? []);
      })
      .catch(() => {
        if (cancelled) return;
        setQuizPoints(0);
        setQuizSeasons([]);
        setArchetypes([]);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [isOwnProfile, userId]);

  const handleOpenDeck = async (tournament: MyArchetypeTournamentResult) => {
    if (!token || !isOwnProfile) return;
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

  const tournamentTableHead = useMemo(
    () => [
      { colspan: "col-span-4", label: t("profile.rankingTournamentColTournament") },
      { colspan: "col-span-2", label: t("profile.rankingTournamentColDate") },
      { colspan: "col-span-2", label: t("profile.rankingTournamentColPlace") },
      { colspan: "col-span-2", label: t("profile.rankingTournamentColPoints") },
      { colspan: "col-span-2", label: t("profile.rankingTournamentColDeck") },
    ],
    [t]
  );

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-24 bg-gray-100 rounded-lg" />
        <div className="h-32 bg-gray-100 rounded-lg" />
      </div>
    );
  }

  return (
    <div className={embedded ? "space-y-5" : "space-y-6"}>
      <section className="space-y-3">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 className={`${embedded ? "text-sm" : "text-lg"} font-bold text-gray-900`}>
            {t("profile.rankingArchetypesTitle")}
          </h3>
          <span className="inline-flex items-center rounded-md bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-800">
            {t("profile.rankingArchetypesTotal", { count: archetypeTotal })}
          </span>
        </div>

        {archetypes.length > 0 ? (
          <ul className="space-y-2.5">
            {archetypes.map((row) => {
              const path = getArchetypePublicPath({
                id: row.archetypeId,
                slug: row.slug,
              });
              const isOpen = openArchetypeId === row.archetypeId;
              const img = row.cardImgUrl
                ? optimizeImageUrl(row.cardImgUrl, "thumb")
                : null;

              return (
                <li
                  key={row.archetypeId}
                  className="rounded-lg border border-gray-200 bg-white overflow-hidden shadow-sm"
                >
                  <div className="flex items-center gap-3 p-2.5">
                    <div className="relative shrink-0">
                      <div className="h-14 w-14 rounded-md overflow-hidden bg-gray-100 border border-gray-200">
                        {img ? (
                          <img
                            src={img}
                            alt=""
                            className="h-full w-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-gray-400">
                            <FaTrophy className="w-5 h-5" aria-hidden />
                          </div>
                        )}
                      </div>
                      <span className="absolute -top-1.5 -left-1.5 inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-amber-500 px-1 text-[11px] font-bold text-white shadow">
                        #{row.rank}
                      </span>
                    </div>

                    <div className="min-w-0 flex-1">
                      {path ? (
                        <Link
                          to={path}
                          className="font-semibold text-gray-900 hover:text-blue-700 hover:underline line-clamp-1"
                        >
                          {row.archetypeName}
                        </Link>
                      ) : (
                        <p className="font-semibold text-gray-900 line-clamp-1">
                          {row.archetypeName}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 mt-0.5">
                        {t("profile.rankingArchetypeRank", {
                          rank: row.rank,
                          total: row.playersCount,
                        })}
                      </p>
                    </div>

                    <div className="shrink-0 text-right space-y-1">
                      <p className="text-sm font-bold text-emerald-700">
                        {t("profile.rankingPoints", { count: row.points })}
                      </p>
                      {(row.tournaments ?? []).length > 0 && (
                        <button
                          type="button"
                          onClick={() =>
                            setOpenArchetypeId(isOpen ? null : row.archetypeId)
                          }
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-gray-600 hover:text-gray-900"
                          aria-expanded={isOpen}
                        >
                          {isOpen
                            ? t("profile.rankingHideTournaments")
                            : t("profile.rankingToggleTournaments")}
                          <FaChevronDown
                            className={`w-2.5 h-2.5 transition-transform ${
                              isOpen ? "rotate-180" : ""
                            }`}
                            aria-hidden
                          />
                        </button>
                      )}
                    </div>
                  </div>

                  {isOpen && (row.tournaments ?? []).length > 0 && (
                    <div className="border-t border-gray-100 bg-white p-2">
                      <div className="w-full text-xs tablet:text-sm text-left text-gray-500 overflow-x-auto rounded-lg border border-gray-200">
                        <PaginationTableHead tableHeadItem={tournamentTableHead} />
                        <div className="grid grid-cols-12 bg-white min-w-[480px]">
                          {[...(row.tournaments ?? [])]
                            .sort((a, b) => {
                              const da = a.eventDate
                                ? new Date(a.eventDate).getTime()
                                : 0;
                              const db = b.eventDate
                                ? new Date(b.eventDate).getTime()
                                : 0;
                              return db - da;
                            })
                            .map((tournament) => (
                              <div
                                key={`${row.archetypeId}-${tournament.tournamentId}`}
                                className="grid grid-cols-12 col-span-12 items-center border-b border-l border-r last:border-b-0 hover:bg-slate-200"
                              >
                                <div className="col-span-4 p-1.5 tablet:p-2 min-w-0">
                                  <Link
                                    to={
                                      isOwnProfile
                                        ? URL_FRONT_MY_TOURNAMENT_DETAIL(
                                            tournament.tournamentId
                                          )
                                        : URL_FRONT_TOURNAMENT(
                                            tournament.tournamentId
                                          )
                                    }
                                    className="font-medium text-gray-900 hover:underline line-clamp-2"
                                  >
                                    {tournament.tournamentName}
                                  </Link>
                                </div>
                                <div className="col-span-2 p-1.5 tablet:p-2 text-center text-gray-600">
                                  {tournament.eventDate
                                    ? formatShortDate(
                                        String(tournament.eventDate).slice(
                                          0,
                                          10
                                        ),
                                        i18n.language
                                      )
                                    : "—"}
                                </div>
                                <div className="col-span-2 p-1.5 tablet:p-2 text-center text-gray-700">
                                  {t(
                                    "profile.rankingArchetypeTournamentPlace",
                                    {
                                      place: tournament.place,
                                      total: tournament.playersCount,
                                    }
                                  )}
                                </div>
                                <div className="col-span-2 p-1.5 tablet:p-2 text-center font-semibold text-emerald-700">
                                  {t("profile.rankingPoints", {
                                    count: tournament.points,
                                  })}
                                </div>
                                <div className="col-span-2 p-1.5 tablet:p-2 text-right min-w-0">
                                  {tournament.deckLabel ? (
                                    isOwnProfile ? (
                                      <button
                                        type="button"
                                        onClick={() =>
                                          void handleOpenDeck(tournament)
                                        }
                                        disabled={deckLoading}
                                        className="text-blue-700 hover:underline font-medium disabled:opacity-50 truncate max-w-full"
                                      >
                                        {tournament.deckLabel}
                                      </button>
                                    ) : (
                                      <span className="font-medium text-gray-800 truncate block">
                                        {tournament.deckLabel}
                                      </span>
                                    )
                                  ) : (
                                    <span className="italic text-gray-500">
                                      {t(
                                        "profile.rankingArchetypeTournamentNoDeck"
                                      )}
                                    </span>
                                  )}
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
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

      <section className="space-y-3">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 className={`${embedded ? "text-sm" : "text-lg"} font-bold text-gray-900`}>
            {t("profile.rankingQuizTitle")}
          </h3>
          <span className="inline-flex items-center rounded-md bg-sky-100 px-2 py-0.5 text-xs font-semibold text-sky-800">
            {t("profile.rankingQuizTotal", { count: quizPoints })}
          </span>
        </div>

        {quizSeasons.length > 0 ? (
          <ul className="space-y-2">
            {quizSeasons.map((season) => (
              <li
                key={season.seasonId}
                className="relative overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm"
              >
                {season.imageUrl && (
                  <div
                    className="pointer-events-none absolute inset-y-0 right-0 w-[48%] sm:w-[42%] overflow-hidden"
                    aria-hidden
                  >
                    <img
                      src={optimizeImageUrl(season.imageUrl, "thumb")}
                      alt=""
                      className="h-full w-full object-cover opacity-55"
                      style={{
                        objectPosition: `${season.imageFocalX ?? 50}% ${
                          season.imageFocalY ?? 50
                        }%`,
                        transform: `scale(${(season.imageZoom ?? 100) / 100})`,
                        transformOrigin: `${season.imageFocalX ?? 50}% ${
                          season.imageFocalY ?? 50
                        }%`,
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-white via-white/70 to-white/15" />
                  </div>
                )}
                <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 p-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-gray-900">{season.name}</p>
                      {(() => {
                        const status = seasonStatusFromDates(
                          season.startDate,
                          season.endDate,
                        );
                        if (status === "upcoming") return null;
                        return (
                          <span
                            className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${seasonStatusBadgeClass(status)}`}
                          >
                            {t(
                              status === "current"
                                ? "quiz.seasonStatusCurrent"
                                : "quiz.seasonStatusPast",
                            )}
                          </span>
                        );
                      })()}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {t("profile.rankingQuizSeasonDates", {
                        start: formatShortDate(season.startDate, i18n.language),
                        end: formatShortDate(season.endDate, i18n.language),
                      })}
                    </p>
                    <p className="text-xs text-gray-500">
                      {t("profile.rankingQuizSeasonAttempts", {
                        count: season.attemptsCount,
                      })}
                    </p>
                  </div>
                  <div className="shrink-0 text-right space-y-1">
                    <p className="text-base font-bold text-sky-700">
                      {t("profile.rankingPoints", { count: season.points })}
                    </p>
                    <Link
                      to={getQuizSeasonRankingPath(season.seasonId)}
                      className="text-[11px] font-semibold text-blue-700 hover:underline"
                    >
                      {t("profile.rankingQuizSeasonView")}
                    </Link>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <NoItemMessage
            message={t("profile.rankingQuizSeasonEmpty")}
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
