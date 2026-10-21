import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
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
  const isAuthenticated = useSelector(
    (state: RootState) => state.user.isAuthenticated
  );
  const [attempt, setAttempt] = useState<QuizAttempt | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const timeoutSubmittedRef = useRef(false);

  const loadAttempt = useCallback(async () => {
    if (!attemptId) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await getQuizAttempt(attemptId);
      setAttempt(data);
      const firstUnanswered = data.questions.findIndex((q) => !q.userAnswer);
      setCurrentIndex(firstUnanswered >= 0 ? firstUnanswered : 0);
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
        const updated = await submitQuizAnswer(
          attempt.id,
          currentQuestion.id,
          answer
        );
        setAttempt(updated);
      } catch {
        setError(t("quiz.answerError"));
      } finally {
        setIsSubmitting(false);
      }
    },
    [attempt, currentQuestion, isSubmitting, t]
  );

  const handleSkip = useCallback(() => {
    void handleAnswer({ skipped: true });
  }, [handleAnswer]);

  useEffect(() => {
    if (!isDailyTimerActive || secondsLeft === null || secondsLeft > 0) return;
    if (timeoutSubmittedRef.current || isSubmitting) return;
    timeoutSubmittedRef.current = true;
    void handleAnswer({ timedOut: true, selectedIndex: -1, value: null });
  }, [isDailyTimerActive, secondsLeft, isSubmitting, handleAnswer]);

  const goNext = async () => {
    if (!attempt) return;
    if (currentIndex < attempt.questions.length - 1) {
      setCurrentIndex((i) => i + 1);
      return;
    }
    if (attempt.status !== "finished") {
      setIsSubmitting(true);
      try {
        const updated = await finishQuizAttempt(attempt.id);
        setAttempt(updated);
      } catch {
        setError(t("quiz.finishError"));
      } finally {
        setIsSubmitting(false);
      }
    }
  };

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

  return (
    <UserBasicLayout
      mainTitle={attempt?.theme?.label ?? t("quiz.playTitle")}
      subTitle={
        attempt
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

        {!isLoading && attempt && currentQuestion && (
          <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm space-y-5">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>
                {isDaily ? t("quiz.modeDaily") : t("quiz.modeFree")}
              </span>
              <Link
                to={URL_FRONT_QUIZ}
                className="text-blue-600 hover:underline"
              >
                ← {t("quiz.backToHub")}
              </Link>
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
                disabled={isSubmitting || (isDailyTimerActive && secondsLeft === 0)}
                onAnswer={(selectedIndex) =>
                  handleAnswer({ selectedIndex })
                }
              />
            )}

            {currentQuestion.type === "true_false" && (
              <TrueFalseQuestion
                key={currentQuestion.id}
                question={currentQuestion}
                questionNumberLabel={freeQuestionNumberLabel}
                disabled={isSubmitting || (isDailyTimerActive && secondsLeft === 0)}
                onAnswer={(value) => handleAnswer({ value })}
              />
            )}

            {currentQuestion.type === "order" && (
              <OrderQuestion
                key={currentQuestion.id}
                question={currentQuestion}
                questionNumberLabel={freeQuestionNumberLabel}
                disabled={isSubmitting || (isDailyTimerActive && secondsLeft === 0)}
                onAnswer={(order) => handleAnswer({ order })}
              />
            )}

            {currentQuestion.type === "name_the_cards" && (
              <NameTheCardsQuestion
                key={currentQuestion.id}
                question={currentQuestion}
                questionNumberLabel={freeQuestionNumberLabel}
                disabled={isSubmitting || (isDailyTimerActive && secondsLeft === 0)}
                onAnswer={(cardIds) => handleAnswer({ cardIds })}
              />
            )}

            {currentQuestion.type === "summoner" && (
              <SummonerQuestion
                key={currentQuestion.id}
                question={currentQuestion}
                questionNumberLabel={freeQuestionNumberLabel}
                disabled={isSubmitting || (isDailyTimerActive && secondsLeft === 0)}
                onAnswer={(cardIds) => handleAnswer({ cardIds })}
              />
            )}

            {currentQuestion.type === "zoom" && (
              <ZoomQuestion
                key={currentQuestion.id}
                question={currentQuestion}
                questionNumberLabel={freeQuestionNumberLabel}
                disabled={isSubmitting || (isDailyTimerActive && secondsLeft === 0)}
                onAnswer={(payload) => handleAnswer(payload)}
              />
            )}

            {currentQuestion.type === "hint_ladder" && (
              <HintLadderQuestion
                key={currentQuestion.id}
                question={currentQuestion}
                questionNumberLabel={freeQuestionNumberLabel}
                disabled={isSubmitting || (isDailyTimerActive && secondsLeft === 0)}
                onAnswer={(payload) => handleAnswer(payload)}
              />
            )}

            {!isDaily && !currentQuestion.userAnswer && (
              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={handleSkip}
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded border border-gray-300 bg-white text-gray-700 text-sm font-semibold hover:bg-gray-50 disabled:opacity-50"
                >
                  {t("quiz.skip")}
                </button>
              </div>
            )}

            {/* Feedback : uniquement en partie libre */}
            {!isDaily && currentQuestion.userAnswer && (
              <div className="flex items-center justify-between gap-3 pt-2">
                <div className="space-y-1">
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
                </div>
                {!isLastQuestion && (
                  <button
                    type="button"
                    onClick={goNext}
                    disabled={isSubmitting}
                    className="px-4 py-2 rounded bg-blue-700 text-white text-sm font-semibold hover:bg-blue-800 disabled:opacity-50"
                  >
                    {t("quiz.next")}
                  </button>
                )}
                {isLastQuestion && attempt.status !== "finished" && (
                  <button
                    type="button"
                    onClick={goNext}
                    disabled={isSubmitting}
                    className="px-4 py-2 rounded bg-blue-700 text-white text-sm font-semibold hover:bg-blue-800 disabled:opacity-50"
                  >
                    {t("quiz.finish")}
                  </button>
                )}
              </div>
            )}

            {!isDaily &&
              attempt.status === "finished" &&
              isLastQuestion &&
              currentQuestion.userAnswer && (
                <div className="border-t border-gray-100 pt-4">
                  <p className="text-lg font-bold text-gray-900">
                    {t("quiz.finalScore", {
                      score: attempt.score,
                      max: attempt.maxScore,
                    })}
                  </p>
                </div>
              )}
          </div>
        )}
      </div>
    </UserBasicLayout>
  );
};

export default QuizPlayPage;
