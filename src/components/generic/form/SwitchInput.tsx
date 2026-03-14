import { useState } from "react";

interface SwitchInputProps<T = Record<string, unknown>> {
  label?: string;
  attribute: string;
  data: T;
  setAction: React.Dispatch<React.SetStateAction<T>>;
  condition?: string;
  disabled?: boolean;
  displayRow?: boolean;
}

function SwitchInput<T extends Record<string, unknown>>({
  label,
  attribute,
  data,
  setAction,
  disabled,
  displayRow = false,
}: SwitchInputProps<T>): JSX.Element {
  const [toggle, setToggle] = useState(false);

  return (
    <div className={`${displayRow ? "col-span-4 flex flex-row justify-center items-center px-2 space-x-2" : "flex flex-col justify-center items-end px-2 space-y-1"}`}>
      {label && <label className="font-medium">{label}</label>}
      {displayRow && <span>Non</span>}
      <label className="inline-flex relative items-center cursor-pointer">
        <input
          type="checkbox"
          className="sr-only peer"
          id="input-form"
          checked={data && typeof data[attribute] === 'boolean' ? data[attribute] : false}
          onChange={() => {
            if (!disabled) {
              setToggle(!toggle);
              setAction((prevState) => ({
                ...prevState,
                [attribute]: !toggle,
              }));
            }
          }}
          disabled={disabled}
        />
        <div className="w-11 h-6 bg-red-200 rounded-full peer dark:bg-red-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-red-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-red-600 peer-checked:bg-green-600"></div>
      </label>
      {displayRow && <span>Oui</span>}
    </div>
  );
}

export { SwitchInput };
