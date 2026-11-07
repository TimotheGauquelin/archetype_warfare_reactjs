import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import usePopup from "../../../../hooks/usePopup";
import PopUp from "../../../generic/PopUp";
import { Input } from "../../../generic/form/input/Input";
import SelectInput from "../../../generic/form/SelectInput";
import type { QuizDifficulty, QuizTheme } from "../../../../services/quiz";
import {
  switchAllQuizQuestionsToActive,
  switchAllQuizQuestionsToInactive,
  switchAllQuizQuestionsToNonDaily,
} from "../../../../services/quiz";
import { FaCalendar, FaEye, FaEyeSlash } from "react-icons/fa";

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
  selectedIds: number[];
  onClearSelection: () => void;
  /** Force l'ouverture du panneau Actions générales (ex. au clic d'une checkbox). */
  openGeneralActionsSignal?: number;
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
  selectedIds,
  onClearSelection,
  openGeneralActionsSignal = 0,
}) => {
  const [displayGeneralActions, setDisplayGeneralActions] = useState(false);
  const { isOpen, popupConfig, closePopup, showConfirmDialog } = usePopup();
  const selectedCount = selectedIds.length;

  useEffect(() => {
    if (openGeneralActionsSignal > 0) {
      setDisplayGeneralActions(true);
    }
  }, [openGeneralActionsSignal]);

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

  const requireSelection = (): boolean => {
    if (selectedCount === 0) {
      toast.warning("Sélectionnez au moins une question dans le tableau.");
      return false;
    }
    return true;
  };

  const handleSwitchSelectedToInactive = () => {
    if (!requireSelection()) return;
    showConfirmDialog({
      title: "Mettre les questions sélectionnées en inactif",
      message: `Êtes-vous sûr de vouloir désactiver ${selectedCount} question${
        selectedCount > 1 ? "s" : ""
      } ?`,
      onConfirm: () => {
        void (async () => {
          try {
            await switchAllQuizQuestionsToInactive(setRefresh, selectedIds);
            toast.success(
              `${selectedCount} question${selectedCount > 1 ? "s" : ""} désormais inactive${
                selectedCount > 1 ? "s" : ""
              }`
            );
            onClearSelection();
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

  const handleSwitchSelectedToActive = () => {
    if (!requireSelection()) return;
    showConfirmDialog({
      title: "Mettre les questions sélectionnées en actif",
      message: `Êtes-vous sûr de vouloir activer ${selectedCount} question${
        selectedCount > 1 ? "s" : ""
      } ?`,
      onConfirm: () => {
        void (async () => {
          try {
            await switchAllQuizQuestionsToActive(setRefresh, selectedIds);
            toast.success(
              `${selectedCount} question${selectedCount > 1 ? "s" : ""} désormais active${
                selectedCount > 1 ? "s" : ""
              }`
            );
            onClearSelection();
          } catch (error) {
            toast.error(
              error instanceof Error
                ? error.message
                : "Impossible d'activer les questions"
            );
          }
        })();
      },
    });
  };

  const handleSwitchSelectedToNonDaily = () => {
    if (!requireSelection()) return;
    showConfirmDialog({
      title: "Libérer les créneaux Daily sélectionnés",
      message: `Retirer ${selectedCount} question${
        selectedCount > 1 ? "s" : ""
      } de leur jour planifié ? Elles restent dans le pool Daily si elles y étaient.`,
      onConfirm: () => {
        void (async () => {
          try {
            await switchAllQuizQuestionsToNonDaily(setRefresh, selectedIds);
            toast.success(
              `Créneaux Daily libérés pour ${selectedCount} question${
                selectedCount > 1 ? "s" : ""
              }`
            );
            onClearSelection();
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
            {selectedCount > 0 ? ` (${selectedCount})` : ""}
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
            className="flex items-center justify-center tablet:justify-start bg-orange-100 hover:bg-orange-200 p-2 tablet:p-1 rounded text-orange-500 font-semibold text-sm disabled:opacity-50"
            onClick={handleSwitchSelectedToNonDaily}
            disabled={selectedCount === 0}
          >
            <FaCalendar className="mr-2 shrink-0" />
            Passer les sélectionnées en « non-planifiées » pour le daily
            {selectedCount > 0 ? ` (${selectedCount})` : ""}
          </button>
          <button
            type="button"
            className="flex items-center justify-center tablet:justify-start bg-green-100 hover:bg-green-200 p-2 tablet:p-1 rounded text-green-600 font-semibold text-sm disabled:opacity-50"
            onClick={handleSwitchSelectedToActive}
            disabled={selectedCount === 0}
          >
            <FaEye className="mr-2 shrink-0" />
            Changer la sélection en « actives »
            {selectedCount > 0 ? ` (${selectedCount})` : ""}
          </button>
          <button
            type="button"
            className="flex items-center justify-center tablet:justify-start bg-red-100 hover:bg-red-200 p-2 tablet:p-1 rounded text-red-500 font-semibold text-sm disabled:opacity-50"
            onClick={handleSwitchSelectedToInactive}
            disabled={selectedCount === 0}
          >
            <FaEyeSlash className="mr-2 shrink-0" />
            Changer la sélection en « inactives »
            {selectedCount > 0 ? ` (${selectedCount})` : ""}
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
