import React, { useCallback } from "react";

export const Input = ({
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
}) => {
  const handleChange = useCallback((e) => {
    setAction((prevState) => ({
      ...prevState,
      [attribute]: e.target.value,
    }));
  }, [setAction, attribute]);

  const inputValue = typeof data === 'object' && data !== null 
    ? (data[attribute] || '') 
    : (data || '');

  return (
    <div className={`flex flex-col col-span-${colSpanWidth}`}>
      {label && (
        <label className="mt-2 font-medium">
          {label}:{" "}
          {required && <span className="text-red-500 font-bold">*</span>}
        </label>
      )}
      <input
        required={required}
        placeholder={placeholder}
        className={`p-2 bg-gray-100 rounded-md ${disabled ? "opacity-50 hover:outline-none" : "hover:opacity-90 hover:outline hover:outline-2 hover:outline-black"}`}
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
};
