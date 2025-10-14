import React, { useMemo } from "react";

const ArchetypeCard = ({ archetype, index, haveAMedal }) => {

  const imageUrl = useMemo(() => {
    if (
      archetype?.headerImg?.includes(".jpg") ||
      archetype?.headerImg?.includes(".png") ||
      archetype?.headerImg?.includes(".jpeg")
    ) {
      return archetype.headerImg;
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
          className="bg-cover bg-center h-full w-full"
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
        <p className={`${index < 3 && "pl-2"}`}>{archetype?.name}</p>
      </div>
    </div>
  );
};

export default ArchetypeCard;
