import React, { useCallback, useId } from "react";

interface InputProps<T extends Record<string, unknown> = Record<string, unknown>> {
  label?: string;
  required?: boolean;
  inputType?: string;
  inputName?: string;
  colSpanWidth?: number | string;
  attribute: string;
  data: T;
  setAction: React.Dispatch<React.SetStateAction<T>>;
  placeholder?: string;
  min?: string | number;
  max?: string | number;
  disabled?: boolean;
  condition?: string;
}

function Input<T extends Record<string, unknown> = Record<string, unknown>>({
  label,
  required,
  inputType,
  inputName,
  colSpanWidth,
  attribute,
  data,
  setAction,
  placeholder,
  min,
  max,
  disabled,
}: InputProps<T>): JSX.Element {
  const inputId = useId();

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setAction((prevState: T) => ({
      ...prevState,
      [attribute]: e.target.value,
    } as T));
  }, [setAction, attribute]);

  const inputValue = typeof data === 'object' && data !== null 
    ? (typeof data[attribute] === 'string' || typeof data[attribute] === 'number' ? String(data[attribute]) : '') 
    : (typeof data === 'string' || typeof data === 'number' ? String(data) : '');

  return (
    <div data-testid="text-input-container" className={`flex flex-col col-span-${colSpanWidth}`}>
      {label && (
        <label htmlFor={inputId} className="mt-2 font-bold">
          {label}:{" "}
          {required && <span className="text-red-500 font-bold">*</span>}
        </label>
      )}
      <input
        id={inputId}
        data-testid="text-input"
        required={required}
        placeholder={placeholder}
        className={`mt-2 p-2 bg-white border border-slate-100 rounded-md outline-none focus:outline-none ${disabled ? "opacity-50" : ""}`}
        min={min}
        max={max}
        type={inputType}
        name={inputName}
        value={inputValue}
        onChange={handleChange}
        disabled={disabled ? true : false}
        aria-label={label ? undefined : attribute}
      />
    </div>
  );
}

export { Input };
