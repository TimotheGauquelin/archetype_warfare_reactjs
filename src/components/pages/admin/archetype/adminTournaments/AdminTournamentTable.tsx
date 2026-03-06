import { Link } from "react-router-dom";
import PaginationTableHead from "@/components/generic/pagination/PaginationTableHead";
import { getAdminTournamentManagePath, getAdminTournamentUpdatePath } from "@/constant/urlsFront";
import type { Tournament } from "@/types";
import { TOURNAMENT_STATUS } from "@/utils/trad/tournamentStatus";
import { verbalDate } from "@/utils/date/verbalDate";
import NoItemMessage from "@/components/generic/NoItemMessage";

const TABLE_HEAD_ITEMS = [
  { colspan: "col-span-3", label: "Nom" },
  { colspan: "col-span-2", label: "Statut" },
  { colspan: "col-span-2", label: "Lieu" },
  { colspan: "col-span-2", label: "Début" },
  { colspan: "col-span-1", label: "Joueurs" },
  { colspan: "col-span-2", label: "Actions" },
];

interface AdminTournamentTableProps {
  tournaments: Tournament[];
  emptyMessage?: string;
  onRequestDelete?: (tournament: Tournament) => void;
}

const AdminTournamentTable: React.FC<AdminTournamentTableProps> = ({
  tournaments,
  emptyMessage = "Aucun tournoi dans cette catégorie.",
  onRequestDelete,
}) => {
  if (tournaments.length === 0) {
    return (
      <NoItemMessage message={emptyMessage} />
    );
  }

  return (
    <div className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
      <PaginationTableHead tableHeadItem={TABLE_HEAD_ITEMS} />
      <div className="grid grid-cols-12">
        {tournaments.map((t) => (
          <div
            className="grid grid-cols-12 col-span-12 flex items-center border-b border-l border-r hover:bg-slate-200"
            key={t.id}
          >
            <div className="col-span-3 p-1">{t.name}</div>
            <div className="col-span-2 p-1">
              {TOURNAMENT_STATUS(t.status as string)}
            </div>
            <div className="col-span-2 p-1">{t.location ?? "—"}</div>
            <div className="col-span-2 p-1">{verbalDate(t.event_date ?? "")}</div>
            <div className="col-span-1 p-1">
              {t.players?.length ?? 0} / {t.max_players ?? "—"}
            </div>
            <div className="flex flex-col col-span-2 bg-gray-100 p-1 text-right border-l">
              <Link
                to={getAdminTournamentUpdatePath(t.id)}
                className="font-medium text-blue-600 hover:text-yellow-600 hover:underline cursor-pointer"
              >
                Modifier
              </Link>
              <Link
                to={getAdminTournamentManagePath(t.id)}
                className="font-medium text-blue-600 hover:text-yellow-600 hover:underline cursor-pointer"
              >
                Gérer
              </Link>
              {onRequestDelete && (
                <span
                  onClick={() => onRequestDelete(t)}
                  className="font-medium text-blue-600 hover:text-red-600 hover:underline cursor-pointer"
                >
                  Supprimer
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminTournamentTable;
