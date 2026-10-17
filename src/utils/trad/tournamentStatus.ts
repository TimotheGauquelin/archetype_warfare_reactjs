export const TOURNAMENT_STATUS = (status: string): string => {
    switch (status) {
        case 'registration_open':
            return 'Inscriptions ouvertes';
        case 'registration_closed':
            return 'Inscriptions closes';
        case 'tournament_beginning':
        case 'tournament_is_beginning':
            return 'Début du tournoi';
        case 'tournament_in_progress':
            return 'Tournoi en cours';
        case 'tournament_finished':
            return 'Tournoi terminé';
        case 'tournament_cancelled':
            return 'Tournoi annulé';
        case 'tournament_did_not_happen':
            return 'Pas eu lieu';
        default:
            return status;
    }
}

export const TOURNAMENT_MATCH_STATUS = (
    status: string,
    options?: { isBye?: boolean }
) => {
    if (options?.isBye && (status === 'completed' || status === 'pending' || status === 'in_progress')) {
        return 'Terminé (BYE)';
    }
    switch (status) {
        case 'pending':
            return 'En attente';
        case 'in_progress':
            return 'En cours';
        case 'completed':
            return 'Terminé';
    }
}

export const TOURNAMENT_ROUND_STATUS = (status: string) => {
    switch (status) {
        case 'pending':
            return 'En attente';
        case 'in_progress':
            return 'En cours';
        case 'completed':
            return 'Terminé';
    }
}