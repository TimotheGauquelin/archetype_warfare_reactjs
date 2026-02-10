import React, { useMemo } from "react";
import type { Tournament } from "../../../../types";
import TournamentCard from "./TournamentCard";
import NoItemMessage from "../../../generic/NoItemMessage";
import TournamentListSkeleton from "@/components/skeletons/TournamentListSkeleton";
import SubtitleDivider from "@/components/generic/SubtitleDivider";

interface TournamentListProps {
  tournaments: Tournament[];
  isLoading?: boolean;
}

const TournamentList: React.FC<TournamentListProps> = ({ tournaments, isLoading }) => {

  const {
    inProgress,
    in7Days,
    inMonth,
    finished,
    cancelled,
  } = useMemo(() => {
    const now = new Date();
    const nowTime = now.getTime();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const dayMs = 24 * 60 * 60 * 1000;

    const groups = {
      inProgress: [] as Tournament[],
      in7Days: [] as Tournament[],
      inMonth: [] as Tournament[],
      finished: [] as Tournament[],
      cancelled: [] as Tournament[],
    };

    const push = (key: keyof typeof groups, t: Tournament) => {
      groups[key].push(t);
    };

    tournaments.forEach((tournament) => {
      const status = (tournament.status as string | undefined)?.toLowerCase();

      // Tournois annulés :
      // - statut "tournament_cancelled"
      // - event_date dans les 7 derniers jours
      if (status === "tournament_cancelled" && tournament.event_date) {
        const start = new Date(tournament.event_date).getTime();
        const diffDaysPast = (nowTime - start) / dayMs;
        if (diffDaysPast >= 0 && diffDaysPast <= 7) {
          push("cancelled", tournament);
        }
        return;
      }

      if (tournament.event_date) {
        const start = new Date(tournament.event_date).getTime();
        const end = tournament.event_date_end
          ? new Date(tournament.event_date_end).getTime()
          : start;

        // Tournoi fini (dates uniquement)
        if (end < nowTime) {
          push("finished", tournament);
          return;
        }

        // Tournoi en cours (entre début et fin)
        if (start <= nowTime && end >= nowTime) {
          push("inProgress", tournament);
          return;
        }

        // Tournoi à venir : classification uniquement à partir de la date de début
        const diffDays = (start - today) / dayMs;

        if (diffDays >= 0 && diffDays < 7) {
          push("in7Days", tournament);
          return;
        }

        if (diffDays >= 7 && diffDays < 30) {
          push("inMonth", tournament);
          return;
        }

        // Au-delà de 30 jours : on le considère aussi comme "dans le mois" / futur
        push("inMonth", tournament);
        return;
      }

      // Pas de date : on le place par défaut dans "dans le mois"
      push("inMonth", tournament);
    });

    const sortByDate = (items: Tournament[]) =>
      [...items].sort((a, b) => {
        const dateA = a.event_date ? new Date(a.event_date).getTime() : Number.POSITIVE_INFINITY;
        const dateB = b.event_date ? new Date(b.event_date).getTime() : Number.POSITIVE_INFINITY;
        if (dateA !== dateB) return dateA - dateB;
        return (a.id ?? 0) - (b.id ?? 0);
      });

    return {
      inProgress: sortByDate(groups.inProgress),
      in7Days: sortByDate(groups.in7Days),
      inMonth: sortByDate(groups.inMonth),
      finished: sortByDate(groups.finished),
      cancelled: sortByDate(groups.cancelled),
    };
  }, [tournaments]);

  if (isLoading) {
    return <TournamentListSkeleton />;
  }

  if (!tournaments.length) {
    return (
      <NoItemMessage
        message="Aucun tournoi pour le moment."
        textPosition="center"
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {inProgress.length > 0 && (
        <section>
          <SubtitleDivider label={`En cours (${inProgress.length})`} displayDivider />
          <ul className="list-none p-0 m-0 flex flex-col gap-3">
            {inProgress.map((tournament) => (
              <li key={tournament.id}>
                <TournamentCard tournament={tournament} />
              </li>
            ))}
          </ul>
        </section>
      )}

      {in7Days.length > 0 && (
        <section>
          <SubtitleDivider label={`Dans les 7 prochains jours (${in7Days.length})`} displayDivider />
          <ul className="list-none p-0 m-0 flex flex-col gap-3">
            {in7Days.map((tournament) => (
              <li key={tournament.id}>
                <TournamentCard tournament={tournament} />
              </li>
            ))}
          </ul>
        </section>
      )}

      {inMonth.length > 0 && (
        <section>
          <SubtitleDivider label={`Dans le mois (${inMonth.length})`} displayDivider />
          <ul className="list-none p-0 m-0 flex flex-col gap-3">
            {inMonth.map((tournament) => (
              <li key={tournament.id}>
                <TournamentCard tournament={tournament} />
              </li>
            ))}
          </ul>
        </section>
      )}

      {finished.length > 0 && (
        <section>
          <SubtitleDivider label={`Tournois finis (${finished.length})`} displayDivider />
          <ul className="list-none p-0 m-0 flex flex-col gap-3">
            {finished.map((tournament) => (
              <li key={tournament.id}>
                <TournamentCard tournament={tournament} />
              </li>
            ))}
          </ul>
        </section>
      )}

      {cancelled.length > 0 && (
        <section>
          <SubtitleDivider label={`Tournois annulés (${cancelled.length})`} displayDivider />
          <ul className="list-none p-0 m-0 flex flex-col gap-3">
            {cancelled.map((tournament) => (
              <li key={tournament.id}>
                <TournamentCard tournament={tournament} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
};

export default TournamentList;

