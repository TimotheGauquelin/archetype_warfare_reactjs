import React, { useState } from "react";
import { toast } from "react-toastify";
import usePopup from "../../../../hooks/usePopup";
import PopUp from "../../../generic/PopUp";
import type { QuizDifficulty, QuizTheme } from "../../../../services/quiz";
import {
  switchAllQuizQuestionsToInactive,
  switchAllQuizQuestionsToNonDaily,
} from "../../../../services/quiz";

export type AdminQuizFilters = {
  prompt: string;
  theme: string;
  type: string;
  difficulty: "" | QuizDifficulty;
  is_active: "" | "true" | "false";
  was_daily_question: "" | "true" | "false";
};

interface AdminQuizFilterProps {
  themes: QuizTheme[];
  criteria: AdminQuizFilters;
  setCriteria: React.Dispatch<React.SetStateAction<AdminQuizFilters>>;
  resetAllFilters: () => void;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}

const AdminQuizFilter: React.FC<AdminQuizFilterProps> = ({
  themes,
  criteria,
  setCriteria,
  resetAllFilters,
  setRefresh,
}) => {
  const [displayGeneralActions, setDisplayGeneralActions] = useState(false);
  const { isOpen, popupConfig, closePopup, showConfirmDialog } = usePopup();

  const handleResetAllFiltersButton = () => {
    showConfirmDialog({
      title: "Confirmer la réinitialisation des filtres",
      message:
        "Êtes-vous sûr de vouloir réinitialiser tous les filtres de recherche ?",
      onConfirm: () => {
        resetAllFilters();
      },
    });
  };

  const handleSwitchAllToInactive = () => {
    showConfirmDialog({
      title: "Mettre toutes les questions en inactif",
      message:
        "Êtes-vous sûr de vouloir désactiver toutes les questions du quiz ?",
      onConfirm: () => {
        void (async () => {
          try {
            await switchAllQuizQuestionsToInactive(setRefresh);
            toast.success("Toutes les questions sont désormais inactives");
          } catch (error) {
            toast.error(
              error instanceof Error
                ? error.message
                : "Impossible de désactiver les questions"
            );
          }
        })();
      },
    });
  };

  const handleSwitchAllToNonDaily = () => {
    showConfirmDialog({
      title: "Libérer tous les créneaux Daily",
      message:
        "Retirer toutes les questions de leur jour planifié ? Le statut « déjà utilisée en Daily » est conservé (non replanifiable).",
      onConfirm: () => {
        void (async () => {
          try {
            await switchAllQuizQuestionsToNonDaily(setRefresh);
            toast.success("Tous les créneaux Daily ont été libérés");
          } catch (error) {
            toast.error(
              error instanceof Error
                ? error.message
                : "Impossible de libérer les créneaux"
            );
          }
        })();
      },
    });
  };

  return (
    <div className="bg-slate-200 rounded p-2">
      <div className="flex justify-between">
        <h2>Filtres : </h2>
        <p
          className="hover:text-red-500 cursor-pointer"
          onClick={() => handleResetAllFiltersButton()}
        >
          Reset les filtres
        </p>
      </div>

      <div className="flex justify-between items-center">
        <div className="grid grid-cols-12 pt-4 gap-4 flex justify-center items-center">
          <input
            className="col-span-3 p-2 rounded"
            placeholder="Quelle question recherchez-vous ?"
            type="text"
            value={criteria.prompt}
            onChange={(e) => {
              setCriteria((prev) => ({
                ...prev,
                prompt: e.target.value,
              }));
            }}
          />
          <select
            value={criteria.theme}
            className="col-span-2 p-2 rounded"
            onChange={(e) =>
              setCriteria((prev) => ({
                ...prev,
                theme: e.target.value,
              }))
            }
          >
            <option value="">-- Aucun thème --</option>
            {themes
              .filter((theme) => theme.slug !== "all")
              .map((theme) => (
                <option key={theme.id} value={theme.slug}>
                  {theme.label}
                </option>
              ))}
          </select>
          <select
            value={criteria.type}
            className="col-span-2 p-2 rounded"
            onChange={(e) =>
              setCriteria((prev) => ({
                ...prev,
                type: e.target.value,
              }))
            }
          >
            <option value="">-- Aucun type --</option>
            <option value="mcq">MCQ</option>
            <option value="true_false">Vrai / Faux</option>
            <option value="order">Dans l&apos;ordre</option>
            <option value="name_the_cards">Trouvez le nom</option>
            <option value="summoner">Invocateur</option>
            <option value="zoom">Zoom</option>
            <option value="hint_ladder">Indices</option>
          </select>
          <select
            value={criteria.difficulty}
            className="col-span-2 p-2 rounded"
            onChange={(e) =>
              setCriteria((prev) => ({
                ...prev,
                difficulty: e.target.value as AdminQuizFilters["difficulty"],
              }))
            }
          >
            <option value="">-- Aucune difficulté --</option>
            <option value="easy">Facile</option>
            <option value="medium">Moyen</option>
            <option value="hard">Difficile</option>
          </select>
          <select
            value={criteria.is_active}
            className="col-span-1 p-2 rounded"
            onChange={(e) =>
              setCriteria((prev) => ({
                ...prev,
                is_active: e.target.value as AdminQuizFilters["is_active"],
              }))
            }
          >
            <option value="">-- Statut --</option>
            <option value="true">Actives</option>
            <option value="false">Inactives</option>
          </select>
          <select
            value={criteria.was_daily_question}
            className="col-span-1 p-2 rounded"
            onChange={(e) =>
              setCriteria((prev) => ({
                ...prev,
                was_daily_question: e.target
                  .value as AdminQuizFilters["was_daily_question"],
              }))
            }
          >
            <option value="">-- Daily --</option>
            <option value="true">Déjà utilisée</option>
            <option value="false">Jamais utilisée</option>
          </select>
          <p
            className="col-span-1 flex justify-end hover:text-red-500 cursor-pointer text-sm whitespace-nowrap"
            onClick={() => {
              setDisplayGeneralActions(!displayGeneralActions);
            }}
          >
            Actions générales
          </p>
        </div>
      </div>

      {displayGeneralActions && (
        <div className="mt-2 space-y-2">
          <div className="bg-slate-200 rounded p-2">
            <div className="flex items-center flex-wrap gap-2">
              <p>Mettre toutes les questions en inactif :</p>
              <button
                type="button"
                className="bg-red-200 p-1 rounded text-white hover:bg-red-300"
                onClick={handleSwitchAllToInactive}
              >
                Activer !
              </button>
            </div>
          </div>
          <div className="bg-slate-200 rounded p-2">
            <div className="flex items-center flex-wrap gap-2">
              <p>Libérer tous les créneaux Daily :</p>
              <button
                type="button"
                className="bg-red-200 p-1 rounded text-white hover:bg-red-300"
                onClick={handleSwitchAllToNonDaily}
              >
                Activer !
              </button>
            </div>
          </div>
        </div>
      )}

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
    </div>
  );
};

export default AdminQuizFilter;
