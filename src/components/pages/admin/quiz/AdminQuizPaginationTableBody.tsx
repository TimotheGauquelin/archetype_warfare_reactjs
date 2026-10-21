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

interface AdminQuizPaginationTableBodyProps {
  arrayItems: AdminQuizQuestion[];
  onDelete: (question: AdminQuizQuestion) => void;
  onToggleActive: (question: AdminQuizQuestion) => void;
}

const AdminQuizPaginationTableBody: React.FC<AdminQuizPaginationTableBodyProps> = ({
  arrayItems,
  onDelete,
  onToggleActive,
}) => {
  if (!arrayItems || arrayItems.length === 0) {
    return (
      <div className="col-span-12 p-4 border border-l border-r text-center">
        Aucune question trouvée.
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
          <div className="col-span-1 p-1">{item.id}</div>
          <div className="col-span-2 p-1">{item.theme?.label ?? "—"}</div>
          <div className="col-span-1 p-1">
            {item.type === "true_false"
              ? "Vrai/Faux"
              : item.type === "order"
                ? "Ordre"
                : item.type === "name_the_cards"
                  ? "Nom"
                  : item.type === "summoner"
                    ? "Invoc."
                    : item.type === "zoom"
                      ? "Zoom"
                      : item.type === "hint_ladder"
                        ? "Indices"
                        : "MCQ"}
          </div>
          <div className="col-span-2 p-1 line-clamp-2" title={item.prompt}>
            {item.prompt}
          </div>
          <div className="col-span-1 p-1">{difficultyLabel(item.difficulty)}</div>
          <div className="col-span-1 p-1">{item.points}</div>
          <div className="col-span-1 p-1 text-center">
            {item.was_daily_question ? "Oui" : "Non"}
          </div>
          <div className="col-span-1 p-1">
            <div className="flex justify-center">
              <label className="inline-flex relative items-center mr-5 cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={!!item.is_active}
                  onChange={() => onToggleActive(item)}
                />
                <CheckboxSlider />
              </label>
            </div>
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
              to={getAdminQuizUpdatePath(item.id)}
            >
              Modifier
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminQuizPaginationTableBody;
