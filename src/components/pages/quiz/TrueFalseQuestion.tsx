import { useEffect, useState } from "react";
import type { QuizPublicQuestion } from "@/services/quiz";
import QuizQuestionBadges from "@/components/pages/quiz/QuizQuestionBadges";
import QuizQuestionHint from "@/components/pages/quiz/QuizQuestionHint";
import QuizExplanationBlock from "@/components/pages/quiz/QuizExplanationBlock";

const DEFAULT_QUESTION_ARTWORK = "/assets/question_artwork.png";

interface TrueFalseQuestionProps {
  question: QuizPublicQuestion;
  disabled?: boolean;
  questionNumberLabel?: string | null;
  forfeitPointsOnHint?: boolean;
  onHintUsed?: () => void;
  onDraftChange?: (draft: { value: boolean } | null) => void;
}

const TrueFalseQuestion = ({
  question,
  disabled,
  questionNumberLabel,
  forfeitPointsOnHint,
  onHintUsed,
  onDraftChange,
}: TrueFalseQuestionProps) => {
  const hasAnswered = Boolean(question.userAnswer);
  const answeredSelected =
    typeof question.userAnswer?.value === "boolean"
      ? question.userAnswer.value
      : null;
  const [pendingValue, setPendingValue] = useState<boolean | null>(null);
  const correct = question.correctPayload?.correct;
  const imageSrc = question.imageUrl?.trim() || DEFAULT_QUESTION_ARTWORK;
  const selected = hasAnswered ? answeredSelected : pendingValue;

  useEffect(() => {
    setPendingValue(null);
    onDraftChange?.(null);
  }, [question.id, onDraftChange]);

  const selectValue = (value: boolean) => {
    if (disabled || hasAnswered) return;
    setPendingValue(value);
    onDraftChange?.({ value });
  };

  const buttonClass = (value: boolean) => {
    let style = "border-gray-200 bg-white hover:bg-gray-50";
    if (hasAnswered) {
      if (correct === value) {
        style = "border-green-400 bg-green-50";
      } else if (selected === value) {
        style = "border-red-400 bg-red-50";
      }
    } else if (pendingValue === value) {
      style = "border-blue-500 bg-blue-50 ring-1 ring-blue-300";
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
      <p className="text-md md:text-lg font-medium text-gray-900">{question.prompt}</p>

      {question.hint && !hasAnswered && (
        <QuizQuestionHint
          hint={question.hint}
          forfeitPointsOnHint={forfeitPointsOnHint}
          onHintUsed={onHintUsed}
        />
      )}

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          disabled={disabled || hasAnswered}
          onClick={() => selectValue(true)}
          className={`px-4 py-3 rounded-lg border font-semibold disabled:cursor-default ${buttonClass(true)}`}
        >
          Vrai
        </button>
        <button
          type="button"
          disabled={disabled || hasAnswered}
          onClick={() => selectValue(false)}
          className={`px-4 py-3 rounded-lg border font-semibold disabled:cursor-default ${buttonClass(false)}`}
        >
          Faux
        </button>
      </div>

      {hasAnswered && (
        <QuizExplanationBlock
          explanation={question.explanation}
          explanationImageUrl={question.explanationImageUrl}
        />
      )}
    </div>
  );
};

export default TrueFalseQuestion;
