export const summonMechanicsToFrench = (summonMechanic: string): string => {
    switch (summonMechanic) {
        case "Special Summon":
            return "Invocation Spéciale";
        case "Tribute Summon":
            return "Invocation Sacrifice";
        case "Ritual Summon":
            return "Invocation Rituelle";
        case "Fusion Summon":
            return "Invocation Fusion";
        case "Synchro Summon":
            return "Invocation Synchro";
        case "Xyz Summon":
            return "Invocation Xyz";
        case "Pendulum Summon":
            return "Invocation Pendule";
        case "Link Summon":
            return "Invocation Lien";
        default:
            return summonMechanic;
    }
}