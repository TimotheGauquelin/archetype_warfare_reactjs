const performancesLabel = ["ATK", "DEF", "CONSI", "RECOV", "VERSA"];

const emptyFullDeckSchema = [
  {
    label: "Main Deck",
    colorItem: "rgba(254, 183, 77, 0.15)",
    colorText: "#E89E2E",
    cards: [],
  },
  {
    label: "Extra Deck",
    colorItem: "rgba(219, 115, 255, 0.15)",
    colorText: "#DB73FF",
    cards: [],
  },
];

const extraDeckLabels = [
  "Fusion Monster",
  "Pendulum Effect Fusion Monster",
  "Synchro Monster",
  "Synchro Tuner Monster",
  "Synchro Pendulum Effect Monster",
  "XYZ Monster",
  "XYZ Pendulum Effect Monster",
  "Link Monster",
];

export { performancesLabel, emptyFullDeckSchema, extraDeckLabels };
