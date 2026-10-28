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

const statusClass = (status: AdminQuizSeason["status"]) => {
  if (status === "current") return "bg-emerald-500";
  if (status === "upcoming") return "bg-sky-500";
  return "bg-slate-400";
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
      {arrayItems.map((item) => {
        const badge = (
          <span
            className={`inline-flex px-2 py-0.5 rounded text-xs font-bold text-white ${statusClass(item.status)}`}
          >
            {statusLabel(item.status)}
          </span>
        );

        const actions = (
          <>
            <button
              type="button"
              className="font-medium text-blue-600 hover:text-red-600 hover:underline cursor-pointer"
              onClick={() => onDelete(item)}
            >
              Supprimer
            </button>
            <Link
              className="hover:text-yellow-600 hover:underline cursor-pointer"
              to={getAdminQuizSeasonUpdatePath(item.id)}
            >
              Modifier
            </Link>
          </>
        );

        return (
          <div
            className="col-span-12 border-b border-l border-r hover:bg-slate-200"
            key={item.id}
          >
            {/* Mobile card */}
            <div className="sscreen:hidden p-3 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <p className="font-semibold text-gray-900 leading-snug min-w-0 break-words">
                  {item.name}
                </p>
                {badge}
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                <div>
                  <span className="font-semibold text-gray-800">Début</span>
                  <p>{formatDate(item.startDate)}</p>
                </div>
                <div>
                  <span className="font-semibold text-gray-800">Fin</span>
                  <p>{formatDate(item.endDate)}</p>
                </div>
                <div>
                  <span className="font-semibold text-gray-800">Jours</span>
                  <p>{item.dayCount}</p>
                </div>
                <div>
                  <span className="font-semibold text-gray-800">Questions</span>
                  <p>{item.questionCount}</p>
                </div>
              </div>
              <div className="flex justify-end gap-3 text-sm">{actions}</div>
            </div>

            {/* Desktop row */}
            <div className="hidden sscreen:grid grid-cols-12 items-center cursor-pointer">
              <div className="col-span-3 p-1 font-medium text-gray-800">
                {item.name}
              </div>
              <div className="col-span-2 p-1">{formatDate(item.startDate)}</div>
              <div className="col-span-2 p-1">{formatDate(item.endDate)}</div>
              <div className="col-span-1 p-1">{item.dayCount}</div>
              <div className="col-span-1 p-1">{item.questionCount}</div>
              <div className="col-span-1 p-1">{badge}</div>
              <div className="col-span-2 bg-gray-100 p-1 text-right flex flex-col items-end gap-0.5">
                {actions}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AdminQuizSeasonPaginationTableBody;
