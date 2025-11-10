import React, { useMemo } from "react";
import { databaseDateToCalendarDate } from "../../utils/date/databaseDateToCalendarDate";

const ArchetypeCard = ({ archetype, index, haveAMedal, displayDate = false }) => {

  const imageUrl = useMemo(() => {
    if (
      archetype?.card_img_url
    ) {
      return archetype.card_img_url;
    }
    return process.env.PUBLIC_URL + "/assets/waiting_archetype_image.jpg";
  }, [archetype?.headerImg]);

  const medalPath = useMemo(() => {
    if (!haveAMedal || index >= 3) return null;

    const medalType = index === 0 ? "gold" : index === 1 ? "silver" : "bronze";
    return process.env.PUBLIC_URL + `/assets/medalIcon/${medalType}_medal.png`;
  }, [haveAMedal, index]);

  return (
    <div>
      <div className="aspect-square bg-red-200 bg-cover bg-center rounded-lg">
        <img
          className="bg-cover bg-center h-full w-full rounded-lg"
          src={imageUrl}
          alt=""
        />
      </div>
      <div className="font-bold pt-3 text-center ellipsisText flex justify-center items-center">
        {medalPath && (
          <div style={{ width: "30px" }}>
            <img src={medalPath} alt="" />
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
