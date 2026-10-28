import { useEffect, useState } from "react";
import type { QuizMcqChoice, QuizPublicQuestion } from "@/services/quiz";
import QuizQuestionBadges from "@/components/pages/quiz/QuizQuestionBadges";
import QuizQuestionHint from "@/components/pages/quiz/QuizQuestionHint";
import QuizExplanationBlock from "@/components/pages/quiz/QuizExplanationBlock";

const DEFAULT_QUESTION_ARTWORK = "/assets/question_artwork.png";

interface McqQuestionProps {
  question: QuizPublicQuestion;
  disabled?: boolean;
  questionNumberLabel?: string | null;
  forfeitPointsOnHint?: boolean;
  onHintUsed?: () => void;
  onDraftChange?: (draft: { selectedIndex: number } | null) => void;
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
  forfeitPointsOnHint,
  onHintUsed,
  onDraftChange,
}: McqQuestionProps) => {
  const choices = (question.payload.choices ?? []).map(toChoice);
  const hasAnswered = Boolean(question.userAnswer);
  const answeredSelected =
    typeof question.userAnswer?.selectedIndex === "number"
      ? question.userAnswer.selectedIndex
      : null;
  const [pendingIndex, setPendingIndex] = useState<number | null>(null);
  const correctIndex = question.correctPayload?.correctIndex;
  const imageSrc = question.imageUrl?.trim() || DEFAULT_QUESTION_ARTWORK;
  const hasChoiceArtworks = choices.some((c) => Boolean(c.artworkUrl));
  const selected = hasAnswered ? answeredSelected : pendingIndex;

  useEffect(() => {
    setPendingIndex(null);
    onDraftChange?.(null);
  }, [question.id, onDraftChange]);

  const selectChoice = (index: number) => {
    if (disabled || hasAnswered) return;
    setPendingIndex(index);
    onDraftChange?.({ selectedIndex: index });
  };

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
        <QuizQuestionHint
          hint={question.hint}
          forfeitPointsOnHint={forfeitPointsOnHint}
          onHintUsed={onHintUsed}
        />
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
          } else if (pendingIndex === index) {
            style = "border-blue-500 bg-blue-50 ring-1 ring-blue-300";
          }

          const label = choice.name || choice.text || `Option ${index + 1}`;

          return (
            <button
              key={`${question.id}-${index}`}
              type="button"
              disabled={disabled || hasAnswered}
              onClick={() => selectChoice(index)}
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

      {hasAnswered && (
        <QuizExplanationBlock
          explanation={question.explanation}
          explanationImageUrl={question.explanationImageUrl}
        />
      )}
    </div>
  );
};

export default McqQuestion;
