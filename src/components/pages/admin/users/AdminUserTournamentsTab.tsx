import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import PaginationTableHead from "../../../generic/pagination/PaginationTableHead";
import NoItemMessage from "../../../generic/NoItemMessage";
import SelectInput from "../../../generic/form/SelectInput";
import { Input } from "../../../generic/form/input/Input";
import PopUp from "../../../generic/PopUp";
import DeckSection from "../../userProfil/deckCommon/DeckSection";
import DeckCardsGrid from "../../userProfil/deckCommon/DeckCardsGrid";
import { getAdminUserTournamentsSummary } from "../../../../services/user";
import {
  getTournamentPlayerDeckSnapshot,
  type TournamentPlayerDeckSnapshot,
} from "../../../../services/tournament";
import { getAdminTournamentManagePath } from "../../../../constant/urlsFront";
import { verbalDate } from "../../../../utils/date/verbalDate";
import { sortedDeck } from "../../../../utils/functions/sortedDeck";
import { EXTRA_DECK_LABELS } from "../../../../utils/const/extraDeckConst";
import { useCardTypes } from "../../../../hooks/useCardTypes";
import type { AdminUserTournamentSummaryItem, DeckCard, RootState } from "../../../../types";

interface AdminUserTournamentsTabProps {
  userId: string;
}

const TABLE_HEAD_ITEMS = [
  { colspan: "col-span-3", label: "Nom du tournoi" },
  { colspan: "col-span-2", label: "Date" },
  { colspan: "col-span-2", label: "Lieu" },
  { colspan: "col-span-2", label: "Bilan" },
  { colspan: "col-span-1", label: "Deck" },
  { colspan: "col-span-2", label: "Actions" },
];

const OFFICIAL_OPTIONS = [
  { id: "true", label: "Officiel" },
  { id: "false", label: "Communautaire" },
];

type TournamentFilterForm = {
  deck: string;
  location: string;
  event_date: string;
  is_official: "" | "true" | "false";
} & Record<string, unknown>;

const EMPTY_FILTERS: TournamentFilterForm = {
  deck: "",
  location: "",
  event_date: "",
  is_official: "",
};

const placeLabel = (place: number | null, playersCount: number) => {
  if (place == null) return null;
  if (playersCount > 0) return `${place}e / ${playersCount}`;
  return `${place}e`;
};

const toDateKey = (value: string | Date | null | undefined): string => {
  if (!value) return "";
  const raw = typeof value === "string" ? value : String(value);
  if (!raw) return "";
  return raw.slice(0, 10);
};

