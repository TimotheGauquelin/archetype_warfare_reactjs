import React from "react";
import PaginationTableHead from "../../generic/pagination/PaginationTableHead";
import AdminBanlistPaginationTableBody from "./AdminBanlistPaginationTableBody";

const AdminBanlistPagination = ({
  banlists,
  numberOfCardsFromArchetypePerStatus,
  setRefresh,
}) => {
  const tableHeadItemArray = [
    {
      colspan: "col-span-2",
      label: "Titre de la banlist",
    },
    {
      colspan: "col-span-2",
      label: "Date d'application",
    },
    {
      colspan: "col-span-1",
      label: "Nb total de cartes",
    },
    {
      colspan: "col-span-1",
      label: "Nb cartes interdites",
    },
    {
      colspan: "col-span-1",
      label: "Nb. cartes limitées",
    },
    {
      colspan: "col-span-1",
      label: "Nb. cartes semi-limités",
    },
    {
      colspan: "col-span-4",
      label: "Actions",
    },
  ];

  return (
    <div className="">
      <p>Toutes les banlists :</p>
      <div className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <PaginationTableHead tableHeadItem={tableHeadItemArray} />
        <AdminBanlistPaginationTableBody
          arrayItems={banlists}
          numberOfCardsFromArchetypePerStatus={
            numberOfCardsFromArchetypePerStatus
          }
          setRefresh={setRefresh}
        />
      </div>
      {/* <PaginationFooter
          pagination={pagination}
          setPagination={setPagination}
          itemArraySize={archetypesTotalCount}
        /> */}
    </div>
  );
};

export default AdminBanlistPagination;
