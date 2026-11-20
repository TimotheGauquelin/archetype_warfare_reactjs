import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import PageContentBlock from "../../components/generic/PageContentBlock";
import RevealOnScroll from "../../components/generic/RevealOnScroll";
import UserHeroLayout from "./layout";

const QUARTER_KEYS = ["q0", "q1", "q2", "q3", "q4"] as const;

const QUARTER_STYLES: Record<
  (typeof QUARTER_KEYS)[number],
  { color: string; titleColor: string }
> = {
  q0: {
    color: "from-gray-200 via-gray-100 to-purple-200 bg-gradient-to-b",
    titleColor: "text-gray-700",
  },
  q1: { color: "bg-blue-100", titleColor: "text-blue-700" },
  q2: { color: "bg-green-100", titleColor: "text-green-700" },
  q3: { color: "bg-yellow-100", titleColor: "text-yellow-700" },
  q4: { color: "bg-purple-100", titleColor: "text-purple-700" },
};

const RoadMapPage = () => {
  const { t } = useTranslation();

  const quarters = useMemo(() => {
    return QUARTER_KEYS.map((key) => {
      const rawItems = t(`roadmap.${key}.items`, { returnObjects: true });
      const items = Array.isArray(rawItems)
        ? rawItems.filter((item): item is string => typeof item === "string")
        : [];
      const period = t(`roadmap.${key}.period`);
      const dates = t(`roadmap.${key}.dates`);
      return {
        key,
        period,
        dates,
        items,
        ...QUARTER_STYLES[key],
      };
    }).filter(
      (quarter) =>
        quarter.items.length > 0 &&
        !quarter.period.startsWith("roadmap.") &&
        !quarter.dates.startsWith("roadmap.")
    );
  }, [t]);

  return (
    <UserHeroLayout
      mainTitle={t("hero.roadmap.title")}
      subTitle={t("hero.roadmap.subtitle")}
    >
      <PageContentBlock>
        <div className="flex flex-col w-full justify-center max-w-containerSize m-auto">
          <h1 className="text-2xl font-bold mb-8 text-center">
            {t("roadmap.pageTitle")}
          </h1>

          <div className="space-y-6">
            {quarters.map((quarter) => (
              <RevealOnScroll
                key={quarter.key}
                as="section"
                className={`rounded-xl p-6 ${quarter.color} shadow-sm`}
              >
                <div className="flex flex-col sscreen:flex-row sscreen:items-center sscreen:justify-between mb-4">
                  <h2
                    className={`text-2xl tablet:text-3xl font-extrabold ${quarter.titleColor}`}
                  >
                    {quarter.period}
                  </h2>
                  <span className="text-gray-600 font-medium mt-2 sscreen:mt-0">
                    {quarter.dates}
                  </span>
                </div>

                <ul className="space-y-2 mt-4">
                  {quarter.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start">
                      <span className="text-gray-600 mr-2">•</span>
                      <span className="text-gray-800">{item}</span>
                    </li>
                  ))}
                </ul>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </PageContentBlock>
    </UserHeroLayout>
  );
};

export default RoadMapPage;
