import React from "react";

const NoItemMessage = ({ message, textPosition = "center" || "left" }) => {
  return (
    <div className={`bg-red-200 text-red-500 font-medium p-5 ${textPosition === "center" ? "text-center" : "text-left"} rounded-md w-full`}>
      <p>{message}</p>
    </div>
  );
};

export default NoItemMessage;
