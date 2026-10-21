import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import UserBasicLayout from "../layout";
import type { RootState } from "@/types";

/**
 * Le quizz est pour l'instant réservé à la langue française.
 * En anglais, on affiche un message « coming soon » (toujours en anglais).
 */
const QuizFrenchOnlyGate = () => {
  const { t } = useTranslation();
  const locale = useSelector((state: RootState) => state.locale?.value ?? "fr");
  const isFrench = String(locale).toLowerCase().startsWith("fr");

  if (isFrench) {
    return <Outlet />;
  }

  return (
    <UserBasicLayout
      mainTitle={t("hero.quiz.title")}
      subTitle={t("hero.quiz.subtitle")}
    >
      <div className="px-4 py-12 max-w-xl mx-auto text-center space-y-3">
        <h2 className="text-xl font-bold text-gray-900">
          {t("quiz.englishComingSoonTitle")}
        </h2>
        <p className="text-base text-gray-700">
          {t("quiz.englishComingSoonBody")}
        </p>
      </div>
    </UserBasicLayout>
  );
};

export default QuizFrenchOnlyGate;
