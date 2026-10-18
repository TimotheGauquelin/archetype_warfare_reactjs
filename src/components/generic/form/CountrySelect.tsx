import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  getCountryFlagUrl,
  getCountryName,
  getCountryOptions,
  type CountryOption,
} from "@/utils/country";

interface CountrySelectProps {
  value: string;
  onChange: (code: string) => void;
  label?: string;
  disabled?: boolean;
}

const CountrySelect = ({
  value,
  onChange,
  label,
  disabled = false,
}: CountrySelectProps) => {
  const { t, i18n } = useTranslation();
  const locale = i18n.language ?? "fr";
  const options = useMemo(() => getCountryOptions(locale), [locale]);
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const selectedName = getCountryName(value, locale);

  const suggestions = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (trimmed.length < 1) return options.slice(0, 12);
    return options
      .filter(
        (option) =>
          option.name.toLowerCase().includes(trimmed) ||
          option.code.toLowerCase().includes(trimmed)
      )
      .slice(0, 12);
  }, [options, query]);

  const handleSelect = (option: CountryOption) => {
    onChange(option.code);
    setQuery("");
    setIsOpen(false);
  };

  const handleClear = () => {
    onChange("");
    setQuery("");
    setIsOpen(false);
  };

  return (
    <div className="flex flex-col rounded-md space-y-2 mt-2 relative">
      {label && <label className="font-medium">{label}</label>}

      {value && selectedName ? (
        <div className="flex items-center gap-2 p-2 bg-gray-100 rounded-md">
          <img
            src={getCountryFlagUrl(value)}
            alt=""
            className="w-6 h-4 object-cover rounded-sm shrink-0"
            width={24}
            height={18}
          />
          <span className="flex-1 text-gray-900 truncate">{selectedName}</span>
          {!disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="text-sm text-gray-500 hover:text-gray-800 shrink-0"
            >
              {t("profile.clearCountry")}
            </button>
          )}
        </div>
      ) : (
        <input
          type="text"
          value={query}
          disabled={disabled}
          placeholder={t("profile.selectCountry")}
          className={`p-2 bg-gray-100 rounded-md ${disabled ? "opacity-50" : ""}`}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onBlur={() => {
            // délai pour laisser le clic sur une option passer
            window.setTimeout(() => setIsOpen(false), 150);
          }}
        />
      )}

      {isOpen && !value && !disabled && suggestions.length > 0 && (
        <ul className="absolute z-20 top-full left-0 right-0 mt-1 max-h-56 overflow-auto bg-white border border-gray-200 rounded-md shadow-md">
          {suggestions.map((option) => (
            <li key={option.code}>
              <button
                type="button"
                className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-gray-100"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleSelect(option)}
              >
                <img
                  src={getCountryFlagUrl(option.code)}
                  alt=""
                  className="w-6 h-4 object-cover rounded-sm shrink-0"
                  width={24}
                  height={18}
                />
                <span className="truncate">{option.name}</span>
                <span className="text-xs text-gray-400 ml-auto shrink-0">
                  {option.code}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CountrySelect;
