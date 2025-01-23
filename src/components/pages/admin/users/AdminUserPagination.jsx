import React from "react";
import PaginationTableHead from "../../../generic/pagination/PaginationTableHead";
import AdminBanlistPaginationTableBody from "../AdminBanlistPaginationTableBody";
import AdminUserPaginationTableBody from "./AdminUserPaginationTableBody";

const AdminUserPagination = ({ users, setRefresh }) => {
  const tableHeadItemArray = [
    {
      colspan: "col-span-1",
      label: "Id",
    },
    {
      colspan: "col-span-2",
      label: "Pseudo",
    },
    // {
    //   colspan: "col-span-2",
    //   label: "Date d'application",
    // },
  ];

  return (
    <div className="">
      <p>Toutes les utilisateurs :</p>
      <div className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <PaginationTableHead tableHeadItem={tableHeadItemArray} />
        <AdminUserPaginationTableBody
          arrayItems={users}
          //   numberOfCardsFromArchetypePerStatus={
          //     numberOfCardsFromArchetypePerStatus
          //   }
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

export default AdminUserPagination;
