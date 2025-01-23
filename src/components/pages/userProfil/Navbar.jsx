import React from "react";
import { FaHome } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {
  const history = useNavigate();
  const location = useLocation();

  return (
    <div className="flex items-center max-w-containerSize my-3 mx-auto px-2">
      <FaHome className="cursor-pointer mr-3" onClick={() => history("/")} />
      {location?.pathname === "/profil"
        ? " / Mon Profil"
        : location?.pathname.includes("/my-decks") && " / Mes Decks"}
    </div>
  );
};

export default Navbar;
