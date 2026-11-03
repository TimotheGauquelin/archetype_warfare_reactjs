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
      className="text-xl font-bold flex items-center mb-3 tablet:mb-4 w-full"
    >
      {leftIcon && <img className="w-7 tablet:w-8 mr-2" src={leftIcon} alt="" />}
      <span className="leading-tight">{label}</span>
      {displayDivider && <div className="hidden lscreen:flex flex-grow h-[2px] ml-4 bg-gray-300"></div>}
    </div>
  );
};

export default SubtitleDivider;
