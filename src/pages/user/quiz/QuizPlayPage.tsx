import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import UserBasicLayout from "../layout";
import {
  finishQuizAttempt,
  getQuizAttempt,
  submitQuizAnswer,
  type QuizAttempt,
} from "@/services/quiz";
import McqQuestion from "@/components/pages/quiz/McqQuestion";
import TrueFalseQuestion from "@/components/pages/quiz/TrueFalseQuestion";
import OrderQuestion from "@/components/pages/quiz/OrderQuestion";
import NameTheCardsQuestion from "@/components/pages/quiz/NameTheCardsQuestion";
import SummonerQuestion from "@/components/pages/quiz/SummonerQuestion";
import ZoomQuestion from "@/components/pages/quiz/ZoomQuestion";
import HintLadderQuestion from "@/components/pages/quiz/HintLadderQuestion";
import PopUp from "@/components/generic/PopUp";
import usePopup from "@/hooks/usePopup";
import {
  URL_FRONT_LOGIN,
  URL_FRONT_QUIZ,
} from "@/constant/urlsFront";
import type { RootState } from "@/types";
import Loader from "@/components/generic/Loader";

const QuizPlayPage = () => {
  const { attemptId } = useParams<{ attemptId: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isOpen, popupConfig, closePopup, showConfirmDialog } = usePopup();
  const isAuthenticated = useSelector(
    (state: RootState) => state.user.isAuthenticated
  );
  const [attempt, setAttempt] = useState<QuizAttempt | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [hintUsed, setHintUsed] = useState(false);
  const [draftAnswer, setDraftAnswer] = useState<Record<string, unknown> | null>(
    null
  );
  const timeoutSubmittedRef = useRef(false);
  const questionBlockRef = useRef<HTMLDivElement>(null);
  const liveSubmitRef = useRef<(() => Record<string, unknown> | null) | null>(
    null
  );
  const handleDraftChange = useCallback(
    (draft: Record<string, unknown> | null) => {
      setDraftAnswer(draft);
    },
    []
  );
  const handleRegisterSubmit = useCallback(
    (submit: (() => Record<string, unknown> | null) | null) => {
      liveSubmitRef.current = submit;
    },
    []
  );

  const loadAttempt = useCallback(async () => {
    if (!attemptId) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await getQuizAttempt(attemptId);
      setAttempt(data);
      const allAnswered = data.questions.every((q) => q.userAnswer);
      const isFreeFinished =
        data.mode !== "daily" && data.status === "finished" && allAnswered;
      setShowResults(isFreeFinished);
      if (!isFreeFinished) {
        const firstUnanswered = data.questions.findIndex((q) => !q.userAnswer);
        setCurrentIndex(firstUnanswered >= 0 ? firstUnanswered : 0);
      }
      timeoutSubmittedRef.current = false;
    } catch {
      setError(t("quiz.loadAttemptError"));
    } finally {
      setIsLoading(false);
    }
  }, [attemptId, t]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(URL_FRONT_LOGIN);
      return;
    }
    loadAttempt();
  }, [isAuthenticated, navigate, loadAttempt]);

  const currentQuestion = useMemo(
    () => attempt?.questions[currentIndex] ?? null,
    [attempt, currentIndex]
  );

  useEffect(() => {
    if (!currentQuestion?.id || showResults) return;
    questionBlockRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [currentQuestion?.id, currentIndex, showResults]);

  useEffect(() => {
    setHintUsed(false);
    setDraftAnswer(null);
    liveSubmitRef.current = null;
  }, [currentQuestion?.id]);

  const isDaily = attempt?.mode === "daily";

  // Zoom a son propre chrono (3 phases) : ne pas afficher le chrono daily global
  const isDailyTimerActive =
    Boolean(isDaily) &&
    attempt?.status === "in_progress" &&
    Boolean(currentQuestion) &&
    currentQuestion?.type !== "zoom" &&
    !currentQuestion?.userAnswer &&
    typeof attempt?.timeLimitSeconds === "number" &&
    attempt.timeLimitSeconds > 0 &&
    Boolean(attempt?.timerStartedAt);

  useEffect(() => {
    if (!isDailyTimerActive || !attempt?.timerStartedAt || !attempt.timeLimitSeconds) {
      setSecondsLeft(null);
      return;
    }

    const tick = () => {
      const started = new Date(attempt.timerStartedAt as string).getTime();
      const remainingMs = attempt.timeLimitSeconds! * 1000 - (Date.now() - started);
      setSecondsLeft(Math.max(0, Math.ceil(remainingMs / 1000)));
    };

    tick();
    const interval = window.setInterval(tick, 200);
    return () => window.clearInterval(interval);
  }, [isDailyTimerActive, attempt?.timerStartedAt, attempt?.timeLimitSeconds]);

  const handleAnswer = useCallback(
    async (answer: Record<string, unknown>) => {
      if (!attempt || !currentQuestion || isSubmitting) return;
      if (currentQuestion.userAnswer) return;
      setIsSubmitting(true);
      setError(null);
      try {
        const payload =
          attempt.mode === "daily" && hintUsed
            ? { ...answer, usedHint: true }
            : answer;
        const updated = await submitQuizAnswer(
          attempt.id,
          currentQuestion.id,
          payload
        );
        // Daily : finaliser sans écran résultat (comportement d’origine)
        if (
          updated.mode === "daily" &&
          updated.status !== "finished" &&
          updated.questions.every((q) => q.userAnswer)
        ) {
          try {
            const finished = await finishQuizAttempt(updated.id);
            setAttempt(finished);
          } catch {
            setAttempt(updated);
            setError(t("quiz.finishError"));
          }
        } else {
          setAttempt(updated);
        }
      } catch {
        setError(t("quiz.answerError"));
      } finally {
        setIsSubmitting(false);
      }
    },
    [attempt, currentQuestion, hintUsed, isSubmitting, t]
  );

  const handleSkip = useCallback(() => {
    void handleAnswer({ skipped: true });
  }, [handleAnswer]);

  const handleValidate = useCallback(() => {
    if (currentQuestion?.type === "zoom") {
      const payload = liveSubmitRef.current?.();
      if (!payload) return;
      void handleAnswer(payload);
      return;
    }
    if (!draftAnswer) return;
    void handleAnswer(draftAnswer);
  }, [currentQuestion?.type, draftAnswer, handleAnswer]);

  const usesSharedValidate =
    currentQuestion?.type === "mcq" ||
    currentQuestion?.type === "true_false" ||
    currentQuestion?.type === "order" ||
    currentQuestion?.type === "name_the_cards" ||
    currentQuestion?.type === "summoner" ||
    currentQuestion?.type === "zoom" ||
    currentQuestion?.type === "hint_ladder";

  useEffect(() => {
    if (!isDailyTimerActive || secondsLeft === null || secondsLeft > 0) return;
    if (timeoutSubmittedRef.current || isSubmitting) return;
    timeoutSubmittedRef.current = true;
    void handleAnswer({ timedOut: true, selectedIndex: -1, value: null });
  }, [isDailyTimerActive, secondsLeft, isSubmitting, handleAnswer]);

  const goNext = useCallback(async () => {
    if (!attempt || attempt.mode === "daily") return;
    if (currentIndex < attempt.questions.length - 1) {
      setCurrentIndex((i) => i + 1);
      timeoutSubmittedRef.current = false;
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      if (attempt.status !== "finished") {
        const finished = await finishQuizAttempt(attempt.id);
        setAttempt(finished);
      }
      setShowResults(true);
    } catch {
      setError(t("quiz.finishError"));
    } finally {
      setIsSubmitting(false);
    }
  }, [attempt, currentIndex, t]);

  const timerUrgent = secondsLeft !== null && secondsLeft <= 5;

  const freeQuestionNumberLabel =
    !isDaily && attempt
      ? t("quiz.questionNumber", {
          current: Math.min(currentIndex + 1, attempt.totalCount),
          total: attempt.totalCount,
        })
      : null;

  const isLastQuestion =
    Boolean(attempt) && currentIndex >= (attempt?.questions.length ?? 0) - 1;

  const showResultsSlide =
    Boolean(attempt) && showResults && attempt?.mode !== "daily";

  const leaveToHub = useCallback(async () => {
    if (!attempt) {
      navigate(URL_FRONT_QUIZ);
      return;
    }
    if (attempt.status === "in_progress") {
      try {
        await finishQuizAttempt(attempt.id);
      } catch {
        // On quitte quand même le hub même si la finalisation échoue.
      }
    }
    navigate(URL_FRONT_QUIZ);
  }, [attempt, navigate]);

  const handleBackToHubClick = useCallback(() => {
    if (!attempt || attempt.status !== "in_progress") {
      navigate(URL_FRONT_QUIZ);
      return;
    }
    showConfirmDialog({
      title: t("quiz.leaveConfirmTitle"),
      message: isDaily
        ? t("quiz.leaveConfirmDaily")
        : t("quiz.leaveConfirmFree"),
      confirmText: t("quiz.leaveConfirmYes"),
      cancelText: t("quiz.leaveConfirmNo"),
      onConfirm: () => {
        void leaveToHub();
      },
    });
  }, [attempt, isDaily, leaveToHub, navigate, showConfirmDialog, t]);

  return (
    <UserBasicLayout
      mainTitle={
        showResultsSlide
          ? t("quiz.resultTitle")
          : attempt?.theme?.label ?? t("quiz.playTitle")
      }
      subTitle={
        showResultsSlide
          ? t("quiz.resultSubtitle")
          : attempt
            ? t("quiz.progress", {
                current: Math.min(currentIndex + 1, attempt.totalCount),
                total: attempt.totalCount,
              })
            : t("quiz.playTitle")
      }
    >
      <div className="px-4 py-6 max-w-2xl mx-auto">
        {isLoading && (
          <div className="flex justify-center py-10">
            <Loader />
          </div>
        )}

        {error && (
          <p className="text-red-600 bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            {error}
          </p>
        )}

        {!isLoading && attempt && showResultsSlide && (
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm space-y-6 text-center">
            <p className="text-sm text-gray-500">
              {isDaily ? t("quiz.modeDaily") : t("quiz.modeFree")}
              {attempt.theme?.label ? ` · ${attempt.theme.label}` : ""}
            </p>
            <p className="text-3xl font-bold text-gray-900">
              {t("quiz.finalScore", {
                score: attempt.score,
                max: attempt.maxScore,
              })}
            </p>
            <button
              type="button"
              onClick={() => navigate(URL_FRONT_QUIZ)}
              className="inline-flex items-center justify-center px-5 py-2.5 rounded bg-blue-700 text-white text-sm font-semibold hover:bg-blue-800"
            >
              {t("quiz.backToHub")}
            </button>
          </div>
        )}

        {!isLoading && attempt && !showResultsSlide && currentQuestion && (
          <div
            id="quiz-question"
            ref={questionBlockRef}
            className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm space-y-5 scroll-mt-4"
          >
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>
                {isDaily ? t("quiz.modeDaily") : t("quiz.modeFree")}
              </span>
              <button
                type="button"
                onClick={handleBackToHubClick}
                className="text-blue-600 hover:underline"
              >
                ← {t("quiz.backToHub")}
              </button>
            </div>

            {isDailyTimerActive && secondsLeft !== null && (
              <div
                className={`rounded-lg border px-4 py-3 text-center ${
                  timerUrgent
                    ? "border-red-300 bg-red-50 text-red-700"
                    : "border-amber-200 bg-amber-50 text-amber-800"
                }`}
              >
                <p className="text-xs font-semibold uppercase tracking-wide mb-1">
                  {t("quiz.timerLabel")}
                </p>
                <p className="text-3xl font-bold tabular-nums">
                  {t("quiz.timerSeconds", { seconds: secondsLeft })}
                </p>
              </div>
            )}

            {currentQuestion.type === "mcq" && (
              <McqQuestion
                key={currentQuestion.id}
                question={currentQuestion}
                questionNumberLabel={freeQuestionNumberLabel}
                forfeitPointsOnHint={isDaily}
                onHintUsed={() => setHintUsed(true)}
                disabled={isSubmitting || (isDailyTimerActive && secondsLeft === 0)}
                onDraftChange={handleDraftChange}
              />
            )}

            {currentQuestion.type === "true_false" && (
              <TrueFalseQuestion
                key={currentQuestion.id}
                question={currentQuestion}
                questionNumberLabel={freeQuestionNumberLabel}
                forfeitPointsOnHint={isDaily}
                onHintUsed={() => setHintUsed(true)}
                disabled={isSubmitting || (isDailyTimerActive && secondsLeft === 0)}
                onDraftChange={handleDraftChange}
              />
            )}

            {currentQuestion.type === "order" && (
              <OrderQuestion
                key={currentQuestion.id}
                question={currentQuestion}
                questionNumberLabel={freeQuestionNumberLabel}
                forfeitPointsOnHint={isDaily}
                onHintUsed={() => setHintUsed(true)}
                disabled={isSubmitting || (isDailyTimerActive && secondsLeft === 0)}
                onDraftChange={handleDraftChange}
              />
            )}

            {currentQuestion.type === "name_the_cards" && (
              <NameTheCardsQuestion
                key={currentQuestion.id}
                question={currentQuestion}
                questionNumberLabel={freeQuestionNumberLabel}
                forfeitPointsOnHint={isDaily}
                onHintUsed={() => setHintUsed(true)}
                disabled={isSubmitting || (isDailyTimerActive && secondsLeft === 0)}
                onDraftChange={handleDraftChange}
              />
            )}

            {currentQuestion.type === "summoner" && (
              <SummonerQuestion
                key={currentQuestion.id}
                question={currentQuestion}
                questionNumberLabel={freeQuestionNumberLabel}
                forfeitPointsOnHint={isDaily}
                onHintUsed={() => setHintUsed(true)}
                disabled={isSubmitting || (isDailyTimerActive && secondsLeft === 0)}
                onDraftChange={handleDraftChange}
              />
            )}

            {currentQuestion.type === "zoom" && (
              <ZoomQuestion
                key={currentQuestion.id}
                question={currentQuestion}
                questionNumberLabel={freeQuestionNumberLabel}
                disabled={isSubmitting || (isDailyTimerActive && secondsLeft === 0)}
                onAnswer={(payload) => handleAnswer(payload)}
                onDraftChange={handleDraftChange}
                onRegisterSubmit={handleRegisterSubmit}
              />
            )}

            {currentQuestion.type === "hint_ladder" && (
              <HintLadderQuestion
                key={currentQuestion.id}
                question={currentQuestion}
                questionNumberLabel={freeQuestionNumberLabel}
                disabled={isSubmitting || (isDailyTimerActive && secondsLeft === 0)}
                onDraftChange={handleDraftChange}
              />
            )}

            {!currentQuestion.userAnswer &&
              (usesSharedValidate || !isDaily) && (
              <div className="flex justify-end gap-2 pt-1">
                {usesSharedValidate && (
                  <button
                    type="button"
                    onClick={handleValidate}
                    disabled={isSubmitting || !draftAnswer}
                    className="px-4 py-2 rounded bg-blue-700 text-white text-sm font-semibold hover:bg-blue-800 disabled:opacity-50"
                  >
                    {t("quiz.validateAnswer")}
                  </button>
                )}
                {!isDaily && (
                  <button
                    type="button"
                    onClick={handleSkip}
                    disabled={isSubmitting}
                    className="px-4 py-2 rounded border border-gray-300 bg-white text-gray-700 text-sm font-semibold hover:bg-gray-50 disabled:opacity-50"
                  >
                    {t("quiz.skip")}
                  </button>
                )}
              </div>
            )}

            {!isDaily && currentQuestion.userAnswer && (
              <div className="flex items-center justify-between gap-3 pt-2">
                <p
                  className={`text-sm font-medium ${
                    currentQuestion.isCorrect ? "text-green-700" : "text-red-700"
                  }`}
                >
                  {Boolean(currentQuestion.userAnswer?.skipped)
                    ? t("quiz.skipped")
                    : Boolean(currentQuestion.userAnswer?.timedOut)
                      ? t("quiz.timedOut")
                      : currentQuestion.isCorrect
                        ? t("quiz.correct")
                        : t("quiz.incorrect")}
                </p>
                <button
                  type="button"
                  onClick={() => void goNext()}
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded bg-blue-700 text-white text-sm font-semibold hover:bg-blue-800 disabled:opacity-50"
                >
                  {isLastQuestion ? t("quiz.seeScore") : t("quiz.next")}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <PopUp
        isOpen={isOpen}
        onClose={closePopup}
        title={popupConfig.title}
        className={popupConfig.className}
        showCloseButton={popupConfig.showCloseButton}
        closeOnBackdropClick={popupConfig.closeOnBackdropClick}
      >
        {popupConfig.content}
      </PopUp>
    </UserBasicLayout>
  );
};

export default QuizPlayPage;
