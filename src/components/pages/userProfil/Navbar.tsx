import {
  URL_FRONT_MY_DECKS,
  URL_FRONT_MY_PROFILE,
  URL_FRONT_MY_TOURNAMENTS,
} from "@/constant/urlsFront";
import React from "react";
import { useTranslation } from "react-i18next";
import { FaHome } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";

const Navbar: React.FC = () => {
  const history = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const breadcrumb = location?.pathname.includes(URL_FRONT_MY_PROFILE)
    ? `/ ${t("profile.myProfile")}`
    : location?.pathname.includes(URL_FRONT_MY_DECKS)
      ? `/ ${t("profile.myDecks")}`
      : location?.pathname.includes(URL_FRONT_MY_TOURNAMENTS)
        ? `/ ${t("profile.myTournaments")}`
        : "";

  return (
    <div className="bg-blue-300 flex flex-row items-center w-full max-w-containerSize mx-auto py-3 px-2">
      <FaHome className="cursor-pointer mr-3" onClick={() => history("/")} />
      <span className="text-black">{breadcrumb}</span>
    </div>
  );
};

export default Navbar;
