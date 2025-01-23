import { ErrorMessage } from "formik";

export const FormikStringInput = ({
  type,
  form: { setFieldValue },
  field: { name, value },
}) => {
  return (
    <>
      <input
        id={name}
        name={name}
        type={type ? type : "string"}
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
