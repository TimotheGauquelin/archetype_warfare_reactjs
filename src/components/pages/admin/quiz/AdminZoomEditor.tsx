import type { MouseEvent } from "react";
import QuizChoiceCardPicker, {
  type ChoiceCard,
  emptyChoiceCard,
} from "./QuizChoiceCardPicker";

export type ZoomFormState = {
  answer: ChoiceCard;
  focusX: number;
  focusY: number;
  phaseDurationSeconds: number;
};

export const emptyZoomForm = (): ZoomFormState => ({
  answer: emptyChoiceCard(),
  focusX: 50,
  focusY: 50,
  phaseDurationSeconds: 15,
});

interface AdminZoomEditorProps {
  value: ZoomFormState;
  onChange: (next: ZoomFormState) => void;
}

const SCALE_PREVIEW = [4.5, 2.2, 1] as const;

const AdminZoomEditor = ({ value, onChange }: AdminZoomEditorProps) => {
  const previewUrl = value.answer.artworkUrl ?? "";

  const setFocusFromClick = (event: MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    onChange({
      ...value,
      focusX: Math.max(0, Math.min(100, Math.round(x))),
      focusY: Math.max(0, Math.min(100, Math.round(y))),
    });
  };

  return (
    <div className="space-y-4">
      <QuizChoiceCardPicker
        label="Carte réponse (autocomplétion)"
        value={value.answer}
        onChange={(answer) => onChange({ ...value, answer })}
      />

      <label className="flex flex-col text-sm font-medium text-gray-800 max-w-xs">
        Durée par phase (secondes)
        <input
          type="number"
          min={5}
          max={30}
          className="mt-1 p-2 rounded font-normal border border-gray-300"
          value={value.phaseDurationSeconds}
          onChange={(e) =>
            onChange({
              ...value,
              phaseDurationSeconds: Math.max(
                5,
                Math.min(30, Math.floor(Number(e.target.value) || 15))
              ),
            })
          }
        />
        <span className="mt-1 text-xs text-gray-600 font-normal">
          Chaque phase dure ce temps. Total joueur = 3 × cette valeur (ex. 15
          s → 45 s). Points : 3 → 2 → 1.
        </span>
      </label>

      <div className="grid grid-cols-2 gap-3 max-w-sm">
        <label className="flex flex-col text-sm font-medium text-gray-800">
          Focus X (%)
          <input
            type="number"
            min={0}
            max={100}
            className="mt-1 p-2 rounded font-normal border border-gray-300"
            value={value.focusX}
            onChange={(e) =>
              onChange({
                ...value,
                focusX: Math.max(0, Math.min(100, Number(e.target.value) || 0)),
              })
            }
          />
        </label>
        <label className="flex flex-col text-sm font-medium text-gray-800">
          Focus Y (%)
          <input
            type="number"
            min={0}
            max={100}
            className="mt-1 p-2 rounded font-normal border border-gray-300"
            value={value.focusY}
            onChange={(e) =>
              onChange({
                ...value,
                focusY: Math.max(0, Math.min(100, Number(e.target.value) || 0)),
              })
            }
          />
        </label>
      </div>

      <p className="text-xs text-gray-600">
        Cliquez sur l&apos;aperçu pour placer le centre du zoom.
      </p>

      {previewUrl ? (
        <div className="space-y-3">
          <div
            role="button"
            tabIndex={0}
            onClick={setFocusFromClick}
            onKeyDown={() => undefined}
            className="relative aspect-square w-64 max-w-full cursor-crosshair overflow-hidden rounded shadow-md bg-slate-800"
          >
            <img
              src={previewUrl}
              alt="Focus zoom"
              className="h-full w-full object-cover block"
              draggable={false}
            />
            <span
              className="pointer-events-none absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-red-500 shadow"
              style={{ left: `${value.focusX}%`, top: `${value.focusY}%` }}
            />
          </div>

          <div className="flex flex-wrap gap-3">
            {SCALE_PREVIEW.map((scale, index) => (
              <div key={scale} className="space-y-1">
                <p className="text-xs font-medium text-gray-700">
                  Phase {index + 1} ({[3, 2, 1][index]} pts)
                </p>
                <div className="aspect-square h-28 w-28 overflow-hidden rounded bg-slate-800 shadow">
                  <img
                    src={previewUrl}
                    alt=""
                    className="h-full w-full object-cover"
                    style={{
                      objectPosition: `${value.focusX}% ${value.focusY}%`,
                      transform: `scale(${scale})`,
                      transformOrigin: `${value.focusX}% ${value.focusY}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-sm text-amber-800 bg-amber-50 rounded p-2">
          Sélectionnez une carte pour régler le focus du zoom.
        </p>
      )}
    </div>
  );
};

export default AdminZoomEditor;
