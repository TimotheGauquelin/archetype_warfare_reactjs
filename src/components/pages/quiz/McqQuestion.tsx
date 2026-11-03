import { useEffect, useMemo, useState } from "react";
import type { QuizMcqChoice, QuizPublicQuestion } from "@/services/quiz";
import QuizQuestionBadges from "@/components/pages/quiz/QuizQuestionBadges";
import QuizQuestionHint from "@/components/pages/quiz/QuizQuestionHint";
import QuizExplanationBlock from "@/components/pages/quiz/QuizExplanationBlock";
import { shuffle } from "@/utils/shuffle";

const DEFAULT_QUESTION_ARTWORK = "/assets/question_artwork.png";

interface McqQuestionProps {
  question: QuizPublicQuestion;
  disabled?: boolean;
  questionNumberLabel?: string | null;
  forfeitPointsOnHint?: boolean;
  onHintUsed?: () => void;
  onDraftChange?: (draft: { selectedIndex: number } | null) => void;
}

type DisplayChoice = QuizMcqChoice & { originalIndex: number };

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
  const shuffledChoices = useMemo((): DisplayChoice[] => {
    const mapped = (question.payload.choices ?? []).map((raw, index) => ({
      ...toChoice(raw),
      originalIndex: index,
    }));
    return shuffle(mapped);
    // Shuffle once per question id
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question.id]);

  const hasAnswered = Boolean(question.userAnswer);
  const answeredSelected =
    typeof question.userAnswer?.selectedIndex === "number"
      ? question.userAnswer.selectedIndex
      : null;
  const [pendingOriginalIndex, setPendingOriginalIndex] = useState<number | null>(
    null
  );
  const correctIndex = question.correctPayload?.correctIndex;
  const imageSrc = question.imageUrl?.trim() || DEFAULT_QUESTION_ARTWORK;
  const hasChoiceArtworks = shuffledChoices.some((c) => Boolean(c.artworkUrl));
  const selectedOriginal = hasAnswered ? answeredSelected : pendingOriginalIndex;

  useEffect(() => {
    setPendingOriginalIndex(null);
    onDraftChange?.(null);
  }, [question.id, onDraftChange]);

  const selectChoice = (originalIndex: number) => {
    if (disabled || hasAnswered) return;
    setPendingOriginalIndex(originalIndex);
    onDraftChange?.({ selectedIndex: originalIndex });
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
        {shuffledChoices.map((choice, displayIndex) => {
          let style = "border-gray-200 bg-white hover:bg-gray-50";
          if (hasAnswered) {
            if (correctIndex != null && choice.originalIndex === correctIndex) {
              style = "border-green-400 bg-green-50";
            } else if (selectedOriginal === choice.originalIndex) {
              style = "border-red-400 bg-red-50";
            }
          } else if (pendingOriginalIndex === choice.originalIndex) {
            style = "border-blue-500 bg-blue-50 ring-1 ring-blue-300";
          }

          const label =
            choice.name || choice.text || `Option ${displayIndex + 1}`;

          return (
            <button
              key={`${question.id}-${choice.originalIndex}`}
              type="button"
              disabled={disabled || hasAnswered}
              onClick={() => selectChoice(choice.originalIndex)}
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
                    {String.fromCharCode(65 + displayIndex)}.
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
