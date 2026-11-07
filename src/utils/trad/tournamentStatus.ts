import i18n from "@/i18n";

export const TOURNAMENT_STATUS = (status: string): string => {
    switch (status) {
        case "not_visible":
            return i18n.t("tournamentStatus.not_visible");
        case "registration_open":
            return i18n.t("tournamentStatus.registration_open");
        case "registration_closed":
            return i18n.t("tournamentStatus.registration_closed");
        case "tournament_beginning":
        case "tournament_is_beginning":
            return i18n.t("tournamentStatus.tournament_beginning");
        case "tournament_in_progress":
            return i18n.t("tournamentStatus.tournament_in_progress");
        case "tournament_finished":
            return i18n.t("tournamentStatus.tournament_finished");
        case "tournament_cancelled":
            return i18n.t("tournamentStatus.tournament_cancelled");
        case "tournament_did_not_happen":
            return i18n.t("tournamentStatus.tournament_did_not_happen");
        default:
            return status;
    }
};

export const TOURNAMENT_MATCH_STATUS = (
    status: string,
    options?: { isBye?: boolean }
) => {
    if (
        options?.isBye &&
        (status === "completed" || status === "pending" || status === "in_progress")
    ) {
        return i18n.t("tournamentStatus.match_completed_bye");
    }
    switch (status) {
        case "pending":
            return i18n.t("tournamentStatus.match_pending");
        case "in_progress":
            return i18n.t("tournamentStatus.match_in_progress");
        case "completed":
            return i18n.t("tournamentStatus.match_completed");
        default:
            return status;
    }
};

export const TOURNAMENT_ROUND_STATUS = (status: string) => {
    switch (status) {
        case "pending":
            return i18n.t("tournamentStatus.round_pending");
        case "in_progress":
            return i18n.t("tournamentStatus.round_in_progress");
        case "completed":
            return i18n.t("tournamentStatus.round_completed");
        default:
            return status;
    }
};
