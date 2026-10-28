import React, { useMemo } from "react";
import { toast } from "react-toastify";
import usePopup from "../../../../hooks/usePopup";
import PopUp from "../../../generic/PopUp";
import { Input } from "../../../generic/form/input/Input";
import SelectInput from "../../../generic/form/SelectInput";
import type { UserRoleOption } from "../../../../services/user";

export type AdminUserFilters = {
  q: string;
  is_active: "" | "true" | "false";
  is_banned: "" | "true" | "false";
  role: string;
} & Record<string, unknown>;

interface AdminUserFilterProps {
  roles: UserRoleOption[];
  criteria: AdminUserFilters;
  setCriteria: React.Dispatch<React.SetStateAction<AdminUserFilters>>;
  resetAllFilters: () => void;
}

const ACTIVE_OPTIONS = [
  { id: "true", label: "Actifs" },
  { id: "false", label: "Inactifs" },
];

const BANNED_OPTIONS = [
  { id: "true", label: "Bannis" },
  { id: "false", label: "Non bannis" },
];

const AdminUserFilter: React.FC<AdminUserFilterProps> = ({
  roles,
  criteria,
  setCriteria,
  resetAllFilters,
}) => {
  const { isOpen, popupConfig, closePopup, showConfirmDialog } = usePopup();

  const roleOptions = useMemo(
    () =>
      roles
        .filter((role) => role.label)
        .map((role) => ({ id: role.label, label: role.label })),
    [roles]
  );

  const handleResetAllFiltersButton = () => {
    showConfirmDialog({
      title: "Confirmer la réinitialisation des filtres",
      message:
        "Êtes-vous sûr de vouloir réinitialiser tous les filtres de recherche ?",
      onConfirm: () => {
        resetAllFilters();
        toast.success("Vous avez mis les filtres à leur état d'origine.");
      },
    });
  };

  return (
    <div className="border border-gray-200 bg-slate-100 rounded p-2 tablet:p-3">
      <div className="flex flex-col tablet:flex-row tablet:justify-between gap-2">
        <h2 className="text-md font-semibold">Filtres :</h2>
        <button
          type="button"
          className="hover:text-red-500 cursor-pointer text-sm text-left tablet:text-right"
          onClick={() => handleResetAllFiltersButton()}
        >
          Reset les filtres
        </button>
      </div>

      <div className="grid grid-cols-12 gap-2 tablet:gap-3 sscreen:gap-4 items-end pt-2">
        <div className="col-span-12 tablet:col-span-6 sscreen:col-span-4">
          <Input
            attribute="q"
            data={criteria}
            setAction={setCriteria}
            placeholder="Pseudo ou email…"
            inputType="text"
            colSpanWidth="12"
          />
        </div>
        <div className="col-span-6 tablet:col-span-3 sscreen:col-span-2">
          <SelectInput
            attribute="is_active"
            data={criteria}
            setAction={setCriteria}
            defaultOptionLabel="-- Actif --"
            options={ACTIVE_OPTIONS}
            colSpanWidth="12"
            ariaLabel="Actif"
          />
        </div>
        <div className="col-span-6 tablet:col-span-3 sscreen:col-span-2">
          <SelectInput
            attribute="is_banned"
            data={criteria}
            setAction={setCriteria}
            defaultOptionLabel="-- Banni --"
            options={BANNED_OPTIONS}
            colSpanWidth="12"
            ariaLabel="Banni"
          />
        </div>
        <div className="col-span-12 tablet:col-span-6 sscreen:col-span-2">
          <SelectInput
            attribute="role"
            data={criteria}
            setAction={setCriteria}
            defaultOptionLabel="-- Rôle --"
            options={roleOptions}
            colSpanWidth="12"
            ariaLabel="Rôle"
          />
        </div>
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
    </div>
  );
};

export default AdminUserFilter;
