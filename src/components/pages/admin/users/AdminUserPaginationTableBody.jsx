import { format } from "date-fns";
import { fr } from "date-fns/locale";
import React from "react";
import { Link } from "react-router-dom";

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
