import React from "react";
import { Link } from "react-router-dom";
import ArchetypeCard from "../../generic/ArchetypeCard";
import SubtitleDivider from "../../generic/SubtitleDivider";
import ArchetypeListSkeleton from "../../skeletons/ArchetypeListSkeleton";
import NoItemMessage from "../../generic/NoItemMessage";
import type { Archetype } from "../../../types";

interface ArchetypeListProps {
  dataArray: Archetype[];
  subTitleDividerText?: string;
  haveMedal?: boolean;
  isFetching?: boolean;
  skeletonItemCount?: number;
  errorMessage?: string | null;
  displayDate?: boolean;
}

const ArchetypeList: React.FC<ArchetypeListProps> = ({
  dataArray,
  subTitleDividerText,
  haveMedal,
  isFetching = false,
  skeletonItemCount = 8,
  errorMessage = null,
  displayDate = false,
}) => {
  if (isFetching) {
    return (
      <ArchetypeListSkeleton
        itemCount={skeletonItemCount}
        subTitleDividerText={subTitleDividerText}
      />
    );
  }

  return (
    <div className="w-full px-4 lscreen:px-0 m-auto min-h-[640px]">
      {subTitleDividerText && (
        <SubtitleDivider displayDivider label={subTitleDividerText} />
      )}

      {dataArray.length > 0 ? (
        <div className="grid pb-5 grid-cols-12 gap-4">
          {dataArray.map((archetype, index) => (
            <div
              key={`${archetype?.id}-${index}`}
              className="col-span-12 sscreen:col-span-4 lscreen:col-span-3"
            >
              <Link
                to={`/archetype/${archetype?.id}`}
                className="bg-white p-3 rounded-lg aspect-square cardShadow hover:shadow-lg transition-shadow duration-200 block"
              >
                <ArchetypeCard
                  archetype={archetype}
                  index={index}
                  haveAMedal={haveMedal}
                  displayDate={displayDate}
                />
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <NoItemMessage message={errorMessage || "Aucun archétype trouvé"} />
      )}
    </div>
  );
};

export default ArchetypeList;
