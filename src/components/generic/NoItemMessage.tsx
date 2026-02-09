import React from "react";

interface NoItemMessageProps {
  message: string;
  textPosition?: "center" | "left";
}

const NoItemMessage: React.FC<NoItemMessageProps> = ({ message, textPosition = "center" }) => {
  return (
    <div
      data-testid="no-item-message"
      className={`bg-gray-200 text-gray-500 font-medium p-5 ${textPosition === "center" ? "text-center" : "text-left"} rounded-md w-full`}
    >
      <p data-testid="no-item-message-text">{message}</p>
    </div>
  );
};

export default NoItemMessage;
