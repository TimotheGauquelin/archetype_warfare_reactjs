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
  for_daily: "" | "true" | "false";
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
  { id: "mcq", label: "QCM" },
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

const FOR_DAILY_OPTIONS = [
  { id: "true", label: "Pour le Daily" },
  { id: "false", label: "Question libre" },
];

const WAS_DAILY_OPTIONS = [
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
        "Retirer toutes les questions de leur jour planifié ? Elles restent dans le pool Daily si elles y étaient.",
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
    <div className="border border-gray-200 bg-slate-100 rounded p-2 tablet:p-3">
      <div className="flex flex-col tablet:flex-row tablet:justify-between gap-2">
        <h2 className="text-md font-semibold">Filtres :</h2>
        <div className="flex flex-row tablet:flex-col flex-wrap tablet:items-end gap-x-4 gap-y-1 text-sm">
          <button
            type="button"
            className="hover:text-red-500 cursor-pointer text-left"
            onClick={() => handleResetAllFiltersButton()}
          >
            Reset les filtres
          </button>
          <button
            type="button"
            className="hover:text-blue-500 cursor-pointer text-left"
            onClick={() => {
              setDisplayGeneralActions(!displayGeneralActions);
            }}
          >
            Actions générales
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-2 tablet:gap-3 sscreen:gap-4 items-end pt-2">
        <div className="col-span-12 tablet:col-span-6 sscreen:col-span-3">
          <Input
            attribute="prompt"
            data={criteria}
            setAction={setCriteria}
            placeholder="Quelle question recherchez-vous ?"
            inputType="text"
            colSpanWidth="12"
          />
        </div>
        <div className="col-span-6 tablet:col-span-3 sscreen:col-span-2">
          <SelectInput
            attribute="theme"
            data={criteria}
            setAction={setCriteria}
            defaultOptionLabel="-- Aucun thème --"
            options={themeOptions}
            colSpanWidth="12"
            ariaLabel="Thème"
          />
        </div>
        <div className="col-span-6 tablet:col-span-3 sscreen:col-span-2">
          <SelectInput
            attribute="type"
            data={criteria}
            setAction={setCriteria}
            defaultOptionLabel="-- Aucun type --"
            options={TYPE_OPTIONS}
            colSpanWidth="12"
            ariaLabel="Type"
          />
        </div>
        <div className="col-span-6 tablet:col-span-4 sscreen:col-span-2">
          <SelectInput
            attribute="difficulty"
            data={criteria}
            setAction={setCriteria}
            defaultOptionLabel="-- Aucune difficulté --"
            options={DIFFICULTY_OPTIONS}
            colSpanWidth="12"
            ariaLabel="Difficulté"
          />
        </div>
        <div className="col-span-6 tablet:col-span-4 sscreen:col-span-1">
          <SelectInput
            attribute="is_active"
            data={criteria}
            setAction={setCriteria}
            defaultOptionLabel="-- Statut --"
            options={ACTIVE_OPTIONS}
            colSpanWidth="12"
            ariaLabel="Statut"
          />
        </div>
        <div className="col-span-6 tablet:col-span-4 sscreen:col-span-1">
          <SelectInput
            attribute="for_daily"
            data={criteria}
            setAction={setCriteria}
            defaultOptionLabel="-- Destination --"
            options={FOR_DAILY_OPTIONS}
            colSpanWidth="12"
            ariaLabel="Destination"
          />
        </div>
        <div className="col-span-6 tablet:col-span-4 sscreen:col-span-1">
          <SelectInput
            attribute="was_daily_question"
            data={criteria}
            setAction={setCriteria}
            defaultOptionLabel="-- Historique Daily --"
            options={WAS_DAILY_OPTIONS}
            colSpanWidth="12"
            ariaLabel="Historique Daily"
          />
        </div>
      </div>

      {displayGeneralActions && (
        <div className="flex flex-col tablet:flex-row flex-wrap bg-white border border-gray-200 rounded-lg p-2 mt-2 gap-2">
          <button
            type="button"
            className="flex items-center justify-center tablet:justify-start bg-orange-100 hover:bg-orange-200 p-2 tablet:p-1 rounded text-orange-500 font-semibold text-sm"
            onClick={handleSwitchAllToNonDaily}
          >
            <FaCalendar className="mr-2 shrink-0" />
            Changer toutes les questions en « non-planifiées » pour le daily
          </button>
          <button
            type="button"
            className="flex items-center justify-center tablet:justify-start bg-red-100 hover:bg-red-200 p-2 tablet:p-1 rounded text-red-500 font-semibold text-sm"
            onClick={handleSwitchAllToInactive}
          >
            <FaEyeSlash className="mr-2 shrink-0" />
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
