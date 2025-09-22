import React from "react";

const ArchetypeCard = ({ archetype, index, haveAMedal }) => {
  return (
    <div>
      <div className="aspect-square bg-red-200 bg-cover bg-center rounded-lg">
        <img
          className="bg-cover bg-center h-full w-full"
          src={
            archetype?.headerImg?.includes(".jpg") ||
              archetype?.headerImg?.includes(".png") ||
              archetype?.headerImg?.includes(".jpeg")
              ? archetype.headerImg
              : process.env.PUBLIC_URL + "/assets/waiting_archetype_image.jpg"
          }
          alt=""
        />
      </div>
      <div className="font-bold pt-3 text-center ellipsisText flex justify-center items-center">
        {haveAMedal && index < 3 && (
          <div style={{ width: "30px" }}>
            <img
              src={
                process.env.PUBLIC_URL +
                `/assets/medalIcon/${index === 0
                  ? "gold"
                  : index === 1
                    ? "silver"
                    : index === 2 && "bronze"
                }_medal.png`
              }
              alt=""
            />
          </div>
        )}
        <p className={`${index < 3 && "pl-2"}`}>{archetype?.name}</p>
      </div>
      {/* <div className="font-bold pt-3 text-center ellipsisText">{archetype.name}</div> */}
    </div>
  );
};

export default ArchetypeCard;
