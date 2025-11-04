import { format } from "date-fns";
import { enGB } from "date-fns/locale";
import React from "react";
import { Link } from "react-router-dom";

const AdminBanlistPaginationTableBody = ({
  arrayItems,
  handleDeleteBanlist,
}) => {

  const numberOfCardsFromArchetypePerStatus = (item, status) => {
    return item.banlist_archetype_cards.filter((card) => card.archetype_id === null && card.card_status.label === status).length;
  };

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
            </div>
            <div className={`col-span-2 px-3 py-4`}>
              <p>Active {format(new Date(item?.release_date), "PPP", {
                locale: enGB,
              })}</p>
            </div>
            <div className={`col-span-1 px-3 py-4`}>
              {item.banlist_archetype_cards.length > 1 ? `${item.banlist_archetype_cards.length} cards` : `${item.banlist_archetype_cards.length} card`}
            </div>
            <div className={`col-span-1 px-3 py-4`}>
              {numberOfCardsFromArchetypePerStatus(item, "Forbidden")}
            </div>
            <div className={`col-span-1 px-3 py-4`}>
              {numberOfCardsFromArchetypePerStatus(item, "Limited")}
            </div>
            <div className={`col-span-1 px-3 py-4`}>
              {numberOfCardsFromArchetypePerStatus(item, "Semi-Limited")}
            </div>
            <div className="col-span-4 bg-gray-100 p-4 text-right">
              <p
                className="font-medium text-blue-600 hover:text-red-600 hover:underline cursor-pointer"
                onClick={() => {
                  handleDeleteBanlist(item.id);
                }}
              >
                Supprimer
              </p>
              <Link
                className="hover:text-yellow-600 hover:underline cursor-pointer"
                to={`/admin/banlists/update/${item.id}`}
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
