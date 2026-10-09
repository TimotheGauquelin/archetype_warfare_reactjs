import React from "react";

interface AbsoluteInputProps {
  children: React.ReactNode;
}

const AbsoluteInput: React.FC<AbsoluteInputProps> = ({ children }) => {
  return (
    <>
      <div className="hidden tablet:block h-[56px] w-full" aria-hidden />
      <div
        data-testid="absolute-input"
        className="w-full z-10 absoluteShadowSearchBlock mx-auto tablet:absolute tablet:left-0 tablet:right-0 tablet:m-auto bg-white rounded-md"
        style={{ top: "-40px" }}
      >
        <div className="w-full tablet:m-auto flex flex-col align-center grid grid-cols-12 gap-1 p-3 rounded-md">
          {children}
        </div>
      </div>
    </>
  );
};

export default AbsoluteInput;
