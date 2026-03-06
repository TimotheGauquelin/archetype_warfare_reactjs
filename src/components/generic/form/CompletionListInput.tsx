import { useMemo, useState } from "react";

export interface CompletionListInputProps<T> {
  items: T[];
  getItemLabel: (item: T) => string;
  alreadyAdded?: T[];
  getItemId?: (item: T) => string | number;
  value: string;
  onChange: (value: string) => void;
  onSelect?: (item: T) => void;
  maxSuggestions?: number;
  minChars?: number;
  label?: string;
  required?: boolean;
  placeholder?: string;
  colSpanWidth?: string;
  disabled?: boolean;
  id?: string;
}

function CompletionListInput<T>({
  items,
  getItemLabel,
  alreadyAdded = [],
  getItemId,
  value,
  onChange,
  onSelect,
  maxSuggestions = 10,
  minChars = 1,
  label,
  required,
  placeholder,
  colSpanWidth,
  disabled = false,
  id,
}: CompletionListInputProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const excludedIds = useMemo(() => {
    if (alreadyAdded.length === 0) return null;
    if (getItemId) return new Set(alreadyAdded.map(getItemId));
    return null;
  }, [alreadyAdded, getItemId]);

  const suggestions = useMemo(() => {
    const trimmed = value.trim().toLowerCase();
    if (trimmed.length < minChars) return [];
    const notAlreadyAdded = (item: T) => {
      if (alreadyAdded.length === 0) return true;
      if (excludedIds !== null && getItemId) return !excludedIds.has(getItemId(item));
      return !alreadyAdded.includes(item);
    };
    return items
      .filter((item) => notAlreadyAdded(item) && getItemLabel(item).toLowerCase().includes(trimmed))
      .sort((a, b) => getItemLabel(a).localeCompare(getItemLabel(b), "fr"))
      .slice(0, maxSuggestions);
  }, [items, getItemLabel, value, minChars, maxSuggestions, excludedIds, alreadyAdded, getItemId]);

  const showList = isOpen && isFocused && suggestions.length > 0;

  const handleSelect = (item: T) => {
    const label = getItemLabel(item);
    onChange(label);
    onSelect?.(item);
    setIsOpen(false);
  };

  const containerClass = colSpanWidth ? `col-span-${colSpanWidth}` : "";

  return (
    <div className={`flex flex-col rounded-md ${containerClass} space-y-2`}>
      {label && (
        <label className="font-medium" htmlFor={id}>
          {label}: {required && <span className="text-red-500 font-bold">*</span>}
        </label>
      )}
      <div className="w-full border border-gray-200 rounded-md relative">
        <input
          id={id}
          type="text"
          className="p-1 bg-gray-100 rounded-md w-full"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => {
            setIsFocused(true);
            if (value.trim().length >= minChars) setIsOpen(true);
          }}
          onBlur={() => setTimeout(() => setIsFocused(false), 150)}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete="off"
          aria-autocomplete="list"
          aria-expanded={showList}
          aria-controls={id ? `${id}-listbox` : undefined}
          role="combobox"
        />
        {showList && (
          <ul
            id={id ? `${id}-listbox` : undefined}
            role="listbox"
            className="absolute z-10 w-full mt-0.5 bg-white rounded-md shadow-md max-h-64 overflow-auto border border-gray-200"
          >
            {suggestions.map((item, index) => {
              const itemLabel = getItemLabel(item);
              return (
                <li
                  key={index}
                  role="option"
                  className="flex items-center justify-between gap-2 p-2 border-b border-gray-300 last:border-b-0 hover:bg-gray-100"
                >
                  <span>{itemLabel}</span>
                  <span
                    role="button"
                    tabIndex={0}
                    className="cursor-pointer text-blue-600 hover:underline text-sm whitespace-nowrap"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleSelect(item);
                    }}
                  >
                    Ajouter au tableau
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

export default CompletionListInput;
