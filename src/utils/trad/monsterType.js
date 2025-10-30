export const monsterTypeToFrench = (monsterType) => {
    switch (monsterType.toLowerCase()) {
        case "warrior":
            return "Guerrier";
            break;
        case "spellcaster":
            return "Magicien";
            break;
        case "fairy":
            return "Elfe";
            break;
        case "beast-warrior":
            return "Bête-Guerrier";
            break;
        case "dragon":
            return "Dragon";
            break;
        case "beast":
            return "Bête";
            break;
        case "winged beast":
            return "Bête Ailée";
            break;
        case "fiend":
            return "Démon";
            break;
        case "cyberse":
            return "Cybers";
            break;
        case "dinosaur":
            return "Dinosaure";
            break;
        case "divine-beast":
            return "Bête Divine";
            break;
        case "machine":
            return "Machine";
            break;
        case "plant":
            return "Plante";
            break;
        case "psychic":
            return "Psychique";
            break;
        case "pyro":
            return "Pyro";
            break;
        case "reptile":
            return "Reptile";
            break;
        case "rock":
            return "Rocher";
            break;
        case "sea serpent":
            return "Serpent de Mer";
            break;
        case "thunder":
            return "Tonnerre";
            break;
        case "wyrm":
            return "Wyrm";
            break;
        case "zombie":
            return "Zombie";
            break;
        case "fish":
            return "Poisson";
            break;
        case "insect":
            return "Insecte";
            break;
        case "creator-god":
            return "Dieu Créateur";
            break;
        case "aqua":
            return "Aqua";
            break;
        default:
            return monsterType;
    }
}