import React from "react";
import { Link } from "react-router-dom";
import ArchetypeCard from "../../generic/ArchetypeCard";
import SubtitleDivider from "../../generic/SubtitleDivider";
import ArchetypeListSkeleton from "../../skeletons/ArchetypeListSkeleton";
import NoItemMessage from "../../generic/NoItemMessage";
import type { Archetype } from "../../../types";
import { getArchetypePublicPath } from "../../../constant/urlsFront";

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
    <div className="w-full m-auto">
      {subTitleDividerText && (
        <SubtitleDivider displayDivider label={subTitleDividerText} />
      )}

      {dataArray.length > 0 ? (
        <div className="grid pb-4 grid-cols-2 sscreen:grid-cols-3 lscreen:grid-cols-4 gap-2.5 tablet:gap-3 sscreen:gap-4">
          {dataArray.map((archetype, index) => {
            const archetypePath = getArchetypePublicPath(archetype);
            if (!archetypePath) return null;

            return (
            <div
              key={`${archetype?.slug ?? archetype?.id}-${index}`}
            >
              <Link
                to={archetypePath}
                className="bg-white p-2 tablet:p-3 rounded-lg aspect-square cardShadow hover:shadow-lg transition-shadow duration-200 block"
              >
                <ArchetypeCard
                  archetype={archetype}
                  index={index}
                  haveAMedal={haveMedal}
                  displayDate={displayDate}
                />
              </Link>
            </div>
          );
          })}
        </div>
      ) : (
        <NoItemMessage message={errorMessage || "Aucun archétype trouvé"} />
      )}
    </div>
  );
};

export default ArchetypeList;
