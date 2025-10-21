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
}) => {
  const handleChange = useCallback((e) => {
    setAction((prevState) => ({
      ...prevState,
      [attribute]: e.target.value,
    }));
  }, [setAction, attribute]);

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
        className="p-2 bg-gray-100 rounded-md"
        min={min}
        max={max}
        type={inputType}
        name={inputName}
        value={data && data[attribute]}
        onChange={handleChange}
      />
    </div>
  );
};
