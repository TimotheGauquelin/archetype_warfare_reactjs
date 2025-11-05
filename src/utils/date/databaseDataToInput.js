// 2025-11-04T00:00:00.000Z -> 2025-11-04
export const formatDateForInput = (isoDate) => {
    if (!isoDate) return "";
    const date = new Date(isoDate);
    return date.toISOString().split('T')[0];
};