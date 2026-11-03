import React, { useEffect, useMemo, useState } from "react";

export interface TagAutocompleteOption {
  value: string | number;
  label: string;
  description?: string;
}

interface TagAutocompleteInputProps {
  label?: string;
  options: TagAutocompleteOption[];
  selectedValues: Array<string | number>;
  onChange: (values: Array<string | number>) => void;
  placeholder?: string;
  compact?: boolean;
}

const TagAutocompleteInput: React.FC<TagAutocompleteInputProps> = ({
  label,
  options,
  selectedValues,
  onChange,
  placeholder = "Ajouter…",
  compact = false,
}) => {
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const selectedSet = useMemo(
    () => new Set(selectedValues.map((v) => String(v))),
    [selectedValues]
  );

  const selectedOptions = useMemo(
    () => options.filter((opt) => selectedSet.has(String(opt.value))),
    [options, selectedSet]
  );

  const filteredOptions = useMemo(() => {
    const q = input.trim().toLowerCase();
    return options.filter((opt) => {
      if (selectedSet.has(String(opt.value))) return false;
      if (!q) return true;
      return (
        opt.label.toLowerCase().includes(q) ||
        (opt.description?.toLowerCase().includes(q) ?? false)
      );
    });
  }, [options, selectedSet, input]);

  useEffect(() => {
    // reset typing when selection changes from outside
    setInput("");
  }, [selectedValues]);

  const handleSelect = (value: string | number) => {
    if (selectedSet.has(String(value))) return;
    onChange([...selectedValues, value]);
    setInput("");
  };

  const removeItem = (value: string | number) => {
    onChange(selectedValues.filter((v) => String(v) !== String(value)));
  };

  return (
    <div className="w-full">
      {label ? (
        <label className={`font-medium text-gray-700 ${compact ? "text-[10px]" : "text-sm"}`}>
          {label}
        </label>
      ) : null}
      <div
        className={`w-full border border-gray-200 rounded-md bg-white ${
          compact ? "p-1" : "p-2"
        }`}
      >
        {selectedOptions.length > 0 ? (
          <div className={`flex flex-wrap gap-1 ${compact ? "mb-1" : "mb-2"}`}>
            {selectedOptions.map((item) => (
              <span
                key={String(item.value)}
                title={item.description}
                className={`inline-flex items-center rounded-sm border border-slate-300 bg-slate-100 text-slate-700 ${
                  compact ? "text-[10px] px-1 py-0.5" : "text-xs p-1"
                }`}
              >
                <span>{item.label}</span>
                <button
                  type="button"
                  className="ml-1 font-bold opacity-80 hover:opacity-100"
                  onClick={() => removeItem(item.value)}
                  aria-label={`Retirer ${item.label}`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        ) : null}

        <input
          className={`w-full bg-gray-100 rounded-md ${
            compact ? "p-1 text-[11px]" : "p-2 text-sm"
          }`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 120)}
          placeholder={placeholder}
        />

        {isOpen ? (
          <ul
            className={`bg-white rounded-md shadow-md overflow-auto mt-1 border border-gray-200 z-20 relative ${
              compact ? "max-h-28" : "max-h-64"
            }`}
          >
            {filteredOptions.map((item) => (
              <li
                key={String(item.value)}
                className={`cursor-pointer border-b border-gray-100 hover:bg-gray-50 ${
                  compact ? "px-1.5 py-1" : "p-2"
                }`}
                onMouseDown={() => handleSelect(item.value)}
              >
                <span
                  className={`font-medium text-gray-800 ${
                    compact ? "text-[11px]" : "text-sm"
                  }`}
                >
                  {item.label}
                </span>
                {item.description ? (
                  <span
                    className={`block text-gray-500 line-clamp-1 ${
                      compact ? "text-[10px]" : "text-xs"
                    }`}
                  >
                    {item.description}
                  </span>
                ) : null}
              </li>
            ))}
            {filteredOptions.length === 0 ? (
              <li className={`text-gray-400 ${compact ? "p-1 text-[10px]" : "p-2 text-sm"}`}>
                Aucun résultat
              </li>
            ) : null}
          </ul>
        ) : null}
      </div>
    </div>
  );
};

export default TagAutocompleteInput;
