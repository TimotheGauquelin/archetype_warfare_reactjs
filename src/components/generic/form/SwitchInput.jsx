import { useState } from "react";

export const SwitchInput = ({
  label,
  attribute,
  data,
  setAction,
}) => {
  const [toggle, setToggle] = useState(data[attribute]);

  return (
    <div className="flex flex-col justify-center items-center px-2">
      <label className="mt-2 font-medium">{label}</label>
      <label className="inline-flex relative items-center cursor-pointer">
        <input
          type="checkbox"
          className="sr-only peer"
          id="input-form"
          checked={data && data[attribute]}
          onChange={() => {
            setToggle(!toggle);
            setAction((prevState) => ({
              ...prevState,
              [attribute]: !toggle,
            }));
          }}
        />
        <div className="w-11 h-6 bg-red-200 rounded-full peer dark:bg-red-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-red-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-red-600 peer-checked:bg-green-600"></div>
      </label>
    </div>
  );
};
