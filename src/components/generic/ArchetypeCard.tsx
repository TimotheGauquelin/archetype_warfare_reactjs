import React, { useMemo } from "react";
import { databaseDateToCalendarDate } from "../../utils/date/databaseDateToCalendarDate";
import type { Archetype } from "../../types";
import { optimizeImageUrl } from "../../utils/image/optimizeImageUrl";

interface ArchetypeCardProps {
  archetype: Archetype;
  index: number;
  haveAMedal?: boolean;
  displayDate?: boolean;
}

const ArchetypeCard: React.FC<ArchetypeCardProps> = ({ archetype, index, haveAMedal, displayDate = false }) => {

  const imageUrl = useMemo(() => {
    if (archetype?.card_img_url) {
      return optimizeImageUrl(archetype.card_img_url, "card");
    }
    return import.meta.env.BASE_URL + "assets/waiting_archetype_image.jpg";
  }, [archetype?.card_img_url]);

  const medalPath = useMemo(() => {
    if (!haveAMedal || index >= 3) return null;

    const medalType = index === 0 ? "gold" : index === 1 ? "silver" : "bronze";
    return import.meta.env.BASE_URL + `assets/medalIcon/${medalType}_medal.webp`;
  }, [haveAMedal, index]);

  return (
    <div>
      <div className="aspect-square bg-cover bg-center rounded-lg">
        <img
          className="bg-cover bg-center h-full w-full rounded-lg"
          src={imageUrl}
          alt=""
          width={360}
          height={360}
          sizes="(max-width: 768px) 45vw, 360px"
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className="font-bold pt-3 text-center ellipsisText flex justify-center items-center">
        {medalPath && (
          <div style={{ width: "30px" }}>
            <img src={medalPath} alt="" width={30} height={30} loading="lazy" decoding="async" />
          </div>
        )}
        <p className={`${index < 3 && "pl-2"} flex flex-col`}>
          <span>{archetype?.name}</span>
          <span className="text-xs">{displayDate && ` (${databaseDateToCalendarDate(archetype?.in_aw_date)})`}</span></p>
      </div>
    </div>
  );
};

export default ArchetypeCard;
