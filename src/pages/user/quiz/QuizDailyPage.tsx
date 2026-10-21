import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import UserBasicLayout from "../layout";
import { startDailyQuiz } from "@/services/quiz";
import {
  URL_FRONT_LOGIN,
  URL_FRONT_QUIZ,
  URL_FRONT_QUIZ_PLAY,
} from "@/constant/urlsFront";
import type { RootState } from "@/types";
import Loader from "@/components/generic/Loader";

const QuizDailyPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isAuthenticated = useSelector(
    (state: RootState) => state.user.isAuthenticated
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(URL_FRONT_LOGIN);
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const attempt = await startDailyQuiz();
        if (!cancelled) {
          navigate(URL_FRONT_QUIZ_PLAY(attempt.id), { replace: true });
        }
      } catch {
        if (!cancelled) setError(t("quiz.startError"));
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, navigate, t]);

  return (
    <UserBasicLayout
      mainTitle={t("quiz.dailyTitle")}
      subTitle={t("quiz.starting")}
    >
      <div className="px-4 py-10 max-w-xl mx-auto text-center">
        {error ? (
          <div className="space-y-3">
            <p className="text-red-600">{error}</p>
            <Link to={URL_FRONT_QUIZ} className="text-blue-700 hover:underline">
              {t("quiz.backToHub")}
            </Link>
          </div>
        ) : (
          <div className="flex justify-center">
            <Loader />
          </div>
        )}
      </div>
    </UserBasicLayout>
  );
};

export default QuizDailyPage;
