import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import UserProfileLayoutTitle from "@/components/generic/UserProfileLayoutTitle";
import UserProfilLayout from "../../layout";
import TournamentCard from "@/components/pages/user/tournaments/TournamentCard";
import type { Tournament, RootState } from "@/types";
import { getMyTournaments } from "@/services/tournament";
import { URL_FRONT_MY_TOURNAMENT_DETAIL } from "@/constant/urlsFront";

const AllMyTournamentsPage: React.FC = () => {
  const { t } = useTranslation();
  const user = useSelector((state: RootState) => state.user);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadMyTournaments = useCallback(async () => {
    if (!user.token) {
      setTournaments([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const list = await getMyTournaments(user.token);
      setTournaments(list);
    } catch (e) {
      setError(t("profile.loadTournamentsError"));
    } finally {
      setIsLoading(false);
    }
  }, [user.token, t]);

  useEffect(() => {
    void loadMyTournaments();
  }, [loadMyTournaments]);

  const { inProgressTournaments, upcomingTournaments, pastTournaments } = useMemo(() => {
    const groups = {
      inProgressTournaments: [] as Tournament[],
      upcomingTournaments: [] as Tournament[],
      pastTournaments: [] as Tournament[],
    };

    tournaments.forEach((tournament) => {
      const status = (tournament.status as string | undefined)?.toLowerCase();

      if (status === "tournament_in_progress" || status === "tournament_beginning") {
        groups.inProgressTournaments.push(tournament);
        return;
      }

      if (status === "tournament_finished") {
        groups.pastTournaments.push(tournament);
        return;
      }

      groups.upcomingTournaments.push(tournament);
    });

    return groups;
  }, [tournaments]);

  return (
    <UserProfilLayout>
      <div className="bg-white rounded-lg shadow-sm p-4 mb-2">
        <UserProfileLayoutTitle title={t("profile.allMyTournaments")} />

        {error && (
          <p className="text-red-600 text-sm mb-3" role="alert">
            {error}
          </p>
        )}

        {isLoading && (
          <p className="text-gray-500 text-sm mb-3">{t("profile.loadingTournaments")}</p>
        )}

        {!isLoading && tournaments.length === 0 && !error && (
          <p className="text-gray-500 text-sm">{t("profile.noTournaments")}</p>
        )}

        {inProgressTournaments.length > 0 && (
          <section className="mt-4">
            <h2 className="text-lg font-semibold mb-2">{t("profile.tournamentInProgress")}</h2>
            <div className="flex flex-col gap-4">
              {inProgressTournaments.map((tournament) => (
                <TournamentCard
                  key={tournament.id}
                  tournament={tournament}
                  to={URL_FRONT_MY_TOURNAMENT_DETAIL(tournament.id)}
                />
              ))}
            </div>
          </section>
        )}

        {upcomingTournaments.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold mb-2">{t("profile.upcomingTournament")}</h2>
            <div className="flex flex-col gap-4">
              {upcomingTournaments.map((tournament) => (
                <TournamentCard
                  key={tournament.id}
                  tournament={tournament}
                  to={URL_FRONT_MY_TOURNAMENT_DETAIL(tournament.id)}
                />
              ))}
            </div>
          </section>
        )}

        {pastTournaments.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold mb-2">{t("profile.pastTournaments")}</h2>
            <div className="flex flex-col gap-4">
              {pastTournaments.map((tournament) => (
                <TournamentCard
                  key={tournament.id}
                  tournament={tournament}
                  to={URL_FRONT_MY_TOURNAMENT_DETAIL(tournament.id)}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </UserProfilLayout>
  );
};

export default AllMyTournamentsPage;
