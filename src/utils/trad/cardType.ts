export const cardTypeToFrench = (cardType: string): string => {
    switch (cardType.toLowerCase()) {
        case "normal monster":
            return "Monstre Normal";
            break;
        case "normal tuner monster":
            return "Monstre Normal Syntoniseur";
            break;
        case "effect monster":
            return "Monstre à Effet";
            break;
        case "tuner monster":
            return "Monstre Syntoniseur";
            break;
        case "pendulum tuner effect monster":
            return "Monstre Pendule Syntoniseur à Effet";
            break;
        case "flip effect monster":
            return "Monstre à Effet Flip";
            break;
        case "spirit monster":
            return "Monstre Spirit";
            break;
        case "union effect monster":
            return "Monstre Union";
            break;
        case "gemini monster":
            return "Monstre Gemeau";
            break;
        case "toon monster":
            return "Monstre Toon";
            break;
        case "ritual monster":
            return "Monstre Rituel";
            break;
        case "ritual effect monster":
            return "Monstre Rituel à Effet";
            break;
        case "pendulum effect ritual monster":
            return "Monstre Rituel Pendule à Effet";
            break;
        case "pendulum normal monster":
            return "Monstre Pendule Normal";
            break;
        case "pendulum effect monster":
            return "Monstre Pendule à Effet";
            break;
        case "pendulum flip monster":
            return "Monstre Pendule Flip";
            break;
        case "pendulum flip effect monster":
            return "Monstre Pendule Flip à Effet";
            break;
        case "fusion monster":
            return "Monstre Fusion";
            break;
        case "pendulum effect fusion monster":
            return "Monstre Fusion Pendule à Effet";
            break;
        case "xyz monster":
            return "Monstre XYZ";
            break;
        case "xyz pendulum effect monster":
            return "Monstre XYZ Pendule à Effet";
            break;
        case "link monster":
            return "Monstre Lien";
            break;
        case "synchro monster":
            return "Monstre Synchro";
            break;
        case "synchro tuner monster":
            return "Monstre Synchro Syntoniseur";
            break;
        case "synchro pendulum effect monster":
            return "Monstre Synchro Pendule à Effet";
            break;
        case "normal spell":
            return "Magie Normal";
            break;
        case "field spell":
            return "Magie de Terrain";
            break;
        case "equip spell":
            return "Magie d'Equipement";
            break;
        case "continuous spell":
            return "Magie Continue";
            break;
        case "quick-play spell":
            return "Magie Jeu Rapide";
            break;
        case "ritual spell":
            return "Magie Rituelle";
            break;
        case "normal trap":
            return "Piège Normal";
            break;
        case "continuous trap":
            return "Piège Continue";
            break;
        case "counter trap":
            return "Contre-Piège";
            break;
        default:
            return cardType;
    }
}