import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { TournamentDropDown } from "@/components/pages/user/tournaments/TournamentDropDown";
import PaginationTableHead from "@/components/generic/pagination/PaginationTableHead";
import CountryFlagLabel from "@/components/generic/CountryFlagLabel";
import {
  URL_FRONT_MY_PROFILE,
  getUserProfilePath,
} from "@/constant/urlsFront";
import type { RootState } from "@/types";
import { TournamentPlayer } from "@/types";

const TournamentDetailsPlayers = ({
  players,
}: {
  players: TournamentPlayer[];
}) => {
  const { t } = useTranslation();
  const currentUserId = useSelector((state: RootState) => state.user.id);

  const tableHead = [
    { colspan: "col-span-4 sscreen:col-span-4", label: t("tournamentDetail.playersColName") },
    {
      colspan: "col-span-5 sscreen:col-span-5",
      label: t("tournamentDetail.playersColNationality"),
    },
    {
      colspan: "col-span-3 sscreen:col-span-3",
      label: t("tournamentDetail.playersColActions"),
    },
  ];

  const sortedPlayers = [...players].sort(
    (a, b) => a.user?.username?.localeCompare(b.user?.username ?? "") ?? 0,
  );

  return (
    <TournamentDropDown title={t("tournamentDetail.playersTitle")}>
      {sortedPlayers.length === 0 ? (
        <p className="text-sm text-gray-500">
          {t("tournamentDetail.playersEmpty")}
        </p>
      ) : (
        <div className="w-full text-sm text-left text-gray-500 overflow-x-auto">
          <PaginationTableHead tableHeadItem={tableHead} />
          <div className="grid grid-cols-12">
            {sortedPlayers.map((player, index) => {
              const userId = player.user?.id ?? player.user_id;
              const username = player.user?.username?.trim() || "—";
              const country =
                typeof player.user?.country === "string"
                  ? player.user.country
                  : null;

              return (
                <div
                  key={player.id ?? userId ?? index}
                  className="grid grid-cols-12 col-span-12 items-center border-b border-l border-r hover:bg-slate-200"
                >
                  <div className="col-span-4 p-2 font-medium text-gray-900 truncate">
                    {username}
                  </div>
                  <div className="col-span-5 p-2 min-w-0">
                    {country ? (
                      <CountryFlagLabel countryCode={country} />
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </div>
                  <div className="col-span-3 p-2 text-right">
                    {userId ? (
                      <Link
                        to={
                          String(userId) === String(currentUserId)
                            ? URL_FRONT_MY_PROFILE
                            : getUserProfilePath(userId)
                        }
                        className="inline-flex items-center justify-center px-3 py-1.5 rounded bg-blue-700 text-white text-xs font-semibold hover:bg-blue-800"
                      >
                        {t("tournamentDetail.playersViewProfile")}
                      </Link>
                    ) : (
                      <span className="text-gray-400 text-xs">—</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </TournamentDropDown>
  );
};

export default TournamentDetailsPlayers;
