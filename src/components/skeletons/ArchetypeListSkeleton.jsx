import React from "react";
import SubtitleDivider from "../generic/SubtitleDivider";

const ArchetypeListSkeleton = ({ itemCount = 8, subTitleDividerText }) => {
  return (
    <div className="w-full m-auto mb-5">
      {subTitleDividerText && (
        <SubtitleDivider displayDivider label={subTitleDividerText} />
      )}
      <div className="grid pb-5 grid-cols-12 gap-4">
        {[...Array(itemCount)].map((_, index) => (
          <div
            key={index}
            className="col-span-6 sscreen:col-span-4 lscreen:col-span-3 bg-white p-3 rounded-lg aspect-square cardShadow"
            style={{ animationDelay: `${index * 60}ms` }}
          >
            <div className="aspect-square bg-gray-200 rounded-lg animate-pulse" />
            <div className="pt-3 text-center">
              <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArchetypeListSkeleton;