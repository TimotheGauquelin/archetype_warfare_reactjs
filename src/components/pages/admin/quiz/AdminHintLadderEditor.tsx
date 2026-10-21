import QuizChoiceCardPicker, {
  type ChoiceCard,
  emptyChoiceCard,
} from "./QuizChoiceCardPicker";

export type HintLadderLevel = "hard" | "medium" | "easy" | "newbie";

export type HintLadderFormState = {
  answer: ChoiceCard;
  hints: Record<HintLadderLevel, string>;
};

export const HINT_LADDER_LEVEL_META: Array<{
  level: HintLadderLevel;
  label: string;
  points: number;
}> = [
  { level: "hard", label: "Difficile", points: 3 },
  { level: "medium", label: "Moyen", points: 2 },
  { level: "easy", label: "Facile", points: 1 },
  { level: "newbie", label: "Newbie", points: 0 },
];

export const emptyHintLadderForm = (): HintLadderFormState => ({
  answer: emptyChoiceCard(),
  hints: {
    hard: "",
    medium: "",
    easy: "",
    newbie: "",
  },
});

interface AdminHintLadderEditorProps {
  value: HintLadderFormState;
  onChange: (next: HintLadderFormState) => void;
}

const AdminHintLadderEditor = ({
  value,
  onChange,
}: AdminHintLadderEditorProps) => {
  return (
    <div className="space-y-4">
      <QuizChoiceCardPicker
        label="Carte réponse (autocomplétion)"
        value={value.answer}
        onChange={(answer) => onChange({ ...value, answer })}
      />

      <div className="space-y-3">
        <p className="text-sm font-medium text-gray-800">
          Indices (du plus difficile au plus facile)
        </p>
        {HINT_LADDER_LEVEL_META.map(({ level, label, points }) => (
          <label
            key={level}
            className="flex flex-col text-sm font-medium text-gray-800"
          >
            <span className="flex items-center gap-2">
              {label}
              <span className="text-xs font-normal text-gray-600">
                ({points} pt{points === 1 ? "" : "s"})
              </span>
            </span>
            <textarea
              required
              rows={2}
              className="mt-1 p-2 rounded font-normal border border-gray-300"
              value={value.hints[level]}
              placeholder={`Indice ${label.toLowerCase()}…`}
              onChange={(e) =>
                onChange({
                  ...value,
                  hints: { ...value.hints, [level]: e.target.value },
                })
              }
            />
          </label>
        ))}
      </div>
    </div>
  );
};

export default AdminHintLadderEditor;
