import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ArchetypeCard from "../../generic/ArchetypeCard";
import SubtitleDivider from "../../generic/SubtitleDivider";
import ArchetypeListSkeleton from "../../skeletons/ArchetypeListSkeleton";
import NoItemMessage from "../../generic/NoItemMessage";

const ArchetypeList = ({
  dataArray,
  subTitleDividerText,
  haveMedal,
  isFetching = false,
  skeletonItemCount = 8,
  errorMessage = null,
}) => {
  const [visibleCards, setVisibleCards] = useState(0);

  useEffect(() => {
    if (!isFetching && dataArray?.length > 0) {
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
  }, [isFetching, dataArray]);

  if (isFetching) {
    return (
      <ArchetypeListSkeleton
        itemCount={skeletonItemCount}
        subTitleDividerText={subTitleDividerText}
      />
    );
  }

  return (
    <div className="w-full m-auto mb-[50px]">
      {subTitleDividerText && (
        <SubtitleDivider displayDivider label={subTitleDividerText} />
      )}

      {dataArray.length > 0 ? (
        <div className="grid pb-5 grid-cols-12 gap-4">
          {dataArray.map((archetype, index) => {
            const isVisible = index < visibleCards;

            return (
              <div
                key={`${archetype?.id}-${index}`}
                className={`col-span-12 sscreen:col-span-4 lscreen:col-span-3 transition-all duration-500 ease-out ${isVisible
                  ? "opacity-100 translate-y-0 scale-100"
                  : "opacity-0 translate-y-4 scale-95"
                  }`}
              >
                <Link
                  to={`/archetype/${archetype?.id}`}
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
      ) : (
        <NoItemMessage message={errorMessage || "Aucun archétype trouvé"} />
      )
      }
    </div >
  );
};

export default ArchetypeList;