import React from "react";

const ErrorText = ({ errorText, errorTextCenter }) => {
  return (
    <div
      className={`col-span-12 bg-red-100 p-4 rounded ${
        errorTextCenter && "text-center"
      } text-gray-800 border border-red-200 border-4`}
    >
      <p>{errorText}</p>
    </div>
  );
};

export default ErrorText;
