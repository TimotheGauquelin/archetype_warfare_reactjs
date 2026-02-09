import React, { useEffect, useState, useRef } from "react";
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
  const [visibleCards, setVisibleCards] = useState<number>(0);
  const isFirstLoad = useRef<boolean>(true);

  useEffect(() => {
    if (!isFetching && dataArray?.length > 0) {
      if (isFirstLoad.current) {
        setVisibleCards(0);

        const interval = setInterval(() => {
          setVisibleCards(prev => {
            if (prev < dataArray.length) {
              return prev + 1;
            } else {
              clearInterval(interval);
              isFirstLoad.current = false;
              return prev;
            }
          });
        }, 500);

        return () => clearInterval(interval);
      } else {
        setVisibleCards(dataArray.length);
      }
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
    <div className="w-full m-auto">
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
                    displayDate={displayDate}
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