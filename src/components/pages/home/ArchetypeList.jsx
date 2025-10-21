import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ArchetypeCard from "../../generic/ArchetypeCard";
import SubtitleDivider from "../../generic/SubtitleDivider";
import ArchetypeListSkeleton from "../../skeletons/ArchetypeListSkeleton";

const ArchetypeList = ({
  dataArray,
  subTitleDividerText,
  haveMedal,
  isLoading = false,
  skeletonItemCount = 8,
}) => {
  const [visibleCards, setVisibleCards] = useState(0);

  useEffect(() => {
    if (!isLoading && dataArray?.length > 0) {
      setVisibleCards(0); // Reset
      
      const interval = setInterval(() => {
        setVisibleCards(prev => {
          if (prev < dataArray.length) {
            return prev + 1;
          } else {
            clearInterval(interval);
            return prev;
          }
        });
      }, 500);

      return () => clearInterval(interval);
    } else {
      setVisibleCards(0);
    }
  }, [isLoading, dataArray]);

  if (isLoading || !dataArray || dataArray.length === 0) {
    return (
      <ArchetypeListSkeleton
        itemCount={skeletonItemCount}
        subTitleDividerText={subTitleDividerText}
      />
    );
  }

  return (
    <div className="w-full m-auto mb-5">
      {subTitleDividerText && (
        <SubtitleDivider displayDivider label={subTitleDividerText} />
      )}
      <div className="grid pb-5 grid-cols-12 gap-4">
        {dataArray.map((archetype, index) => {
          const isVisible = index < visibleCards;
          
          return (
            <div
              key={`${archetype?.id}-${index}`}
              className={`col-span-6 sscreen:col-span-4 lscreen:col-span-3 transition-all duration-500 ease-out ${
                isVisible 
                  ? "opacity-100 translate-y-0 scale-100" 
                  : "opacity-0 translate-y-4 scale-95"
              }`}
            >
              <Link
                to={`/archetype/${archetype?.id}`}
                state={{ id: archetype?.id }}
                className="bg-white p-3 rounded-lg aspect-square cardShadow hover:shadow-lg transition-shadow duration-200 block"
              >
                <ArchetypeCard
                  archetype={archetype}
                  index={index}
                  haveAMedal={haveMedal}
                />
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ArchetypeList;