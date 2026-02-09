import { URL_FRONT_MY_DECKS, URL_FRONT_MY_PROFILE } from "@/constant/urlsFront";
import React from "react";
import { FaHome } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";

const Navbar: React.FC = () => {
  const history = useNavigate();
  const location = useLocation();

  return (
    <div className="bg-blue-300 flex flex-row items-center w-full max-w-containerSize mx-auto py-3 px-2">
      <FaHome className="cursor-pointer mr-3" onClick={() => history("/")} />
      <span className="text-black">{location?.pathname.includes(URL_FRONT_MY_PROFILE)
        ? "/ Mon Profil"
        : location?.pathname.includes(URL_FRONT_MY_DECKS) && "/ Mes Decks"}
      </span>
    </div>
  );
};

export default Navbar;
