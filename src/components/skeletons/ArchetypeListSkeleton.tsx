import React from "react";
import SubtitleDivider from "../generic/SubtitleDivider";

interface ArchetypeListSkeletonProps {
  itemCount?: number;
  subTitleDividerText?: string;
}

const ArchetypeListSkeleton: React.FC<ArchetypeListSkeletonProps> = ({ itemCount = 8, subTitleDividerText }) => {
  return (
    <div data-testid="archetype-list-skeleton" className="w-full m-auto mb-4">
      {subTitleDividerText && (
        <SubtitleDivider displayDivider label={subTitleDividerText} />
      )}
      <div className="grid pb-4 grid-cols-2 sscreen:grid-cols-3 lscreen:grid-cols-4 gap-2.5 tablet:gap-3 sscreen:gap-4">
        {[...Array(itemCount)].map((_, index) => (
          <div
            key={index}
            className="bg-white p-2 tablet:p-3 rounded-lg aspect-square cardShadow"
            style={{ animationDelay: `${index * 60}ms` }}
          >
            <div className="aspect-square bg-gray-200 rounded-lg animate-pulse" />
            <div className="pt-2 tablet:pt-3 text-center">
              <div className="h-3 tablet:h-4 bg-gray-300 rounded w-3/4 mx-auto animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArchetypeListSkeleton;