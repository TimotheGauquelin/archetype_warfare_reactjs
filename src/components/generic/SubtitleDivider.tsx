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
      className="text-xl tablet:text-2xl font-bold flex items-center mb-5 tablet:mb-8 lscreen:mb-10 w-full"
    >
      {leftIcon && <img className="w-8 tablet:w-[40px] mr-2" src={leftIcon} alt="" />}
      <span className="leading-tight">{label}</span>
      {displayDivider && <div className="hidden lscreen:flex flex-grow h-[3px] ml-5 bg-gray-300"></div>}
    </div>
  );
};

export default SubtitleDivider;
