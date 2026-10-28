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
        className="w-[calc(100%-1.5rem)] tablet:w-full z-10 absoluteShadowSearchBlock mx-auto relative tablet:absolute tablet:left-0 tablet:right-0 tablet:m-auto tablet:top-[-40px] bg-white rounded-md mt-3 tablet:mt-0"
      >
        <div className="w-full tablet:m-auto grid grid-cols-12 gap-2 tablet:gap-1 p-2.5 tablet:p-3 rounded-md items-end">
          {children}
        </div>
      </div>
    </>
  );
};

export default AbsoluteInput;
