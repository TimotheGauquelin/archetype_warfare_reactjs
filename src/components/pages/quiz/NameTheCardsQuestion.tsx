import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import type { QuizNameTheCardsAnswer, QuizPublicQuestion } from "@/services/quiz";
import QuizQuestionBadges from "@/components/pages/quiz/QuizQuestionBadges";
import QuizQuestionHint from "@/components/pages/quiz/QuizQuestionHint";
import QuizExplanationBlock from "@/components/pages/quiz/QuizExplanationBlock";
import QuizChoiceCardPicker, {
  emptyChoiceCard,
  type ChoiceCard,
} from "@/components/pages/admin/quiz/QuizChoiceCardPicker";

interface NameTheCardsQuestionProps {
  question: QuizPublicQuestion;
  disabled?: boolean;
  questionNumberLabel?: string | null;
  forfeitPointsOnHint?: boolean;
  onHintUsed?: () => void;
  onDraftChange?: (draft: { cardIds: string[] } | null) => void;
}

const NameTheCardsQuestion = ({
  question,
  disabled,
  questionNumberLabel,
  forfeitPointsOnHint,
  onHintUsed,
  onDraftChange,
}: NameTheCardsQuestionProps) => {
  const { t } = useTranslation();

  const monsterCount = useMemo(() => {
    const raw = Number(question.payload.monsterCount) || 1;
    return Math.max(1, Math.min(10, raw));
  }, [question.payload.monsterCount]);

  const hasAnswered = Boolean(question.userAnswer);
  const answeredCardIds = Array.isArray(question.userAnswer?.cardIds)
    ? (question.userAnswer?.cardIds as string[]).map(String)
    : null;

  const [slots, setSlots] = useState<ChoiceCard[]>(() =>
    emptySlots(monsterCount)
  );

  const correctAnswers: QuizNameTheCardsAnswer[] = Array.isArray(
    question.correctPayload?.answers
  )
    ? question.correctPayload.answers
    : [];

  useEffect(() => {
    if (!hasAnswered) {
      setSlots(emptySlots(monsterCount));
      onDraftChange?.(null);
      return;
    }
    onDraftChange?.(null);
    if (answeredCardIds && answeredCardIds.length > 0) {
      setSlots((prev) =>
        answeredCardIds.map((cardId, index) => {
          const correct = correctAnswers[index];
          const prevSlot = prev[index];
          if (prevSlot?.cardId === cardId && (prevSlot.name || prevSlot.artworkUrl)) {
            return prevSlot;
          }
          if (correct && String(correct.cardId) === String(cardId)) {
            return {
              text: correct.name || correct.label || cardId,
              cardId,
              name: correct.name || correct.label || null,
              artworkUrl: correct.artworkUrl ?? null,
            };
          }
          return {
            text: cardId,
            cardId,
            name: null,
            artworkUrl: null,
          };
        })
      );
      return;
    }
    // Passé sans réponse : afficher les bonnes réponses
    setSlots(
      correctAnswers.length > 0
        ? correctAnswers.map((correct) => ({
            text: correct.name || correct.label || String(correct.cardId ?? ""),
            cardId: correct.cardId ? String(correct.cardId) : null,
            name: correct.name || correct.label || null,
            artworkUrl: correct.artworkUrl ?? null,
          }))
        : emptySlots(monsterCount)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question.id, monsterCount, hasAnswered, answeredCardIds?.join(",")]);

  const publishDraft = (nextSlots: ChoiceCard[]) => {
    if (hasAnswered) {
      onDraftChange?.(null);
      return;
    }
    const filled = nextSlots.every((slot) => Boolean(slot.cardId));
    if (!filled) {
      onDraftChange?.(null);
      return;
    }
    onDraftChange?.({
      cardIds: nextSlots.map((slot) => String(slot.cardId ?? "")),
    });
  };

  return (
    <div className="space-y-3">
      {questionNumberLabel && (
        <p className="text-sm font-semibold text-gray-700">{questionNumberLabel}</p>
      )}
      <QuizQuestionBadges question={question} />
      <p className="text-md md:text-lg font-medium text-gray-900">{question.prompt}</p>
      <p className="text-sm text-gray-600">{t("quiz.nameTheCardsHint")}</p>

      {question.imageUrl && (
        <div className="flex justify-center">
          <img
            src={question.imageUrl}
            alt=""
            className="max-h-80 w-auto rounded object-contain shadow-md"
          />
        </div>
      )}

      {question.hint && !hasAnswered && (
        <QuizQuestionHint
          hint={question.hint}
          forfeitPointsOnHint={forfeitPointsOnHint}
          onHintUsed={onHintUsed}
        />
      )}

      <div className="space-y-3">
        {(hasAnswered && correctAnswers.length > 0
          ? correctAnswers.map((_, index) => index)
          : slots.map((_, index) => index)
        ).map((index) => {
          const slot = slots[index] ?? emptyChoiceCard();
          const correct = correctAnswers[index];
          const userPicked = Boolean(answeredCardIds?.[index]);
          const isCorrectSlot =
            hasAnswered &&
            userPicked &&
            correct &&
            String(correct.cardId) === String(slot.cardId);
          const showAsCorrectReveal = hasAnswered && (!userPicked || isCorrectSlot);

          return (
            <div
              key={`slot-${index}`}
              className={`rounded-lg bg-white p-3 shadow-md ${
                hasAnswered
                  ? showAsCorrectReveal
                    ? "ring-2 ring-green-400"
                    : "ring-2 ring-red-300"
                  : ""
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="mt-2 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-700 text-sm font-bold text-white">
                  {index + 1}
                </span>
                {hasAnswered ? (
                  <div className="flex-1 space-y-2">
                    {userPicked && !isCorrectSlot && (
                      <div className="flex flex-wrap items-center gap-3">
                        {slot.artworkUrl && (
                          <img
                            src={slot.artworkUrl}
                            alt=""
                            className="h-14 w-14 object-cover rounded shadow-sm"
                          />
                        )}
                        <span className="text-sm font-semibold text-gray-900">
                          {slot.name || slot.text || slot.cardId}
                        </span>
                      </div>
                    )}
                    {correct && (
                      <div
                        className={`flex items-center gap-2 text-sm ${
                          isCorrectSlot || !userPicked
                            ? "text-gray-900 font-semibold"
                            : "text-green-800"
                        }`}
                      >
                        {correct.artworkUrl && (
                          <img
                            src={correct.artworkUrl}
                            alt=""
                            className="h-10 w-10 object-cover rounded"
                          />
                        )}
                        <span>
                          {userPicked && !isCorrectSlot
                            ? `${t("quiz.nameTheCardsExpected")} `
                            : ""}
                          <strong>{correct.name || correct.label}</strong>
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <QuizChoiceCardPicker
                    label=""
                    value={slot}
                    disabled={disabled}
                    onChange={(next) => {
                      const updated = [...slots];
                      updated[index] = next;
                      setSlots(updated);
                      publishDraft(updated);
                    }}
                  />
                )}
              </div>
            </div>
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

function emptySlots(count: number): ChoiceCard[] {
  return Array.from({ length: count }, () => emptyChoiceCard());
}

export default NameTheCardsQuestion;
