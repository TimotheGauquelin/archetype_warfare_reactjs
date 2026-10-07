import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Button from "../components/generic/buttons/classicButton/Button";
import Header from "../components/generic/header/Header";
import Footer from "../components/generic/footer/Footer";

const TermsAndConditions = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const s3Items = t("terms.s3Items", { returnObjects: true }) as string[];
  const s4Items = t("terms.s4Items", { returnObjects: true }) as string[];

  return (
    <div>
      <Header />
      <div className="m-2 max-w-containerSize mx-auto bg-white p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            {t("terms.title")}
          </h1>
          <Button
            buttonText={t("terms.back")}
            className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
            action={() => navigate(-1)}
          />
        </div>

        <div className="prose prose-lg max-w-none">
          <section className="mb-4">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              {t("terms.s1Title")}
            </h2>
            <p className="text-gray-700 mb-4">{t("terms.s1Body")}</p>
          </section>

          <section className="mb-4">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              {t("terms.s2Title")}
            </h2>
            <p className="text-gray-700 mb-4">{t("terms.s2Body")}</p>
          </section>

          <section className="mb-4">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              {t("terms.s3Title")}
            </h2>
            <div className="text-gray-700 mb-4">
              <p className="mb-2">{t("terms.s3Intro")}</p>
              <ul className="list-disc pl-6 space-y-1">
                {Array.isArray(s3Items) &&
                  s3Items.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
          </section>

          <section className="mb-4">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              {t("terms.s4Title")}
            </h2>
            <div className="text-gray-700 mb-4">
              <p className="mb-2">{t("terms.s4Intro")}</p>
              <ul className="list-disc pl-6 space-y-1">
                {Array.isArray(s4Items) &&
                  s4Items.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
          </section>

          <section className="mb-4">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              {t("terms.s5Title")}
            </h2>
            <p className="text-gray-700 mb-4">{t("terms.s5Body")}</p>
          </section>

          <section className="mb-4">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              {t("terms.s6Title")}
            </h2>
            <p className="text-gray-700 mb-4">{t("terms.s6Body")}</p>
          </section>

          <section className="mb-4">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              {t("terms.s7Title")}
            </h2>
            <p className="text-gray-700 mb-4">{t("terms.s7Body")}</p>
          </section>

          <section className="mb-4">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              {t("terms.s8Title")}
            </h2>
            <p className="text-gray-700 mb-4">{t("terms.s8Body")}</p>
          </section>

          <section className="mb-4">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              {t("terms.s9Title")}
            </h2>
            <p className="text-gray-700 mb-4">{t("terms.s9Body")}</p>
          </section>

          <div className="mt-8 p-4 bg-gray-100 rounded-lg">
            <p className="text-sm text-gray-600">
              <strong>{t("terms.lastUpdated")}</strong>{" "}
              {new Date().toLocaleDateString(i18n.language === "en" ? "en-GB" : "fr-FR")}
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TermsAndConditions;
