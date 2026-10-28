import { Link } from "react-router-dom";
import CheckboxSlider from "../../../generic/CheckboxSlider";
import type { AdminQuizQuestion, QuizDifficulty } from "../../../../services/quiz";
import { getAdminQuizUpdatePath } from "../../../../constant/urlsFront";

const difficultyLabel = (difficulty?: QuizDifficulty) => {
  switch (difficulty) {
    case "easy":
      return "Facile";
    case "hard":
      return "Difficile";
    case "medium":
    default:
      return "Moyen";
  }
};

const typeLabel = (type: AdminQuizQuestion["type"]) => {
  switch (type) {
    case "true_false":
      return "Vrai/Faux";
    case "order":
      return "Ordre";
    case "name_the_cards":
      return "Nom";
    case "summoner":
      return "Invoc.";
    case "zoom":
      return "Zoom";
    case "hint_ladder":
      return "Indices";
    default:
      return "QCM";
  }
};

interface AdminQuizPaginationTableBodyProps {
  arrayItems: AdminQuizQuestion[];
  onDelete: (question: AdminQuizQuestion) => void;
  onToggleActive: (question: AdminQuizQuestion) => void;
}

const AdminQuizPaginationTableBody: React.FC<
  AdminQuizPaginationTableBodyProps
> = ({ arrayItems, onDelete, onToggleActive }) => {
  if (!arrayItems || arrayItems.length === 0) {
    return (
      <div className="col-span-12 p-4 border border-l border-r text-center">
        Aucune question trouvée.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-12">
      {arrayItems.map((item) => {
        const activeToggle = (
          <label className="inline-flex relative items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={!!item.is_active}
              onChange={() => onToggleActive(item)}
            />
            <CheckboxSlider />
          </label>
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
              to={getAdminQuizUpdatePath(item.id)}
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
                <div className="min-w-0">
                  <p className="text-xs text-gray-500">#{item.id}</p>
                  <p
                    className="font-medium text-gray-900 leading-snug line-clamp-3"
                    title={item.prompt}
                  >
                    {item.prompt}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0 text-sm">
                  {actions}
                </div>
              </div>
              <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-600">
                <span>
                  <span className="font-semibold text-gray-800">Thème</span>{" "}
                  {item.theme?.label ?? "—"}
                </span>
                <span>
                  <span className="font-semibold text-gray-800">Mode</span>{" "}
                  {typeLabel(item.type)}
                </span>
                <span>
                  <span className="font-semibold text-gray-800">Diff.</span>{" "}
                  {difficultyLabel(item.difficulty)}
                </span>
                <span>
                  <span className="font-semibold text-gray-800">Pts</span>{" "}
                  {item.points}
                </span>
                <span title={item.was_daily_question ? "Déjà sortie en Daily" : undefined}>
                  <span className="font-semibold text-gray-800">Dest.</span>{" "}
                  {item.for_daily ? "Daily" : "Libre"}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-xs text-gray-600">Active</span>
                {activeToggle}
              </div>
            </div>

            {/* Desktop row */}
            <div className="hidden sscreen:grid grid-cols-12 items-center cursor-pointer">
              <div className="col-span-1 p-1">{item.id}</div>
              <div className="col-span-1 p-1">{item.theme?.label ?? "—"}</div>
              <div className="col-span-1 p-1">{typeLabel(item.type)}</div>
              <div className="col-span-3 p-1 line-clamp-2" title={item.prompt}>
                {item.prompt}
              </div>
              <div className="col-span-1 p-1">
                {difficultyLabel(item.difficulty)}
              </div>
              <div className="col-span-1 p-1">{item.points}</div>
              <div
                className="col-span-1 p-1 text-center"
                title={
                  item.was_daily_question ? "Déjà sortie en Daily" : undefined
                }
              >
                {item.for_daily ? "Daily" : "Libre"}
              </div>
              <div className="col-span-1 p-1">
                <div className="flex justify-center">{activeToggle}</div>
              </div>
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

export default AdminQuizPaginationTableBody;
