import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { fetchDeckById, getMyDecks } from "@/services/deck";
import type {
  Deck,
  DeckCard,
  DeckWithArchetypeDetails,
  RootState,
} from "@/types";
import NoItemMessage from "@/components/generic/NoItemMessage";
import MyDecksDivSkeleton from "@/components/skeletons/MyDecksDivSkeleton";
import { optimizeImageUrl } from "@/utils/image/optimizeImageUrl";
import PopUp from "@/components/generic/PopUp";
import { useCardTypes } from "@/hooks/useCardTypes";
import { sortedDeck } from "@/utils/functions/sortedDeck";
import { EXTRA_DECK_LABELS } from "@/utils/const/extraDeckConst";
import DeckSection from "@/components/pages/userProfil/deckCommon/DeckSection";
import DeckCardsGrid from "@/components/pages/userProfil/deckCommon/DeckCardsGrid";

interface AdminUserDecksTabProps {
  userId: string;
}

const AdminUserDecksTab: React.FC<AdminUserDecksTabProps> = ({ userId }) => {
  const { token } = useSelector((state: RootState) => state.user);
  const { cardTypes } = useCardTypes();
  const [decks, setDecks] = useState<DeckWithArchetypeDetails[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDeck, setSelectedDeck] = useState<Deck | null>(null);
  const [deckLoading, setDeckLoading] = useState(false);

  useEffect(() => {
    if (!token || !userId) return;
    void getMyDecks(token, userId, setDecks, setIsFetching, setError);
  }, [token, userId]);

  const handleOpenDeck = async (deckId: string) => {
    if (!token) return;
    setDeckLoading(true);
    try {
      const deck = await fetchDeckById(token, deckId);
      setSelectedDeck(deck);
    } finally {
      setDeckLoading(false);
    }
  };

  const sortedDeckCards = useMemo((): DeckCard[] | null => {
    if (!selectedDeck?.deck_cards) return null;
    const base = selectedDeck.deck_cards as DeckCard[];
    if (!cardTypes.length) return base;
    return sortedDeck(base, cardTypes);
  }, [selectedDeck?.deck_cards, cardTypes]);

  const { mainDisplayCards, extraDisplayCards } = useMemo(() => {
    if (!sortedDeckCards) {
      return {
        mainDisplayCards: [] as DeckCard[],
        extraDisplayCards: [] as DeckCard[],
      };
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

  if (isFetching) {
    return <MyDecksDivSkeleton itemCount={6} />;
  }

  if (error) {
    return (
      <p className="text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
        {error}
      </p>
    );
  }

  if (decks.length === 0) {
    return (
      <NoItemMessage
        message="Cet utilisateur n'a aucun deck."
        textPosition="left"
      />
    );
  }

  return (
    <>
      <div className="grid grid-cols-12 gap-2 tablet:gap-3">
        {decks
          .filter(
            (deck): deck is DeckWithArchetypeDetails & { id: string } =>
              deck.id != null && deck.id !== ""
          )
          .map((deck) => {
            const archetypeImg = deck.archetype?.card_img_url;
            const isPlayable =
              Boolean(deck.is_playable) && deck.archetype?.is_active === true;

            return (
              <button
                key={deck.id}
                type="button"
                onClick={() => void handleOpenDeck(deck.id)}
                className="text-left p-2 space-y-1.5 bg-gray-50 border border-gray-200 rounded-lg col-span-6 tablet:col-span-4 sscreen:col-span-3 lscreen:col-span-2 hover:bg-gray-100 hover:shadow-sm transition-all"
              >
                <div className="mx-auto w-16 h-16 tablet:w-20 tablet:h-20 sscreen:w-24 sscreen:h-24 rounded-md overflow-hidden bg-gray-300">
                  {archetypeImg ? (
                    <img
                      className="rounded-md w-full h-full object-cover"
                      src={optimizeImageUrl(archetypeImg, "card")}
                      alt={
                        deck.archetype?.label ||
                        deck.label ||
                        "Deck sans archétype"
                      }
                      width={96}
                      height={96}
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-300" />
                  )}
                </div>
                <p className="flex flex-col items-center gap-1">
                  <span className="font-bold line-clamp-1 text-sm">
                    {deck.label}
                  </span>
                  {deck.archetype?.label && (
                    <span className="text-xs text-gray-600 line-clamp-1">
                      {deck.archetype.label}
                    </span>
                  )}
                  <span
                    className={`text-white text-xs px-1.5 py-0.5 rounded-sm ${
                      isPlayable ? "bg-green-500" : "bg-red-500"
                    }`}
                  >
                    {isPlayable ? "Jouable" : "Non jouable"}
                  </span>
                </p>
              </button>
            );
          })}
      </div>

      <PopUp
        isOpen={selectedDeck != null || deckLoading}
        onClose={() => {
          if (!deckLoading) setSelectedDeck(null);
        }}
        title={selectedDeck?.label ?? "Deck"}
        className="max-w-3xl w-full"
      >
        {deckLoading ? (
          <p className="text-sm text-gray-500 animate-pulse">
            Chargement du deck…
          </p>
        ) : selectedDeck && sortedDeckCards ? (
          <div className="space-y-3">
            {selectedDeck.archetype?.label && (
              <p className="font-semibold text-sm">
                Archétype : {selectedDeck.archetype.label}
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
            {mainDisplayCards.length === 0 &&
              extraDisplayCards.length === 0 && (
                <p className="text-gray-500 text-sm">
                  Aucune carte dans ce deck.
                </p>
              )}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">Impossible de charger ce deck.</p>
        )}
      </PopUp>
    </>
  );
};

export default AdminUserDecksTab;
