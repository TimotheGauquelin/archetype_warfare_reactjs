import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import type { QuizPublicQuestion } from "@/services/quiz";
import QuizQuestionBadges from "@/components/pages/quiz/QuizQuestionBadges";
import QuizQuestionHint from "@/components/pages/quiz/QuizQuestionHint";
import QuizExplanationBlock from "@/components/pages/quiz/QuizExplanationBlock";

export type OrderItem = {
  id: string;
  label: string;
  imageUrl?: string | null;
};

interface OrderQuestionProps {
  question: QuizPublicQuestion;
  disabled?: boolean;
  questionNumberLabel?: string | null;
  forfeitPointsOnHint?: boolean;
  onHintUsed?: () => void;
  onDraftChange?: (draft: { order: string[] } | null) => void;
}

const shuffle = <T,>(items: T[]): T[] => {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const OrderQuestion = ({
  question,
  disabled,
  questionNumberLabel,
  forfeitPointsOnHint,
  onHintUsed,
  onDraftChange,
}: OrderQuestionProps) => {
  const { t } = useTranslation();
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const sourceItems = useMemo((): OrderItem[] => {
    const raw = question.payload.items ?? [];
    return raw.map((item, index) => ({
      id: String(item.id ?? index),
      label: item.label ?? "",
      imageUrl: item.imageUrl ?? null,
    }));
  }, [question.payload.items]);

  const hasAnswered = Boolean(question.userAnswer);
  const answeredOrder = Array.isArray(question.userAnswer?.order)
    ? (question.userAnswer?.order as string[])
    : null;
  const correctOrder = question.correctPayload?.correctOrder ?? null;

  const [ordered, setOrdered] = useState<OrderItem[]>([]);

  useEffect(() => {
    const map = new Map(sourceItems.map((item) => [item.id, item]));
    if (answeredOrder && answeredOrder.length > 0) {
      setOrdered(
        answeredOrder
          .map((id) => map.get(String(id)))
          .filter((item): item is OrderItem => Boolean(item))
      );
      onDraftChange?.(null);
      return;
    }
    if (hasAnswered && correctOrder && correctOrder.length > 0) {
      // Passé sans ordre : afficher l'ordre correct
      setOrdered(
        correctOrder
          .map((id) => map.get(String(id)))
          .filter((item): item is OrderItem => Boolean(item))
      );
      onDraftChange?.(null);
      return;
    }
    const shuffled = shuffle(sourceItems);
    setOrdered(shuffled);
    onDraftChange?.({ order: shuffled.map((item) => item.id) });
    // Shuffle once per question load (not on every items identity change)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question.id, hasAnswered, answeredOrder?.join(","), correctOrder?.join(",")]);

  const moveItem = (from: number, to: number) => {
    if (from === to || from < 0 || to < 0 || hasAnswered || disabled) return;
    setOrdered((prev) => {
      const next = [...prev];
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item);
      onDraftChange?.({ order: next.map((entry) => entry.id) });
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
      <p className="text-sm text-gray-600">{t("quiz.orderHint")}</p>

      {question.hint && !hasAnswered && (
        <QuizQuestionHint
          hint={question.hint}
          forfeitPointsOnHint={forfeitPointsOnHint}
          onHintUsed={onHintUsed}
        />
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        {ordered.map((item, index) => (
          <div
            key={item.id}
            draggable={!disabled && !hasAnswered}
            onDragStart={() => setDragIndex(index)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => {
              if (dragIndex === null) return;
              moveItem(dragIndex, index);
              setDragIndex(null);
            }}
            onDragEnd={() => setDragIndex(null)}
            className={`rounded-lg bg-white p-3 shadow-md ${
              !disabled && !hasAnswered ? "cursor-grab active:cursor-grabbing" : ""
            } ${
              hasAnswered && correctOrder
                ? correctOrder[index] === item.id
                  ? "ring-2 ring-green-400"
                  : "ring-2 ring-red-300"
                : ""
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-gray-500 w-6">
                {index + 1}.
              </span>
              {item.imageUrl && (
                <img
                  src={item.imageUrl}
                  alt=""
                  className="h-16 w-16 object-cover rounded shadow-sm"
                  draggable={false}
                />
              )}
              <span className="font-medium text-gray-900">{item.label}</span>
            </div>
          </div>
        ))}
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

export default OrderQuestion;
