import React from "react";
import { ErrorMessage, useFormikContext } from "formik";

interface FormikStringInputProps {
  type?: string;
  name: string;
}

export const FormikStringInput: React.FC<FormikStringInputProps> = ({
  type,
  name,
}) => {
  const { setFieldValue, values } = useFormikContext<Record<string, unknown>>();
  const value = values[name] as string || '';
  return (
    <>
      <input
        id={name}
        name={name}
        type={type || "text"}
        onChange={(e) => {
          setFieldValue(name, e.target.value);
        }}
        value={value}
        className="p-1 bg-gray-100"
      />
      <div className="text-red-500">
        <ErrorMessage name={name} />
      </div>
    </>
  );
};
