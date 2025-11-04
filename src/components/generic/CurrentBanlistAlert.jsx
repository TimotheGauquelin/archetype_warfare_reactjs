import React from "react";
import { Link } from "react-router-dom";

const CurrentBanlistAlert = ({ currentBanlist }) => {
  const arrayLength = currentBanlist?.banlist_archetype_cards
  return (
    // <Link
    //   state={{ request: "put", id: currentBanlist.id }}
    // >
      <div className="bg-green-200 hover:bg-green-300 cursor-pointer p-3 mt-2 rounded-lg">
        {`Depuis le ${currentBanlist?.release_date}, la banlist "${currentBanlist?.label}"
          est active. Elle contient ${arrayLength?.length} cartes au total.`}
      </div>
    // </Link>
  );
};

export default CurrentBanlistAlert;
