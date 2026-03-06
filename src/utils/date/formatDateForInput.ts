// 2025-11-04T00:00:00.000Z -> 2025-11-04
export const formatDateForInput = (isoDate: string | undefined | null, withHours: boolean = false): string => {
    if (!isoDate) return "";
    const date = new Date(isoDate);
    if (withHours) {
        return date.toISOString().split('T')[1];
    }
    return date.toISOString().split('T')[0];
};

export const formatDateForInputWithHours = (isoDate: string | undefined | null): string => {
    if (!isoDate) return "";
    const date = new Date(isoDate);
    const pad = (n: number) => (n < 10 ? "0" + n : String(n));
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};
  