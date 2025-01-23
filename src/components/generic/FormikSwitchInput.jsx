import { useState } from "react";

export const FormikSwitchInput = ({
  form: { setFieldValue },
  field: { name, value },
}) => {
  const [toggleHighlighted, setToggleHighlighted] = useState(false);

  return (
    <label className="inline-flex relative items-center cursor-pointer">
      <input
        type="checkbox"
        className="sr-only peer"
        id="input-form"
        checked={value}
        onChange={() => {
          setToggleHighlighted(!toggleHighlighted);
          setFieldValue(name, !toggleHighlighted);
        }}
      />
      <div className="w-11 h-6 bg-red-200 rounded-full peer dark:bg-red-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-red-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-red-600 peer-checked:bg-green-600"></div>
    </label>
  );
};
