import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import PaginationTableHead from "@/components/generic/pagination/PaginationTableHead";
import NoItemMessage from "@/components/generic/NoItemMessage";
import { URL_FRONT_TOURNAMENT } from "@/constant/urlsFront";
import type { Tournament } from "@/types";
import { TOURNAMENT_STATUS } from "@/utils/trad/tournamentStatus";
import { verbalDate } from "@/utils/date/verbalDate";

interface TournamentTableProps {
  tournaments: Tournament[];
  emptyMessage?: string;
}

const TournamentTable: React.FC<TournamentTableProps> = ({
  tournaments,
  emptyMessage,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const tableHeadItems = [
    { colspan: "col-span-4 sscreen:col-span-3", label: t("tournamentsPage.colName") },
    { colspan: "col-span-3 sscreen:col-span-2", label: t("tournamentsPage.colStatus") },
    { colspan: "col-span-3 sscreen:col-span-2", label: t("tournamentsPage.colLocation") },
    { colspan: "col-span-2", label: t("tournamentsPage.colDate") },
    {
      colspan: "hidden sscreen:flex sscreen:col-span-1",
      label: t("tournamentsPage.colPlayers"),
    },
    {
      colspan: "hidden sscreen:flex sscreen:col-span-2",
      label: t("tournamentsPage.colActions"),
    },
  ];

  if (tournaments.length === 0) {
    return (
      <NoItemMessage
        message={emptyMessage ?? t("tournamentsPage.empty")}
        textPosition="center"
      />
    );
  }

  return (
    <div className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
      <PaginationTableHead tableHeadItem={tableHeadItems} />
      <div className="grid grid-cols-12">
        {tournaments.map((tournament) => {
          const detailPath = URL_FRONT_TOURNAMENT(tournament.id);
          return (
            <div
              key={tournament.id}
              role="link"
              tabIndex={0}
              onClick={() => navigate(detailPath)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  navigate(detailPath);
                }
              }}
              className="grid grid-cols-12 col-span-12 items-center border-b border-l border-r hover:bg-slate-200 cursor-pointer"
            >
              <div className="col-span-4 sscreen:col-span-3 p-1 min-w-0">
                <div className="truncate font-medium text-gray-900">
                  {tournament.name}
                </div>
                <div className="text-xs text-gray-500 truncate">
                  {tournament.is_official
                    ? t("tournamentsPage.official")
                    : t("tournamentsPage.community")}
                  {tournament.is_online
                    ? ` · ${t("tournamentsPage.online")}`
                    : ""}
                </div>
              </div>
              <div className="col-span-3 sscreen:col-span-2 p-1">
                {TOURNAMENT_STATUS(tournament.status as string)}
              </div>
              <div className="col-span-3 sscreen:col-span-2 p-1 truncate">
                {tournament.location?.trim() || t("tournamentsPage.online")}
              </div>
              <div className="col-span-2 p-1">
                {verbalDate(tournament.event_date ?? "")}
              </div>
              <div className="hidden sscreen:block sscreen:col-span-1 p-1">
                {tournament.players?.length ?? 0} /{" "}
                {tournament.max_players ?? "—"}
              </div>
              <div
                className="hidden sscreen:flex sscreen:flex-col sscreen:col-span-2 p-1 text-right border-l"
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={() => navigate(detailPath)}
                  className="font-medium text-blue-600 hover:text-yellow-600 hover:underline cursor-pointer text-right"
                >
                  {t("tournamentsPage.view")}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TournamentTable;
