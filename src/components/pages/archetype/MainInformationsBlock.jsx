import React from "react";
import Progress from "./Progress";

const MainInformationsBlock = ({ archetype, performancesLabel }) => {
  return (
    <div
      className="bg-white flex flex-col lscreen:flex-row w-full mx-auto shadow-lg rounded-xl inset-x-0 lscreen:absolute p-5 lscreen:max-w-containerSize m-auto"
      style={{
        bottom: "-64px",
      }}
    >
      <div className="flex flex-col lscreen:w-1/3 mx-3">
        <h3 className="text-xl font-bold">
          {archetype?.types?.length > 1 ? "Types Principaux" : "Type Principal"}
        </h3>
        <div
          className="h-full lscreen:w-80 lscreen:mt-5 grid grid-cols-10 lscreen:grid-cols-10 gap-4"
        >
          {archetype?.types
            ?.sort((a, b) => a.label.localeCompare(b.label))
            ?.slice(0, 4)
            ?.map((type, index) => (
              <div
                key={index}
                className="col-span-2 text-center"
              >
                <div>
                  <img
                    className="w-full"
                    src={`${process.env.PUBLIC_URL}/assets/cardTypeIcon/${type.label}.png`}
                    alt=""
                  />
                </div>
                <p className="pt-1 font-medium">{type.label}</p>
              </div>
            ))}
        </div>
      </div>
      <div className="flex flex-col lscreen:w-1/3 mx-3">
        <h3 className="text-xl font-bold">
          {archetype?.attributes?.length > 1
            ? "Attributs Principaux :"
            : "Attribut Principal"}
        </h3>
        <div
          className="h-full lscreen:w-80 lscreen:mt-5 grid grid-cols-10 lscreen:grid-cols-10 gap-4"
        >
          {archetype?.attributes
            ?.sort((a, b) => a.label.localeCompare(b.label))
            ?.slice(0, 4)
            ?.map((attribute, index) => (
              <div
                key={index}
                className="col-span-2 text-center"
              >
                <div>
                  <img
                    className="w-full"
                    src={`${process.env.PUBLIC_URL}/assets/cardAttributeIcon/${attribute.label}.png`}
                    alt=""
                  />
                </div>
                <p className="pt-1 font-medium">{attribute.label}</p>
              </div>
            ))}
        </div>
      </div>
      <div className="flex flex-col lscreen:w-1/3 mx-3">
        <h3 className="text-xl font-bold">Statistiques</h3>
        <div className="h-full flex flex-col justify-between">
          {archetype?.performances
            ?.sort(function (a, b) {
              return (
                performancesLabel.indexOf(a.label) -
                performancesLabel.indexOf(b.label)
              );
            })
            ?.map((performance, index) => {
              return (
                <Progress
                  key={index}
                  label={performance.label}
                  mark={performance.note}
                />
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default MainInformationsBlock;
