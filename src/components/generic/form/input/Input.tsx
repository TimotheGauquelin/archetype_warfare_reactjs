import React, { useCallback } from "react";

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
        <label className="mt-2 font-medium">
          {label}:{" "}
          {required && <span className="text-red-500 font-bold">*</span>}
        </label>
      )}
      <input
        data-testid="text-input"
        required={required}
        placeholder={placeholder}
        className={`mt-2 p-2 bg-gray-100 rounded-md ${disabled ? "opacity-50 hover:outline-none" : "hover:opacity-90 hover:outline hover:outline-2 hover:outline-black"}`}
        min={min}
        max={max}
        type={inputType}
        name={inputName}
        value={inputValue}
        onChange={handleChange}
        disabled={disabled ? true : false}
      />
    </div>
  );
}

export { Input };