const AdminUserTournamentsTab: React.FC<AdminUserTournamentsTabProps> = ({
  userId,
}) => {
  const token = useSelector((state: RootState) => state.user.token);
  const { cardTypes } = useCardTypes();
  const [tournaments, setTournaments] = useState<
    AdminUserTournamentSummaryItem[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<TournamentFilterForm>(EMPTY_FILTERS);
  const [selectedDeck, setSelectedDeck] =
    useState<TournamentPlayerDeckSnapshot | null>(null);
  const [deckLoading, setDeckLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    void getAdminUserTournamentsSummary(userId).then((data) => {
      if (cancelled) return;
      if (!data) {
        setError("Impossible de charger les tournois.");
        setTournaments([]);
      } else {
        setTournaments(data);
      }
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const deckOptions = useMemo(() => {
    const labels = new Set<string>();
    tournaments.forEach((item) => {
      const label = item.participation.deck_label?.trim();
      if (label) labels.add(label);
    });
    return Array.from(labels)
      .sort((a, b) => a.localeCompare(b, "fr", { sensitivity: "base" }))
      .map((label) => ({ id: label, label }));
  }, [tournaments]);

  const filteredTournaments = useMemo(() => {
    const deck = filters.deck.trim();
    const location = filters.location.trim().toLowerCase();
    const date = filters.event_date.trim();
    const official = filters.is_official;

    return tournaments.filter((item) => {
      if (deck && (item.participation.deck_label ?? "").trim() !== deck) {
        return false;
      }
      if (
        location &&
        !(item.location ?? "").toLowerCase().includes(location)
      ) {
        return false;
      }
      if (date && toDateKey(item.event_date) !== date) {
        return false;
      }
      if (official === "true" && !item.is_official) return false;
      if (official === "false" && item.is_official) return false;
      return true;
    });
  }, [tournaments, filters]);

  const handleOpenDeck = async (tournamentPlayerId: number) => {
    if (!token) return;
    setDeckLoading(true);
    setSelectedDeck(null);
    try {
      const snapshot = await getTournamentPlayerDeckSnapshot(
        tournamentPlayerId,
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

  if (loading) {
    return <p className="text-sm text-gray-500 p-2">Chargement…</p>;
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 rounded p-3 text-sm">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="border border-gray-200 bg-slate-100 rounded p-2">
        <div className="flex justify-between items-center">
          <h2 className="text-md font-semibold">Filtres :</h2>
          <p
            className="hover:text-red-500 cursor-pointer text-sm"
            onClick={() => setFilters(EMPTY_FILTERS)}
          >
            Reset les filtres
          </p>
        </div>
        <div className="grid grid-cols-12 gap-4 items-end pt-2">
          <SelectInput
            attribute="deck"
            data={filters}
            setAction={setFilters}
            label="Deck"
            defaultOptionLabel="-- Tous les decks --"
            options={deckOptions}
            colSpanWidth="3"
            ariaLabel="Deck utilisé"
          />
          <Input
            attribute="location"
            data={filters}
            setAction={setFilters}
            placeholder="Lille, Paris, etc."
            inputType="text"
            colSpanWidth="3"
            label="Lieu"
          />
          <Input
            attribute="event_date"
            data={filters}
            setAction={setFilters}
            inputType="date"
            colSpanWidth="3"
            label="Date"
          />
          <SelectInput
            attribute="is_official"
            data={filters}
            setAction={setFilters}
            label="Type"
            defaultOptionLabel="-- Officiel / Communautaire --"
            options={OFFICIAL_OPTIONS}
            colSpanWidth="3"
            ariaLabel="Type de tournoi"
          />
        </div>
      </div>

      <p className="text-sm text-gray-600">
        {filteredTournaments.length} participation
        {filteredTournaments.length > 1 ? "s" : ""}
      </p>

      {filteredTournaments.length === 0 ? (
        <NoItemMessage message="Aucune participation à un tournoi." />
      ) : (
        <div className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <PaginationTableHead tableHeadItem={TABLE_HEAD_ITEMS} />
          <div className="grid grid-cols-12">
            {filteredTournaments.map((item) => {
              const p = item.participation;
              const record = `${p.match_wins}V / ${p.match_losses}D / ${p.match_draws}N`;
              const place = placeLabel(p.place, p.players_count);
              const deckLabel = p.deck_label?.trim();
              return (
                <div
                  className="grid grid-cols-12 col-span-12 flex items-center border-b border-l border-r hover:bg-slate-200"
                  key={`${item.tournament_id}-${p.tournament_player_id}`}
                >
                  <div className="col-span-3 p-1">
                    <div>{item.name}</div>
                    <div className="text-xs text-gray-500">
                      {item.is_official ? "Officiel" : "Communautaire"}
                      {item.is_online ? " · En ligne" : ""}
                    </div>
                  </div>
                  <div className="col-span-2 p-1">
                    {verbalDate(toDateKey(item.event_date))}
                  </div>
                  <div className="col-span-2 p-1">{item.location ?? "—"}</div>
                  <div className="col-span-2 p-1">
                    <div>{record}</div>
                    {place && (
                      <div className="text-xs text-gray-600 font-medium">
                        Position : {place}
                      </div>
                    )}
                    {p.dropped && (
                      <span className="text-xs text-red-600 font-medium block">
                        Abandon
                      </span>
                    )}
                    {p.disqualified_at && (
                      <span className="text-xs text-red-600 font-medium block">
                        Disqualifié
                      </span>
                    )}
                  </div>
                  <div className="col-span-1 p-1">
                    {deckLabel ? (
                      <button
                        type="button"
                        onClick={() => void handleOpenDeck(p.tournament_player_id)}
                        disabled={deckLoading}
                        className="text-blue-600 hover:text-blue-800 hover:underline font-medium text-left disabled:opacity-50"
                      >
                        {deckLabel}
                      </button>
                    ) : (
                      <div>—</div>
                    )}
                    {p.archetype_name && (
                      <div className="text-xs text-gray-500">
                        {p.archetype_name}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col col-span-2 bg-gray-100 p-1 text-right border-l">
                    <Link
                      to={getAdminTournamentManagePath(item.tournament_id)}
                      className="font-medium text-blue-600 hover:text-yellow-600 hover:underline cursor-pointer"
                    >
                      Voir
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <PopUp
        isOpen={selectedDeck != null || deckLoading}
        onClose={() => {
          if (!deckLoading) setSelectedDeck(null);
        }}
        title={selectedDeck?.label ?? "Deck du joueur"}
        className="max-w-3xl w-full"
      >
        {deckLoading ? (
          <p className="text-sm text-gray-500 animate-pulse">
            Chargement du deck…
          </p>
        ) : selectedDeck && sortedDeckCards ? (
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
            {mainDisplayCards.length === 0 &&
              extraDisplayCards.length === 0 && (
                <p className="text-gray-500 text-sm">Deck vide.</p>
              )}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">
            Aucun snapshot de deck disponible.
          </p>
        )}
      </PopUp>
    </div>
  );
};

export default AdminUserTournamentsTab;
