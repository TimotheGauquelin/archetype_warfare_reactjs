import PaginationTableHead from "../../../generic/pagination/PaginationTableHead";
import PaginationFooter from "../../../generic/pagination/PaginationFooter";
import AdminQuizSeasonPaginationTableBody from "./AdminQuizSeasonPaginationTableBody";
import type { AdminQuizSeason } from "../../../../services/quiz";

interface AdminQuizSeasonPaginationProps {
  seasons: AdminQuizSeason[];
  loading: boolean;
  onDelete: (season: AdminQuizSeason) => void;
  /** Affiche le pied de pagination (page « toutes les saisons ») */
  showFooter?: boolean;
  currentPage?: number;
  setPagination?: (page: number) => void;
  setRefresh?: React.Dispatch<React.SetStateAction<boolean>>;
  seasonsTotalCount?: number;
  totalPages?: number;
  pageSize?: number;
}

const TABLE_HEAD = [
  { colspan: "col-span-3", label: "Nom" },
  { colspan: "col-span-2", label: "Date de début" },
  { colspan: "col-span-2", label: "Date de fin" },
  { colspan: "col-span-1", label: "Nb. jours total" },
  { colspan: "col-span-1", label: "Nb. questions planifiées" },
  { colspan: "col-span-1", label: "Statut" },
  { colspan: "col-span-2", label: "Actions" },
];

const AdminQuizSeasonPagination: React.FC<AdminQuizSeasonPaginationProps> = ({
  seasons,
  loading,
  onDelete,
  showFooter = false,
  currentPage = 1,
  setPagination,
  setRefresh,
  seasonsTotalCount,
  totalPages = 1,
  pageSize = 30,
}) => {
  const total = seasonsTotalCount ?? seasons.length;

  return (
    <div className="bg-white">
      <div className="w-full text-sm text-left text-gray-500 overflow-x-auto">
        <div className="min-w-0 sscreen:min-w-[800px]">
          <div className="hidden sscreen:block">
            <PaginationTableHead tableHeadItem={TABLE_HEAD} />
          </div>
          <div>
            {loading ? (
              <div className="p-4">Chargement...</div>
            ) : (
              <AdminQuizSeasonPaginationTableBody
                arrayItems={seasons}
                onDelete={onDelete}
              />
            )}
          </div>
        </div>
      </div>

      {showFooter && setPagination && setRefresh && (
        <PaginationFooter
          setRefresh={() => setRefresh((prev) => !prev)}
          currentPage={currentPage}
          setPagination={setPagination}
          itemsTotalCount={total}
          totalPages={totalPages}
          pageSize={pageSize}
        />
      )}
    </div>
  );
};

export default AdminQuizSeasonPagination;
