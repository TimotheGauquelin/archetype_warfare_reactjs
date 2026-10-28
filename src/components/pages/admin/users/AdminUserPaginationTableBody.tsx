import React from "react";
import CheckboxSlider from "../../../generic/CheckboxSlider";
import {
  deleteUserByAdmin,
  switchIsActive,
  switchIsBanned,
} from "../../../../services/user";
import { Link } from "react-router-dom";
import type { User } from "../../../../types";
import usePopup from "../../../../hooks/usePopup";
import PopUp from "../../../generic/PopUp";

interface AdminUserPaginationTableBodyProps {
  arrayItems: User[];
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}

const AdminUserPaginationTableBody: React.FC<
  AdminUserPaginationTableBodyProps
> = ({ arrayItems, setRefresh }) => {
  const { isOpen, popupConfig, closePopup, showConfirmDialog } = usePopup();

  const handleDelete = (user: User) => {
    if (user.id == null) return;
    showConfirmDialog({
      title: "Suppression de l'utilisateur",
      message: `Êtes-vous sûr de vouloir supprimer « ${user.username ?? "cet utilisateur"} » ? Cette action est irréversible.`,
      confirmText: "Supprimer",
      cancelText: "Annuler",
      onConfirm: () => {
        void deleteUserByAdmin(user.id!, setRefresh);
      },
    });
  };

  if (!arrayItems || arrayItems.length === 0) {
    return (
      <div className="col-span-12 p-4 border border-l border-r text-center">
        Aucun utilisateur trouvé.
      </div>
    );
  }

  const roleBadges = (item: User) =>
    item?.roles && item.roles.length > 0 ? (
      [...item.roles]
        .map((role) =>
          typeof role === "string"
            ? role
            : ((role as { label?: string }).label ?? "")
        )
        .sort((a, b) => a.localeCompare(b))
        .map((role) => (
          <span
            key={role}
            className={`text-xs rounded-sm shrink-0 ${
              role === "Admin"
                ? "bg-red-200 text-red-700 p-1"
                : "bg-green-200 text-green-700 p-1"
            }`}
          >
            {role}
          </span>
        ))
    ) : (
      <span className="text-gray-500 text-xs shrink-0">Aucun rôle</span>
    );

  return (
    <>
      <div className="grid grid-cols-12">
        {arrayItems.map((item) => {
          const activeToggle = (
            <label className="inline-flex relative items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={!!item?.is_active}
                onChange={() => {
                  if (item?.id != null) {
                    switchIsActive(item.id, setRefresh);
                  }
                }}
              />
              <CheckboxSlider />
            </label>
          );

          const bannedToggle = (
            <label className="inline-flex relative items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={!!item?.is_banned}
                onChange={() => {
                  if (item?.id != null) {
                    switchIsBanned(item.id, setRefresh);
                  }
                }}
              />
              <CheckboxSlider />
            </label>
          );

          const actions = (
            <>
              <button
                type="button"
                className="font-medium text-blue-600 hover:text-red-600 hover:underline cursor-pointer"
                onClick={() => handleDelete(item)}
              >
                Supprimer
              </button>
              <Link
                className="hover:text-yellow-600 hover:underline cursor-pointer"
                to={`/admin/users/update/${item.id ?? ""}`}
              >
                Modifier
              </Link>
            </>
          );

          return (
            <div
              className="col-span-12 border-b border-l border-r hover:bg-slate-200"
              key={item.id}
            >
              {/* Mobile card */}
              <div className="sscreen:hidden p-3 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 space-y-1">
                    <p className="font-semibold text-gray-900 truncate">
                      {item?.username}
                    </p>
                    <div className="flex flex-wrap gap-1">{roleBadges(item)}</div>
                    <p className="text-xs text-gray-600 break-all">
                      {item?.email}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0 text-sm">
                    {actions}
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-600">Actif</span>
                    {activeToggle}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-600">Banni</span>
                    {bannedToggle}
                  </div>
                </div>
              </div>

              {/* Desktop row */}
              <div className="hidden sscreen:grid grid-cols-12 items-center cursor-pointer">
                <div className="col-span-4 p-1 flex flex-wrap items-center gap-1 min-w-0">
                  <span className="text-sm text-gray-900 truncate">
                    {item?.username}
                  </span>
                  {roleBadges(item)}
                </div>
                <div className="col-span-4 p-1 truncate">{item?.email}</div>
                <div className="col-span-1 p-1">
                  <div className="flex justify-center">{activeToggle}</div>
                </div>
                <div className="col-span-1 p-1">
                  <div className="flex justify-center">{bannedToggle}</div>
                </div>
                <div className="col-span-2 bg-gray-100 p-1 text-right flex flex-col items-end gap-0.5">
                  {actions}
                </div>
              </div>
            </div>
          );
        })}
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
    </>
  );
};

export default AdminUserPaginationTableBody;
