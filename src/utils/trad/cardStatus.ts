export const cardStatusToFrench = (cardStatus: string): string => {
    switch (cardStatus.toLowerCase()) {
        case "forbidden":
            return "Interdit";
        case "limited":
            return "Limité";
        case "semi-limited":
            return "Semi-Limité";
        case "unlimited":
            return "Illimité";
        default:
            return cardStatus;
    }
}