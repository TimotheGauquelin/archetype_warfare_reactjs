import React from "react";
import { useTranslation } from "react-i18next";
import { summonMechanicsToFrench } from "../../../utils/trad/summonMechanics";
import { attributeToFrench } from "../../../utils/trad/attribute";
import { monsterTypeToFrench } from "../../../utils/trad/monsterType";
import type { Archetype } from "../../../types";

interface MainInformationsBlockProps {
  archetype: Archetype;
}

type InfoItem = { key: string; label: string; iconSrc: string };

const InfoSection: React.FC<{ title: string; items: InfoItem[] }> = ({
  title,
  items,
}) => (
  <div className="flex flex-col lscreen:w-1/3 lscreen:mx-3">
    <h3 className="text-sm tablet:text-lg lscreen:text-xl font-bold leading-tight">
      {title}
    </h3>
    <div className="h-full lscreen:w-80 mt-1.5 tablet:mt-2 lscreen:mt-3 grid grid-cols-4 tablet:grid-cols-10 gap-1.5 tablet:gap-3">
      {items.map((item) => (
        <div
          key={item.key}
          className="col-span-1 tablet:col-span-2 text-center min-w-0"
        >
          <div className="aspect-square w-full max-w-[36px] tablet:max-w-[52px] mx-auto">
            <img
              className="w-full h-full object-contain"
              src={item.iconSrc}
              alt=""
              width={52}
              height={52}
              loading="lazy"
              decoding="async"
            />
          </div>
          <p className="pt-0.5 tablet:pt-1 font-medium text-[10px] tablet:text-xs leading-tight truncate">
            {item.label}
          </p>
        </div>
      ))}
    </div>
  </div>
);

const MainInformationsBlock: React.FC<MainInformationsBlockProps> = ({
  archetype,
}) => {
  const { t, i18n } = useTranslation();
  const isFrench = i18n.language?.startsWith("fr");

  const types: InfoItem[] =
    archetype?.types
      ?.slice()
      .sort((a, b) => a.label.localeCompare(b.label))
      .slice(0, 4)
      .map((type) => ({
        key: `type-${type.label}`,
        label: isFrench ? monsterTypeToFrench(type.label) : type.label,
        iconSrc: `${import.meta.env.BASE_URL}assets/cardTypeIcon/${type.label.toLowerCase()}.png`,
      })) ?? [];

  const attributes: InfoItem[] =
    archetype?.attributes
      ?.slice()
      .sort((a, b) => a.label.localeCompare(b.label))
      .slice(0, 4)
      .map((attribute) => ({
        key: `attr-${attribute.label}`,
        label: isFrench
          ? attributeToFrench(attribute.label)
          : attribute.label,
        iconSrc: `${import.meta.env.BASE_URL}assets/cardAttributeIcon/${attribute.label.toLowerCase()}.png`,
      })) ?? [];

  const summons: InfoItem[] =
    archetype?.summon_mechanics
      ?.slice()
      .sort((a, b) => a.label.localeCompare(b.label))
      .slice(0, 4)
      .map((sm) => ({
        key: `sm-${sm.label}`,
        label: isFrench ? summonMechanicsToFrench(sm.label) : sm.label,
        iconSrc: `${import.meta.env.BASE_URL}assets/cardAttributeIcon/${sm.label}.png`,
      })) ?? [];

  return (
    <div className="relative bg-white flex flex-col lscreen:flex-row w-full mx-auto shadow-md rounded-lg inset-x-0 lscreen:absolute lscreen:bottom-[-56px] p-2.5 tablet:p-4 lscreen:max-w-containerSize m-auto gap-2.5 tablet:gap-4 lscreen:gap-0">
      <InfoSection
        title={
          types.length > 1
            ? t("archetypePage.mainTypes")
            : t("archetypePage.mainType")
        }
        items={types}
      />
      <InfoSection
        title={
          attributes.length > 1
            ? t("archetypePage.mainAttributes")
            : t("archetypePage.mainAttribute")
        }
        items={attributes}
      />
      <InfoSection
        title={
          summons.length > 1
            ? t("archetypePage.summonMethods")
            : t("archetypePage.summonMethod")
        }
        items={summons}
      />
    </div>
  );
};

export default MainInformationsBlock;
