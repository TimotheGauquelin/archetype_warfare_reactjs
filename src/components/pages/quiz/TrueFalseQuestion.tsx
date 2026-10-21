import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { QuizPublicQuestion } from "@/services/quiz";
import QuizQuestionBadges from "@/components/pages/quiz/QuizQuestionBadges";

const DEFAULT_QUESTION_ARTWORK = "/assets/question_artwork.png";

interface TrueFalseQuestionProps {
  question: QuizPublicQuestion;
  disabled?: boolean;
  questionNumberLabel?: string | null;
  onAnswer: (value: boolean) => void;
}

const TrueFalseQuestion = ({
  question,
  disabled,
  questionNumberLabel,
  onAnswer,
}: TrueFalseQuestionProps) => {
  const { t } = useTranslation();
  const [showHint, setShowHint] = useState(false);
  const hasAnswered = Boolean(question.userAnswer);
  const selected =
    typeof question.userAnswer?.value === "boolean"
      ? question.userAnswer.value
      : null;
  const correct = question.correctPayload?.correct;
  const imageSrc = question.imageUrl?.trim() || DEFAULT_QUESTION_ARTWORK;

  const buttonClass = (value: boolean) => {
    let style = "border-gray-200 bg-white hover:bg-gray-50";
    if (hasAnswered) {
      if (correct === value) {
        style = "border-green-400 bg-green-50";
      } else if (selected === value) {
        style = "border-red-400 bg-red-50";
      }
    }
    return style;
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-center">
        <img
          src={imageSrc}
          alt=""
          className="max-h-64 w-auto rounded border border-gray-200 object-contain"
        />
      </div>
      {questionNumberLabel && (
        <p className="text-sm font-semibold text-gray-700">{questionNumberLabel}</p>
      )}
      <QuizQuestionBadges question={question} />
      <p className="text-lg font-medium text-gray-900">{question.prompt}</p>

      {question.hint && !hasAnswered && (
        <div className="space-y-1">
          {!showHint ? (
            <button
              type="button"
              className="text-sm text-blue-700 hover:underline"
              onClick={() => setShowHint(true)}
            >
              {t("quiz.showHint")}
            </button>
          ) : (
            <p className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded p-2">
              <span className="font-semibold">{t("quiz.hint")} :</span> {question.hint}
            </p>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          disabled={disabled || hasAnswered}
          onClick={() => onAnswer(true)}
          className={`px-4 py-3 rounded-lg border font-semibold disabled:cursor-default ${buttonClass(true)}`}
        >
          Vrai
        </button>
        <button
          type="button"
          disabled={disabled || hasAnswered}
          onClick={() => onAnswer(false)}
          className={`px-4 py-3 rounded-lg border font-semibold disabled:cursor-default ${buttonClass(false)}`}
        >
          Faux
        </button>
      </div>

      {hasAnswered && question.explanation && (
        <p className="text-sm text-gray-700 bg-slate-50 border border-slate-200 rounded p-3">
          <span className="font-semibold">{t("quiz.explanation")} :</span>{" "}
          {question.explanation}
        </p>
      )}
    </div>
  );
};

export default TrueFalseQuestion;
