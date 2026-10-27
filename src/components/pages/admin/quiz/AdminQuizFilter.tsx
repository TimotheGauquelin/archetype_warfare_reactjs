import React, { useMemo, useState } from "react";
import { toast } from "react-toastify";
import usePopup from "../../../../hooks/usePopup";
import PopUp from "../../../generic/PopUp";
import { Input } from "../../../generic/form/input/Input";
import SelectInput from "../../../generic/form/SelectInput";
import type { QuizDifficulty, QuizTheme } from "../../../../services/quiz";
import {
  switchAllQuizQuestionsToInactive,
  switchAllQuizQuestionsToNonDaily,
} from "../../../../services/quiz";
import { FaCalendar, FaEyeSlash } from "react-icons/fa";

export type AdminQuizFilters = {
  prompt: string;
  theme: string;
  type: string;
  difficulty: "" | QuizDifficulty;
  is_active: "" | "true" | "false";
  was_daily_question: "" | "true" | "false";
} & Record<string, unknown>;

interface AdminQuizFilterProps {
  themes: QuizTheme[];
  criteria: AdminQuizFilters;
  setCriteria: React.Dispatch<React.SetStateAction<AdminQuizFilters>>;
  resetAllFilters: () => void;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}

const TYPE_OPTIONS = [
  { id: "mcq", label: "MCQ" },
  { id: "true_false", label: "Vrai / Faux" },
  { id: "order", label: "Dans l'ordre" },
  { id: "name_the_cards", label: "Trouvez le nom" },
  { id: "summoner", label: "Invocateur" },
  { id: "zoom", label: "Zoom" },
  { id: "hint_ladder", label: "Indices" },
];

const DIFFICULTY_OPTIONS = [
  { id: "easy", label: "Facile" },
  { id: "medium", label: "Moyen" },
  { id: "hard", label: "Difficile" },
];

const ACTIVE_OPTIONS = [
  { id: "true", label: "Actives" },
  { id: "false", label: "Inactives" },
];

const DAILY_OPTIONS = [
  { id: "true", label: "Déjà sortie en Daily" },
  { id: "false", label: "Pas encore sortie" },
];

const AdminQuizFilter: React.FC<AdminQuizFilterProps> = ({
  themes,
  criteria,
  setCriteria,
  resetAllFilters,
  setRefresh,
}) => {
  const [displayGeneralActions, setDisplayGeneralActions] = useState(false);
  const { isOpen, popupConfig, closePopup, showConfirmDialog } = usePopup();

  const themeOptions = useMemo(
    () =>
      themes
        .filter((theme) => theme.slug !== "all")
        .map((theme) => ({ id: theme.slug, label: theme.label })),
    [themes]
  );

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
        "Retirer toutes les questions de leur jour planifié ? Le statut « déjà sortie en Daily » est conservé (non replanifiable).",
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
    <div className="border border-gray-200 bg-slate-100 rounded p-2">
      <div className="flex justify-between">
        <h2 className="text-md font-semibold">Filtres : </h2>
        <div className="flex flex-col items-center gap-2">
          <p
            className="hover:text-red-500 cursor-pointer"
            onClick={() => handleResetAllFiltersButton()}
          >
            Reset les filtres
          </p>
          <p
            className="hover:text-blue-500 cursor-pointer"
            onClick={() => {
              setDisplayGeneralActions(!displayGeneralActions);
            }}
          >
            Actions générales
          </p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4 items-end pt-2">
        <Input
          attribute="prompt"
          data={criteria}
          setAction={setCriteria}
          placeholder="Quelle question recherchez-vous ?"
          inputType="text"
          colSpanWidth="3"
        />
        <SelectInput
          attribute="theme"
          data={criteria}
          setAction={setCriteria}
          defaultOptionLabel="-- Aucun thème --"
          options={themeOptions}
          colSpanWidth="2"
          ariaLabel="Thème"
        />
        <SelectInput
          attribute="type"
          data={criteria}
          setAction={setCriteria}
          defaultOptionLabel="-- Aucun type --"
          options={TYPE_OPTIONS}
          colSpanWidth="2"
          ariaLabel="Type"
        />
        <SelectInput
          attribute="difficulty"
          data={criteria}
          setAction={setCriteria}
          defaultOptionLabel="-- Aucune difficulté --"
          options={DIFFICULTY_OPTIONS}
          colSpanWidth="2"
          ariaLabel="Difficulté"
        />
        <SelectInput
          attribute="is_active"
          data={criteria}
          setAction={setCriteria}
          defaultOptionLabel="-- Statut --"
          options={ACTIVE_OPTIONS}
          colSpanWidth="1"
          ariaLabel="Statut"
        />
        <SelectInput
          attribute="was_daily_question"
          data={criteria}
          setAction={setCriteria}
          defaultOptionLabel="-- Daily --"
          options={DAILY_OPTIONS}
          colSpanWidth="1"
          ariaLabel="Daily"
        />
      </div>

      {displayGeneralActions && (
        <div className="flex bg-white border border-gray-200 rounded-lg p-2 mt-2 space-x-2">
          <button
            type="button"
            className="flex items-center bg-orange-100 hover:bg-orange-200 p-1 rounded text-orange-500 font-semibold"
            onClick={handleSwitchAllToNonDaily}
          >
            <FaCalendar className="mr-2" />
            Changer toutes les questions en « non-planifiées » pour le daily
          </button>
          <button
            type="button"
            className="flex items-center bg-red-100 hover:bg-red-200 p-1 rounded text-red-500 font-semibold"
            onClick={handleSwitchAllToInactive}
          >
            <FaEyeSlash className="mr-2" />
            Changer toutes les questions en « inactives »
          </button>
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
