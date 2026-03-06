import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import UserProfileLayoutTitle from "@/components/generic/UserProfileLayoutTitle";
import UserProfilLayout from "../../layout";
import type { RootState, Deck, DeckCard } from "@/types";
import {
    getMyTournamentDetail,
    getTournamentStandings,
    dropFromTournament,
    reportMatchResult,
    setTournamentMyDeck,
    getTournamentPlayerDeckSnapshot,
    type MyTournamentDetail as MyTournamentDetailType,
    type MyTournamentRound,
    type TournamentStanding,
    type TournamentPlayerDeckSnapshot,
} from "@/services/tournament";
import { getMyPlayableDecks, fetchDeckById } from "@/services/deck";
import { useCardTypes } from "@/hooks/useCardTypes";
import { sortedDeck } from "@/utils/functions/sortedDeck";
import { EXTRA_DECK_LABELS } from "@/utils/const/extraDeckConst";
import DeckCardsGrid from "@/components/pages/userProfil/deckCommon/DeckCardsGrid";
import DeckSection from "@/components/pages/userProfil/deckCommon/DeckSection";
import { TOURNAMENT_STATUS } from "@/utils/trad/tournamentStatus";
import NoItemMessage from "@/components/generic/NoItemMessage";
import {
    MatchMakingCard,
} from "@/components/pages/userProfil/myTournaments/MatchMakingCard";
import type { MatchScoreProps } from "@/types/match";
import Section from "@/components/generic/Section";

