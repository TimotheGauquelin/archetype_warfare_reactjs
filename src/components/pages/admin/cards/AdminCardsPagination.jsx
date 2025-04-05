import React from "react";
import PaginationFooter from "../../../generic/pagination/PaginationFooter";

const AdminCardsPagination = ({
  currentPage,
  setPagination,
  setRefresh,
  itemsTotalCount,
  totalPages,
  pageSize,
}) => {
  return (
    <div className="">
      <div className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <PaginationFooter
          currentPage={currentPage}
          setPagination={setPagination}
          setRefresh={setRefresh}
          itemsTotalCount={itemsTotalCount}
          totalPages={totalPages}
          pageSize={pageSize}
        />
      </div>
    </div>
  );
};

export default AdminCardsPagination;
