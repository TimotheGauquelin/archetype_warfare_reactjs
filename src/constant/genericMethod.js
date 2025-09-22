const switchEngToFrenchType = (type) => {
  var newType;
  switch (type) {
    case "Aqua":
      newType = "Aqua";
      break;
    case "Beast":
      newType = "Bête";
      break;
    case "Beast-Warrior":
      newType = "Bête-Guerrier";
      break;
    case "Creator-God":
      newType = "Dieu Créateur";
      break;
    case "Cyberse":
      newType = "Cybers";
      break;
    case "Dinosaur":
      newType = "Dinosaure";
      break;
    case "Divine-Beast":
      newType = "Bête Divine";
      break;
    case "Dragon":
      newType = "Dragon";
      break;
    case "Fairy":
      newType = "Elfe";
      break;
    case "Fiend":
      newType = "Démon";
      break;
    case "Fish":
      newType = "Poisson";
      break;
    case "Insect":
      newType = "Insecte";
      break;
    case "Machine":
      newType = "Machine";
      break;
    case "Plant":
      newType = "Plante";
      break;
    case "Psychic":
      newType = "Psychique";
      break;
    case "Pyro":
      newType = "Pyro";
      break;
    case "Reptile":
      newType = "Reptile";
      break;
    case "Rock":
      newType = "Rocher";
      break;
    case "Sea Serpent":
      newType = "Serpent de Mer";
      break;
    case "Spellcaster":
      newType = "Magicien";
      break;
    case "Thunder":
      newType = "Tonnerre";
      break;
    case "Warrior":
      newType = "Guerrier";
      break;
    case "Winged Beast":
      newType = "Bête Ailée";
      break;
    case "Wyrm":
      newType = "Wyrm";
      break;
    case "Zombie":
      newType = "Zombie";
      break;
    default:
      newType = null;
  }

  return newType;
};

const switchEngToFrenchAttribute = (attribute) => {
  var newAttribute;
  switch (attribute) {
    case "DARK":
      newAttribute = "Ténèbre";
      break;
    case "LIGHT":
      newAttribute = "Lumière";
      break;
    case "FIRE":
      newAttribute = "Feu";
      break;
    case "WATER":
      newAttribute = "Eau";
      break;
    case "EARTH":
      newAttribute = "Terre";
      break;
    case "WIND":
      newAttribute = "Vent";
      break;
    case "DIVINE":
      newAttribute = "Divin";
      break;
    default:
      newAttribute = null;
  }

  return newAttribute;
};

const sortingCardsFromCardTypeLabelAndLevelAndName = (cardTypes, a, b) => {
  return (
    cardTypes.indexOf(a.cardType.label) - cardTypes.indexOf(b.cardType.label) ||
    a.level - b.level ||
    a.name - b.name
  );
};

const convertJavaDateIntoJS = (javaDate) => {
  var newDate = new Date(javaDate);
  return `${newDate.toLocaleDateString("fr-FR")} - ${newDate.toLocaleTimeString(
    [],
    { hour: "2-digit", minute: "2-digit" }
  )}`;
};

export {
  switchEngToFrenchType,
  switchEngToFrenchAttribute,
  sortingCardsFromCardTypeLabelAndLevelAndName,
  convertJavaDateIntoJS,
};
