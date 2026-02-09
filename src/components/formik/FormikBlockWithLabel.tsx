import React from "react";

interface FormikBlockWithLabelProps {
  label: string;
  requiredInput?: boolean;
  children: React.ReactNode;
}

const FormikBlockWithLabel: React.FC<FormikBlockWithLabelProps> = ({ label, requiredInput, children }) => {
  return (
    <div className="flex flex-col mb-2">
      <label className="font-bold">
        {label}
        {requiredInput && "*"}
      </label>
      {children}
    </div>
  );
};

export default FormikBlockWithLabel;
