/**
 * Check if the current date is within the deadline window for a tournament.
 * @param eventDate - The date of the tournament.
 * @param deadlineHours - The number of hours before the tournament start that the deadline window ends.
 * @returns True if the current date is within the deadline window, false otherwise.
 */
export function deadlineWindow(eventDate: string | undefined, deadlineHours: number = 48): boolean {
    if (!eventDate) return true;
    const start = new Date(eventDate).getTime();
    const deadline = start - deadlineHours * 60 * 60 * 1000;
    return Date.now() < deadline;
}