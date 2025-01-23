import React from "react";
import "../../styles/components/SubtitleDivider.scss";

const SubtitleDivider = ({
  label,
  displayDivider,
  statusDisplayed,
  leftIcon,
}) => {
  return (
    <div
      className={`text-2xl sscreen:text-4xl font-bold flex justify-between
   
      `}
    >
      {leftIcon && <img className="w-[40px] mr-2" src={leftIcon} alt="" />}
      <h2 className="">{label}</h2>
      {displayDivider && (
        <div className="w-auto">
          <hr className="divider w-full my-auto" />
        </div>
      )}
    </div>
  );
};

export default SubtitleDivider;
