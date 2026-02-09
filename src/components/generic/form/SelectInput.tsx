import React, { useCallback } from "react";

interface Option {
  id: number | string;
  label: string;
}

interface SelectInputProps {
  defaultOptionLabel: string;
  className?: string;
  label?: string;
  disabled?: boolean;
  options: Option[];
  inputName?: string;
  required?: boolean;
  colSpanWidth?: string;
  attribute: string;
  setAction: React.Dispatch<React.SetStateAction<Record<string, unknown>>>;
  data: Record<string, unknown>;
}

const SelectInput: React.FC<SelectInputProps> = ({ 
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
}) => {
  const handleChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    
    setAction((prevState: Record<string, unknown>) => {
      return {
        ...prevState,
        [attribute]: e.target.value
      };
    });
  }, [setAction, attribute]);

  return (
    <div className={`flex flex-col col-span-${colSpanWidth} rounded-md space-y-2 mt-2`}>
      {label && <label className="font-medium">
        {label}: {required && <span className="text-red-500 font-bold">*</span>}
      </label>}
      <select 
        className={`h-full p-2 bg-gray-100 rounded-md ${className} ${disabled && "opacity-50 hover:outline-none"}`} 
        name={inputName} 
        value={
          data[attribute] 
            ? (typeof data[attribute] === 'object' && data[attribute] !== null && 'id' in data[attribute] 
              ? String((data[attribute] as Option).id) 
              : String(data[attribute]))
            : ''
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
