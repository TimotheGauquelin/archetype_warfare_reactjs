import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import SubtitleDivider from "../../generic/SubtitleDivider";
import NoItemMessage from "../../generic/NoItemMessage";
import CountryFlagLabel from "../../generic/CountryFlagLabel";
import PaginationTableHead from "../../generic/pagination/PaginationTableHead";
import type { ArchetypeRankingPlayer } from "../../../services/archetypeRanking";

const MEDAL_TYPES = ["gold", "silver", "bronze"] as const;

const medalSrc = (index: number): string =>
  `${import.meta.env.BASE_URL}assets/medalIcon/${MEDAL_TYPES[index]}_medal.webp`;

interface ArchetypeMastersSectionProps {
  masters: ArchetypeRankingPlayer[];
  isLoading?: boolean;
}

const ArchetypeMastersSection = ({
  masters,
  isLoading = false,
}: ArchetypeMastersSectionProps) => {
  const { t } = useTranslation();
  const topThree = masters.slice(0, 3);

  const tableHead = useMemo(
    () => [
      { colspan: "col-span-2", label: t("archetypePage.masterColRank") },
      { colspan: "col-span-7", label: t("archetypePage.masterColPlayer") },
      { colspan: "col-span-3", label: t("archetypePage.masterColPoints") },
    ],
    [t]
  );

  return (
    <div className="pt-2 tablet:pt-5">
      <SubtitleDivider label={t("archetypePage.masters")} displayDivider />
      {isLoading ? (
        <div className="bg-gray-100 p-3 tablet:p-4 border border-gray-200 rounded-lg mb-4 animate-pulse">
          <div className="h-5 tablet:h-6 bg-gray-200 rounded w-2/3 mb-2" />
          <div className="h-5 tablet:h-6 bg-gray-200 rounded w-1/2 mb-2" />
          <div className="h-5 tablet:h-6 bg-gray-200 rounded w-3/5" />
        </div>
      ) : topThree.length > 0 ? (
        <div className="w-full text-xs tablet:text-sm text-left text-gray-500 mb-4 overflow-x-auto rounded-lg border border-gray-200">
          <PaginationTableHead tableHeadItem={tableHead} />
          <div className="grid grid-cols-12 bg-white min-w-[280px]">
            {topThree.map((player, index) => (
              <div
                key={player.userId}
                className="grid grid-cols-12 col-span-12 items-center border-b border-l border-r last:border-b-0 hover:bg-slate-200"
              >
                <div className="col-span-2 p-1.5 tablet:p-2 flex items-center justify-center gap-1 tablet:gap-1.5 font-semibold text-gray-900">
                  <img
                    src={medalSrc(index)}
                    alt={t(`archetypePage.masterRank${index + 1}`)}
                    className="w-5 h-5 tablet:w-6 tablet:h-6 object-contain shrink-0"
                    width={24}
                    height={24}
                    loading="lazy"
                    decoding="async"
                  />
                  <span>#{index + 1}</span>
                </div>
                <div className="col-span-7 p-1.5 tablet:p-2 flex items-center gap-1.5 tablet:gap-2 min-w-0 text-gray-900">
                  <span className="font-medium truncate">
                    {player.username?.trim() || t("archetypePage.masterUnknown")}
                  </span>
                  <CountryFlagLabel countryCode={player.country} />
                </div>
                <div className="col-span-3 p-1.5 tablet:p-2 text-center text-gray-800">
                  {t("archetypePage.masterPoints", { count: player.points })}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="mb-4">
          <NoItemMessage
            message={t("archetypePage.noMasters")}
            textPosition="center"
          />
        </div>
      )}
    </div>
  );
};

export default ArchetypeMastersSection;
