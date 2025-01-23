import { ErrorMessage } from "formik";
import { useState } from "react";
import { FaEye } from "react-icons/fa";

export const FormikPasswordInput = ({
  form: { setFieldValue },
  field: { name, value },
}) => {
  const [displayPassword, setDisplayPassword] = useState(false);

  return (
    <>
      <div className="flex">
        <input
          id={name}
          name={name}
          type={displayPassword ? "string" : "password"}
          autoComplete="off"
          onChange={(e) => {
            setFieldValue(name, e.target.value);
          }}
          value={value}
          className="p-1 bg-gray-100 w-80"
        />
        <div
          className="bg-black w-20 flex justify-center items-center"
          onClick={() => {
            setDisplayPassword(!displayPassword);
          }}
        >
          <FaEye className="text-white" />,
        </div>
      </div>
      <div className="text-red-500">
        <ErrorMessage name={name} />
      </div>
    </>
  );
};
