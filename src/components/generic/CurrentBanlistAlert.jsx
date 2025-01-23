import React, { useEffect, useState } from "react";
import api_aw from "../../api/api_aw";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Link } from "react-router-dom";

const CurrentBanlistAlert = () => {
  const [currentBanlist, setCurrentBanlist] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const getCurrentBanlist = () => {
    api_aw.get(`/public/banlists/current`).then((response) => {
      if (response.status === 200) {
        setCurrentBanlist(response.data);
        setIsLoading(false);
      }
    });
  };

  useEffect(() => {
    getCurrentBanlist();
  }, []);

  if (isLoading === false) {
    return (
      <Link
        to="/admin/banlists/form"
        state={{ request: "put", id: currentBanlist.id }}
      >
        <div className="bg-green-200 hover:bg-green-300 cursor-pointer p-3 rounded-lg">
          Depuis le{" "}
          {format(new Date(currentBanlist?.releaseDate), "PPP", {
            locale: fr,
          })}
          , la {currentBanlist?.label} est active. Elle contient{" "}
          {currentBanlist?.cards.length} cartes au total
        </div>
      </Link>
    );
  } else {
    return null;
  }
};

export default CurrentBanlistAlert;
