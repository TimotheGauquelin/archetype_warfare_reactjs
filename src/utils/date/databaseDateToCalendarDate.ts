// 2025-11-04T00:00:00.000Z -> 04/11/2025
export const databaseDateToCalendarDate = (dateString: string | undefined | null): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
}