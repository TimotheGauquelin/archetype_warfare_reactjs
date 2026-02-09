import React from "react";

interface ErrorTextProps {
  errorText: string;
  errorTextCenter?: boolean;
}

const ErrorText: React.FC<ErrorTextProps> = ({ errorText, errorTextCenter }) => {
  return (
    <div
      data-testid="error-text"
      className={`col-span-12 mt-2 p-2 bg-red-100 text-red-500 rounded mb-1 ${
        errorTextCenter && "text-center"
      }`}
    >
      <p>{errorText}</p>
    </div>
  );
};

export default ErrorText;
