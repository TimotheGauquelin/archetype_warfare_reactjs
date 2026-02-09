import React from "react";
import { Link } from "react-router-dom";
import { databaseDateToCalendarDate } from "../../utils/date/databaseDateToCalendarDate";
import type { Banlist } from "../../types";

interface CurrentBanlistAlertProps {
  currentBanlist: Banlist;
}

const CurrentBanlistAlert: React.FC<CurrentBanlistAlertProps> = ({ currentBanlist }) => {
  const arrayLength = currentBanlist?.banlist_archetype_cards
  return (
    <Link
      to={`/admin/banlists/update/${currentBanlist.id}`}
    >
      <div className="bg-green-200 hover:bg-green-300 cursor-pointer p-3 mt-2 rounded-lg">
        {`Depuis le ${databaseDateToCalendarDate(currentBanlist?.release_date)}, la banlist "${currentBanlist?.label}"
          est active. Elle contient ${arrayLength?.length} cartes au total.`}
      </div>
    </Link>
  );
};

export default CurrentBanlistAlert;
