import React from "react";
import CheckboxSlider from "../../../generic/CheckboxSlider";
import { deleteUserByAdmin, switchIsActive, switchIsBanned } from "../../../../services/user";
import { Link } from "react-router-dom";

const AdminUserPaginationTableBody = ({ arrayItems, setRefresh }) => {
  if (!arrayItems || arrayItems.length === 0) {
    return (
      <div className="col-span-12 p-4 border border-l border-r text-center">
        Aucun utilisateur trouvé.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-12">
      {arrayItems?.map((item, index) => {
        return (
          <div
            className="grid grid-cols-12 col-span-12 flex items-center border-b border-l border-r hover:bg-slate-200 cursor-pointer"
            key={index}
          >
            <div className={`col-span-1 px-3 py-4`}>{item?.id}</div>
            <div className={`col-span-2 px-3 py-4 flex flex-col`}>
              <span className="text-md mb-1">{item?.username}</span>
              <div className="flex flex-row gap-2">
                {item?.roles?.length > 0
                  ? item?.roles
                    .sort((a, b) => a.label.localeCompare(b.label))
                    .map((role) => {
                      return <span key={role.label} className={`text-xs rounded-sm ${role.label === "Admin" ? "bg-red-200 text-red-700 p-1" : "bg-green-200 text-green-700 p-1"}`}>{role.label}</span>
                    })
                  : <span className="text-gray-500">Aucun rôle</span>}
              </div>
            </div>
            <div className={`col-span-2 px-3 py-4`}>{item?.email}</div>
            <div className={`col-span-1 px-3 py-4`}>
              <label className="inline-flex relative items-center mr-5 cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={!!item?.is_active}
                  onChange={() => {
                    switchIsActive(item?.id, setRefresh);
                  }}
                />
                <CheckboxSlider />
              </label>
            </div>
            <div className={`col-span-1 px-2 py-4`}>
              <label className="inline-flex relative items-center mr-5 cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={!!item?.is_banned}
                  onChange={() => {
                    switchIsBanned(item?.id, setRefresh);
                  }}
                />
                <CheckboxSlider />
              </label>
            </div>
            <div className="h-full col-span-5 p-4 bg-gray-100 text-right">
              <p
                className="font-medium text-blue-600 hover:text-red-600 hover:underline cursor-pointer"
                onClick={() => {
                  deleteUserByAdmin(item.id, setRefresh);
                }}
              >
                Supprimer
              </p>
              <Link
                className="hover:text-yellow-600 hover:underline cursor-pointer"
                to={`/admin/users/update/${item.id}`}
              >
                Modifier
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AdminUserPaginationTableBody;