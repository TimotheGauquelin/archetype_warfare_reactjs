import React, { useEffect, useState } from "react";

interface MultiSelectInputProps {
  colSpanWidth: string;
  label?: string;
  required?: boolean;
  array: string[];
  data: { roles?: string[] };
  setAction: React.Dispatch<React.SetStateAction<{ roles: string[] }>>;
}

const roleBadgeClass = (role: string): string => {
  if (role === "Admin") {
    return "bg-red-200 text-red-700 border-red-300";
  }
  if (role === "User") {
    return "bg-green-200 text-green-700 border-green-300";
  }
  return "bg-slate-200 text-slate-700 border-slate-300";
};

const MultiSelectInput: React.FC<MultiSelectInputProps> = ({
  colSpanWidth,
  label,
  required,
  array,
  data,
  setAction,
}) => {
  const [input, setInput] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setSelectedTags(Array.isArray(data?.roles) ? data.roles : []);
  }, [data?.roles]);

  const filteredOptions = array.filter(
    (opt) =>
      (input.trim() === "" ||
        opt.toLowerCase().includes(input.toLowerCase())) &&
      !selectedTags.includes(opt)
  );

  const handleSelect = (item: string) => {
    if (selectedTags.includes(item)) return;
    const next = [...selectedTags, item];
    setSelectedTags(next);
    setAction((prev) => ({ ...prev, roles: next }));
    setInput("");
  };

  const removeItem = (item: string) => {
    const next = selectedTags.filter((i) => i !== item);
    setSelectedTags(next);
    setAction((prev) => ({ ...prev, roles: next }));
  };

  return (
    <div className={`flex flex-col col-span-${colSpanWidth} rounded-md`}>
      {label && (
        <label className="mt-2 font-medium">
          {label}:{" "}
          {required && <span className="text-red-500 font-bold">*</span>}
        </label>
      )}
      <div className="w-full border border-gray-200 rounded-md p-2 bg-white">
        <div className="flex flex-col w-full rounded-md">
          {selectedTags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {selectedTags.map((item) => (
                <span
                  key={item}
                  className={`inline-flex items-center text-xs rounded-sm border p-1 ${roleBadgeClass(item)}`}
                >
                  <span>{item}</span>
                  <button
                    type="button"
                    className="ml-1 font-bold opacity-80 hover:opacity-100"
                    onClick={() => removeItem(item)}
                    aria-label={`Retirer ${item}`}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
          <input
            className="p-2 bg-gray-100 rounded-md"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onFocus={() => setIsOpen(true)}
            onBlur={() => setTimeout(() => setIsOpen(false), 100)}
            placeholder="Ajouter un rôle..."
          />
        </div>
        {isOpen && (
          <ul className="bg-white rounded-md shadow-md max-h-64 overflow-auto mt-1 border border-gray-200">
            {filteredOptions.map((item) => (
              <li
                key={item}
                className="cursor-pointer p-2 border-b border-gray-100 hover:bg-gray-50 flex items-center gap-2"
                onMouseDown={() => handleSelect(item)}
              >
                <span
                  className={`text-xs rounded-sm border px-1.5 py-0.5 ${roleBadgeClass(item)}`}
                >
                  {item}
                </span>
              </li>
            ))}
            {filteredOptions.length === 0 && (
              <li className="p-2 text-gray-400">Aucun résultat</li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default MultiSelectInput;
