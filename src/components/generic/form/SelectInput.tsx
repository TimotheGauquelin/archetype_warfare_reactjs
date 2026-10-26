import React, { useCallback, useId } from "react";

interface Option {
  id: number | string;
  label: string;
}

interface SelectInputProps<T extends Record<string, unknown> = Record<string, unknown>> {
  defaultOptionLabel: string;
  className?: string;
  label?: string;
  disabled?: boolean;
  options: Option[];
  inputName?: string;
  required?: boolean;
  colSpanWidth?: string;
  attribute: string;
  setAction: React.Dispatch<React.SetStateAction<T>>;
  data: T;
  /** Nom accessible si pas de label visible (lecteurs d’écran / Lighthouse). */
  ariaLabel?: string;
}

const SelectInput = <T extends Record<string, unknown>>({
  defaultOptionLabel,
  className,
  label,
  disabled,
  options,
  inputName,
  required,
  colSpanWidth,
  attribute,
  setAction,
  data,
  ariaLabel,
}: SelectInputProps<T>) => {
  const generatedId = useId();
  const selectId = inputName ? `select-${inputName}` : generatedId;
  const accessibleName = ariaLabel || label || defaultOptionLabel;

  const handleChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setAction((prevState: T) => {
      return {
        ...prevState,
        [attribute]: e.target.value,
      };
    });
  }, [setAction, attribute]);

  return (
    <div className={`flex flex-col col-span-${colSpanWidth} rounded-md space-y-2 mt-2`}>
      {label && (
        <label htmlFor={selectId} className="font-bold">
          {label}: {required && <span className="text-red-500 font-bold">*</span>}
        </label>
      )}
      <select
        id={selectId}
        className={`h-full p-2 bg-white border border-slate-100 rounded-md outline-none focus:outline-none ${className ?? ""} ${disabled ? "opacity-50" : ""}`}
        name={inputName}
        aria-label={label ? undefined : accessibleName}
        value={
          data[attribute]
            ? (typeof data[attribute] === "object" && data[attribute] !== null && "id" in data[attribute]
              ? String((data[attribute] as Option).id)
              : String(data[attribute]))
            : ""
        }
        onChange={handleChange}
        disabled={disabled ? true : false}
      >
        <option value="">{defaultOptionLabel}</option>
        {options?.map((option, index) => {
          return <option key={index} value={String(option.id)}>{option.label}</option>;
        })}
      </select>
    </div>
  );
};

export default SelectInput;
