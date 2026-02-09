import { useState } from "react";
import { FaEye } from "react-icons/fa";

interface InputPasswordProps<T extends Record<string, unknown> = Record<string, unknown>> {
  label: string;
  required?: boolean;
  attribute: string;
  setAction: React.Dispatch<React.SetStateAction<T>>;
  colSpanWidth?: string | number;
  data: T;
  disabled?: boolean;
  /** Attribut name du champ (pour form action / FormData). Par défaut : label */
  name?: string;
}

export const InputPassword = <T extends Record<string, unknown> = Record<string, unknown>>({
  label,
  required,
  attribute,
  setAction,
  colSpanWidth,
  data,
  disabled,
  name: inputName,
}: InputPasswordProps<T>): JSX.Element => {
  const [displayPassword, setDisplayPassword] = useState(false);

  const inputValue = typeof data === 'object' && data !== null
    ? (typeof data[attribute] === 'string' ? data[attribute] : '')
    : (typeof data === 'string' ? data : '');

  return (
    <div
      data-testid="password-input-container"
      className={`flex flex-col col-span-${colSpanWidth}`}
    >
      <label className="mt-2 font-medium">
        {label}:
        {required && <span className="text-red-500 font-bold">*</span>}
      </label>
      <div className="flex mt-2 group">
        <input
          data-testid="password-input"
          id={label}
          name={inputName ?? label}
          type={displayPassword ? "text" : "password"}
          autoComplete="off"
          value={inputValue}
          onChange={(e) => {
            setAction((prevState: T) => ({
              ...prevState,
              [attribute]: e.target.value,
            } as T));
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
  );
};
