import React from "react";
import PaginationTableHead from "../../../generic/pagination/PaginationTableHead";
import AdminUserPaginationTableBody from "./AdminUserPaginationTableBody";
import PaginationFooter from "../../../generic/pagination/PaginationFooter";

const AdminUserPagination = ({
  setRefresh,
  users,
  currentPage,
  setPagination,
  usersTotalCount,
  totalPages,
  pageSize,
}) => {
  const tableHeadItemArray = [
    {
      colspan: "col-span-1",
      label: "Id",
    },
    {
      colspan: "col-span-2",
      label: "Pseudo",
    },
    {
      colspan: "col-span-2",
      label: "Email",
    },
    {
      colspan: "col-span-1",
      label: "Is Active",
    },
    {
      colspan: "col-span-1",
      label: "Is Forbidden",
    },
    {
      colspan: "col-span-5",
      label: "Actions",
    },
  ];

  return (
    <div className="">
      <p>Toutes les utilisateurs :</p>
      <div className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <PaginationTableHead tableHeadItem={tableHeadItemArray} />
        <AdminUserPaginationTableBody
          arrayItems={users.users}
          setRefresh={setRefresh}
        />
      </div>
      <PaginationFooter
        setRefresh={setRefresh}
        currentPage={currentPage}
        setPagination={setPagination}
        itemsTotalCount={usersTotalCount}
        totalPages={totalPages}
        pageSize={pageSize}
      />
    </div>
  );
};

export default AdminUserPagination;
