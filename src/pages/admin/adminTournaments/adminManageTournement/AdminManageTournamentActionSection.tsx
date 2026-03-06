import Button from "@/components/generic/buttons/classicButton/Button";
import ErrorText from "@/components/generic/ErrorText";
import AdminSection from "@/components/pages/admin/AdminSection";
import { TournamentDetail } from "@/services/tournament";

interface AdminManageTournamentActionSectionProps {
    tournament: TournamentDetail | null;
    actionLoading: boolean;
    handleNextRound: () => void;
    handleToggleRegistration: () => void
    handleStart: () => void
    hasEnoughPlayers: boolean;
    canAdvanceRound: boolean;
}

const AdminManageTournamentActionSection = ({ tournament, actionLoading, handleNextRound, handleToggleRegistration , handleStart, hasEnoughPlayers, canAdvanceRound }: AdminManageTournamentActionSectionProps) => {
    const isLastRoundAndNotUntilWinner =
        tournament?.until_winner === false &&
        tournament?.current_round != null &&
        tournament?.max_number_of_rounds != null &&
        tournament.current_round === tournament.max_number_of_rounds;

    const advanceRoundButtonText =
        tournament?.status === "tournament_beginning"
            ? "Lancer la première ronde"
            : isLastRoundAndNotUntilWinner
                ? "Terminer le tournoi"
                : "Passer à la ronde suivante";

    return (
        <AdminSection adminSectionTitle="Actions tournoi">
            <div className="flex flex-wrap gap-2 items-center">
                {(tournament?.status === "registration_open" ||
                    tournament?.status === "registration_closed") && (
                        <Button
                            buttonText={
                                tournament?.status === "registration_open"
                                    ? "Fermer les inscriptions"
                                    : "Ouvrir les inscriptions"
                            }
                            action={handleToggleRegistration}
                            disabled={actionLoading}
                            className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700"
                        />
                    )}
                {tournament?.status === "registration_closed" && (
                    <>
                        <Button
                            buttonText="Démarrer le tournoi"
                            action={handleStart}
                            disabled={actionLoading || !hasEnoughPlayers}
                            className="px-4 py-2 bg-green-600 text-white rounded"
                        />
                        {!hasEnoughPlayers && (
                            <ErrorText errorText="Il faut au moins 2 joueurs pour démarrer le tournoi." errorTextCenter={false} />
                        )}
                    </>
                )}

                {canAdvanceRound && tournament?.status !== "tournament_finished" && (
                    <Button
                        buttonText={advanceRoundButtonText}
                        action={handleNextRound}
                        disabled={actionLoading || !canAdvanceRound}
                        className="px-4 py-2 bg-blue-600 text-white rounded"
                    />
                )}
                {tournament?.status === "tournament_in_progress" && !canAdvanceRound && (
                    <span className="text-sm text-gray-500 self-center">
                        Tous les matchs de la ronde courante doivent être terminés.
                    </span>
                )}
            </div>
        </AdminSection>
    )
}

export default AdminManageTournamentActionSection;