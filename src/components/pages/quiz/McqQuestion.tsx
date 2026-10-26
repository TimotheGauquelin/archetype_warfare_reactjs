import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { QuizMcqChoice, QuizPublicQuestion } from "@/services/quiz";
import QuizQuestionBadges from "@/components/pages/quiz/QuizQuestionBadges";

const DEFAULT_QUESTION_ARTWORK = "/assets/question_artwork.png";

interface McqQuestionProps {
  question: QuizPublicQuestion;
  disabled?: boolean;
  questionNumberLabel?: string | null;
  onAnswer: (selectedIndex: number) => void;
}

const toChoice = (raw: string | QuizMcqChoice): QuizMcqChoice => {
  if (typeof raw === "string") {
    return { text: raw, cardId: null, name: null, artworkUrl: null };
  }
  return {
    text: raw.text ?? raw.name ?? "",
    cardId: raw.cardId ?? null,
    name: raw.name ?? null,
    artworkUrl: raw.artworkUrl ?? null,
  };
};

const McqQuestion = ({
  question,
  disabled,
  questionNumberLabel,
  onAnswer,
}: McqQuestionProps) => {
  const { t } = useTranslation();
  const [showHint, setShowHint] = useState(false);
  const choices = (question.payload.choices ?? []).map(toChoice);
  const hasAnswered = Boolean(question.userAnswer);
  const selected =
    typeof question.userAnswer?.selectedIndex === "number"
      ? question.userAnswer.selectedIndex
      : null;
  const correctIndex = question.correctPayload?.correctIndex;
  const imageSrc = question.imageUrl?.trim() || DEFAULT_QUESTION_ARTWORK;
  const hasChoiceArtworks = choices.some((c) => Boolean(c.artworkUrl));

  return (
    <div className="space-y-3">
      {!hasChoiceArtworks && (
        <div className="flex justify-center">
          <img
            src={imageSrc}
            alt=""
            className="max-h-64 w-auto rounded border border-gray-200 object-contain"
          />
        </div>
      )}
      {questionNumberLabel && (
        <p className="text-sm font-semibold text-gray-700">{questionNumberLabel}</p>
      )}
      <QuizQuestionBadges question={question} />
      <p className="text-md md:text-lg font-medium text-gray-900">{question.prompt}</p>

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
              <span className="font-semibold">{t("quiz.hint")} :</span>{" "}
              {question.hint}
            </p>
          )}
        </div>
      )}

      <div
        className={
          hasChoiceArtworks
            ? "grid gap-3 sm:grid-cols-2"
            : "grid gap-2"
        }
      >
        {choices.map((choice, index) => {
          let style = "border-gray-200 bg-white hover:bg-gray-50";
          if (hasAnswered) {
            if (correctIndex != null && index === correctIndex) {
              style = "border-green-400 bg-green-50";
            } else if (selected === index) {
              style = "border-red-400 bg-red-50";
            }
          }

          const label = choice.name || choice.text || `Option ${index + 1}`;

          return (
            <button
              key={`${question.id}-${index}`}
              type="button"
              disabled={disabled || hasAnswered}
              onClick={() => onAnswer(index)}
              className={`w-full text-left px-3 py-3 rounded-lg border transition-colors disabled:cursor-default ${style}`}
            >
              <div className="flex items-center gap-3">
                {choice.artworkUrl && (
                  <img
                    src={choice.artworkUrl}
                    alt=""
                    className="h-20 w-20 shrink-0 rounded object-cover border border-gray-200"
                  />
                )}
                <div className="min-w-0">
                  <span className="font-semibold text-gray-500 mr-2">
                    {String.fromCharCode(65 + index)}.
                  </span>
                  <span className="font-medium text-gray-900">{label}</span>
                </div>
              </div>
            </button>
          );
        })}
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

export default McqQuestion;
