import React from "react";
import "../../styles/components/SubtitleDivider.scss";

const SubtitleDivider = ({
  label,
  displayDivider,
  leftIcon,
}) => {
  return (
    <div
      className={`text-2xl sscreen:text-4xl font-bold flex items-center mb-4 w-full`}
    >
      {leftIcon && <img className="w-[40px] mr-2" src={leftIcon} alt="" />}
      <span className="">{label}</span>
      {displayDivider && <div className="flex-grow h-[3px] ml-5 bg-gray-300"></div>}
    </div>
  );
};

export default SubtitleDivider;
