import PaginationTableHead from "../../generic/pagination/PaginationTableHead";
import AdminBanlistPaginationTableBody from "./AdminBanlistPaginationTableBody";
import type { Banlist } from "../../../types";

interface AdminBanlistPaginationProps {
  banlists: Banlist[];
  setRefresh?: React.Dispatch<React.SetStateAction<boolean>>;
  handleDeleteBanlist: (id: number) => void;
}

const AdminBanlistPagination: React.FC<AdminBanlistPaginationProps> = ({
  banlists,
  handleDeleteBanlist,
}) => {
  const tableHeadItemArray = [
    {
      colspan: "col-span-2",
      label: "Titre de la banlist",
    },
    {
      colspan: "col-span-2",
      label: "Date d'application",
    },
    {
      colspan: "col-span-1",
      label: "Nb c. totales",
    },
    {
      colspan: "col-span-1",
      label: "Nb. c. interdites",
    },
    {
      colspan: "col-span-1",
      label: "Nb. c. limitées",
    },
    {
      colspan: "col-span-1",
      label: "Nb. c. semi-limitées",
    },
    {
      colspan: "col-span-4",
      label: "Actions",
    },
  ];

  return (
    <div className="mt-2">
      <p>Toutes les banlists :</p>
      <div className="w-full text-sm text-left text-gray-500 dark:text-gray-400 mt-2">
        <PaginationTableHead tableHeadItem={tableHeadItemArray} />
        <AdminBanlistPaginationTableBody
          arrayItems={banlists}
          handleDeleteBanlist={handleDeleteBanlist}
        />
      </div>
    </div>
  );
};

export default AdminBanlistPagination;
