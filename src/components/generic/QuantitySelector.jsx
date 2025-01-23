import React from "react";

const QuantitySelector = () => {
  return (
    <div className="flex justify-center w-1/5">
      <svg className="fill-current text-gray-600 w-3" viewBox="0 0 448 512">
        <path d="M416 208H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h384c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z" />
      </svg>

      <input
        className="mx-2 border text-center w-8"
        type="text"
        defaultValue="1"
      />

      <svg className="fill-current text-gray-600 w-3" viewBox="0 0 448 512">
        <path d="M416 208H272V64c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v144H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h144v144c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V304h144c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z" />
      </svg>
    </div>
  );
};

export default QuantitySelector;
