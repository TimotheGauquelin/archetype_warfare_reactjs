import { useState } from "react";
import { FaEye } from "react-icons/fa";

export const InputPassword = ({
  label,
  required,
  attribute,
  setAction,
  colSpanWidth,
  data,
  disabled,
}) => {
  const [displayPassword, setDisplayPassword] = useState(false);

  const inputValue = typeof data === 'object' && data !== null 
    ? (data[attribute] || '') 
    : (data || '');

  return (
    <>
      <div className={`flex flex-col col-span-${colSpanWidth}`}>
        <label className="mt-2 font-medium">
          {label}:
          {required && <span className="text-red-500 font-bold">*</span>}
        </label>
        <div className="flex mt-2 group">
          <input
            id={label}
            name={label}
            type={displayPassword ? "text" : "password"}
            autoComplete="off"
            value={inputValue}
            onChange={(e) => {
              setAction((prevState) => ({
                ...prevState,
                [attribute]: e.target.value,
              }));
            }}
            disabled={disabled}
            className="bg-gray-100 w-full flex-1 p-2 rounded-l-md group-hover:outline group-hover:outline-2 group-hover:outline-black disabled:opacity-50"
          />
          <div
            className="bg-black hover:bg-gray-900 group-hover:outline group-hover:outline-2 group-hover:outline-black w-12 sm:w-20 p-2 flex justify-center items-center rounded-r-md cursor-pointer transition-colors duration-200"
            onClick={() => {
              setDisplayPassword(!displayPassword);
            }}
          >
            <FaEye className="text-white" />
          </div>
        </div>
      </div>
    </>
  );
};