const MyTournamentDetail: React.FC = () => {
    const { tournamentId } = useParams<{ tournamentId: string }>();
    const [tournament, setTournament] = useState<MyTournamentDetailType | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [myStanding, setMyStanding] = useState<TournamentStanding | null>(null);
    const [isDropping, setIsDropping] = useState(false);
    const [playableDecks, setPlayableDecks] = useState<Deck[]>([]);
    const [playableDecksLoading, setPlayableDecksLoading] = useState(false);
    const [selectedDeckId, setSelectedDeckId] = useState<number | "">("");
    const [isSubmittingDeck, setIsSubmittingDeck] = useState(false);
    const [deckSnapshot, setDeckSnapshot] = useState<TournamentPlayerDeckSnapshot | null>(null);
    const [deckSnapshotLoading, setDeckSnapshotLoading] = useState(false);
    const [selectedDeckPreview, setSelectedDeckPreview] = useState<Deck | null>(null);
    const [selectedDeckPreviewLoading, setSelectedDeckPreviewLoading] = useState(false);

    const { cardTypes } = useCardTypes();

    const user = useSelector((state: RootState) => state.user);

    console.log("tournament!!!!", tournament)

    const maxWinningDuelPerPlayer = tournament ? Math.ceil(tournament.matches_per_round / 2) : 1;
    const isTournamentPhase = tournament?.status?.includes("tournament") ?? false;
    const isTournamentInProgress = tournament?.status === "tournament_in_progress";
    const isRegistrationOpen = tournament?.status === "registration_open";
    const registeredDeckId = tournament?.tournament_player?.deck_id ?? null;
    const haveCompletedAllMatches = tournament?.rounds.every((round) => {
        return round.match?.status === "completed"
    });

    const loadTournament = useCallback(async () => {
        if (!tournamentId || !user.token) return;
        setIsLoading(true);
        setError(null);
        try {
            const data = await getMyTournamentDetail(tournamentId, user.token);
            setTournament(data);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Impossible de charger les détails du tournoi.");
        } finally {
            setIsLoading(false);
        }
    }, [tournamentId, user.token]);

    const handleSubmitScore = async (matchId: number, playersScore: MatchScoreProps) => {
        try {
            if (!user.token) return;
            await reportMatchResult(matchId, playersScore, user.token);
            await loadTournament();
        } catch {
        }

    }

    const handleDrop = async () => {
        if (!tournamentId || !user.token) return;
        setIsDropping(true);
        try {
            await dropFromTournament(tournamentId, user.token);
            await loadTournament();
        } catch {
            // erreurs toastées dans le service
        } finally {
            setIsDropping(false);
        }
    }

    useEffect(() => {
        loadTournament();
    }, [loadTournament]);

    useEffect(() => {
        const playerId = tournament?.tournament_player?.id;
        if (!playerId || !user.token) {
            setDeckSnapshot(null);
            return;
        }
        let cancelled = false;
        setDeckSnapshotLoading(true);
        getTournamentPlayerDeckSnapshot(playerId, user.token)
            .then((snapshot) => {
                if (!cancelled) setDeckSnapshot(snapshot);
            })
            .catch(() => {
                if (!cancelled) setDeckSnapshot(null);
            })
            .finally(() => {
                if (!cancelled) setDeckSnapshotLoading(false);
            });
        return () => {
            cancelled = true;
        };
    }, [tournament?.tournament_player?.id, tournament?.tournament_player?.deck_id, user.token]);

    useEffect(() => {
        if (!user.id || !user.token) {
            setPlayableDecks([]);
            setSelectedDeckId("");
            return;
        }
        let cancelled = false;
        setPlayableDecksLoading(true);
        getMyPlayableDecks(user.token, user.id)
            .then((decks) => {
                if (!cancelled) {
                    const list = decks ?? [];
                    setPlayableDecks(list);
                    const registeredDeckId = tournament?.tournament_player?.deck_id;
                    const isRegisteredInList =
                        registeredDeckId != null &&
                        list.some((d) => d.id === registeredDeckId);
                    setSelectedDeckId(isRegisteredInList ? registeredDeckId : "");
                }
            })
            .catch(() => {
                if (!cancelled) setPlayableDecks([]);
            })
            .finally(() => {
                if (!cancelled) setPlayableDecksLoading(false);
            });
        return () => {
            cancelled = true;
        };
    }, [isRegistrationOpen, user.id, user.token, tournament?.tournament_player?.deck_id, tournament?.id]);

    const handleSubmitDeck = async () => {
        if (!tournamentId || !user.token || selectedDeckId === "") return;
        setIsSubmittingDeck(true);
        try {
            await setTournamentMyDeck(tournamentId, selectedDeckId, user.token);
            await loadTournament();
        } catch {
            // erreur déjà toastée dans le service
        } finally {
            setIsSubmittingDeck(false);
        }
    };

    useEffect(() => {
        if (!user.token || selectedDeckId === "" || selectedDeckId === registeredDeckId) {
            setSelectedDeckPreview(null);
            setSelectedDeckPreviewLoading(false);
            return;
        }
        let cancelled = false;
        setSelectedDeckPreviewLoading(true);
        fetchDeckById(user.token, selectedDeckId)
            .then((deck) => {
                if (!cancelled) setSelectedDeckPreview(deck);
            })
            .catch(() => {
                if (!cancelled) setSelectedDeckPreview(null);
            })
            .finally(() => {
                if (!cancelled) setSelectedDeckPreviewLoading(false);
            });
        return () => {
            cancelled = true;
        };
    }, [selectedDeckId, registeredDeckId, user.token]);

    const sortedSnapshotCards = useMemo((): DeckCard[] | null => {
        if (!deckSnapshot?.cards) return null;

        const baseDeckCards: DeckCard[] = deckSnapshot.cards.map((entry) => ({
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
    }, [deckSnapshot?.cards, cardTypes]);

    const deckCardsForDisplay = useMemo((): DeckCard[] | null => {
        // Si on a sélectionné un autre deck que celui enregistré, on affiche ce deck
        if (selectedDeckId !== "" && selectedDeckId !== registeredDeckId && selectedDeckPreview?.deck_cards?.length) {
            const base = selectedDeckPreview.deck_cards as DeckCard[];
            if (!cardTypes.length) return base;
            return sortedDeck(base, cardTypes);
        }
        // Sinon, on affiche le snapshot du deck enregistré (s'il existe)
        return sortedSnapshotCards;
    }, [selectedDeckId, registeredDeckId, selectedDeckPreview?.deck_cards, sortedSnapshotCards, cardTypes]);

    const { mainDisplayCards, extraDisplayCards } = useMemo(() => {
        if (!deckCardsForDisplay) {
            return { mainDisplayCards: [] as DeckCard[], extraDisplayCards: [] as DeckCard[] };
        }
        const main: DeckCard[] = [];
        const extra: DeckCard[] = [];

        deckCardsForDisplay.forEach((deckCard) => {
            const cardType = deckCard.card?.card_type || (deckCard.card as any)?.cardType?.label || "";
            const isExtra = EXTRA_DECK_LABELS.includes(cardType);
            if (isExtra) {
                extra.push(deckCard);
            } else {
                main.push(deckCard);
            }
        });

        return { mainDisplayCards: main, extraDisplayCards: extra };
    }, [deckCardsForDisplay]);

    useEffect(() => {
        if (!tournamentId || !tournament?.status?.includes("finished")) {
            setMyStanding(null);
            return;
        }
        let cancelled = false;
        getTournamentStandings(tournamentId)
            .then((standings) => {
                if (cancelled || user.id == null) return;
                const mine = standings.find(
                    (s) => String(s.user_id) === String(user.id)
                );
                if (!cancelled) setMyStanding(mine ?? null);
            })
            .catch(() => {
                if (!cancelled) setMyStanding(null);
            });
        return () => {
            cancelled = true;
        };
    }, [tournamentId, tournament?.status, user.id]);

    return (
        <UserProfilLayout>
            <div className="bg-white rounded-lg sh p-4 mb-2">
                <UserProfileLayoutTitle title={`Détails: ${tournament?.name ?? ""}`} returnButton={true} />

                {isLoading && (
                    <p className="text-gray-500 mb-3">Chargement des informations du tournoi…</p>
                )}

                {error && (
                    <p className="text-red-600 mb-3" role="alert">
                        {error}
                    </p>
                )}

                {!isLoading && !tournament && !error && (
                    <NoItemMessage message="Aucun tournoi trouvé." />
                )}

                {tournament && (
                    <div className="space-y-1 flex flex-col ITEM">
                        <section className="p-2 bg-gray-100 rounded-md">
                            <div className="text-gray-700 space-y-1">
                                <p>
                                    <span className="font-semibold">Statut :</span> <span className="text-red-500 font-semibold">{TOURNAMENT_STATUS(tournament.status)}</span>
                                </p>
                                {tournament?.status?.includes("finished") && myStanding != null && (
                                    <p>
                                        <span className="font-semibold">Classement: </span>
                                        <span className="font-semibold text-green-700">
                                            Vous avez fini {myStanding.rank}{myStanding.rank === 1 ? "er" : "ème"}
                                        </span>
                                    </p>
                                )}
                                <p>
                                    <span className="font-semibold">Date de début :</span>{" "}
                                    {new Date(tournament.event_date).toLocaleString("fr-FR")}
                                </p>
                                <p>
                                    <span className="font-semibold">Nombre de rondes :</span> {tournament.max_number_of_rounds}
                                </p>
                            </div>
                        </section>

                        {
                            tournament.require_deck_list && (
                                <Section title="Mon deck">
                                    <p>
                                        <span >Vous êtes inscrit à ce tournoi </span>
                                        {tournament.tournament_player.deck_id
                                            ? (
                                                <span className="text-green-700 font-semibold"> et avez choisi votre deck</span>
                                            )
                                            : (
                                                <span className="text-red-600">mais vous n'avez pas encore sélectionné de deck</span>
                                            )
                                        }
                                    </p>
                                    <div>
                                        {playableDecksLoading ? (
                                            <p className="text-gray-500 text-sm">Chargement des decks jouables…</p>
                                        ) : (
                                            <div className="grid grid-cols-12 gap-2">
                                                <div className="md:col-span-2 col-span-12">
                                                    <select
                                                        id="tournament-deck-select"
                                                        value={selectedDeckId}
                                                        onChange={(e) => setSelectedDeckId(e.target.value === "" ? "" : Number(e.target.value))}
                                                        className="w-full max-w-md rounded border border-gray-300 bg-white py-2 px-3 text-gray-700 focus:border-blue-500 focus:outline-none"
                                                        disabled={!isRegistrationOpen || playableDecks.length === 0 || playableDecksLoading}
                                                    >
                                                        <option value="" disabled>Sélectionner votre deck</option>
                                                        {playableDecks
                                                            .filter((d): d is Deck & { id: number } => d.id != null)
                                                            .map((deck) => (
                                                                <option key={deck.id} value={deck.id} selected={deck.id === Number(selectedDeckId)}>
                                                                    {deck.label}
                                                                </option>
                                                            ))}
                                                    </select>
                                                    {playableDecks.length === 0 && !playableDecksLoading && (
                                                        <p className="text-amber-700 text-sm mt-1">
                                                            Aucun deck jouable. Créez un deck d'au moins 40 cartes et selectionnez-le !
                                                        </p>
                                                    )}
                                                    {isRegistrationOpen && <button
                                                        type="button"
                                                        onClick={handleSubmitDeck}
                                                        disabled={
                                                            !isRegistrationOpen ||
                                                            selectedDeckId === "" ||
                                                            isSubmittingDeck ||
                                                            (registeredDeckId != null &&
                                                                selectedDeckId === registeredDeckId)
                                                        }
                                                        className="mt-2 inline-flex items-center px-3 py-1.5 rounded bg-green-600 text-white text-sm hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        {isSubmittingDeck
                                                            ? "Enregistrement…"
                                                            : registeredDeckId != null &&
                                                                selectedDeckId !== "" &&
                                                                selectedDeckId !== registeredDeckId
                                                                ? "Changer de deck"
                                                                : "Valider mon deck"}
                                                    </button>}
                                                </div>
                                                <div className="p-2 md:col-span-10 col-span-12 bg-white">
                                                    {deckSnapshotLoading || selectedDeckPreviewLoading ? (
                                                        <p className="text-gray-500 text-sm">Chargement du deck…</p>
                                                    ) : deckCardsForDisplay ? (
                                                        <div className="space-y-3">
                                                            {mainDisplayCards.length > 0 && (
                                                                <DeckSection
                                                                    title="Cartes du Main Deck"
                                                                    badges={[
                                                                        {
                                                                            label: "Monstre",
                                                                            value: mainDisplayCards
                                                                                .filter((card) => card.card?.card_type?.includes("Monster"))
                                                                                .reduce((acc, card) => acc + card.quantity, 0),
                                                                            className: "bg-orange-200 text-orange-700 p-1 rounded-md",
                                                                        },
                                                                        {
                                                                            label: "Magie",
                                                                            value: mainDisplayCards
                                                                                .filter((card) => card.card?.card_type?.includes("Spell"))
                                                                                .reduce((acc, card) => acc + card.quantity, 0),
                                                                            className: "bg-green-200 text-green-700 p-1 rounded-md",
                                                                        },
                                                                        {
                                                                            label: "Piège",
                                                                            value: mainDisplayCards
                                                                                .filter((card) => card.card?.card_type?.includes("Trap"))
                                                                                .reduce((acc, card) => acc + card.quantity, 0),
                                                                            className: "bg-purple-200 text-purple-700 p-1 rounded-md",
                                                                        },
                                                                        {
                                                                            label: "Total MainDeck",
                                                                            value: `${mainDisplayCards.reduce((acc, card) => acc + card.quantity, 0)}/60`,
                                                                            className: `p-1 rounded-md ${mainDisplayCards.reduce((acc, card) => acc + card.quantity, 0) >= 60 ? "bg-red-200 text-red-700" : "bg-red-200 text-red-700"}`,
                                                                        },
                                                                    ]}
                                                                >
                                                                    <DeckCardsGrid cards={mainDisplayCards} />
                                                                </DeckSection>
                                                            )}
                                                            {extraDisplayCards.length > 0 && (
                                                                <DeckSection
                                                                    title="Cartes de l'ExtraDeck"
                                                                    badges={[
                                                                        {
                                                                            label: "Total ExtraDeck",
                                                                            value: `${extraDisplayCards.reduce((acc, card) => acc + card.quantity, 0)}/15`,
                                                                            className: `p-1 rounded-md ${extraDisplayCards.reduce((acc, card) => acc + card.quantity, 0) >= 15 ? "bg-red-200 text-red-700" : "bg-gray-300 text-gray-700"}`,
                                                                        },
                                                                    ]}
                                                                >
                                                                    <DeckCardsGrid cards={extraDisplayCards} />
                                                                </DeckSection>
                                                            )}
                                                        </div>
                                                    ) : registeredDeckId ? (
                                                        <p className="text-gray-500 text-sm">
                                                            Aucun détail de deck disponible pour ce tournoi.
                                                        </p>
                                                    ) : (
                                                        <p className="text-gray-500 text-sm">
                                                            Aucun deck sélectionné pour ce tournoi.
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </Section>
                            )}

                        {isTournamentInProgress && !tournament.tournament_player.dropped && (
                            <section className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={handleDrop}
                                    disabled={!haveCompletedAllMatches}
                                    className="cursor-pointer mt-2 inline-block w-fit items-center px-3 py-1.5 rounded bg-red-600 text-white text-sm hover:bg-red-700 disabled:opacity-60"
                                >
                                    {isDropping ? "Abandon en cours…" : "Drop du tournoi"}
                                </button>
                            </section>
                        )}


                        {!isTournamentPhase && (
                            <NoItemMessage message="Ce tournoi n'a pas encore commencé, merci de patienter." />
                        )}

                        {isTournamentPhase && (
                            <Section title="Mes matchmakings">
                                {tournament.rounds.length === 0 ? (
                                    <NoItemMessage message="Aucune ronde n'a encore été générée pour ce tournoi." />
                                ) : (
                                    <div className="space-y-2">
                                        {tournament.tournament_player.dropped && (
                                            <p className="bg-red-100 p-2 rounded-md text-base font-bold text-red-600">
                                                Vous avez abandonné le tournoi {tournament.rounds.length != null ? `à la ronde ${tournament.rounds.length}` : ""}</p>
                                        )}
                                        {tournament.rounds
                                            .sort((a, b) => b.round_number - a.round_number)
                                            .map((round: MyTournamentRound) => {
                                                if (round.match !== null) {
                                                    return (
                                                        <MatchMakingCard
                                                            key={round.id}
                                                            round={round}
                                                            maxWinningDuelPerPlayer={maxWinningDuelPerPlayer}
                                                            onSubmitScore={handleSubmitScore}
                                                        />
                                                    )
                                                }
                                            }
                                            )
                                        }
                                    </div>
                                )}
                            </Section>
                        )}

                        {tournament.allow_penalities && (
                            <Section title="Mes pénalités">
                            {tournament?.tournament_player?.penalties &&
                                tournament.tournament_player.penalties.length > 0 ? (
                                <ul className="space-y-3 list-none p-0 m-0">
                                    {tournament.tournament_player.penalties.map((penalty) => (
                                        <li
                                            key={penalty.id}
                                            className="border border-gray-200 rounded-md p-3 bg-gray-50 text-sm"
                                        >
                                            <div className="font-semibold text-gray-800">
                                                {penalty.penalty_type?.label ?? "Pénalité"}
                                            </div>
                                            {penalty.reason && (
                                                <p className="mt-1 text-gray-700">
                                                    Raison : {penalty.reason}
                                                </p>
                                            )}
                                            {penalty.notes && (
                                                <p className="mt-0.5 text-gray-600">
                                                    {penalty.notes}
                                                </p>
                                            )}
                                            {penalty.applied_at && (
                                                <p className="mt-1 text-gray-500 text-xs">
                                                    Appliquée le{" "}
                                                    {new Date(
                                                        penalty.applied_at
                                                    ).toLocaleString("fr-FR")}
                                                </p>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>Vous n'avez pas encore de pénalités.</p>
                            )}
                        </Section>
                        )}
                    </div>
                )}
            </div>
        </UserProfilLayout>
    );
};

export default MyTournamentDetail;
