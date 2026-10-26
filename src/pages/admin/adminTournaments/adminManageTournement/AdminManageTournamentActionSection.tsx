import Button from "@/components/generic/buttons/classicButton/Button";
import ErrorText from "@/components/generic/ErrorText";
import { TournamentDetail } from "@/services/tournament";
import { FaArrowRight, FaLock, FaPlay, FaUnlock } from "react-icons/fa";

interface AdminManageTournamentActionSectionProps {
  tournament: TournamentDetail | null;
  actionLoading: boolean;
  handleNextRound: () => void;
  handleToggleRegistration: () => void;
  handleStart: () => void;
  hasEnoughPlayers: boolean;
  canAdvanceRound: boolean;
}

const AdminManageTournamentActionSection = ({
  tournament,
  actionLoading,
  handleNextRound,
  handleToggleRegistration,
  handleStart,
  hasEnoughPlayers,
  canAdvanceRound,
}: AdminManageTournamentActionSectionProps) => {
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
    <section className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm space-y-3 mb-6">
      <h2 className="text-xl font-semibold text-gray-900">Actions tournoi</h2>
      <div className="flex flex-wrap gap-2 items-center">
        {(tournament?.status === "registration_open" ||
          tournament?.status === "registration_closed") && (
          <Button
            icon={tournament?.status === "registration_open" ? <FaLock /> : <FaUnlock />}
            buttonText={
              tournament?.status === "registration_open"
                ? "Fermer les inscriptions"
                : "Ouvrir les inscriptions"
            }
            action={handleToggleRegistration}
            disabled={actionLoading}
            className="flex items-center px-4 py-2 bg-orange-100 hover:bg-orange-200 text-orange-500 rounded p-1 font-semibold"
          />
        )}
        {tournament?.status === "registration_closed" && (
          <>
            <Button
              icon={<FaPlay />}
              buttonText="Démarrer le tournoi"
              action={handleStart}
              disabled={actionLoading || !hasEnoughPlayers}
              className="flex items-center px-4 py-2 bg-green-200 hover:bg-green-300 text-green-500 rounded p-1 font-semibold"
            />
            {!hasEnoughPlayers && (
              <ErrorText
                errorText="Il faut au moins 2 joueurs pour démarrer le tournoi."
                errorTextCenter={false}
              />
            )}
          </>
        )}

        {canAdvanceRound && tournament?.status !== "tournament_finished" && (
          <Button
            icon={<FaArrowRight />}
            buttonText={advanceRoundButtonText}
            action={handleNextRound}
            disabled={actionLoading || !canAdvanceRound}
            className="flex items-center px-4 py-2 bg-blue-200 hover:bg-blue-300 text-blue-500 rounded p-1 font-semibold"
          />
        )}
        {tournament?.status === "tournament_in_progress" && !canAdvanceRound && (
          <span className="text-sm text-gray-500 self-center">
            Tous les matchs de la ronde courante doivent être terminés.
          </span>
        )}
      </div>
    </section>
  );
};

export default AdminManageTournamentActionSection;
