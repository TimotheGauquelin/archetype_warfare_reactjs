import React from "react";
import "../../styles/components/SubtitleDivider.scss";

interface SubtitleDividerProps {
  label: string;
  displayDivider?: boolean;
  leftIcon?: string;
}

const SubtitleDivider: React.FC<SubtitleDividerProps> = ({
  label,
  displayDivider,
  leftIcon,
}) => {
  return (
    <div
      className={`text-2xl font-bold flex items-center mb-10 w-full`}
    >
      {leftIcon && <img className="w-[40px] mr-2" src={leftIcon} alt="" />}
      <span className="">{label}</span>
      {displayDivider && <div className="flex-grow h-[3px] ml-5 bg-gray-300"></div>}
    </div>
  );
};

export default SubtitleDivider;
