import React from "react";
import { Link } from "react-router-dom";
import { URL_FRONT_ADMIN_BANLIST_FORM } from "../../constant/urlsFront";

const CurrentBanlistAlert = ({ currentBanlist }) => {
  return (
    <Link
      to={URL_FRONT_ADMIN_BANLIST_FORM}
      state={{ request: "put", id: currentBanlist.id }}
    >
      <div className="bg-green-200 hover:bg-green-300 cursor-pointer p-3 mt-2 rounded-lg">
        {`Depuis le ${currentBanlist?.release_date}, la ${currentBanlist?.label}
          est active. Elle contient ${currentBanlist?.banlist_cards_length}
          cartes au total.`}
      </div>
    </Link>
  );
};

export default CurrentBanlistAlert;
