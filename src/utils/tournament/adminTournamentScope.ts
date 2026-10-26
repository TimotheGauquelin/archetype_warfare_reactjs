import type { Tournament } from "@/types";

export type AdminTournamentScope = "in-progress" | "upcoming" | "past";

const STATUS_IN_PROGRESS = [
  "tournament_beginning",
  "tournament_is_beginning",
  "tournament_in_progress",
];
const STATUS_FINISHED = [
  "tournament_finished",
  "tournament_cancelled",
  "tournament_did_not_happen",
];
const STATUS_UPCOMING = [
  "not_visible",
  "registration_open",
  "registration_closed",
];

const isEventDatePast = (tournament: Tournament): boolean => {
  const endOrStart = tournament.event_date_end || tournament.event_date;
  if (!endOrStart) return false;
  return new Date(endOrStart).getTime() < Date.now();
};

export const isAdminTournamentScope = (
  value: string | undefined
): value is AdminTournamentScope =>
  value === "in-progress" || value === "upcoming" || value === "past";

const byEventDateDesc = (a: Tournament, b: Tournament): number => {
  const aDate = a.event_date_end || a.event_date || "";
  const bDate = b.event_date_end || b.event_date || "";
  return bDate.localeCompare(aDate);
};

export const partitionAdminTournaments = (
  tournaments: Tournament[]
): {
  inProgress: Tournament[];
  upcoming: Tournament[];
  past: Tournament[];
} => {
  const inProgress = tournaments
    .filter((t) => STATUS_IN_PROGRESS.includes(t.status as string))
    .sort(byEventDateDesc);
  const past = tournaments
    .filter((t) => {
      const status = t.status as string;
      if (STATUS_FINISHED.includes(status)) return true;
      return STATUS_UPCOMING.includes(status) && isEventDatePast(t);
    })
    .sort(byEventDateDesc);
  const upcoming = tournaments
    .filter((t) => {
      const status = t.status as string;
      return STATUS_UPCOMING.includes(status) && !isEventDatePast(t);
    })
    .sort(byEventDateDesc);
  return { inProgress, upcoming, past };
};

export const filterTournamentsByScope = (
  tournaments: Tournament[],
  scope: AdminTournamentScope
): Tournament[] => {
  const { inProgress, upcoming, past } = partitionAdminTournaments(tournaments);
  switch (scope) {
    case "in-progress":
      return inProgress;
    case "upcoming":
      return upcoming;
    case "past":
      return past;
  }
};

export const ADMIN_TOURNAMENT_SCOPE_META: Record<
  AdminTournamentScope,
  {
    title: string;
    catchphrase: string;
    seeAllLabel: string;
    description: string;
    emptyMessage: string;
  }
> = {
  "in-progress": {
    title: "Tournois en cours",
    catchphrase: "Tous les tournois démarrés ou en matchmaking",
    seeAllLabel: "Voir les tournois en cours",
    description: "Tournois démarrés ou en phase de matchmaking.",
    emptyMessage: "Aucun tournoi en cours.",
  },
  upcoming: {
    title: "Tournois à venir",
    catchphrase: "Tous les tournois avant le début de l'événement",
    seeAllLabel: "Voir les tournois à venir",
    description:
      "Inscriptions ouvertes ou fermées, avant le début de l'événement.",
    emptyMessage: "Aucun tournoi à venir.",
  },
  past: {
    title: "Tournois passés",
    catchphrase: "Tous les tournois terminés ou annulés",
    seeAllLabel: "Voir les tournois passés",
    description: "Tournois terminés, annulés ou dont la date est dépassée.",
    emptyMessage: "Aucun tournoi passé.",
  },
};
