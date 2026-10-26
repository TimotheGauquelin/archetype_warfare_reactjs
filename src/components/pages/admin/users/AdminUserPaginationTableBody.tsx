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

  return (
    <>
      <div className="grid grid-cols-12">
        {arrayItems.map((item) => (
          <div
            className="grid grid-cols-12 col-span-12 flex items-center border-b border-l border-r hover:bg-slate-200 cursor-pointer"
            key={item.id}
          >
            <div className="col-span-4 p-1 flex flex-wrap items-center gap-1 min-w-0">
              <span className="text-sm text-gray-900 truncate">
                {item?.username}
              </span>
              {item?.roles && item.roles.length > 0 ? (
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
                <span className="text-gray-500 text-xs shrink-0">
                  Aucun rôle
                </span>
              )}
            </div>
            <div className="col-span-4 p-1 truncate">{item?.email}</div>
            <div className="col-span-1 p-1">
              <div className="flex justify-center">
                <label className="inline-flex relative items-center mr-5 cursor-pointer">
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
              </div>
            </div>
            <div className="col-span-1 p-1">
              <div className="flex justify-center">
                <label className="inline-flex relative items-center mr-5 cursor-pointer">
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
              </div>
            </div>
            <div className="col-span-2 bg-gray-100 p-1 text-right">
              <p
                className="font-medium text-blue-600 hover:text-red-600 hover:underline cursor-pointer"
                onClick={() => handleDelete(item)}
              >
                Supprimer
              </p>
              <Link
                className="hover:text-yellow-600 hover:underline cursor-pointer"
                to={`/admin/users/update/${item.id ?? ""}`}
              >
                Modifier
              </Link>
            </div>
          </div>
        ))}
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
