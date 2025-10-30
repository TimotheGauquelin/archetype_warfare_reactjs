import React from "react";
import { summonMechanicsToFrench } from "../../../utils/trad/summonMechanics";
import { attributeToFrench } from "../../../utils/trad/attribute";
import { monsterTypeToFrench } from "../../../utils/trad/monsterType";

const MainInformationsBlock = ({ archetype}) => {
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
                <p className="pt-1 font-medium">{monsterTypeToFrench(type.label)}</p>
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
                <p className="pt-1 font-medium">{attributeToFrench(attribute.label)}</p>
              </div>
            ))}
        </div>
      </div>
      <div className="flex flex-col lscreen:w-1/3 mx-3">
        <h3 className="text-xl font-bold">
          {archetype?.summon_mechanics?.length > 1
            ? "Méthodes d'invocation"
            : "Méthode d'invocation"}
        </h3>
        <div
          className="h-full lscreen:w-80 lscreen:mt-5 grid grid-cols-10 lscreen:grid-cols-10 gap-4"
        >
          {archetype?.summon_mechanics
            ?.sort((a, b) => a.label.localeCompare(b.label))
            ?.slice(0, 4)
            ?.map((sm, index) => (
              <div
                key={index}
                className="col-span-2 text-center"
              >
                <div>
                  <img
                    className="w-full"
                    src={`${process.env.PUBLIC_URL}/assets/cardAttributeIcon/${sm.label}.png`}
                    alt=""
                  />
                </div>
                <p className="pt-1 font-medium">{summonMechanicsToFrench(sm?.label)}</p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default MainInformationsBlock;
