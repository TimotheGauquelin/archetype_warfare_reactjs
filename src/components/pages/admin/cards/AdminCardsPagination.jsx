import React from "react";
import PaginationFooter from "../../../generic/pagination/PaginationFooter";

const AdminCardsPagination = ({
  setRefresh,
  pagination,
  setPagination,
  cardsTotalCount,
  displayingNumberSize,
}) => {
  return (
    <div className="">
      <div className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <PaginationFooter
          pagination={pagination}
          setPagination={setPagination}
          setRefresh={setRefresh}
          itemArraySize={cardsTotalCount}
          displayingNumberSize={displayingNumberSize}
        />
      </div>
    </div>
  );
};

export default AdminCardsPagination;
