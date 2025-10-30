export const attributeToFrench = (attribute) => {
    switch (attribute.toLowerCase()) {
        case "dark":
            return "Ténèbre";
            break;
        case "light":
            return "Lumière";
            break;
        case "water":   
            return "Eau";
            break;
        case "earth":
            return "Terre";
            break;
        case "wind":
            return "Vent";
            break;
        case "divine":
            return "Divin";
            break;
        case "fire":
            return "Feu";
            break;
        default:
            return attribute;
    }
}