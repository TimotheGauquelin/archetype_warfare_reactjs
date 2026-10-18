import { useTranslation } from "react-i18next";
import SubtitleDivider from "../../generic/SubtitleDivider";
import NoItemMessage from "../../generic/NoItemMessage";
import CountryFlagLabel from "../../generic/CountryFlagLabel";
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

  return (
    <div className="pt-5">
      <SubtitleDivider label={t("archetypePage.masters")} displayDivider />
      {isLoading ? (
        <div className="bg-gray-100 p-4 border border-gray-200 rounded-lg mb-4 animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-2/3 mb-2" />
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-2" />
          <div className="h-6 bg-gray-200 rounded w-3/5" />
        </div>
      ) : topThree.length > 0 ? (
        <div className="bg-gray-100 p-4 border border-gray-200 rounded-lg mb-4">
          <ol className="space-y-3">
            {topThree.map((player, index) => (
              <li
                key={player.userId}
                className="flex items-center justify-between gap-3 text-sm sm:text-base"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={medalSrc(index)}
                    alt={t(`archetypePage.masterRank${index + 1}`)}
                    className="w-8 h-8 object-contain shrink-0"
                    width={32}
                    height={32}
                  />
                  <span className="font-medium text-gray-900 truncate">
                    {player.username?.trim() || t("archetypePage.masterUnknown")}
                  </span>
                  <CountryFlagLabel countryCode={player.country} />
                </div>
                <span className="text-gray-600 shrink-0">
                  {t("archetypePage.masterWins", { count: player.tournamentWins })}
                </span>
              </li>
            ))}
          </ol>
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
