import { useState } from "react";
import { useTranslation } from "react-i18next";
import PopUp from "@/components/generic/PopUp";
import usePopup from "@/hooks/usePopup";

interface QuizQuestionHintProps {
  hint: string;
  /** Daily : avertir que l'indice annule les points */
  forfeitPointsOnHint?: boolean;
  onHintUsed?: () => void;
}

const QuizQuestionHint = ({
  hint,
  forfeitPointsOnHint = false,
  onHintUsed,
}: QuizQuestionHintProps) => {
  const { t } = useTranslation();
  const [showHint, setShowHint] = useState(false);
  const { isOpen, popupConfig, closePopup, showConfirmDialog } = usePopup();

  const reveal = () => {
    setShowHint(true);
    onHintUsed?.();
  };

  const handleClick = () => {
    if (!forfeitPointsOnHint) {
      reveal();
      return;
    }
    showConfirmDialog({
      title: t("quiz.hintForfeitTitle"),
      message: t("quiz.hintForfeitMessage"),
      confirmText: t("quiz.hintForfeitConfirm"),
      cancelText: t("quiz.hintForfeitCancel"),
      onConfirm: reveal,
    });
  };

  return (
    <>
      <div className="space-y-1">
        {!showHint ? (
          <button
            type="button"
            className="text-sm text-blue-700 hover:underline"
            onClick={handleClick}
          >
            {t("quiz.showHint")}
          </button>
        ) : (
          <p className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded p-2">
            <span className="font-semibold">{t("quiz.hint")} :</span> {hint}
            {forfeitPointsOnHint && (
              <span className="block mt-1 text-xs font-medium text-amber-900">
                {t("quiz.hintForfeitActive")}
              </span>
            )}
          </p>
        )}
      </div>
      <PopUp
        isOpen={isOpen}
        onClose={closePopup}
        title={popupConfig.title}
        showCloseButton={popupConfig.showCloseButton}
        closeOnBackdropClick={popupConfig.closeOnBackdropClick}
        className={popupConfig.className}
      >
        {popupConfig.content}
      </PopUp>
    </>
  );
};

export default QuizQuestionHint;
