import QuizChoiceCardPicker, {
  type ChoiceCard,
  emptyChoiceCard,
} from "./QuizChoiceCardPicker";

export type NameTheCardsAnswerForm = ChoiceCard;
export type NameTheCardsScoringMode = "per_card" | "all_or_nothing";

export const emptyNameTheCardsAnswers = (count: number): NameTheCardsAnswerForm[] =>
  Array.from({ length: Math.max(1, Math.min(10, count)) }, () => emptyChoiceCard());

interface AdminNameTheCardsEditorProps {
  monsterCount: number;
  scoringMode: NameTheCardsScoringMode;
  answers: NameTheCardsAnswerForm[];
  onChangeMonsterCount: (count: number) => void;
  onChangeScoringMode: (mode: NameTheCardsScoringMode) => void;
  onChangeAnswers: (answers: NameTheCardsAnswerForm[]) => void;
}

const AdminNameTheCardsEditor = ({
  monsterCount,
  scoringMode,
  answers,
  onChangeMonsterCount,
  onChangeScoringMode,
  onChangeAnswers,
}: AdminNameTheCardsEditorProps) => {
  const setMonsterCount = (raw: number) => {
    const next = Math.max(1, Math.min(10, raw || 1));
    onChangeMonsterCount(next);
  };

  return (
    <div className="space-y-4">
      <label className="flex flex-col text-sm font-medium text-gray-800 max-w-xs">
        Nombre de monstres sur l&apos;image
        <input
          type="number"
          min={1}
          max={10}
          className="mt-1 p-2 rounded font-normal border border-gray-300"
          value={monsterCount}
          onChange={(e) => setMonsterCount(Number(e.target.value))}
        />
      </label>

      <fieldset className="space-y-2">
        <legend className="text-sm font-medium text-gray-800">
          Mode de scoring
        </legend>
        <label className="flex items-start gap-2 text-sm text-gray-800 cursor-pointer">
          <input
            type="radio"
            name="name-the-cards-scoring"
            className="mt-1"
            checked={scoringMode === "per_card"}
            onChange={() => onChangeScoringMode("per_card")}
          />
          <span>
            <span className="font-medium">1 point par carte</span>
            <span className="block text-xs text-gray-600 font-normal">
              Max = nombre de monstres ({monsterCount} pt
              {monsterCount > 1 ? "s" : ""}). Les réponses partielles
              rapportent des points.
            </span>
          </span>
        </label>
        <label className="flex items-start gap-2 text-sm text-gray-800 cursor-pointer">
          <input
            type="radio"
            name="name-the-cards-scoring"
            className="mt-1"
            checked={scoringMode === "all_or_nothing"}
            onChange={() => onChangeScoringMode("all_or_nothing")}
          />
          <span>
            <span className="font-medium">1 point si tout est trouvé</span>
            <span className="block text-xs text-gray-600 font-normal">
              Aucun point si une seule carte est incorrecte ou manquante.
            </span>
          </span>
        </label>
      </fieldset>

      <p className="text-xs text-gray-600">
        L&apos;ordre des réponses doit correspondre aux numéros 1, 2, 3… sur
        l&apos;image. Chaque réponse est une carte (artwork cropped + nom).
      </p>

      {answers.map((answer, index) => (
        <div
          key={`name-card-${index}`}
          className="flex items-start gap-3 bg-white rounded p-3 shadow-sm"
        >
          <span className="mt-3 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-700 text-sm font-bold text-white">
            {index + 1}
          </span>
          <QuizChoiceCardPicker
            label={`Monstre ${index + 1}`}
            value={answer}
            onChange={(next) => {
              const updated = [...answers];
              updated[index] = next;
              onChangeAnswers(updated);
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default AdminNameTheCardsEditor;
