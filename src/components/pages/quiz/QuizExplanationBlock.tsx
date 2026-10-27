import { useTranslation } from "react-i18next";

interface QuizExplanationBlockProps {
  explanation?: string | null;
  explanationImageUrl?: string | null;
}

const QuizExplanationBlock = ({
  explanation,
  explanationImageUrl,
}: QuizExplanationBlockProps) => {
  const { t } = useTranslation();
  const text = explanation?.trim() || "";
  const image = explanationImageUrl?.trim() || "";
  if (!text && !image) return null;

  return (
    <div className="text-sm text-gray-700 bg-slate-50 border border-slate-200 rounded p-3 space-y-2">
      {text && (
        <p>
          <span className="font-semibold">{t("quiz.explanation")} :</span>{" "}
          {text}
        </p>
      )}
      {image && (
        <div className="flex justify-center pt-1">
          <img
            src={image}
            alt=""
            className="max-h-56 w-auto rounded border border-slate-200 object-contain"
          />
        </div>
      )}
    </div>
  );
};

export default QuizExplanationBlock;
