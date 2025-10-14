import React, { useCallback } from "react";

const SelectInput = ({ 
  card, 
  defaultOptionLabel, 
  label, 
  options, 
  inputName, 
  required, 
  colSpanWidth, 
  attribute, 
  setAction, 
  data, 
  condition 
}) => {
  const handleChange = useCallback((e) => {
    setAction((prevState) => {
      return {
        ...prevState,
        [attribute]: e.target.value
      };
    });
  }, [setAction, attribute]);

  return (
    <div className={`flex flex-col col-span-${colSpanWidth} rounded-md`}>
      {label && <label className="mt-2 font-medium">
        {label}: {required && <span className="text-red-500 font-bold">*</span>}
      </label>}
      <select 
        className="h-full p-2 bg-gray-100 rounded-md" 
        name={inputName} 
        value={data[attribute] && data[attribute].id} 
        onChange={handleChange}
      >
        <option value="">{defaultOptionLabel}</option>
        {options?.map((option, index) => {
          return <option key={index} value={option.id}>{option.label}</option>;
        })}
      </select>
    </div>
  );
};

export default SelectInput;
