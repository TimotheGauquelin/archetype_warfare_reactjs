import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { URL_FRONT_ARCHETYPES } from "../../constant/urlsFront";
import RevealOnScroll from "../../components/generic/RevealOnScroll";
import "../../styles/Archetypes.scss";
import UserHeroLayout from "./layout";
import PageContentBlock from "@/components/generic/PageContentBlock";

const ConceptPage = () => {
  const { t } = useTranslation();

  const archetypeSample = useMemo(
    () => [
      { nameKey: "concept.samples.darkMagician", imgUrl: "darkmagician_sample" },
      { nameKey: "concept.samples.stardust", imgUrl: "stardust_sample" },
      { nameKey: "concept.samples.inzektor", imgUrl: "inzektor_sample" },
    ],
    []
  );

  const rules = useMemo(
    () => [
      { emoji: "🎴", titleKey: "concept.rules.1.title", descKey: "concept.rules.1.desc" },
      { emoji: "🚫", titleKey: "concept.rules.2.title", descKey: "concept.rules.2.desc" },
      { emoji: "🔥", titleKey: "concept.rules.3.title", descKey: "concept.rules.3.desc" },
    ],
    []
  );

  return (
    <UserHeroLayout
      mainTitle={t("hero.concept.title")}
      subTitle={t("hero.concept.subtitle")}
    >
      <div className="max-w-containerSize mx-auto w-full px-2">
        <PageContentBlock>
        <RevealOnScroll as="section" className="rounded-xl bg-blue-100 shadow-sm">
          <h2 className="text-center text-2xl tablet:text-3xl font-extrabold text-indigo-700">
            {t("concept.legendaryTitle")}
          </h2>
          <p className="mt-4 text-gray-800 leading-relaxed text-justify">
            {t("concept.legendaryP1Before")}{" "}
            <span className="font-semibold text-indigo-600">{t("concept.legendaryYears")}</span>
            {t("concept.legendaryP1After")}{" "}
            <span className="font-semibold">{t("concept.legendaryMonument")}</span>{" "}
            {t("concept.legendaryP2")}{" "}
            <span className="font-semibold text-purple-500">Fusion</span>,{" "}
            <span className="text-gray-500 font-semibold">Synchro</span>,{" "}
            <span className="text-black font-semibold">Xyz</span>,{" "}
            <span className="text-green-500 font-semibold">{t("concept.summonPendulum")}</span>,{" "}
            <span className="text-blue-500 font-semibold">{t("concept.summonLink")}</span>{" "}
            {t("concept.legendaryP3")}
          </p>

          <div className="grid grid-cols-12 gap-4 mt-6">
            {archetypeSample.map((sample, index) => (
              <div key={index} className="col-span-12 sscreen:col-span-4">
                <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
                  <div className="overflow-hidden">
                    <img
                      src={`${import.meta.env.BASE_URL}assets/archetypeSample/${sample.imgUrl}.jpg`}
                      alt={t(sample.nameKey)}
                      className="w-full transform hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <p className="text-center font-semibold p-3 text-gray-800">
                    {t("concept.archetypeLabel")}{" "}
                    <span className="text-indigo-600">{t(sample.nameKey)}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </RevealOnScroll>
        <RevealOnScroll as="section" className="rounded-xl p-6 bg-red-100 shadow-sm">
          <h2 className="text-center text-2xl tablet:text-3xl font-extrabold text-red-600">
            {t("concept.unbalancedTitle")}
          </h2>
          <p className="mt-4 text-gray-800 leading-relaxed text-justify">
            {t("concept.unbalancedText")}
          </p>
          <div className="mt-4 text-center">
            <span className="inline-block px-4 py-2 rounded-full bg-red-200 shadow-sm text-red-700 font-bold">
              {t("concept.unbalancedResult")}
            </span>
          </div>
        </RevealOnScroll>
        <RevealOnScroll as="section" className="rounded-xl p-6 bg-green-100 shadow-sm">
          <h2 className="text-center text-2xl tablet:text-3xl font-extrabold text-emerald-700">
            {t("concept.visionTitle")}
          </h2>
          <p className="mt-4 text-gray-800 leading-relaxed text-justify">
            {t("concept.visionText")}
          </p>

          <div className="flex flex-col gap-4 mt-6">
            {rules.map((item, idx) => (
              <div
                key={idx}
                className="col-span-12 sscreen:col-span-6 lscreen:col-span-4 cursor-pointer"
              >
                <div className="h-full bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
                  <div className="text-2xl">{item.emoji}</div>
                  <p className="font-bold text-gray-900 mt-2">{t(item.titleKey)}</p>
                  <p className="text-gray-700">{t(item.descKey)}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <span className="inline-block px-4 py-2 rounded-full bg-green-200 shadow-sm text-green-700 font-bold">
              {t("concept.visionResult")}
            </span>
          </div>
        </RevealOnScroll>
        <RevealOnScroll as="section" className="rounded-xl p-6 bg-blue-100 shadow-sm">
          <div className="grid grid-cols-12 gap-6 items-center">
            <div className="col-span-12 lscreen:col-span-8">
              <h3 className="text-2xl font-bold text-gray-900">{t("concept.ctaTitle")}</h3>
              <p className="text-gray-800 mt-2">
                {t("concept.ctaText")}
              </p>
            </div>
            <div className="col-span-12 lscreen:col-span-4 flex lscreen:justify-end">
              <Link
                to={URL_FRONT_ARCHETYPES}
                className="px-5 py-3 bg-black text-white rounded-md font-semibold hover:opacity-90 transition-opacity duration-150"
              >
                {t("concept.ctaButton")}
              </Link>
            </div>
          </div>
        </RevealOnScroll>
      </PageContentBlock>
      </div>
    </UserHeroLayout>
  );
};

export default ConceptPage;
