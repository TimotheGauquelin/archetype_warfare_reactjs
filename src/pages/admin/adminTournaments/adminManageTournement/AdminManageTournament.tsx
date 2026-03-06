import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import AdminBodyHeader from "@/components/pages/admin/AdminBodyHeader";
import AdminLayout from "../../adminLayout";
import Button from "@/components/generic/buttons/classicButton/Button";
import {
    addPlayerToTournament,
    getTournamentById,
    getTournamentDetail,
    getTournamentStandings,
    startTournament,
    tournamentNextRound,
    updateTournament,
    setTournamentPlayerBanned,
    removePlayerFromTournament,
    type TournamentDetail,
    type TournamentStanding,
    type TournamentPlayerAdmin,
    toggleTournamentRegistration,
} from "@/services/tournament";
import { searchUsers } from "@/services/user";
import type { User } from "@/types";
import type { PaginatedResponse } from "@/types";
import type { RootState } from "@/redux/store";
import { TOURNAMENT_STATUS } from "@/utils/trad/tournamentStatus";
import ErrorText from "@/components/generic/ErrorText";
import AdminSection from "@/components/pages/admin/AdminSection";
import AdminTournamentMatchmaking from "@/components/pages/admin/archetype/adminTournaments/AdminTournamentMatchmaking";
import { TournamentDetailsStanding } from "@/components/pages/user/tournaments/TournamentDetailsStanding";
import AdminManageTournamentActionSection from "./AdminManageTournamentActionSection";
import AdminManageTournamentPlayersSection from "./AdminManageTournamentPlayersSection";

