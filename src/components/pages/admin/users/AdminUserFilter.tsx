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
    <div className="border border-gray-200 bg-slate-100 rounded p-2">
      <div className="flex justify-between">
        <h2 className="text-md font-semibold">Filtres : </h2>
        <p
          className="hover:text-red-500 cursor-pointer"
          onClick={() => handleResetAllFiltersButton()}
        >
          Reset les filtres
        </p>
      </div>

      <div className="grid grid-cols-12 gap-4 items-end pt-2">
        <Input
          attribute="q"
          data={criteria}
          setAction={setCriteria}
          placeholder="Pseudo ou email…"
          inputType="text"
          colSpanWidth="4"
        />
        <SelectInput
          attribute="is_active"
          data={criteria}
          setAction={setCriteria}
          defaultOptionLabel="-- Actif --"
          options={ACTIVE_OPTIONS}
          colSpanWidth="2"
          ariaLabel="Actif"
        />
        <SelectInput
          attribute="is_banned"
          data={criteria}
          setAction={setCriteria}
          defaultOptionLabel="-- Banni --"
          options={BANNED_OPTIONS}
          colSpanWidth="2"
          ariaLabel="Banni"
        />
        <SelectInput
          attribute="role"
          data={criteria}
          setAction={setCriteria}
          defaultOptionLabel="-- Rôle --"
          options={roleOptions}
          colSpanWidth="2"
          ariaLabel="Rôle"
        />
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
