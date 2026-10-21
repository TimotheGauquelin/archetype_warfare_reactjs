import { convertBase64 } from "@/utils/img/convertBase";
import QuizImageCardSearch from "./QuizImageCardSearch";
import CheckboxSlider from "@/components/generic/CheckboxSlider";

export type OrderItemForm = {
  id: string;
  label: string;
  imageUrl: string;
  imageMode: "upload" | "card";
  imageCardName: string | null;
};

export const emptyOrderItems = (): [
  OrderItemForm,
  OrderItemForm,
  OrderItemForm,
  OrderItemForm,
] => [
  { id: "0", label: "", imageUrl: "", imageMode: "upload", imageCardName: null },
  { id: "1", label: "", imageUrl: "", imageMode: "upload", imageCardName: null },
  { id: "2", label: "", imageUrl: "", imageMode: "upload", imageCardName: null },
  { id: "3", label: "", imageUrl: "", imageMode: "upload", imageCardName: null },
];

const LETTERS = ["A", "B", "C", "D"] as const;

interface AdminOrderItemsEditorProps {
  items: [OrderItemForm, OrderItemForm, OrderItemForm, OrderItemForm];
  correctOrder: [string, string, string, string];
  onChangeItems: (
    items: [OrderItemForm, OrderItemForm, OrderItemForm, OrderItemForm]
  ) => void;
  onChangeCorrectOrder: (order: [string, string, string, string]) => void;
}

const AdminOrderItemsEditor = ({
  items,
  correctOrder,
  onChangeItems,
  onChangeCorrectOrder,
}: AdminOrderItemsEditorProps) => {
  const updateItem = (index: number, patch: Partial<OrderItemForm>) => {
    const next = [...items] as [
      OrderItemForm,
      OrderItemForm,
      OrderItemForm,
      OrderItemForm,
    ];
    next[index] = { ...next[index], ...patch };
    onChangeItems(next);
  };

  return (
    <div className="space-y-4">
      <p className="text-sm font-medium text-gray-800">
        Propositions (libellé + image optionnelle) — glissez l&apos;ordre correct
        ci-dessous
      </p>

      {items.map((item, index) => (
        <div
          key={item.id}
          className="bg-white rounded p-3 space-y-2 shadow-sm"
        >
          <p className="text-sm font-bold text-gray-800">
            Proposition {LETTERS[index]}
          </p>
          <label className="flex flex-col text-sm font-medium text-gray-800">
            Libellé
            <input
              type="text"
              className="mt-1 p-2 rounded font-normal border border-gray-300"
              value={item.label}
              onChange={(e) => updateItem(index, { label: e.target.value })}
              placeholder="Ex. Kuriboh"
            />
          </label>

          <div className="flex items-center gap-2">
            <span className="text-xs font-medium">Fichier</span>
            <label className="inline-flex relative items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={item.imageMode === "card"}
                onChange={() =>
                  updateItem(index, {
                    imageMode: item.imageMode === "card" ? "upload" : "card",
                    imageUrl: "",
                    imageCardName: null,
                  })
                }
              />
              <CheckboxSlider />
            </label>
            <span className="text-xs font-medium">Artwork carte</span>
          </div>

          {item.imageUrl && (
            <img
              src={item.imageUrl}
              alt=""
              className="max-h-24 rounded object-contain shadow-sm"
            />
          )}

          {item.imageMode === "upload" ? (
            <input
              type="file"
              accept="image/*"
              className="text-sm"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const base64Img = await convertBase64(file);
                if (typeof base64Img === "string") {
                  updateItem(index, {
                    imageUrl: base64Img,
                    imageCardName: null,
                  });
                }
              }}
            />
          ) : (
            <QuizImageCardSearch
              selectedName={item.imageCardName}
              onSelect={(artworkUrl, cardName) =>
                updateItem(index, {
                  imageUrl: artworkUrl,
                  imageCardName: cardName,
                  label: item.label.trim() || cardName,
                })
              }
              onClear={() =>
                updateItem(index, { imageUrl: "", imageCardName: null })
              }
            />
          )}

          {item.imageUrl && (
            <button
              type="button"
              className="text-sm text-red-600 hover:underline"
              onClick={() =>
                updateItem(index, { imageUrl: "", imageCardName: null })
              }
            >
              Retirer l&apos;image
            </button>
          )}
        </div>
      ))}

      <div className="bg-slate-100 rounded p-3 space-y-2">
        <p className="text-sm font-medium text-gray-800">
          Ordre correct (1 → 4)
        </p>
        {correctOrder.map((itemId, position) => (
          <label
            key={`pos-${position}`}
            className="flex items-center gap-2 text-sm"
          >
            <span className="w-16 font-semibold">Place {position + 1}</span>
            <select
              className="p-2 rounded flex-1"
              value={itemId}
              onChange={(e) => {
                const next = [...correctOrder] as [
                  string,
                  string,
                  string,
                  string,
                ];
                next[position] = e.target.value;
                onChangeCorrectOrder(next);
              }}
            >
              {items.map((item, index) => (
                <option key={item.id} value={item.id}>
                  {LETTERS[index]}
                  {item.label ? ` — ${item.label}` : ""}
                </option>
              ))}
            </select>
          </label>
        ))}
      </div>
    </div>
  );
};

export default AdminOrderItemsEditor;
