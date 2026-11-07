import i18n from "@/i18n";

// 2025-11-04 -> 4 Avril 2025 / April 4, 2025
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
    const locale = i18n.language?.startsWith("en") ? "en-US" : "fr-FR";
    return d.toLocaleString(locale, options);
}