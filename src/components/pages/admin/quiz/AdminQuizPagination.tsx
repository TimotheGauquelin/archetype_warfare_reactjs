import PaginationTableHead from "../../../generic/pagination/PaginationTableHead";
import PaginationFooter from "../../../generic/pagination/PaginationFooter";
import AdminQuizPaginationTableBody from "./AdminQuizPaginationTableBody";
import type { AdminQuizQuestion } from "../../../../services/quiz";

interface AdminQuizPaginationProps {
  questions: AdminQuizQuestion[];
  currentPage: number;
  setPagination: (page: number) => void;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  questionsTotalCount: number;
  totalPages: number;
  pageSize: number;
  loading: boolean;
  onDelete: (question: AdminQuizQuestion) => void;
  onToggleActive: (question: AdminQuizQuestion) => void;
}

const AdminQuizPagination: React.FC<AdminQuizPaginationProps> = ({
  questions,
  currentPage,
  setPagination,
  setRefresh,
  questionsTotalCount,
  totalPages,
  pageSize,
  loading,
  onDelete,
  onToggleActive,
}) => {
  const tableHeadItemArray = [
    { colspan: "col-span-1", label: "Id" },
    { colspan: "col-span-2", label: "Thème" },
    { colspan: "col-span-1", label: "Type" },
    { colspan: "col-span-2", label: "Énoncé" },
    { colspan: "col-span-1", label: "Difficulté" },
    { colspan: "col-span-1", label: "Pts" },
    { colspan: "col-span-1", label: "Ex-daily" },
    { colspan: "col-span-1", label: "Active" },
    { colspan: "col-span-2", label: "Actions" },
  ];

  return (
    <div className="">
      <p className="mb-2">{questionsTotalCount} question(s) trouvée(s)</p>

      <div className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <PaginationTableHead tableHeadItem={tableHeadItemArray} />

        <div className="min-h-[120px]">
          {loading ? (
            <div className="p-4">Chargement...</div>
          ) : (
            <AdminQuizPaginationTableBody
              arrayItems={questions}
              onDelete={onDelete}
              onToggleActive={onToggleActive}
            />
          )}
        </div>
      </div>

      <PaginationFooter
        setRefresh={() => setRefresh((prev) => !prev)}
        currentPage={currentPage}
        setPagination={setPagination}
        itemsTotalCount={questionsTotalCount}
        totalPages={totalPages}
        pageSize={pageSize}
      />
    </div>
  );
};

export default AdminQuizPagination;
