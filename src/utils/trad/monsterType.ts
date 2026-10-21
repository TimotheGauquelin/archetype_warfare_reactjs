/** Labels canoniques (EN) stockés en base dans `card.type`. */
export const MONSTER_TYPE_LABELS = [
    "Aqua",
    "Beast",
    "Beast-Warrior",
    "Cyberse",
    "Dinosaur",
    "Divine-Beast",
    "Dragon",
    "Fairy",
    "Fiend",
    "Fish",
    "Illusion",
    "Insect",
    "Machine",
    "Plant",
    "Psychic",
    "Pyro",
    "Reptile",
    "Rock",
    "Sea Serpent",
    "Spellcaster",
    "Thunder",
    "Warrior",
    "Winged Beast",
    "Wyrm",
    "Zombie",
    "Creator-God",
] as const;

export const monsterTypeToFrench = (monsterType: string): string => {
    switch (monsterType.toLowerCase().replace(/_/g, "-")) {
        case "warrior":
            return "Guerrier";
        case "spellcaster":
            return "Magicien";
        case "fairy":
            return "Elfe";
        case "beast-warrior":
            return "Bête-Guerrier";
        case "dragon":
            return "Dragon";
        case "beast":
            return "Bête";
        case "winged beast":
        case "winged-beast":
            return "Bête Ailée";
        case "fiend":
            return "Démon";
        case "cyberse":
            return "Cybers";
        case "dinosaur":
            return "Dinosaure";
        case "divine-beast":
        case "divine beast":
            return "Bête Divine";
        case "machine":
            return "Machine";
        case "plant":
            return "Plante";
        case "psychic":
            return "Psychique";
        case "pyro":
            return "Pyro";
        case "reptile":
            return "Reptile";
        case "rock":
            return "Rocher";
        case "sea-serpent":
        case "sea serpent":
            return "Serpent de Mer";
        case "thunder":
            return "Tonnerre";
        case "wyrm":
            return "Wyrm";
        case "zombie":
            return "Zombie";
        case "fish":
            return "Poisson";
        case "insect":
            return "Insecte";
        case "illusion":
            return "Illusion";
        case "creator-god":
        case "creator god":
            return "Dieu Créateur";
        case "aqua":
            return "Aqua";
        default:
            return monsterType;
    }
};