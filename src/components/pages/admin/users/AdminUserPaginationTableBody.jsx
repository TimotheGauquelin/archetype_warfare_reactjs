import { format } from "date-fns";
import { fr } from "date-fns/locale";
import React from "react";
import { Link } from "react-router-dom";
import CheckboxSlider from "../../../generic/CheckboxSlider";
import { switchIsActive, switchIsForbidden } from "../../../../services/user";

const AdminUserPaginationTableBody = ({ arrayItems, setRefresh }) => {
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
                  checked={item?.is_active}
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
                  checked={item?.is_forbidden}
                  onChange={() => {
                    switchIsForbidden(item?.id, setRefresh);
                  }}
                />
                <CheckboxSlider />
              </label>
            </div>
            {/* <div className={`col-span-1 px-3 py-4`}>{item?.cards.length}</div> */}
            {/* <div className="col-span-4 px-6 py-4 text-right">
              <p
                className="font-medium text-blue-600 dark:text-blue-500 hover:underline cursor-pointer"
                onClick={() => {
                  deleteBanlist(item.id);
                }}
              >
                Supprimer
              </p>
              <Link
                to="/admin/banlists/form"
                state={{ request: "put", id: item.id }}
              >
                Modifier
              </Link>
            </div> */}
          </div>
        );
      })}
    </div>
  );
};

export default AdminUserPaginationTableBody;
