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
  selectedIds?: Set<number>;
  allPageSelected?: boolean;
  onToggleSelect?: (id: number) => void;
  onToggleSelectAll?: () => void;
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
  selectedIds,
  allPageSelected = false,
  onToggleSelect,
  onToggleSelectAll,
  onDelete,
  onToggleActive,
}) => {
  const selectionEnabled = Boolean(selectedIds && onToggleSelect);

  const tableHeadItemArray = [
    {
      colspan: "col-span-1",
      content: selectionEnabled ? (
        <span className="inline-flex items-center gap-1.5 normal-case">
          <input
            type="checkbox"
            className="h-3.5 w-3.5 cursor-pointer accent-blue-600"
            checked={allPageSelected && questions.length > 0}
            disabled={questions.length === 0}
            onChange={onToggleSelectAll}
            aria-label="Sélectionner toutes les lignes"
          />
          <span className="uppercase">Id</span>
        </span>
      ) : undefined,
      label: selectionEnabled ? undefined : "Id",
    },
    { colspan: "col-span-1", label: "Thème du quizz" },
    { colspan: "col-span-1", label: "Mode de jeu" },
    { colspan: "col-span-3", label: "Énoncé de la question" },
    { colspan: "col-span-1", label: "Difficulté" },
    { colspan: "col-span-1", label: "Points" },
    { colspan: "col-span-1", label: "Destination" },
    { colspan: "col-span-1", label: "Active" },
    { colspan: "col-span-2", label: "Actions" },
  ];

  return (
    <div>
      <div className="w-full text-sm text-left text-gray-500 overflow-x-auto">
        <div className="min-w-0 sscreen:min-w-[900px]">
          <div className="hidden sscreen:block">
            <PaginationTableHead tableHeadItem={tableHeadItemArray} />
          </div>
          <div>
            {loading ? (
              <div className="p-4">Chargement...</div>
            ) : (
              <AdminQuizPaginationTableBody
                arrayItems={questions}
                selectedIds={selectedIds}
                onToggleSelect={onToggleSelect}
                onDelete={onDelete}
                onToggleActive={onToggleActive}
                selectionEnabled={selectionEnabled}
              />
            )}
          </div>
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
