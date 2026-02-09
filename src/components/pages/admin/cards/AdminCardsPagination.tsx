import PaginationFooter from "../../../generic/pagination/PaginationFooter";

interface AdminCardsPaginationProps {
  currentPage: number;
  setPagination: (page: number) => void;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  itemsTotalCount: number;
  totalPages: number;
  pageSize: number;
}

const AdminCardsPagination: React.FC<AdminCardsPaginationProps> = ({
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
          setRefresh={() => setRefresh((prev) => !prev)}
          itemsTotalCount={itemsTotalCount}
          totalPages={totalPages}
          pageSize={pageSize}
        />
      </div>
    </div>
  );
};

export default AdminCardsPagination;
