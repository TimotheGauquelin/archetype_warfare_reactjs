export const cardStatusToFrench = (cardStatus) => {
    switch (cardStatus.toLowerCase()) {
        case "forbidden":
            return "Interdit";
            break;
        case "limited":
            return "Limité";
            break;
        case "semi-limited":
            return "Semi-Limité";
            break;
        case "unlimited":
            return "Illimité";
            break;
    }
}