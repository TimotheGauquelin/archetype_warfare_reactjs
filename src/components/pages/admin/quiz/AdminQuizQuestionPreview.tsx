import { useCallback, useEffect, useMemo, useState } from "react";
import type { QuizPublicQuestion } from "@/services/quiz";
import McqQuestion from "@/components/pages/quiz/McqQuestion";
import TrueFalseQuestion from "@/components/pages/quiz/TrueFalseQuestion";
import OrderQuestion from "@/components/pages/quiz/OrderQuestion";
import NameTheCardsQuestion from "@/components/pages/quiz/NameTheCardsQuestion";
import SummonerQuestion from "@/components/pages/quiz/SummonerQuestion";
import ZoomQuestion from "@/components/pages/quiz/ZoomQuestion";
import HintLadderQuestion from "@/components/pages/quiz/HintLadderQuestion";
import {
  evaluatePreviewAnswer,
  toPreviewPublicQuestion,
  type PreviewFormSnapshot,
} from "@/utils/quiz/toPreviewPublicQuestion";

type AdminQuizQuestionPreviewProps = {
  form: PreviewFormSnapshot;
  themeLabel?: string;
};

/**
 * Prévisualisation interactive (composants joueur) pour tester une question admin.
 */
const AdminQuizQuestionPreview = ({
  form,
  themeLabel,
}: AdminQuizQuestionPreviewProps) => {
  const model = useMemo(
    () => toPreviewPublicQuestion(form, themeLabel),
    [form, themeLabel]
  );

  const [previewQuestion, setPreviewQuestion] = useState<QuizPublicQuestion>(
    model.question
  );
  const [draftAnswer, setDraftAnswer] = useState<Record<string, unknown> | null>(
    null
  );
  const [sessionKey, setSessionKey] = useState(0);

  useEffect(() => {
    setPreviewQuestion(model.question);
    setDraftAnswer(null);
    setSessionKey((k) => k + 1);
  }, [model]);

  const handleDraftChange = useCallback(
    (draft: Record<string, unknown> | null) => {
      setDraftAnswer(draft);
    },
    []
  );

  const applyAnswer = useCallback(
    (answer: Record<string, unknown>) => {
      const { isCorrect, correctPayload } = evaluatePreviewAnswer(
        model.question.type,
        model.solution,
        answer
      );
      setPreviewQuestion((prev) => ({
        ...prev,
        userAnswer: answer,
        isCorrect,
        correctPayload,
      }));
      setDraftAnswer(null);
    },
    [model.question.type, model.solution]
  );

  const handleReset = () => {
    setPreviewQuestion(model.question);
    setDraftAnswer(null);
    setSessionKey((k) => k + 1);
  };

  const usesSharedValidate =
    previewQuestion.type === "mcq" ||
    previewQuestion.type === "true_false" ||
    previewQuestion.type === "order" ||
    previewQuestion.type === "name_the_cards" ||
    previewQuestion.type === "summoner" ||
    previewQuestion.type === "hint_ladder";

  const hasAnswered = Boolean(previewQuestion.userAnswer);

  return (
    <div className="space-y-4">

      <div className="bg-slate-50 border border-gray-200 rounded-lg p-4 tablet:p-5 shadow-sm space-y-4 max-w-3xl">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>Aperçu · {previewQuestion.type}</span>
          <button
            type="button"
            onClick={handleReset}
            className="text-blue-600 hover:underline font-medium"
          >
            Réinitialiser
          </button>
        </div>

        {previewQuestion.type === "mcq" && (
          <McqQuestion
            key={sessionKey}
            question={previewQuestion}
            questionNumberLabel="Prévisualisation"
            onDraftChange={handleDraftChange}
          />
        )}
        {previewQuestion.type === "true_false" && (
          <TrueFalseQuestion
            key={sessionKey}
            question={previewQuestion}
            questionNumberLabel="Prévisualisation"
            onDraftChange={handleDraftChange}
          />
        )}
        {previewQuestion.type === "order" && (
          <OrderQuestion
            key={sessionKey}
            question={previewQuestion}
            questionNumberLabel="Prévisualisation"
            onDraftChange={handleDraftChange}
          />
        )}
        {previewQuestion.type === "name_the_cards" && (
          <NameTheCardsQuestion
            key={sessionKey}
            question={previewQuestion}
            questionNumberLabel="Prévisualisation"
            onDraftChange={handleDraftChange}
          />
        )}
        {previewQuestion.type === "summoner" && (
          <SummonerQuestion
            key={sessionKey}
            question={previewQuestion}
            questionNumberLabel="Prévisualisation"
            onDraftChange={handleDraftChange}
          />
        )}
        {previewQuestion.type === "zoom" && (
          <ZoomQuestion
            key={sessionKey}
            question={previewQuestion}
            questionNumberLabel="Prévisualisation"
            onAnswer={(payload) => applyAnswer(payload as Record<string, unknown>)}
            onDraftChange={handleDraftChange}
          />
        )}
        {previewQuestion.type === "hint_ladder" && (
          <HintLadderQuestion
            key={sessionKey}
            question={previewQuestion}
            questionNumberLabel="Prévisualisation"
            onDraftChange={handleDraftChange}
          />
        )}

        {!hasAnswered && usesSharedValidate && (
          <div className="flex justify-end pt-1">
            <button
              type="button"
              onClick={() => {
                if (!draftAnswer) return;
                applyAnswer(draftAnswer);
              }}
              disabled={!draftAnswer}
              className="px-4 py-2 rounded bg-blue-700 text-white text-sm font-semibold hover:bg-blue-800 disabled:opacity-50"
            >
              Valider (test)
            </button>
          </div>
        )}

        {hasAnswered && (
          <div className="flex items-center justify-between gap-3 pt-2 border-t border-gray-200">
            <p
              className={`text-sm font-medium ${
                previewQuestion.isCorrect ? "text-green-700" : "text-red-700"
              }`}
            >
              {previewQuestion.isCorrect
                ? "Bonne réponse (aperçu)"
                : "Mauvaise réponse (aperçu)"}
            </p>
            <button
              type="button"
              onClick={handleReset}
              className="px-3 py-1.5 rounded border border-gray-300 bg-white text-gray-700 text-sm font-semibold hover:bg-gray-50"
            >
              Rejouer
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminQuizQuestionPreview;
