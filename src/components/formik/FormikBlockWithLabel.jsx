import React from "react";

const FormikBlockWithLabel = ({ label, requiredInput, children }) => {
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
