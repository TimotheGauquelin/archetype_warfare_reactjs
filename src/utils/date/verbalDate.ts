// 2025-11-04 -> 4 Avril 2025
// 2025-11-04T12:00:00 -> 4 Avril 2025 12:00
export const verbalDate = (value: string, withHours: boolean = false): string => {
    if (!value) return "—";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return value;
    const options: Intl.DateTimeFormatOptions = {
        day: "numeric",
        month: "long",
        year: "numeric"
    };
    if (withHours) {
        options.hour = "2-digit";
        options.minute = "2-digit";
    }
    return d.toLocaleString("fr-FR", options);
}