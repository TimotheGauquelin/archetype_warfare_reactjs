import React from "react";

const AbsoluteInput = ({ children }) => {
  return (
    <div
      className="inputBlock tablet:absolute tablet:m-auto bg-white"
      style={{ width: "98%", bottom: "-40px" }}
    >
      <div className="w-full tablet:m-auto flex flex-col align-center grid grid-cols-12 gap-1 p-3 rounded-xl">
        {children}
      </div>
    </div>
  );
};

export default AbsoluteInput;
