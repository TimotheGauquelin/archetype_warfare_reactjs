import { useTranslation } from "react-i18next";
import type { QuizPublicQuestion } from "@/services/quiz";

const difficultyClass = (difficulty?: string) => {
  switch (difficulty) {
    case "easy":
      return "bg-green-500";
    case "hard":
      return "bg-red-500";
    case "medium":
    default:
      return "bg-orange-500";
  }
};

interface QuizQuestionBadgesProps {
  question: Pick<QuizPublicQuestion, "type" | "theme" | "difficulty">;
}

const badgeClass =
  "inline-flex items-center px-3 py-1 text-white font-bold rounded-md shadow-sm text-xs";

const QuizQuestionBadges = ({ question }: QuizQuestionBadgesProps) => {
  const { t } = useTranslation();
  const typeLabel =
    question.type === "true_false"
      ? t("quiz.types.true_false")
      : question.type === "order"
        ? t("quiz.types.order")
        : question.type === "name_the_cards"
          ? t("quiz.types.name_the_cards")
          : question.type === "summoner"
            ? t("quiz.types.summoner")
            : question.type === "zoom"
              ? t("quiz.types.zoom")
              : question.type === "hint_ladder"
                ? t("quiz.types.hint_ladder")
                : t("quiz.types.mcq");

  const typeBadgeClass =
    question.type === "true_false"
      ? "bg-indigo-500"
      : question.type === "order"
        ? "bg-cyan-600"
        : question.type === "name_the_cards"
          ? "bg-teal-600"
          : question.type === "summoner"
            ? "bg-violet-600"
            : question.type === "zoom"
              ? "bg-rose-600"
              : question.type === "hint_ladder"
                ? "bg-emerald-600"
                : "bg-blue-500";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className={`${badgeClass} ${typeBadgeClass}`}>
        {t("quiz.badge.gameMode")}: {typeLabel}
      </span>
      {question.theme?.label && (
        <span className={`${badgeClass} bg-slate-600`}>
          {t("quiz.badge.theme")}: {question.theme.label}
        </span>
      )}
      {question.difficulty && (
        <span className={`${badgeClass} ${difficultyClass(question.difficulty)}`}>
          {t("quiz.badge.level")}: {t(`quiz.difficulty.${question.difficulty}`)}
        </span>
      )}
    </div>
  );
};

export default QuizQuestionBadges;
