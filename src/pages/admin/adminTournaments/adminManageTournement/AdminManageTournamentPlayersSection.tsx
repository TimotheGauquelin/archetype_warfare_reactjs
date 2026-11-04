import { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import CompletionListInput from "@/components/generic/form/CompletionListInput";
import NoItemMessage from "@/components/generic/NoItemMessage";
import PaginationTableHead from "@/components/generic/pagination/PaginationTableHead";
import PopUp from "@/components/generic/PopUp";
import DeckCardsGrid from "@/components/pages/userProfil/deckCommon/DeckCardsGrid";
import DeckSection from "@/components/pages/userProfil/deckCommon/DeckSection";
import { useCardTypes } from "@/hooks/useCardTypes";
import { sortedDeck } from "@/utils/functions/sortedDeck";
import { EXTRA_DECK_LABELS } from "@/utils/const/extraDeckConst";
import type {
  TournamentDetail,
  TournamentPlayerAdmin,
  TournamentPlayerPenaltyAdmin,
  PenaltyTypeOption,
} from "@/services/tournament";
import {
  assignTournamentPlayerDeck,
  createTournamentPlayerPenalty,
  deleteTournamentPlayerPenalty,
  getTournamentPenaltyTypes,
  getTournamentPlayerPenalties,
  updateTournamentPlayerPenalty,
} from "@/services/tournament";
import { getMyPlayableDecks } from "@/services/deck";
import { handleApiError, getErrorMessage } from "@/utils/errorHandler";
import type { User, DeckCard, Deck } from "@/types";
import { verbalDate } from "@/utils/date/verbalDate";
import {
  translatePenaltyRound,
  translatePenaltyType,
} from "@/utils/trad/penaltyType";

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
  const { t } = useTranslation();
  const [deckSnapshotPlayer, setDeckSnapshotPlayer] = useState<TournamentPlayerAdmin | null>(null);
  const [assignDeckPlayer, setAssignDeckPlayer] = useState<TournamentPlayerAdmin | null>(null);
  const [playableDecks, setPlayableDecks] = useState<Deck[]>([]);
  const [playableDecksLoading, setPlayableDecksLoading] = useState(false);
  const [selectedDeckId, setSelectedDeckId] = useState<string | "">("");
  const [assignDeckLoading, setAssignDeckLoading] = useState(false);
  const [assignDeckError, setAssignDeckError] = useState<string | null>(null);
  const [playerToRemove, setPlayerToRemove] = useState<TournamentPlayerAdmin | null>(null);
  const [removingPlayer, setRemovingPlayer] = useState(false);
  const [penaltiesPlayer, setPenaltiesPlayer] =
    useState<TournamentPlayerAdmin | null>(null);
  const [playerPenalties, setPlayerPenalties] = useState<
    TournamentPlayerPenaltyAdmin[]
  >([]);
  const [penaltyTypes, setPenaltyTypes] = useState<PenaltyTypeOption[]>([]);
  const [penaltiesLoading, setPenaltiesLoading] = useState(false);
  const [penaltyFormTypeId, setPenaltyFormTypeId] = useState<number | "">("");
  /** "" = avant le début (round_id null) */
  const [penaltyFormRoundId, setPenaltyFormRoundId] = useState<number | "">("");
  const [penaltyFormReason, setPenaltyFormReason] = useState("");
  const [penaltyFormNotes, setPenaltyFormNotes] = useState("");
  const [editingPenaltyId, setEditingPenaltyId] = useState<number | null>(null);
  const [penaltySaving, setPenaltySaving] = useState(false);
  const { cardTypes } = useCardTypes();
  const allowPenalties = Boolean(tournament?.allow_penalities);
  const tournamentRounds = useMemo(() => {
    const rounds = tournament?.rounds ?? [];
    return [...rounds].sort((a, b) => a.round_number - b.round_number);
  }, [tournament?.rounds]);
  const TABLE_HEAD_ITEMS = [
    { colspan: "col-span-4 lscreen:col-span-3", label: "Joueur" },
    { colspan: "col-span-2 lscreen:col-span-2", label: "A abandonné" },
    { colspan: "col-span-3 lscreen:col-span-2", label: "Deck" },
    { colspan: "col-span-3 lscreen:col-span-2", label: "Pénalités" },
    { colspan: "hidden lscreen:flex lscreen:col-span-3", label: "Actions" },
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

  const resetPenaltyForm = () => {
    setEditingPenaltyId(null);
    setPenaltyFormTypeId("");
    setPenaltyFormRoundId("");
    setPenaltyFormReason("");
    setPenaltyFormNotes("");
  };

  const handleOpenPenalties = async (player: TournamentPlayerAdmin) => {
    if (!token || !tournament?.id) return;
    setPenaltiesPlayer(player);
    setPenaltiesLoading(true);
    resetPenaltyForm();
    try {
      const [types, list] = await Promise.all([
        penaltyTypes.length
          ? Promise.resolve(penaltyTypes)
          : getTournamentPenaltyTypes(token),
        getTournamentPlayerPenalties(tournament.id, player.id, token),
      ]);
      if (!penaltyTypes.length) setPenaltyTypes(types);
      setPlayerPenalties(list);
    } catch {
      setPlayerPenalties([]);
    } finally {
      setPenaltiesLoading(false);
    }
  };

  const handleClosePenalties = () => {
    if (penaltySaving) return;
    setPenaltiesPlayer(null);
    setPlayerPenalties([]);
    resetPenaltyForm();
  };

  const handleSavePenalty = async () => {
    if (!token || !tournament?.id || !penaltiesPlayer) return;
    if (penaltyFormTypeId === "") return;
    setPenaltySaving(true);
    try {
      const payload = {
        penalty_type_id: Number(penaltyFormTypeId),
        reason: penaltyFormReason.trim() || null,
        notes: penaltyFormNotes.trim() || null,
        round_id:
          penaltyFormRoundId === "" ? null : Number(penaltyFormRoundId),
      };
      if (editingPenaltyId != null) {
        await updateTournamentPlayerPenalty(
          tournament.id,
          penaltiesPlayer.id,
          editingPenaltyId,
          payload,
          token
        );
      } else {
        await createTournamentPlayerPenalty(
          tournament.id,
          penaltiesPlayer.id,
          payload,
          token
        );
      }
      const list = await getTournamentPlayerPenalties(
        tournament.id,
        penaltiesPlayer.id,
        token
      );
      setPlayerPenalties(list);
      resetPenaltyForm();
      onDeckAssigned?.();
    } finally {
      setPenaltySaving(false);
    }
  };

  const handleEditPenalty = (penalty: TournamentPlayerPenaltyAdmin) => {
    setEditingPenaltyId(penalty.id);
    setPenaltyFormTypeId(penalty.penalty_type_id);
    setPenaltyFormRoundId(penalty.round_id ?? penalty.round?.id ?? "");
    setPenaltyFormReason(penalty.reason ?? "");
    setPenaltyFormNotes(penalty.notes ?? "");
  };

  const handleDeletePenalty = async (penaltyId: number) => {
    if (!token || !tournament?.id || !penaltiesPlayer) return;
    setPenaltySaving(true);
    try {
      await deleteTournamentPlayerPenalty(
        tournament.id,
        penaltiesPlayer.id,
        penaltyId,
        token
      );
      setPlayerPenalties((prev) => prev.filter((p) => p.id !== penaltyId));
      if (editingPenaltyId === penaltyId) resetPenaltyForm();
      onDeckAssigned?.();
    } finally {
      setPenaltySaving(false);
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

  const maxPlayersLabel =
    tournament?.max_players != null && tournament.max_players > 0
      ? String(tournament.max_players)
      : "—";

  return (
    <>
      <div className="flex flex-col flex-wrap gap-2">
        <p className="text-sm font-semibold text-gray-800">
          Joueurs : {players.length} / {maxPlayersLabel}
        </p>
        {tournament?.status.includes("registration") && (
          <div className="space-y-2 bg-gray-100 rounded-md p-2">
            <label htmlFor="addPlayerUsername" className="font-semibold">Ajouter un joueur</label>
            <CompletionListInput
              id="addPlayerUsername"
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
              {players.map((player) => {
                const penaltiesCount = player.penalties?.length ?? 0;
                const lateDeck = Boolean(player.late_deck_penalty);
                const userId = player.user?.id ?? player.user_id;
                const playerLabel = player.user?.username ?? `#${player.id}`;
                return (
                <div
                  className="grid grid-cols-12 col-span-12 flex items-center border-b border-l border-r hover:bg-slate-200"
                  key={player.id}
                >
                  <div className="col-span-4 lscreen:col-span-3 p-1">
                    {userId ? (
                      <Link
                        to={`/admin/users/update/${userId}`}
                        className="font-medium text-blue-700 hover:text-blue-900 hover:underline"
                      >
                        {playerLabel}
                      </Link>
                    ) : (
                      <div className="font-medium text-gray-900">{playerLabel}</div>
                    )}
                    {lateDeck && (
                      <span className="mt-0.5 inline-flex items-center rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-900">
                        Deck tardif
                      </span>
                    )}
                  </div>
                  <div className="col-span-2 lscreen:col-span-2 p-1">
                    {player.dropped ? t("common.yes") : t("common.no")}
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
                  <div className="col-span-3 lscreen:col-span-2 p-1 text-xs">
                    {allowPenalties ? (
                      <div className="space-y-0.5">
                        <p className="text-gray-800">
                          {penaltiesCount > 0
                            ? `${penaltiesCount} pénalité${penaltiesCount > 1 ? "s" : ""}`
                            : "Aucune"}
                        </p>
                        <button
                          type="button"
                          onClick={() => void handleOpenPenalties(player)}
                          className="text-blue-600 hover:underline font-medium"
                        >
                          Gérer
                        </button>
                      </div>
                    ) : (
                      <span className="text-gray-400">Désactivées</span>
                    )}
                  </div>
                  <div className="hidden lscreen:flex lscreen:col-span-3 flex-col p-1 text-right border-l gap-0.5">
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
                        {player.deck_snapshot
                          ? "Changer le deck"
                          : "Assigner un deck"}
                      </button>
                    )}
                    {allowPenalties && (
                      <button
                        type="button"
                        onClick={() => void handleOpenPenalties(player)}
                        className="font-medium text-amber-700 hover:text-amber-900 hover:underline cursor-pointer block w-full text-right"
                      >
                        Pénalités
                      </button>
                    )}
                  </div>
                </div>
              );
              })}
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
            {tournament?.status !== "registration_open" && (
              <p className="text-amber-800 text-xs bg-amber-50 border border-amber-200 rounded px-2 py-1.5">
                Les inscriptions ne sont plus ouvertes : ce joueur sera marqué
                « deck tardif »
                {allowPenalties
                  ? " et recevra un Warning automatique."
                  : "."}
              </p>
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

      <PopUp
        isOpen={!!penaltiesPlayer}
        onClose={handleClosePenalties}
        title={`Pénalités — ${penaltiesPlayer?.user?.username ?? `#${penaltiesPlayer?.id}`}`}
        className="max-w-xl w-full"
      >
        {penaltiesPlayer && (
          <div className="space-y-4">
            {Boolean(penaltiesPlayer.late_deck_penalty) && (
              <p className="text-xs font-semibold text-amber-900 bg-amber-50 border border-amber-200 rounded px-2 py-1.5">
                Flag deck tardif actif sur ce joueur.
              </p>
            )}
            {penaltiesLoading ? (
              <p className="text-sm text-gray-500">Chargement…</p>
            ) : playerPenalties.length === 0 ? (
              <p className="text-sm text-gray-500">Aucune pénalité enregistrée.</p>
            ) : (
              <ul className="space-y-2">
                {playerPenalties.map((penalty) => (
                  <li
                    key={penalty.id}
                    className="border border-gray-200 rounded-md p-2.5 text-sm bg-gray-50"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900">
                          {translatePenaltyType(
                            t,
                            penalty.penalty_type?.code,
                            penalty.penalty_type?.label
                          )}
                        </p>
                        <p className="text-xs text-gray-600 mt-0.5">
                          {translatePenaltyRound(
                            t,
                            penalty.round ??
                              (penalty.round_id == null
                                ? null
                                : tournamentRounds.find(
                                    (r) => r.id === penalty.round_id
                                  ) ?? { round_number: null })
                          )}
                        </p>
                        {penalty.reason && (
                          <p className="text-gray-700 mt-0.5">{penalty.reason}</p>
                        )}
                        {penalty.notes && (
                          <p className="text-gray-600 text-xs mt-0.5">
                            {penalty.notes}
                          </p>
                        )}
                        {penalty.applied_at && (
                          <p className="text-[11px] text-gray-500 mt-1">
                            {verbalDate(penalty.applied_at, true)}
                            {penalty.applied_by?.username
                              ? ` · ${penalty.applied_by.username}`
                              : ""}
                          </p>
                        )}
                      </div>
                      <div className="shrink-0 flex flex-col gap-1 text-right">
                        <button
                          type="button"
                          onClick={() => handleEditPenalty(penalty)}
                          className="text-blue-600 hover:underline text-xs font-medium"
                        >
                          Modifier
                        </button>
                        <button
                          type="button"
                          onClick={() => void handleDeletePenalty(penalty.id)}
                          disabled={penaltySaving}
                          className="text-red-600 hover:underline text-xs font-medium disabled:opacity-50"
                        >
                          Supprimer
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            <div className="border-t border-gray-200 pt-3 space-y-2">
              <p className="text-sm font-semibold text-gray-800">
                {editingPenaltyId != null
                  ? "Modifier la pénalité"
                  : "Ajouter une pénalité"}
              </p>
              <label className="block text-xs font-medium text-gray-700">
                Type
                <select
                  value={penaltyFormTypeId}
                  onChange={(e) =>
                    setPenaltyFormTypeId(
                      e.target.value ? Number(e.target.value) : ""
                    )
                  }
                  className="mt-1 w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm"
                >
                  <option value="">— Choisir —</option>
                  {penaltyTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {translatePenaltyType(t, type.code, type.label)}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-xs font-medium text-gray-700">
                {t("profile.penaltyRoundLabel")}
                <select
                  value={penaltyFormRoundId}
                  onChange={(e) =>
                    setPenaltyFormRoundId(
                      e.target.value ? Number(e.target.value) : ""
                    )
                  }
                  className="mt-1 w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm"
                >
                  <option value="">
                    {t("profile.penaltyRoundBefore")}
                  </option>
                  {tournamentRounds.map((round) => (
                    <option key={round.id} value={round.id}>
                      {t("profile.penaltyRoundN", {
                        number: round.round_number,
                      })}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-xs font-medium text-gray-700">
                Raison
                <input
                  type="text"
                  value={penaltyFormReason}
                  onChange={(e) => setPenaltyFormReason(e.target.value)}
                  className="mt-1 w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm"
                />
              </label>
              <label className="block text-xs font-medium text-gray-700">
                Notes
                <textarea
                  value={penaltyFormNotes}
                  onChange={(e) => setPenaltyFormNotes(e.target.value)}
                  rows={2}
                  className="mt-1 w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm"
                />
              </label>
              <div className="flex justify-end gap-2 pt-1">
                {editingPenaltyId != null && (
                  <button
                    type="button"
                    onClick={resetPenaltyForm}
                    className="px-3 py-1.5 border border-gray-300 rounded-md text-sm hover:bg-gray-100"
                  >
                    Annuler édition
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => void handleSavePenalty()}
                  disabled={penaltySaving || penaltyFormTypeId === ""}
                  className="px-3 py-1.5 bg-amber-600 text-white rounded-md text-sm hover:bg-amber-700 disabled:opacity-50"
                >
                  {penaltySaving
                    ? "Enregistrement…"
                    : editingPenaltyId != null
                      ? "Enregistrer"
                      : "Ajouter"}
                </button>
              </div>
            </div>
          </div>
        )}
      </PopUp>
    </>
  );
};

export default AdminManageTournamentPlayersSection;