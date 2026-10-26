import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import type { QuizPublicQuestion } from "@/services/quiz";
import QuizQuestionBadges from "@/components/pages/quiz/QuizQuestionBadges";
import QuizChoiceCardPicker, {
  emptyChoiceCard,
  type ChoiceCard,
} from "@/components/pages/admin/quiz/QuizChoiceCardPicker";

const LEVELS = ["hard", "medium", "easy", "newbie"] as const;
type HintLevel = (typeof LEVELS)[number];

const POINTS_BY_LEVEL: Record<HintLevel, number> = {
  hard: 3,
  medium: 2,
  easy: 1,
  newbie: 0,
};

interface HintLadderQuestionProps {
  question: QuizPublicQuestion;
  disabled?: boolean;
  questionNumberLabel?: string | null;
  onAnswer: (payload: { cardId: string; level: HintLevel }) => void;
}

const HintLadderQuestion = ({
  question,
  disabled,
  questionNumberLabel,
  onAnswer,
}: HintLadderQuestionProps) => {
  const { t } = useTranslation();
  const [slot, setSlot] = useState<ChoiceCard>(emptyChoiceCard());
  const [revealedIndex, setRevealedIndex] = useState(0);

  const hints = useMemo(() => {
    const raw = question.payload.hints;
    if (!raw || typeof raw !== "object") {
      return { hard: "", medium: "", easy: "", newbie: "" };
    }
    const obj = raw as Record<string, unknown>;
    return {
      hard: String(obj.hard ?? ""),
      medium: String(obj.medium ?? ""),
      easy: String(obj.easy ?? ""),
      newbie: String(obj.newbie ?? ""),
    };
  }, [question.payload.hints]);

  const hasAnswered = Boolean(question.userAnswer);
  const answeredCardId =
    typeof question.userAnswer?.cardId === "string"
      ? question.userAnswer.cardId
      : null;
  const answeredLevel = useMemo(() => {
    const raw = question.userAnswer?.level ?? question.userAnswer?.hintLevel;
    const asString = String(raw ?? "hard");
    return LEVELS.includes(asString as HintLevel)
      ? (asString as HintLevel)
      : "hard";
  }, [question.userAnswer]);

  useEffect(() => {
    setSlot(emptyChoiceCard());
    setRevealedIndex(0);
  }, [question.id]);

  const currentLevel = LEVELS[Math.min(revealedIndex, LEVELS.length - 1)];
  const currentPoints = POINTS_BY_LEVEL[currentLevel];
  const canRevealMore = revealedIndex < LEVELS.length - 1;
  const correctAnswer = question.correctPayload?.answer ?? null;

  const visibleLevels = LEVELS.slice(0, revealedIndex + 1);

  return (
    <div className="space-y-3">
      {questionNumberLabel && (
        <p className="text-sm font-semibold text-gray-700">{questionNumberLabel}</p>
      )}
      <QuizQuestionBadges question={question} />
      <p className="text-md md:text-lg font-medium text-gray-900">{question.prompt}</p>
      <p className="text-sm text-gray-600">{t("quiz.hintLadderIntro")}</p>

      {!hasAnswered && (
        <div className="inline-flex items-center rounded bg-teal-100 px-3 py-1 text-sm font-semibold text-teal-900">
          {t("quiz.hintLadderLevel", {
            level: t(`quiz.hintLadderLevels.${currentLevel}`),
            points: currentPoints,
          })}
        </div>
      )}

      <div className="space-y-2">
        {(hasAnswered ? LEVELS : visibleLevels).map((level) => {
          const text = hints[level];
          if (!text) return null;
          return (
            <div
              key={level}
              className="rounded-lg border border-slate-200 bg-slate-50 p-3"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-600 mb-1">
                {t(`quiz.hintLadderLevels.${level}`)}
                <span className="ml-2 font-normal normal-case text-slate-500">
                  ({POINTS_BY_LEVEL[level]} {t("quiz.hintLadderPts")})
                </span>
              </p>
              <p className="text-sm text-gray-900">{text}</p>
            </div>
          );
        })}
      </div>

      {!hasAnswered && canRevealMore && (
        <button
          type="button"
          disabled={disabled}
          onClick={() => setRevealedIndex((i) => Math.min(i + 1, LEVELS.length - 1))}
          className="inline-flex items-center justify-center self-start px-4 py-2.5 rounded-lg bg-teal-700 text-white text-sm font-bold shadow-sm hover:bg-teal-800 focus:outline-none focus:ring-0 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {t("quiz.hintLadderRevealNext", {
            level: t(`quiz.hintLadderLevels.${LEVELS[revealedIndex + 1]}`),
          })}
        </button>
      )}

      {hasAnswered ? (
        <div className="mt-8 space-y-2">
          {question.isCorrect && correctAnswer ? (
            <div className="flex items-center gap-3 rounded-lg bg-green-50 ring-2 ring-green-400 p-3 shadow-md">
              {correctAnswer.artworkUrl && (
                <img
                  src={correctAnswer.artworkUrl}
                  alt=""
                  className="h-14 w-14 object-cover rounded"
                />
              )}
              <div>
                <p className="text-xs font-medium text-green-800">
                  {t("quiz.zoomCorrectAnswer")}
                </p>
                <p className="text-sm font-semibold text-gray-900">
                  {correctAnswer.name || correctAnswer.label}
                </p>
                {!Boolean(question.userAnswer?.skipped) && (
                  <p className="text-xs text-gray-600 mt-0.5">
                    {t("quiz.hintLadderAnsweredAt", {
                      level: t(`quiz.hintLadderLevels.${answeredLevel}`),
                      points: POINTS_BY_LEVEL[answeredLevel],
                    })}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <>
              {answeredCardId && (
                <div className="flex items-center gap-3 rounded-lg bg-red-50 ring-2 ring-red-300 p-3 shadow-md">
                  <div>
                    <p className="text-xs font-medium text-red-800">
                      {t("quiz.zoomYourAnswer")}
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                      {slot.name || slot.text || answeredCardId}
                    </p>
                    {!Boolean(question.userAnswer?.skipped) && (
                      <p className="text-xs text-gray-600 mt-0.5">
                        {t("quiz.hintLadderAnsweredAt", {
                          level: t(`quiz.hintLadderLevels.${answeredLevel}`),
                          points: POINTS_BY_LEVEL[answeredLevel],
                        })}
                      </p>
                    )}
                  </div>
                </div>
              )}
              {correctAnswer && (
                <div className="flex items-center gap-3 rounded-lg bg-green-50 border border-green-200 p-3">
                  {correctAnswer.artworkUrl && (
                    <img
                      src={correctAnswer.artworkUrl}
                      alt=""
                      className="h-14 w-14 object-cover rounded"
                    />
                  )}
                  <div>
                    <p className="text-xs font-medium text-green-800">
                      {t("quiz.hintLadderExpected")}
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                      {correctAnswer.name || correctAnswer.label}
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      ) : (
        <div className="mt-8 space-y-3 rounded-lg border border-slate-200 bg-slate-100 p-4">
          <QuizChoiceCardPicker
            label={t("quiz.hintLadderAnswerLabel")}
            labelClassName="text-sm font-bold text-gray-900"
            placeholder={t("quiz.hintLadderAnswerPlaceholder")}
            helperText={null}
            value={slot}
            disabled={disabled}
            onChange={setSlot}
          />
          <button
            type="button"
            disabled={disabled || !slot.cardId}
            onClick={() => {
              if (!slot.cardId) return;
              onAnswer({
                cardId: String(slot.cardId),
                level: currentLevel,
              });
            }}
            className="px-4 py-2 rounded bg-blue-700 text-white text-sm font-semibold hover:bg-blue-800 disabled:opacity-50"
          >
            {t("quiz.validateHintLadder")}
          </button>
        </div>
      )}

      {hasAnswered && question.explanation && (
        <p className="text-sm text-gray-700 bg-slate-50 border border-slate-200 rounded p-3">
          <span className="font-semibold">{t("quiz.explanation")} :</span>{" "}
          {question.explanation}
        </p>
      )}
    </div>
  );
};

export default HintLadderQuestion;
