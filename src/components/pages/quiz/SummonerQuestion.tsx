import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import type { QuizNameTheCardsAnswer, QuizPublicQuestion } from "@/services/quiz";
import QuizQuestionBadges from "@/components/pages/quiz/QuizQuestionBadges";
import QuizQuestionHint from "@/components/pages/quiz/QuizQuestionHint";
import QuizExplanationBlock from "@/components/pages/quiz/QuizExplanationBlock";

type SummonerProposition = {
  id: string;
  cardId: string;
  label: string;
  name?: string | null;
  artworkUrl?: string | null;
};

interface SummonerQuestionProps {
  question: QuizPublicQuestion;
  disabled?: boolean;
  questionNumberLabel?: string | null;
  forfeitPointsOnHint?: boolean;
  onHintUsed?: () => void;
  onAnswer: (cardIds: string[]) => void;
}

const SummonerQuestion = ({
  question,
  disabled,
  questionNumberLabel,
  forfeitPointsOnHint,
  onHintUsed,
  onAnswer,
}: SummonerQuestionProps) => {
  const { t } = useTranslation();

  const propositions = useMemo((): SummonerProposition[] => {
    const raw = question.payload.propositions ?? [];
    return raw.map((item, index) => ({
      id: String(item.id ?? index),
      cardId: String(item.cardId ?? ""),
      label: item.label ?? item.name ?? "",
      name: item.name ?? null,
      artworkUrl: item.artworkUrl ?? null,
    }));
  }, [question.payload.propositions]);

  const materialCountHint = Number(question.payload.materialCount) || null;

  const hasAnswered = Boolean(question.userAnswer);
  const answeredCardIds = Array.isArray(question.userAnswer?.cardIds)
    ? (question.userAnswer?.cardIds as string[]).map(String)
    : null;

  const [selected, setSelected] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (answeredCardIds) {
      setSelected(new Set(answeredCardIds));
      return;
    }
    setSelected(new Set());
  }, [question.id, answeredCardIds?.join(",")]);
  const correctAnswers: QuizNameTheCardsAnswer[] = Array.isArray(
    question.correctPayload?.answers
  )
    ? question.correctPayload.answers
    : [];
  const correctIds = new Set(correctAnswers.map((a) => String(a.cardId)));

  const toggle = (cardId: string) => {
    if (disabled || hasAnswered) return;
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(cardId)) next.delete(cardId);
      else next.add(cardId);
      return next;
    });
  };

  return (
    <div className="space-y-3">
      {questionNumberLabel && (
        <p className="text-sm font-semibold text-gray-700">{questionNumberLabel}</p>
      )}
      <QuizQuestionBadges question={question} />
      <p className="text-md md:text-lg font-medium text-gray-900">{question.prompt}</p>
      {materialCountHint != null && materialCountHint > 0 && (
        <p className="inline-flex items-center rounded-md border border-amber-300 bg-amber-50 px-3 py-1.5 text-sm font-bold text-amber-900">
          {t("quiz.summonerMaterialHint", { count: materialCountHint })}
        </p>
      )}

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

      <div className="grid gap-3 sm:grid-cols-2">
        {propositions.map((prop) => {
          const isSelected = selected.has(prop.cardId);
          const isCorrectMaterial = correctIds.has(prop.cardId);
          let ring = "";
          if (hasAnswered) {
            if (isCorrectMaterial && isSelected) ring = "ring-2 ring-green-400";
            else if (isCorrectMaterial && !isSelected)
              ring = "ring-2 ring-amber-400";
            else if (!isCorrectMaterial && isSelected)
              ring = "ring-2 ring-red-300";
          } else if (isSelected) {
            ring = "ring-2 ring-violet-400";
          }

          return (
            <button
              key={prop.id}
              type="button"
              disabled={disabled || hasAnswered}
              onClick={() => toggle(prop.cardId)}
              className={`flex items-center gap-3 rounded-lg bg-white p-3 text-left shadow-md disabled:cursor-default ${ring}`}
            >
              <input
                type="checkbox"
                className="h-5 w-5 accent-violet-700 shrink-0 pointer-events-none"
                checked={isSelected}
                readOnly
                tabIndex={-1}
              />
              {prop.artworkUrl && (
                <img
                  src={prop.artworkUrl}
                  alt=""
                  className="h-16 w-16 object-cover rounded shadow-sm"
                />
              )}
              <span className="font-medium text-gray-900">
                {prop.name || prop.label}
              </span>
            </button>
          );
        })}
      </div>

      {hasAnswered &&
        (!question.isCorrect || Boolean(question.userAnswer?.skipped)) &&
        correctAnswers.length > 0 && (
        <div className="rounded-lg bg-green-50 border border-green-200 p-3 space-y-2">
          <p className="text-sm font-semibold text-green-900">
            {t("quiz.summonerExpected")}
          </p>
          <div className="flex flex-wrap gap-3">
            {correctAnswers.map((answer, index) => (
              <div
                key={`expected-${answer.cardId}-${index}`}
                className="flex items-center gap-2 bg-white rounded p-2 shadow-sm"
              >
                {answer.artworkUrl && (
                  <img
                    src={answer.artworkUrl}
                    alt=""
                    className="h-12 w-12 object-cover rounded"
                  />
                )}
                <span className="text-sm font-medium text-gray-900">
                  {answer.name || answer.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {!hasAnswered && (
        <button
          type="button"
          disabled={disabled || selected.size === 0}
          onClick={() => onAnswer([...selected])}
          className="px-4 py-2 rounded bg-blue-700 text-white text-sm font-semibold hover:bg-blue-800 disabled:opacity-50"
        >
          {t("quiz.validateSummoner")}
        </button>
      )}

      {hasAnswered && (
        <QuizExplanationBlock
          explanation={question.explanation}
          explanationImageUrl={question.explanationImageUrl}
        />
      )}
    </div>
  );
};

export default SummonerQuestion;
