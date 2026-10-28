import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import type { QuizPublicQuestion } from "@/services/quiz";
import QuizQuestionBadges from "@/components/pages/quiz/QuizQuestionBadges";
import QuizExplanationBlock from "@/components/pages/quiz/QuizExplanationBlock";
import QuizChoiceCardPicker, {
  emptyChoiceCard,
  type ChoiceCard,
} from "@/components/pages/admin/quiz/QuizChoiceCardPicker";

const PHASE_SCALES = [4.5, 2.2, 1] as const;
const PHASE_POINTS = [3, 2, 1] as const;

type ZoomAnswerPayload = {
  cardId?: string;
  phase?: number;
  elapsedMs?: number;
  timedOut?: boolean;
};

interface ZoomQuestionProps {
  question: QuizPublicQuestion;
  disabled?: boolean;
  questionNumberLabel?: string | null;
  onAnswer: (payload: ZoomAnswerPayload) => void;
  onDraftChange?: (draft: Record<string, unknown> | null) => void;
  onRegisterSubmit?: (submit: (() => ZoomAnswerPayload | null) | null) => void;
}

const ZoomQuestion = ({
  question,
  disabled,
  questionNumberLabel,
  onAnswer,
  onDraftChange,
  onRegisterSubmit,
}: ZoomQuestionProps) => {
  const { t } = useTranslation();
  const [showHint, setShowHint] = useState(false);
  const [slot, setSlot] = useState<ChoiceCard>(emptyChoiceCard());
  const startedAtRef = useRef<number>(Date.now());
  const timeoutSubmittedRef = useRef(false);
  const [elapsedMs, setElapsedMs] = useState(0);

  const phaseDurationSeconds = useMemo(() => {
    const raw = Number(question.payload.phaseDurationSeconds) || 15;
    return Math.max(5, Math.min(30, raw));
  }, [question.payload.phaseDurationSeconds]);

  const focusX = Number(question.payload.focusX) || 50;
  const focusY = Number(question.payload.focusY) || 50;

  const hasAnswered = Boolean(question.userAnswer);
  const answeredCardId =
    typeof question.userAnswer?.cardId === "string"
      ? question.userAnswer.cardId
      : null;
  const answeredName =
    (typeof question.userAnswer?.name === "string" &&
      question.userAnswer.name) ||
    (typeof question.userAnswer?.label === "string" &&
      question.userAnswer.label) ||
    null;
  const answeredArtworkUrl =
    typeof question.userAnswer?.artworkUrl === "string"
      ? question.userAnswer.artworkUrl
      : null;

  useEffect(() => {
    startedAtRef.current = Date.now();
    setElapsedMs(0);
    setSlot(emptyChoiceCard());
    setShowHint(false);
    timeoutSubmittedRef.current = false;
    onDraftChange?.(null);
  }, [question.id, onDraftChange]);

  useEffect(() => {
    if (hasAnswered || disabled) return;
    const tick = () => setElapsedMs(Date.now() - startedAtRef.current);
    tick();
    const interval = window.setInterval(tick, 200);
    return () => window.clearInterval(interval);
  }, [hasAnswered, disabled, question.id]);

  const phaseDurationMs = phaseDurationSeconds * 1000;
  const totalDurationMs = phaseDurationMs * 3;
  const timeExpired = !hasAnswered && elapsedMs >= totalDurationMs;
  const phase = Math.min(
    3,
    Math.floor(
      Math.min(elapsedMs, Math.max(totalDurationMs - 1, 0)) / phaseDurationMs
    ) + 1
  );
  const phaseIndex = phase - 1;
  const scale = PHASE_SCALES[phaseIndex] ?? 1;
  const phasePoints = PHASE_POINTS[phaseIndex] ?? 1;
  const phaseEndMs = phase * phaseDurationMs;
  const secondsLeftInPhase = Math.max(
    0,
    Math.ceil((phaseEndMs - elapsedMs) / 1000)
  );
  const secondsLeftTotal = Math.max(
    0,
    Math.ceil((totalDurationMs - elapsedMs) / 1000)
  );
  const timerUrgent = secondsLeftInPhase <= 5 || timeExpired;

  useEffect(() => {
    if (hasAnswered || timeExpired || !slot.cardId) {
      onDraftChange?.(null);
    } else {
      onDraftChange?.({ cardId: String(slot.cardId) });
    }
  }, [hasAnswered, timeExpired, slot.cardId, onDraftChange]);

  useEffect(() => {
    if (!onRegisterSubmit) return;
    onRegisterSubmit(() => {
      if (!slot.cardId || timeExpired || hasAnswered) return null;
      const elapsed = Date.now() - startedAtRef.current;
      if (elapsed >= totalDurationMs) return null;
      const currentPhase = Math.min(
        3,
        Math.floor(Math.min(elapsed, totalDurationMs - 1) / phaseDurationMs) + 1
      );
      return {
        cardId: String(slot.cardId),
        phase: currentPhase,
        elapsedMs: elapsed,
      };
    });
    return () => onRegisterSubmit(null);
  }, [
    onRegisterSubmit,
    slot.cardId,
    timeExpired,
    hasAnswered,
    totalDurationMs,
    phaseDurationMs,
  ]);

  // À 0 s : plus de réponse possible, soumission auto (révèle la bonne réponse)
  useEffect(() => {
    if (!timeExpired || hasAnswered || disabled) return;
    if (timeoutSubmittedRef.current) return;
    timeoutSubmittedRef.current = true;
    onDraftChange?.(null);
    onAnswer({
      timedOut: true,
      phase: 3,
      elapsedMs: totalDurationMs,
    });
  }, [
    timeExpired,
    hasAnswered,
    disabled,
    onAnswer,
    onDraftChange,
    totalDurationMs,
  ]);

  const correctAnswer = question.correctPayload?.answer ?? null;
  const userAnswerLabel =
    slot.name || slot.text || answeredName || answeredCardId;
  const userAnswerArtwork = slot.artworkUrl || answeredArtworkUrl;

  return (
    <div className="space-y-3">
      {questionNumberLabel && (
        <p className="text-sm font-semibold text-gray-700">{questionNumberLabel}</p>
      )}
      <QuizQuestionBadges question={question} />
      <p className="text-md md:text-lg font-medium text-gray-900">{question.prompt}</p>
      <p className="text-sm text-gray-600">{t("quiz.zoomHint")}</p>

      {!hasAnswered && (
        <div
          className={`rounded-lg border px-4 py-3 text-center ${
            timerUrgent
              ? "border-red-300 bg-red-50 text-red-700"
              : "border-amber-200 bg-amber-50 text-amber-800"
          }`}
        >
          <p className="text-xs font-semibold uppercase tracking-wide mb-1">
            {t("quiz.zoomPhase", {
              phase,
              points: phasePoints,
              of: 3,
            })}
          </p>
          <p className="text-3xl font-bold tabular-nums">
            {t("quiz.timerSeconds", { seconds: secondsLeftInPhase })}
          </p>
          <p className="mt-1 text-xs font-medium tabular-nums opacity-90">
            {t("quiz.zoomTotalTimer", {
              seconds: secondsLeftTotal,
              total: phaseDurationSeconds * 3,
            })}
          </p>
        </div>
      )}

      {question.imageUrl && (
        <div className="flex justify-center">
          <div className="aspect-square w-full max-w-[min(100%,20rem)] overflow-hidden rounded-lg bg-slate-900 shadow-lg">
            <img
              src={question.imageUrl}
              alt=""
              className="h-full w-full object-cover transition-transform duration-700 ease-out"
              style={{
                objectPosition: `${focusX}% ${focusY}%`,
                transform: `scale(${hasAnswered ? 1 : scale})`,
                transformOrigin: `${focusX}% ${focusY}%`,
              }}
            />
          </div>
        </div>
      )}

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

      {hasAnswered ? (
        <div className="space-y-2">
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
              </div>
            </div>
          ) : (
            <>
              {answeredCardId && (
                <div className="flex items-center gap-3 rounded-lg bg-red-50 ring-2 ring-red-300 p-3 shadow-md">
                  {userAnswerArtwork && (
                    <img
                      src={userAnswerArtwork}
                      alt=""
                      className="h-14 w-14 object-cover rounded"
                    />
                  )}
                  <div>
                    <p className="text-xs font-medium text-red-800">
                      {t("quiz.zoomYourAnswer")}
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                      {userAnswerLabel}
                    </p>
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
                      {t("quiz.zoomExpected")}
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
        <QuizChoiceCardPicker
          label={t("quiz.zoomAnswerLabel")}
          value={slot}
          disabled={disabled || timeExpired}
          onChange={setSlot}
        />
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

export default ZoomQuestion;
