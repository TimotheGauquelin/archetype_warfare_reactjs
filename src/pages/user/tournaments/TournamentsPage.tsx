import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import UserBasicLayout from "../layout";
import TournamentList from "../../../components/pages/user/tournaments/TournamentList";
import { getTournaments } from "../../../services/tournament";
import type { Tournament } from "../../../types";

const TournamentsPage: React.FC = () => {
  const { t } = useTranslation();

  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [, setError] = useState<string | null>(null);

  const loadTournaments = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const list = await getTournaments();
      setTournaments(list);
    } catch {
      setError("Impossible de charger les tournois.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTournaments();
  }, [loadTournaments]);



  return (
    <UserBasicLayout
      mainTitle={t("hero.tournaments.title")}
      subTitle={t("hero.tournaments.subtitle")}
    >
      <div className="px-4 py-6 max-w-4xl mx-auto">
        <TournamentList tournaments={tournaments} isLoading={isLoading} />
      </div>
    </UserBasicLayout>
  );
};

export default TournamentsPage;
