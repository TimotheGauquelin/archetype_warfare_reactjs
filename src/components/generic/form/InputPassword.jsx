import { useState } from "react";
import { FaEye } from "react-icons/fa";

export const InputPassword = ({
  label,
  required,
  attribute,
  setAction,
}) => {
  const [displayPassword, setDisplayPassword] = useState(false);

  return (
    <>
      <div className="mt-2">
        <label className="mt-2 font-medium">
          {label}:
          {required && <span className="text-red-500 font-bold">*</span>}
        </label>
        <div className="flex mb-2">
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
            className="bg-gray-100 w-80 p-2 rounded-l-md"
          />
          <div
            className="bg-black w-20 p-2 flex justify-center items-center rounded-r-md"
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
