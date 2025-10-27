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
  loading,
}) => {
  const tableHeadItemArray = [
    { colspan: "col-span-1", label: "Id" },
    { colspan: "col-span-2", label: "Pseudo" },
    { colspan: "col-span-2", label: "Email" },
    { colspan: "col-span-1", label: "Is Active" },
    { colspan: "col-span-1", label: "Is Forbidden" },
    { colspan: "col-span-5", label: "Actions" },
  ];

  const items = users?.data ?? [];
  console.log(users.pagination);

  return (
    <div className="">
      <p className="mb-2">{users?.pagination?.totalItems ?? 0} utilisateur(s) trouvé(s)</p>

      <div className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <PaginationTableHead tableHeadItem={tableHeadItemArray} />

        <div className="min-h-[120px]">
          {loading ? (
            <div className="p-4">Chargement...</div>
          ) : (
            <AdminUserPaginationTableBody arrayItems={items} setRefresh={setRefresh} />
          )}
        </div>
      </div>

      <PaginationFooter
        setRefresh={setRefresh}
        currentPage={currentPage ?? 1}
        setPagination={setPagination}
        itemsTotalCount={usersTotalCount ?? 0}
        totalPages={totalPages ?? 1}
        pageSize={pageSize ?? 10}
      />
    </div>
  );
};

export default AdminUserPagination;