const AdminManageTournament = () => {
    const { tournamentId } = useParams<{ tournamentId: string }>();
    const { token } = useSelector((state: RootState) => state.user);
    const [tournament, setTournament] = useState<TournamentDetail | null>(null);
    const [standings, setStandings] = useState<TournamentStanding[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [removePlayer, setRemovePlayer] = useState<TournamentPlayerAdmin | null>(null);

    const [addPlayerUsername, setAddPlayerUsername] = useState("");
    const [addPlayerResults, setAddPlayerResults] = useState<PaginatedResponse<User> | null>(null);
    const [addingUserId, setAddingUserId] = useState<number | null>(null);

    const loadData = useCallback(async () => {
        if (!tournamentId) return;
        setLoading(true);
        setError(null);
        try {
            const [tournament, standings] = await Promise.all([
                getTournamentDetail(tournamentId),
                getTournamentStandings(tournamentId).catch(() => []),
            ]);
            setTournament(tournament);
            setStandings(standings);
        } catch (e) {
            setError("Impossible de charger le tournoi.");
            console.error(e);
        } finally {
            setLoading(false);
        }
    }, [tournamentId]);

    useEffect(() => {
        void loadData();
    }, [loadData]);

    const handleStart = useCallback(async () => {
        if (!token || !tournamentId) return;
        setActionLoading(true);
        try {
            await startTournament(tournamentId, token);
            await loadData();
        } finally {
            setActionLoading(false);
        }
    }, [token, tournamentId, loadData]);

    const handleNextRound = useCallback(async () => {
        if (!token || !tournamentId) return;
        setActionLoading(true);
        try {
            await tournamentNextRound(tournamentId, token);
            await loadData();
        } finally {
            setActionLoading(false);
        }
    }, [token, tournamentId, loadData]);

    const handleToggleRegistration = useCallback(async () => {
        try {
            if (!token || !tournamentId) return;
            await toggleTournamentRegistration(Number(tournamentId), token);
            await loadData();
        } finally {
            setActionLoading(false);
        }
    }, [token, tournamentId, tournament, loadData]);

    const handleRemovePlayer = useCallback(
        async (playerId: number | string) => {
            if (!token || !tournamentId) return;
            try {
                await removePlayerFromTournament(tournamentId, playerId, token);
                await loadData();
            } catch {
                // toast already in service
            }
        },
        [token, tournamentId, loadData]
    );

    const handleAddPlayer = useCallback(
        async (user: User) => {
            if (!token || !tournamentId || user.id == null) return;
            setAddingUserId(Number(user.id));
            try {
                await addPlayerToTournament(tournamentId, user.id, token);
                await loadData();
                setAddPlayerResults(null);
                setAddPlayerUsername("");
            } catch {
                // toast in service
            } finally {
                setAddingUserId(null);
            }
        },
        [token, tournamentId, loadData]
    );

    const canStart =
        (tournament && (tournament.status === "registration_closed" || tournament.status === "registration_open")) ?? false;
    const currentRound = tournament && tournament.rounds?.find(
        (r) => r.round_number === tournament?.current_round
    );
    const allMatchesCompleted =
        currentRound?.matches?.every((m) => m.status === "completed") ?? false;
    /** En "tournament_is_beginning" il n’y a pas encore de matchmaking → on peut cliquer directement. */
    const isBeginningNoMatches = tournament && tournament.status === "tournament_beginning";
    const canAdvanceRound = isBeginningNoMatches || allMatchesCompleted;
    const players = tournament && tournament.players ? tournament.players : [];
    const maxPlayers = tournament && tournament.max_players ? tournament.max_players : 0;
    const overCapacity =
        maxPlayers > 0 && players.length > maxPlayers;
    const inscribedUserIds = new Set(
        players.map((p) => String(p.user_id ?? p.user?.id ?? "")).filter(Boolean)
    );
    const hasEnoughPlayers = players.length >= 2;

    const setSearchResults = useCallback((value: PaginatedResponse<User> | ((prev: PaginatedResponse<User>) => PaginatedResponse<User>)) => {
        if (typeof value === "function") {
            setAddPlayerResults((prev) => value(prev ?? { data: [], pagination: { total: 0, totalPages: 1, currentPage: 1, pageSize: 10 } }));
        } else {
            setAddPlayerResults(value ?? null);
        }
    }, []);

    useEffect(() => {
        if (!addPlayerUsername.trim()) {
            setAddPlayerResults(null);
            return;
        }
        const t = setTimeout(() => {
            searchUsers(
                10,
                { currentPage: 1, totalPages: 1, total: 0, pageSize: 10 },
                { username: addPlayerUsername.trim() },
                setSearchResults
            );
        }, 300);
        return () => clearTimeout(t);
    }, [addPlayerUsername, setSearchResults]);

    return (
        <AdminLayout>
            <AdminBodyHeader
                label={`Gérer : ${tournament?.name ?? ""}`}
                catchphrase={TOURNAMENT_STATUS(tournament?.status ?? "")}
                returnButton
            />

            {overCapacity && (
                <ErrorText
                    errorText={`Le nombre de joueurs inscrits (${players.length})
        dépasse la capacité maximale du tournoi (${maxPlayers})`}
                    errorTextCenter={false}
                />
            )}

            {loading && (
                <p className="text-gray-600 text-sm">Chargement…</p>
            )}

            {tournament && !loading && (
                <div className="p-3 bg-gray-100 rounded-md text-sm text-gray-700 space-y-1 mb-4">
                    <p>
                        <span className="font-semibold">Ronde actuelle :</span>{" "}
                        {tournament.current_round} / {tournament.max_number_of_rounds}
                    </p>
                    <p className="font-semibold">Fin du tournoi :</p>
                    <ul className="list-disc list-inside ml-2 space-y-0.5">
                        <li>Au bout de {tournament.max_number_of_rounds} ronde(s)</li>
                        {tournament.until_winner && (
                            <li>Lorsqu&apos;il y a un vainqueur</li>
                        )}
                    </ul>
                </div>
            )}

            <AdminManageTournamentActionSection
                tournament={tournament}
                actionLoading={actionLoading}
                handleNextRound={handleNextRound}
                handleToggleRegistration={handleToggleRegistration}
                handleStart={handleStart}
                hasEnoughPlayers={hasEnoughPlayers}
                canAdvanceRound={canAdvanceRound}
            />

            <AdminManageTournamentPlayersSection
                tournament={tournament}
                players={players}
                addPlayerUsername={addPlayerUsername}
                setAddPlayerUsername={setAddPlayerUsername}
                addPlayerResults={addPlayerResults}
                inscribedUserIds={inscribedUserIds}
                addingUserId={addingUserId}
                handleAddPlayer={handleAddPlayer}
                handleRemovePlayer={handleRemovePlayer}
                setRemovePlayer={setRemovePlayer}
                token={token ?? null}
                onDeckAssigned={loadData}
            />

            
            <AdminSection adminSectionTitle="Matchmaking">
                {tournament && token && (
                    <AdminTournamentMatchmaking
                        tournamentId={tournament.id}
                        rounds={tournament.rounds ?? []}
                        standings={standings}
                        token={token}
                        onMatchUpdated={loadData}
                        matchesPerRound={tournament.matches_per_round}
                    />
                )}
            </AdminSection>

            <AdminSection adminSectionTitle="Classement">
                {standings && standings.length > 0 ? (
                    <TournamentDetailsStanding standings={standings} />
                ) : (
                    <p className="text-gray-600 text-sm">
                        Aucun classement disponible pour ce tournoi pour le moment.
                    </p>
                )}
            </AdminSection>

        </AdminLayout>
    );
};

export default AdminManageTournament;
