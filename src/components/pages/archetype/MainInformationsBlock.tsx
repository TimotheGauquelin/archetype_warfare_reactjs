import React from "react";
import { useTranslation } from "react-i18next";
import { summonMechanicsToFrench } from "../../../utils/trad/summonMechanics";
import { attributeToFrench } from "../../../utils/trad/attribute";
import { monsterTypeToFrench } from "../../../utils/trad/monsterType";
import type { Archetype } from "../../../types";

interface MainInformationsBlockProps {
  archetype: Archetype;
}

const MainInformationsBlock: React.FC<MainInformationsBlockProps> = ({ archetype }) => {
  const { t, i18n } = useTranslation();
  const isFrench = i18n.language?.startsWith("fr");

  return (
    <div
      className="bg-white flex flex-col lscreen:flex-row w-full mx-auto shadow-lg rounded-xl inset-x-0 lscreen:absolute p-5 lscreen:max-w-containerSize m-auto"
      style={{
        bottom: "-64px",
      }}
    >
      <div className="flex flex-col lscreen:w-1/3 mx-3">
        <h3 className="text-xl font-bold">
          {(archetype?.types?.length ?? 0) > 1
            ? t("archetypePage.mainTypes")
            : t("archetypePage.mainType")}
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
                    src={`${import.meta.env.BASE_URL}assets/cardTypeIcon/${type.label.toLowerCase()}.png`}
                    alt=""
                  />
                </div>
                <p className="pt-1 font-medium">
                  {isFrench ? monsterTypeToFrench(type.label) : type.label}
                </p>
              </div>
            ))}
        </div>
      </div>
      <div className="flex flex-col lscreen:w-1/3 mx-3">
        <h3 className="text-xl font-bold">
          {(archetype?.attributes?.length ?? 0) > 1
            ? t("archetypePage.mainAttributes")
            : t("archetypePage.mainAttribute")}
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
                    src={`${import.meta.env.BASE_URL}assets/cardAttributeIcon/${attribute.label.toLowerCase()}.png`}
                    alt=""
                  />
                </div>
                <p className="pt-1 font-medium">
                  {isFrench ? attributeToFrench(attribute.label) : attribute.label}
                </p>
              </div>
            ))}
        </div>
      </div>
      <div className="flex flex-col lscreen:w-1/3 mx-3">
        <h3 className="text-xl font-bold">
          {(archetype?.summon_mechanics?.length ?? 0) > 1
            ? t("archetypePage.summonMethods")
            : t("archetypePage.summonMethod")}
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
                    src={`${import.meta.env.BASE_URL}assets/cardAttributeIcon/${sm.label}.png`}
                    alt=""
                  />
                </div>
                <p className="pt-1 font-medium">
                  {isFrench ? summonMechanicsToFrench(sm?.label) : sm?.label}
                </p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default MainInformationsBlock;
