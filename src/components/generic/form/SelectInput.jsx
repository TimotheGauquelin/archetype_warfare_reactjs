import React from "react";

const SelectInput = ({ card, label, options, inputName, required, colSpanWidth, attribute, setAction, data, condition }) => {
  
  return (
    <div className={`flex flex-col col-span-${colSpanWidth}`}>
      {label && <label className="mt-2 font-medium">
        {label}: {required && <span className="text-red-500 font-bold">*</span>}
      </label>}
      <select className="h-full mt-2 p-2" name={inputName} defaultValue={""} value={condition && data[attribute]} onChange={(e) => {
        setAction((prevState) => ({...prevState, [attribute]: Number(e.target.value)}))
      }}>
        <option value="" disabled>------</option>
        {options?.map((option, index) => {
          return <option key={index} value={option.id}>{option.label}</option>;
        })}
      </select>
    </div>
  );
};

export default SelectInput;
