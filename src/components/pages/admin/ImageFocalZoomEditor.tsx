import type { MouseEvent } from "react";

interface ImageFocalZoomEditorProps {
  imageUrl: string;
  focalX: number;
  focalY: number;
  zoom: number;
  onFocalChange: (focalX: number, focalY: number) => void;
  onZoomChange: (zoom: number) => void;
  /** Style du bandeau d’aperçu final. */
  previewTone?: "amber" | "white";
  previewHint?: string;
}

/**
 * Éditeur point focal + zoom : carte entière cliquable (comme AdminZoomEditor),
 * zoom appliqué uniquement sur l’aperçu de rendu.
 */
const ImageFocalZoomEditor = ({
  imageUrl,
  focalX,
  focalY,
  zoom,
  onFocalChange,
  onZoomChange,
  previewTone = "amber",
  previewHint = "Aperçu highlight (droite)",
}: ImageFocalZoomEditorProps) => {
  const setFocusFromClick = (event: MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    onFocalChange(
      Math.max(0, Math.min(100, Math.round(x))),
      Math.max(0, Math.min(100, Math.round(y)))
    );
  };

  const previewFrom =
    previewTone === "amber"
      ? "from-amber-50 via-amber-50/70"
      : "from-white via-white/70";
  const previewBg = previewTone === "amber" ? "bg-amber-50" : "bg-white";

  return (
    <div className="space-y-3">
      <p className="text-xs text-gray-600">
        Cliquez sur la carte pour placer le point focal, puis réglez le zoom.
      </p>

      <div className="grid grid-cols-2 gap-3 max-w-sm">
        <label className="flex flex-col text-sm font-medium text-gray-800">
          Focus X (%)
          <input
            type="number"
            min={0}
            max={100}
            className="mt-1 p-2 rounded font-normal border border-gray-300"
            value={focalX}
            onChange={(e) =>
              onFocalChange(
                Math.max(0, Math.min(100, Number(e.target.value) || 0)),
                focalY
              )
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
            value={focalY}
            onChange={(e) =>
              onFocalChange(
                focalX,
                Math.max(0, Math.min(100, Number(e.target.value) || 0))
              )
            }
          />
        </label>
      </div>

      <div
        role="button"
        tabIndex={0}
        onClick={setFocusFromClick}
        onKeyDown={() => undefined}
        className="relative aspect-[421/614] w-64 max-w-full cursor-crosshair overflow-hidden rounded shadow-md bg-slate-800"
      >
        <img
          src={imageUrl}
          alt="Point focal"
          className="h-full w-full object-cover block"
          draggable={false}
        />
        <span
          className="pointer-events-none absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-red-500 shadow"
          style={{ left: `${focalX}%`, top: `${focalY}%` }}
        />
      </div>

      <label className="flex flex-col gap-1 text-xs text-gray-700 max-w-sm">
        <span className="flex justify-between font-medium">
          Zoom
          <span className="tabular-nums text-gray-500">{zoom}%</span>
        </span>
        <input
          type="range"
          min={100}
          max={250}
          step={5}
          value={zoom}
          onChange={(e) => onZoomChange(Number(e.target.value))}
          className="w-full"
        />
      </label>

      <p className="text-[11px] text-gray-500">{previewHint}</p>
      <div className={`relative h-16 overflow-hidden rounded border ${previewBg}`}>
        <div className="absolute inset-y-0 right-0 w-2/5 overflow-hidden">
          <img
            src={imageUrl}
            alt=""
            className="h-full w-full object-cover opacity-55"
            style={{
              objectPosition: `${focalX}% ${focalY}%`,
              transform: `scale(${zoom / 100})`,
              transformOrigin: `${focalX}% ${focalY}%`,
            }}
          />
          <div
            className={`absolute inset-0 bg-gradient-to-r ${previewFrom} to-transparent`}
          />
        </div>
        <div className="relative z-10 flex h-full items-center px-3 text-xs text-gray-600">
          Aperçu rendu
        </div>
      </div>
    </div>
  );
};

export default ImageFocalZoomEditor;
