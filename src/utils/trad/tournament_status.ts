export const TOURNAMENT_STATUS = (status: string): string => {
    switch (status) {
        case 'registration_open':
            return 'Inscriptions ouvertes';
        case 'registration_closed':
            return 'Inscriptions closes';
        case 'tournament_beginning':
            return 'Début du tournoi';
        case 'tournament_in_progress':
            return 'Tournoi en cours';
        case 'tournament_finished':
            return 'Tournoi terminé';
        case 'tournament_cancelled':
            return 'Tournoi annulé';
        default:
            return status;
    }
}