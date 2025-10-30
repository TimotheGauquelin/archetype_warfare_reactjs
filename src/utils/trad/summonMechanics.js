export const summonMechanicsToFrench = (summonMechanic) => {
    switch (summonMechanic) {
        case "Special Summon":
            return "Invocation Spéciale";
            break;
        case "Tribute Summon":
            return "Invocation Sacrifice";
            break;
        case "Ritual Summon":
            return "Invocation Rituelle";
            break;
        case "Fusion Summon":
            return "Invocation Fusion";
            break;
        case "Synchro Summon":
            return "Invocation Synchro";
            break;
        case "Xyz Summon":
            return "Invocation Xyz";
            break;
        case "Pendulum Summon":
            return "Invocation Pendule";
            break;
        case "Link Summon":
            return "Invocation Lien";
            break;
        default:
            break;
    }
}