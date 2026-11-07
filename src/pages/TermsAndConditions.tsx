import { useTranslation } from "react-i18next";
import Header from "../components/generic/header/Header";
import Footer from "../components/generic/footer/Footer";

const TermsAndConditions = () => {
  const { t } = useTranslation();

  const s4DataItems = t("terms.s4DataItems", { returnObjects: true }) as string[];
  const s4PurposeItems = t("terms.s4PurposeItems", {
    returnObjects: true,
  }) as string[];
  const s4RetentionItems = t("terms.s4RetentionItems", {
    returnObjects: true,
  }) as string[];
  const s4RightsItems = t("terms.s4RightsItems", {
    returnObjects: true,
  }) as string[];
  const s7Items = t("terms.s7Items", { returnObjects: true }) as string[];

  return (
    <div>
      <Header />
      <div className="m-2 max-w-containerSize mx-auto bg-white p-8">
        <h1 className="text-3xl font-bold text-gray-800">{t("terms.title")}</h1>
        <p className="text-sm text-gray-500 mt-2 mb-6">
          <strong>{t("terms.lastUpdated")}</strong> {t("terms.lastUpdatedDate")}
        </p>
        <p className="text-gray-700 mb-8">{t("terms.intro")}</p>

        <div className="prose prose-lg max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-3 text-gray-800">
              {t("terms.s1Title")}
            </h2>
            <p className="text-gray-700 mb-2">{t("terms.s1Body")}</p>
            <p className="text-gray-700">
              <strong>{t("terms.s1ContactLabel")}</strong>{" "}
              <a
                href={`mailto:${t("terms.s1ContactEmail")}`}
                className="text-blue-700 hover:underline"
              >
                {t("terms.s1ContactEmail")}
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-gray-800">
              {t("terms.s2Title")}
            </h2>
            <p className="text-gray-700 mb-2">{t("terms.s2Intro")}</p>
            <ul className="list-disc pl-6 space-y-1 text-gray-700 mb-2">
              <li>
                <strong>{t("terms.s2HostName")}</strong> —{" "}
                <a
                  href={t("terms.s2HostSite")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-700 hover:underline"
                >
                  {t("terms.s2HostSite")}
                </a>
              </li>
            </ul>
            <p className="text-gray-700">{t("terms.s2HostNote")}</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-gray-800">
              {t("terms.s3Title")}
            </h2>
            <p className="text-gray-700">{t("terms.s3Body")}</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-gray-800">
              {t("terms.s4Title")}
            </h2>
            <p className="text-gray-700 mb-2">{t("terms.s4Intro")}</p>
            <ul className="list-disc pl-6 space-y-1 text-gray-700 mb-4">
              {Array.isArray(s4DataItems) &&
                s4DataItems.map((item) => <li key={item}>{item}</li>)}
            </ul>

            <h3 className="text-xl font-semibold mb-2 text-gray-800">
              {t("terms.s4PurposeTitle")}
            </h3>
            <p className="text-gray-700 mb-2">{t("terms.s4PurposeIntro")}</p>
            <ul className="list-disc pl-6 space-y-1 text-gray-700 mb-4">
              {Array.isArray(s4PurposeItems) &&
                s4PurposeItems.map((item) => <li key={item}>{item}</li>)}
            </ul>

            <h3 className="text-xl font-semibold mb-2 text-gray-800">
              {t("terms.s4LegalTitle")}
            </h3>
            <p className="text-gray-700 mb-4">{t("terms.s4LegalBody")}</p>

            <h3 className="text-xl font-semibold mb-2 text-gray-800">
              {t("terms.s4RetentionTitle")}
            </h3>
            <ul className="list-disc pl-6 space-y-1 text-gray-700 mb-4">
              {Array.isArray(s4RetentionItems) &&
                s4RetentionItems.map((item) => <li key={item}>{item}</li>)}
            </ul>

            <h3 className="text-xl font-semibold mb-2 text-gray-800">
              {t("terms.s4RightsTitle")}
            </h3>
            <p className="text-gray-700 mb-2">{t("terms.s4RightsIntro")}</p>
            <ul className="list-disc pl-6 space-y-1 text-gray-700 mb-2">
              {Array.isArray(s4RightsItems) &&
                s4RightsItems.map((item) => <li key={item}>{item}</li>)}
            </ul>
            <p className="text-gray-700 mb-4">{t("terms.s4RightsContact")}</p>

            <h3 className="text-xl font-semibold mb-2 text-gray-800">
              {t("terms.s4ThirdTitle")}
            </h3>
            <p className="text-gray-700">{t("terms.s4ThirdBody")}</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-gray-800">
              {t("terms.s5Title")}
            </h2>
            <p className="text-gray-700">{t("terms.s5Body")}</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-gray-800">
              {t("terms.s6Title")}
            </h2>
            <p className="text-gray-700">{t("terms.s6Body")}</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-gray-800">
              {t("terms.s7Title")}
            </h2>
            <p className="text-gray-700 mb-2">{t("terms.s7Intro")}</p>
            <ul className="list-disc pl-6 space-y-1 text-gray-700 mb-2">
              {Array.isArray(s7Items) &&
                s7Items.map((item) => <li key={item}>{item}</li>)}
            </ul>
            <p className="text-gray-700">{t("terms.s7Moderation")}</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-gray-800">
              {t("terms.s8Title")}
            </h2>
            <p className="text-gray-700">{t("terms.s8Body")}</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-gray-800">
              {t("terms.s9Title")}
            </h2>
            <p className="text-gray-700">{t("terms.s9Body")}</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-gray-800">
              {t("terms.s10Title")}
            </h2>
            <p className="text-gray-700">{t("terms.s10Body")}</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-gray-800">
              {t("terms.s11Title")}
            </h2>
            <p className="text-gray-700">{t("terms.s11Body")}</p>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TermsAndConditions;
