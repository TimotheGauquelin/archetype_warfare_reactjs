import React from "react";

const ButtonWithIcon = ({
  disabled,
  className,
  action,
  children
}) => {
  return (
    <button
      disabled={disabled && disabled}
      className={className}
      type="button"
      onClick={() => action && action()}
    >
        {children}
    </button>
  );
};

export default ButtonWithIcon;
