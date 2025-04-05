import { format } from "date-fns";
import { enGB } from "date-fns/locale";
import React from "react";
import { Link } from "react-router-dom";
import api_aw from "../../../api/api_aw";

const AdminBanlistPaginationTableBody = ({
  arrayItems,
  setRefresh,
}) => {
  // const deleteBanlist = (id) => {
  //   api_aw.delete(`/public/banlists/${id}`).then((response) => {
  //     if (response.status === 202) {
  //       setRefresh(true);
  //     }
  //   });
  // };

  return (
    <div className="grid grid-cols-12">
      {arrayItems?.map((item, index) => {
        return (
          <div
            className="grid grid-cols-12 col-span-12 flex items-center border-b border-l border-r hover:bg-slate-200 cursor-pointer"
            key={index}
          >
            <div className={`col-span-2 px-3 py-4`}>
              <p>{item?.label}</p>
              <p>Active {format(new Date(item?.release_date), "PPP", {
                locale: enGB,
              })}</p>
            </div>
            <div className={`col-span-2 px-3 py-4`}>
              {item.banlist_cards_length > 1 ? `${item.banlist_cards_length} cards` : `${item.banlist_cards_length} card`} 
            </div>
            <div className={`col-span-2 px-3 py-4`}>
              {/* {numberOfCardsFromArchetypePerStatus("Interdit", item.id)} */}
            </div>
            <div className={`col-span-2 px-3 py-4`}>
              {/* {numberOfCardsFromArchetypePerStatus("Limité", item.id)} */}
            </div>
            <div className={`col-span-2 px-3 py-4`}>
              {/* {numberOfCardsFromArchetypePerStatus("Semi-Limité", item.id)} */}
            </div>
            <div className="col-span-2 px-6 py-4 text-right">
              <p
                className="font-medium text-blue-600 dark:text-blue-500 hover:underline cursor-pointer"
                onClick={() => {
                  // deleteBanlist(item.id);
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
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AdminBanlistPaginationTableBody;
