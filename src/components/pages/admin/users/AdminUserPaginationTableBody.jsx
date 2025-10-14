import React from "react";
import CheckboxSlider from "../../../generic/CheckboxSlider";
import { deleteUser, deleteUserByAdmin, switchIsActive, switchIsBanned } from "../../../../services/user";
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
            <div className={`col-span-2 px-3 py-4`}>{item?.username}</div>
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
            <div className={`col-span-1 px-3 py-4`}>
              <div className="flex flex-col justify-center">
               {item?.roles?.length > 0 ? item?.roles.map((role) => {
                return <span key={role.label} className={`${role.label === "Admin" && "text-red-500 font-bold"}`}>{role.label}</span>
               }) : <span className="text-gray-500">No role</span>}
              </div>
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
            <div className="col-span-4 px-6 py-4 text-right">
              <p
                className="font-medium text-blue-600 dark:text-blue-500 hover:underline cursor-pointer"
                onClick={() => {
                  console.log(item.id);
                  deleteUserByAdmin(item.id, setRefresh);
                }}
              >
                Supprimer
              </p>
              <Link
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