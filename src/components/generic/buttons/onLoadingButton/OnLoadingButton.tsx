import React, { useState } from "react";

interface OnLoadingButtonProps {
  children?: React.ReactNode;
  style?: React.CSSProperties;
  submit?: boolean;
  disabled?: boolean;
  buttonText?: string;
  className?: string;
  action?: () => void;
  loadingText?: string;
  loading?: boolean;
}

const OnLoadingButton: React.FC<OnLoadingButtonProps> = ({ children, style, submit, disabled, buttonText, className, action, loadingText, loading: externalLoading }) => {
  
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    setIsLoading(true);
    action && !disabled && action();
    setIsLoading(false);
  };

  const showLoading = externalLoading ?? isLoading;

  return (
    <button
      data-testid="on-loading-button"
      style={style && style}
      disabled={disabled}
      className={`${className} transition-all duration-200 ${disabled ? "opacity-50 cursor-not-allowed grayscale" : "cursor-pointer hover:opacity-90"}`}
      type={submit ? "submit" : "button"}
      onClick={handleClick}
    >
      {buttonText && <span>{showLoading && loadingText ? loadingText : buttonText}</span>}
      {children && children}
    </button>
  );
};

export default OnLoadingButton;
