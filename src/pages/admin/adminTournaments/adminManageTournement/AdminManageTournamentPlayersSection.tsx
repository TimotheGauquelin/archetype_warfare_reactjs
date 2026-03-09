import { useMemo, useState, useEffect } from "react";
import CompletionListInput from "@/components/generic/form/CompletionListInput";
import NoItemMessage from "@/components/generic/NoItemMessage";
import PaginationTableHead from "@/components/generic/pagination/PaginationTableHead";
import AdminSection from "@/components/pages/admin/AdminSection";
import PopUp from "@/components/generic/PopUp";
import DeckCardsGrid from "@/components/pages/userProfil/deckCommon/DeckCardsGrid";
import DeckSection from "@/components/pages/userProfil/deckCommon/DeckSection";
import { useCardTypes } from "@/hooks/useCardTypes";
import { sortedDeck } from "@/utils/functions/sortedDeck";
import { EXTRA_DECK_LABELS } from "@/utils/const/extraDeckConst";
import type { TournamentDetail, TournamentPlayerAdmin } from "@/services/tournament";
import { assignTournamentPlayerDeck } from "@/services/tournament";
import { getMyPlayableDecks } from "@/services/deck";
import { handleApiError, getErrorMessage } from "@/utils/errorHandler";
import type { User, DeckCard, Deck } from "@/types";
import { verbalDate } from "@/utils/date/verbalDate";

interface AdminManageTournamentPlayersSectionProps {
  tournament: TournamentDetail | null;
  players: TournamentPlayerAdmin[];
  addPlayerUsername: string;
  setAddPlayerUsername: (username: string) => void;
  addPlayerResults: any;
  inscribedUserIds: Set<string>;
  addingUserId: string | null;
  handleAddPlayer: (user: User) => void;
  handleRemovePlayer: (player: any) => void;
  setRemovePlayer: (player: any) => void;
  token: string | null;
  onDeckAssigned?: () => void;
}

