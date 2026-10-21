import QuizChoiceCardPicker, {
  type ChoiceCard,
  emptyChoiceCard,
} from "./QuizChoiceCardPicker";

export type SummonerPropositionForm = ChoiceCard & {
  isMaterial: boolean;
};

export const emptySummonerProposition = (): SummonerPropositionForm => ({
  ...emptyChoiceCard(),
  isMaterial: false,
});

export const emptySummonerPropositions = (
  count: number
): SummonerPropositionForm[] =>
  Array.from({ length: Math.max(0, Math.min(10, count)) }, () =>
    emptySummonerProposition()
  );

interface AdminSummonerEditorProps {
  propositionCount: number;
  propositions: SummonerPropositionForm[];
  onChangePropositionCount: (count: number) => void;
  onChangePropositions: (propositions: SummonerPropositionForm[]) => void;
}

const AdminSummonerEditor = ({
  propositionCount,
  propositions,
  onChangePropositionCount,
  onChangePropositions,
}: AdminSummonerEditorProps) => {
  const materialCount = propositions.filter((p) => p.isMaterial).length;

  return (
    <div className="space-y-4">
      <label className="flex flex-col text-sm font-medium text-gray-800 max-w-xs">
        Nombre de propositions
        <input
          type="number"
          min={2}
          max={10}
          className="mt-1 p-2 rounded font-normal border border-gray-300"
          value={propositionCount}
          onChange={(e) =>
            onChangePropositionCount(
              Math.max(2, Math.min(10, Number(e.target.value) || 2))
            )
          }
        />
      </label>

      <p className="text-xs text-gray-600">
        Ajoutez des propositions (cartes via autocomplétion). Cochez celles qui
        sont les matériaux d&apos;invocation. Au moins un matériau. L&apos;ordre
        n&apos;importe pas.
      </p>
      <p className="text-xs font-medium text-violet-800">
        Matériaux cochés : {materialCount} / {propositions.length}
      </p>

      {propositions.map((proposition, index) => (
        <div
          key={`summoner-prop-${index}`}
          className={`flex items-start gap-3 rounded p-3 shadow-sm ${
            proposition.isMaterial
              ? "bg-violet-50 ring-1 ring-violet-300"
              : "bg-white"
          }`}
        >
          <label
            className="mt-3 flex flex-col items-center gap-1 shrink-0 cursor-pointer"
            title="Matériau"
          >
            <input
              type="checkbox"
              className="h-5 w-5 accent-violet-700"
              checked={proposition.isMaterial}
              onChange={(e) => {
                const updated = [...propositions];
                updated[index] = {
                  ...updated[index],
                  isMaterial: e.target.checked,
                };
                onChangePropositions(updated);
              }}
            />
            <span className="text-[10px] font-semibold text-violet-800 uppercase">
              Mat.
            </span>
          </label>
          <span className="mt-3 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-700 text-sm font-bold text-white">
            {index + 1}
          </span>
          <QuizChoiceCardPicker
            label={`Proposition ${index + 1}`}
            value={proposition}
            onChange={(next) => {
              const updated = [...propositions];
              updated[index] = { ...next, isMaterial: proposition.isMaterial };
              onChangePropositions(updated);
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default AdminSummonerEditor;
