interface FormikDateInputProps {
  form: {
    setFieldValue: (field: string, value: string) => void;
  };
  field: {
    name: string;
    value: string;
  };
}

import React from "react";

export const FormikDateInput: React.FC<FormikDateInputProps> = ({
  form: { setFieldValue },
  field: { name, value },
}) => {
  return (
    <label className="inline-flex relative items-center mr-5 cursor-pointer">
      <input
        type="date"
        id="input-form"
        value={value}
        onChange={(e) => {
          setFieldValue(name, e.target.value);
        }}
      />
    </label>
  );
};
