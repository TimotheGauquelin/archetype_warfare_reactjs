import PaginationTableHead from "../../generic/pagination/PaginationTableHead";
import AdminBanlistPaginationTableBody from "./AdminBanlistPaginationTableBody";
import type { Banlist } from "../../../types";

interface AdminBanlistPaginationProps {
  banlists: Banlist[];
  loading?: boolean;
  setRefresh?: React.Dispatch<React.SetStateAction<boolean>>;
  handleDeleteBanlist: (id: number) => void;
}

const AdminBanlistPagination: React.FC<AdminBanlistPaginationProps> = ({
  banlists,
  loading = false,
  handleDeleteBanlist,
}) => {
  const tableHeadItemArray = [
    { colspan: "col-span-2", label: "Titre de la banlist" },
    { colspan: "col-span-2", label: "Date d'application" },
    { colspan: "col-span-1", label: "Nb c. totales" },
    { colspan: "col-span-1", label: "Nb. c. interdites" },
    { colspan: "col-span-1", label: "Nb. c. limitées" },
    { colspan: "col-span-1", label: "Nb. c. semi-limitées" },
    { colspan: "col-span-4", label: "Actions" },
  ];

  return (
    <div className="">
      <div className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <PaginationTableHead tableHeadItem={tableHeadItemArray} />
        <div>
          {loading ? (
            <div className="p-4">Chargement...</div>
          ) : (
            <AdminBanlistPaginationTableBody
              arrayItems={banlists}
              handleDeleteBanlist={handleDeleteBanlist}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminBanlistPagination;
