import React from "react";

const Button = ({ submit, disabled, buttonText, className, action }) => {
  return (
    <button
      disabled={disabled}
      className={className}
      type={submit ? "submit" : "button"}
      onClick={() => action && action()}
    >
      {buttonText}
    </button>
  );
};

export default Button;
