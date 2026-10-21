import { Link } from "react-router-dom";
import type { AdminQuizSeason } from "../../../../services/quiz";
import { getAdminQuizSeasonUpdatePath } from "../../../../constant/urlsFront";

const statusLabel = (status: AdminQuizSeason["status"]) => {
  switch (status) {
    case "current":
      return "En cours";
    case "upcoming":
      return "À venir";
    case "past":
      return "Terminée";
    default:
      return status;
  }
};

const formatDate = (value: string) => {
  try {
    return new Date(`${value}T12:00:00`).toLocaleDateString("fr-FR");
  } catch {
    return value;
  }
};

interface AdminQuizSeasonPaginationTableBodyProps {
  arrayItems: AdminQuizSeason[];
  onDelete: (season: AdminQuizSeason) => void;
}

const AdminQuizSeasonPaginationTableBody: React.FC<
  AdminQuizSeasonPaginationTableBodyProps
> = ({ arrayItems, onDelete }) => {
  if (!arrayItems || arrayItems.length === 0) {
    return (
      <div className="col-span-12 p-4 border border-l border-r text-center">
        Aucune saison trouvée.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-12">
      {arrayItems.map((item) => (
        <div
          className="grid grid-cols-12 col-span-12 flex items-center border-b border-l border-r hover:bg-slate-200 cursor-pointer"
          key={item.id}
        >
          <div className="col-span-3 p-1 font-medium text-gray-800">
            {item.name}
          </div>
          <div className="col-span-2 p-1">{formatDate(item.startDate)}</div>
          <div className="col-span-2 p-1">{formatDate(item.endDate)}</div>
          <div className="col-span-1 p-1">{item.dayCount}</div>
          <div className="col-span-1 p-1">{item.questionCount}</div>
          <div className="col-span-1 p-1">
            <span
              className={`inline-flex px-2 py-0.5 rounded text-xs font-bold text-white ${
                item.status === "current"
                  ? "bg-emerald-500"
                  : item.status === "upcoming"
                    ? "bg-sky-500"
                    : "bg-slate-400"
              }`}
            >
              {statusLabel(item.status)}
            </span>
          </div>
          <div className="col-span-2 bg-gray-100 p-1 text-right">
            <p
              className="font-medium text-blue-600 hover:text-red-600 hover:underline cursor-pointer"
              onClick={() => onDelete(item)}
            >
              Supprimer
            </p>
            <Link
              className="hover:text-yellow-600 hover:underline cursor-pointer"
              to={getAdminQuizSeasonUpdatePath(item.id)}
            >
              Modifier
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminQuizSeasonPaginationTableBody;
