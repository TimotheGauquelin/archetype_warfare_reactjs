import React from "react";

interface ButtonProps {
  children?: React.ReactNode;
  style?: React.CSSProperties;
  submit?: boolean;
  disabled?: boolean;
  buttonText?: string;
  className?: string;
  action?: () => void;
  loadingText?: string;
  ariaLabel?: string;
}

const Button: React.FC<ButtonProps> = ({ children, style, submit, disabled, buttonText, className, action, ariaLabel }) => {
  return (
    <button
      style={style && style}
      disabled={disabled}
      className={`${className} transition-all duration-200 ${disabled ? "opacity-50 cursor-not-allowed grayscale" : "cursor-pointer hover:opacity-90"}`}
      type={submit ? "submit" : "button"}
      aria-label={ariaLabel || buttonText}
      onClick={() => action && !disabled && action()}
    >
      {buttonText && <span>{buttonText}</span>}
      {children && children}
    </button>
  );
};

export default Button;
