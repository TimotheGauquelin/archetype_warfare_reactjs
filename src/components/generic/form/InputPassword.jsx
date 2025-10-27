import { useState } from "react";
import { FaEye } from "react-icons/fa";

export const InputPassword = ({
  label,
  required,
  attribute,
  setAction,
  colSpanWidth,
}) => {
  const [displayPassword, setDisplayPassword] = useState(false);

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
            type={displayPassword ? "string" : "password"}
            autoComplete="off"
            onChange={(e) => {
              setAction((prevState) => ({
                ...prevState,
                [attribute]: e.target.value,
              }));
            }}
            className="bg-gray-100 w-80 p-2 rounded-l-md group-hover:outline group-hover:outline-2 group-hover:outline-black"
          />
          <div
            className="bg-black hover:bg-gray-900 group-hover:outline group-hover:outline-2 group-hover:outline-black w-20 p-2 flex justify-center items-center rounded-r-md cursor-pointer"
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
