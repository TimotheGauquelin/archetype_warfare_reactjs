// 2025-11-04 -> 4 Avril 2025
export function verbalDate(value: string | undefined): string {
    if (!value) return "—";
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? value : d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}