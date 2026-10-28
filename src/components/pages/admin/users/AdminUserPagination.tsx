import PaginationTableHead from "../../../generic/pagination/PaginationTableHead";
import AdminUserPaginationTableBody from "./AdminUserPaginationTableBody";
import PaginationFooter from "../../../generic/pagination/PaginationFooter";
import type { UserSearchResponse } from "../../../../types";

interface AdminUserPaginationProps {
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  users: UserSearchResponse;
  currentPage: number;
  setPagination: (page: number) => void;
  usersTotalCount: number;
  totalPages: number;
  pageSize: number;
  loading: boolean;
  showFooter?: boolean;
}

const AdminUserPagination: React.FC<AdminUserPaginationProps> = ({
  setRefresh,
  users,
  currentPage,
  setPagination,
  usersTotalCount,
  totalPages,
  pageSize,
  loading,
  showFooter = true,
}) => {
  const tableHeadItemArray = [
    { colspan: "col-span-4", label: "Pseudo" },
    { colspan: "col-span-4", label: "Email" },
    { colspan: "col-span-1", label: "Actif" },
    { colspan: "col-span-1", label: "Banni" },
    { colspan: "col-span-2", label: "Actions" },
  ];

  const items = users?.data ?? [];

  return (
    <div>
      <p className="mb-2 text-xs tablet:text-sm text-gray-600">
        {showFooter
          ? `${users?.pagination?.total ?? items.length} utilisateur(s) trouvé(s)`
          : `${items.length} dernier(s) utilisateur(s)`}
      </p>

      <div className="w-full text-sm text-left text-gray-500 overflow-x-auto">
        <div className="min-w-0 sscreen:min-w-[700px]">
          <div className="hidden sscreen:block">
            <PaginationTableHead tableHeadItem={tableHeadItemArray} />
          </div>
          <div>
            {loading ? (
              <div className="p-4">Chargement...</div>
            ) : (
              <AdminUserPaginationTableBody
                arrayItems={items}
                setRefresh={setRefresh}
              />
            )}
          </div>
        </div>
      </div>

      {showFooter && (
        <PaginationFooter
          setRefresh={() => setRefresh((prev) => !prev)}
          currentPage={currentPage ?? 1}
          setPagination={setPagination}
          itemsTotalCount={usersTotalCount ?? 0}
          totalPages={totalPages ?? 1}
          pageSize={pageSize ?? 10}
        />
      )}
    </div>
  );
};

export default AdminUserPagination;
