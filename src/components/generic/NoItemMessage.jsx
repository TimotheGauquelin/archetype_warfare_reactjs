import React from "react";

const NoItemMessage = ({ message }) => {
  return (
    <div className="bg-red-200 text-red-500 font-medium p-5 text-center rounded-xl w-full">
      <p>{message}</p>
    </div>
  );
};

export default NoItemMessage;