const AdminManageTournamentPlayersSection = ({
  tournament,
  players,
  addPlayerUsername,
  setAddPlayerUsername,
  addPlayerResults,
  handleAddPlayer,
  handleRemovePlayer,
  token,
  onDeckAssigned,
}: AdminManageTournamentPlayersSectionProps) => {

  const [deckSnapshotPlayer, setDeckSnapshotPlayer] = useState<TournamentPlayerAdmin | null>(null);
  const [assignDeckPlayer, setAssignDeckPlayer] = useState<TournamentPlayerAdmin | null>(null);
  const [playableDecks, setPlayableDecks] = useState<Deck[]>([]);
  const [playableDecksLoading, setPlayableDecksLoading] = useState(false);
  const [selectedDeckId, setSelectedDeckId] = useState<string | "">("");
  const [assignDeckLoading, setAssignDeckLoading] = useState(false);
  const [assignDeckError, setAssignDeckError] = useState<string | null>(null);
  const [playerToRemove, setPlayerToRemove] = useState<TournamentPlayerAdmin | null>(null);
  const [removingPlayer, setRemovingPlayer] = useState(false);
  const { cardTypes } = useCardTypes();
  const TABLE_HEAD_ITEMS = [
    { colspan: "col-span-6 lscreen:col-span-4", label: "Joueur" },
    { colspan: "col-span-3 lscreen:col-span-2", label: "A abandonné" },
    { colspan: "col-span-3 lscreen:col-span-2", label: "Deck" },
    { colspan: "hidden lscreen:flex lscreen:col-span-4", label: "Actions" },
  ];

  const handleOpenDeckSnapshot = (player: TournamentPlayerAdmin) => {
    if (!player.deck_snapshot) return;
    setDeckSnapshotPlayer(player);
  };

  const handleCloseDeckSnapshot = () => {
    setDeckSnapshotPlayer(null);
  };

  const handleOpenRemovePlayer = (player: TournamentPlayerAdmin) => {
    setPlayerToRemove(player);
  };

  const handleCloseRemovePlayer = () => {
    if (removingPlayer) return;
    setPlayerToRemove(null);
  };

  const handleConfirmRemovePlayer = async () => {
    if (!playerToRemove) return;
    setRemovingPlayer(true);
    try {
      await handleRemovePlayer(playerToRemove.id);
      setPlayerToRemove(null);
    } finally {
      setRemovingPlayer(false);
    }
  };

  const handleOpenAssignDeck = (player: TournamentPlayerAdmin) => {
    setAssignDeckError(null);
    const existingDeckId = player.deck_id;
    if (existingDeckId !== undefined && existingDeckId !== null && existingDeckId !== "") {
      setSelectedDeckId(existingDeckId);
    } else {
      setSelectedDeckId("");
    }
    setAssignDeckPlayer(player);
  };

  const handleCloseAssignDeck = () => {
    setAssignDeckPlayer(null);
    setPlayableDecks([]);
    setSelectedDeckId("");
    setAssignDeckError(null);
  };

  useEffect(() => {
    const player = assignDeckPlayer;
    const userId = player?.user_id ?? player?.user?.id;
    if (!token || !userId || !player) {
      setPlayableDecks([]);
      return;
    }
    let cancelled = false;
    setPlayableDecksLoading(true);
    getMyPlayableDecks(token, userId)
      .then((decks) => {
        if (!cancelled) {
          setPlayableDecks(Array.isArray(decks) ? decks.filter((d) => d.is_playable !== false) : []);
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
  }, [assignDeckPlayer, token]);

  const handleConfirmAssignDeck = async () => {
    const player = assignDeckPlayer;
    if (!token || !tournament?.id || !player || selectedDeckId === "") return;
    setAssignDeckError(null);
    setAssignDeckLoading(true);
    try {
      await assignTournamentPlayerDeck(tournament.id, player.id, selectedDeckId, token);
      onDeckAssigned?.();
      handleCloseAssignDeck();
    } catch (e) {
      setAssignDeckError(getErrorMessage(handleApiError(e)));
    } finally {
      setAssignDeckLoading(false);
    }
  };

  const deckSnapshot = deckSnapshotPlayer?.deck_snapshot;

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

  const { mainDisplayCards, extraDisplayCards } = useMemo(() => {
    if (!sortedSnapshotCards) {
      return { mainDisplayCards: [] as DeckCard[], extraDisplayCards: [] as DeckCard[] };
    }
    const main: DeckCard[] = [];
    const extra: DeckCard[] = [];

    sortedSnapshotCards.forEach((deckCard) => {
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
  }, [sortedSnapshotCards]);

  return (
    <AdminSection adminSectionTitle="Joueurs">
      <div className="flex flex-col flex-wrap gap-2">
        {tournament?.status.includes("registration") && (
          <div className="space-y-2 bg-gray-100 rounded-md p-2">
            <label htmlFor="addPlayerUsername" className="font-semibold">Actions</label>
            <CompletionListInput
              id="addPlayerUsername"
              placeholder="Ajouter un joueur"
              items={addPlayerResults?.data ?? []}
              getItemLabel={(user: User) => user.username ?? ""}
              alreadyAdded={players.map((p) => p.user).filter(Boolean) as User[]}
              getItemId={(user: User) => user.id ?? ""}
              value={addPlayerUsername}
              onChange={(value) => setAddPlayerUsername(value)}
              onSelect={(user: User) => handleAddPlayer(user)}
            />
          </div>
        )}
        {players.length === 0 ? (
          <NoItemMessage message="Aucun joueur ou données non disponibles." />
        ) : (
          <div className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <PaginationTableHead tableHeadItem={TABLE_HEAD_ITEMS} />
            <div className="grid grid-cols-12">
              {players.map((player) => (
                <div
                  className="grid grid-cols-12 col-span-12 flex items-center border-b border-l border-r hover:bg-slate-200"
                  key={player.id}
                >
                  <div className="col-span-6 lscreen:col-span-4 p-1">
                    {player.user?.username ?? `#${player.id}`}
                  </div>
                  <div className="col-span-3 lscreen:col-span-2 p-1">
                    {player.dropped ? "Oui" : "Non"}
                  </div>
                  <div className="col-span-3 lscreen:col-span-2 p-1">
                    {player.deck_snapshot ? (
                      <div className="flex flex-col items-start gap-0.5">
                        <button
                          type="button"
                          onClick={() => handleOpenDeckSnapshot(player)}
                          className="text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          Voir le deck
                        </button>
                        <p className="text-[10px] text-gray-500">
                          <span>Ajouté par </span>
                          <span className="font-medium">
                            {player.deck_snapshot.snapshot_by?.username ??
                              player.user?.username ??
                              "inconnu"}
                          </span>
                          {player.deck_snapshot.created_at && (
                            <span className="font-light italic"> (le {verbalDate(player.deck_snapshot.created_at, true)})</span>
                          )}
                        </p>
                      </div>
                    ) : (
                      "—"
                    )}
                  </div>
                  <div className="hidden lscreen:flex lscreen:col-span-4 flex-col p-1 text-right border-l gap-0.5">
                    {tournament?.status.includes("registration") && (
                      <span
                        onClick={() => handleOpenRemovePlayer(player)}
                        className={
                          player.banned
                            ? "font-medium text-green-600 hover:text-yellow-600 hover:underline cursor-pointer block w-full text-right"
                            : "font-medium text-orange-600 hover:text-yellow-600 hover:underline cursor-pointer block w-full text-right"
                        }
                      >
                        Retirer du tournoi
                      </span>
                    )}
                    {tournament?.require_deck_list && (
                      <button
                      type="button"
                      onClick={() => handleOpenAssignDeck(player)}
                      className="font-medium text-blue-600 hover:text-blue-800 hover:underline cursor-pointer block w-full text-right"
                    >
                      {player.deck_snapshot ? "Changer le deck" : "Assigner un deck"}
                    </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <PopUp
        isOpen={!!deckSnapshotPlayer}
        onClose={handleCloseDeckSnapshot}
        title={deckSnapshot?.label ?? "Deck du joueur"}
        className="max-w-3xl w-full"
      >
        {deckSnapshot ? (
          <div className="space-y-3">
            {deckSnapshot.archetype?.name && (
              <p className="font-semibold">
                Archétype : {deckSnapshot.archetype.name}
              </p>
            )}
            <p>
              Joueur: {deckSnapshotPlayer?.user?.username}
            </p>
            {sortedSnapshotCards ? (
              <div className="space-y-3">
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
                        className:
                          "p-1 rounded-md bg-gray-200 text-gray-700",
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
                        className:
                          "p-1 rounded-md bg-gray-200 text-gray-700",
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
                Impossible de charger les cartes de ce deck.
              </p>
            )}
          </div>
        ) : (
          <p>Aucun deck enregistré pour ce joueur.</p>
        )}
      </PopUp>

      <PopUp
        isOpen={!!playerToRemove}
        onClose={handleCloseRemovePlayer}
        title="Retirer un joueur du tournoi"
        className="max-w-md w-full"
      >
        {playerToRemove && (
          <div className="space-y-3">
            <p>
              Voulez-vous vraiment retirer{" "}
              <span className="font-semibold">
                {playerToRemove.user?.username ?? `#${playerToRemove.id}`}
              </span>{" "}
              du tournoi ?
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={handleCloseRemovePlayer}
                disabled={removingPlayer}
                className="px-3 py-1.5 border border-gray-300 rounded-md text-sm hover:bg-gray-100 disabled:opacity-50"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleConfirmRemovePlayer}
                disabled={removingPlayer}
                className="px-3 py-1.5 bg-red-600 text-white rounded-md text-sm hover:bg-red-700 disabled:opacity-50"
              >
                {removingPlayer ? "Retrait…" : "Confirmer"}
              </button>
            </div>
          </div>
        )}
      </PopUp>

      <PopUp
        isOpen={!!assignDeckPlayer}
        onClose={handleCloseAssignDeck}
        title="Assigner un deck"
        className="max-w-md w-full"
      >
        {assignDeckPlayer && (
          <div className="space-y-3">
            <p className="font-semibold">
              Joueur : {assignDeckPlayer.user?.username ?? `#${assignDeckPlayer.id}`}
            </p>
            {playableDecksLoading ? (
              <p className="text-gray-500 text-sm">Chargement des decks jouables…</p>
            ) : (
              <>
                <label htmlFor="assign-deck-select" className="block text-sm font-medium text-gray-700">
                  Deck jouable
                </label>
                <select
                  id="assign-deck-select"
                  value={selectedDeckId}
                  onChange={(e) => setSelectedDeckId(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                >
                  <option value="">— Choisir un deck —</option>
                  {playableDecks.map((deck) => (
                    <option key={deck.id} value={deck.id ?? ""}>
                      {deck.label ?? deck.name ?? `Deck #${deck.id}`}
                    </option>
                  ))}
                </select>
                {playableDecks.length === 0 && !playableDecksLoading && (
                  <p className="text-amber-600 text-sm">Aucun deck jouable pour ce joueur.</p>
                )}
              </>
            )}
            {assignDeckError && (
              <p className="text-red-600 text-sm">{assignDeckError}</p>
            )}
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={handleCloseAssignDeck}
                className="px-3 py-1.5 border border-gray-300 rounded-md text-sm hover:bg-gray-100"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleConfirmAssignDeck}
                disabled={playableDecksLoading || selectedDeckId === "" || assignDeckLoading}
                className="px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 disabled:opacity-50"
              >
                {assignDeckLoading ? "Envoi…" : "Valider"}
              </button>
            </div>
          </div>
        )}
      </PopUp>
    </AdminSection>
  );
};

export default AdminManageTournamentPlayersSection;