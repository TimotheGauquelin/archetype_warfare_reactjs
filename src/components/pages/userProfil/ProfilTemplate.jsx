import React, { useState } from "react";
import { FaEllipsisH } from "react-icons/fa";
import NavSideItem from "./NavSideItem";
import { useNavigate } from "react-router-dom";
import {
  URL_FRONT_ADMIN_HOME,
  URL_FRONT_MY_PROFIL,
} from "../../../constant/urlsFront";
import { ROLE_ADMIN } from "../../../utils/const/rolesConst";
import { logOut } from "../../../services/auth";
import { useDispatch, useSelector } from "react-redux";
import PopUp from "../../generic/PopUp";

const ProfilTemplate = ({ children }) => {
  const [displayedNavBar, setDisplayedNavBar] = useState(true);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const authUser = useSelector((state) => state.user);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    logOut(dispatch, navigate);
  };

  const confirmLogout = () => {
    setShowLogoutConfirm(true);
  };

  const handleConfirmLogout = () => {
    handleLogout();
    setShowLogoutConfirm(false);
  };

  const handleCancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  const navSideItems = [
    {
      url: URL_FRONT_MY_PROFIL,
      label: "Mon Profil",
    },
    // {
    //   url: "/my-decks",
    //   label: "Mes Decks",
    // },
  ];

  return (
    <>
      <div className="relative grid-cols-12 py-4 bg-gray-400 max-w-containerSize my-3 mx-auto px-2">
        <div className="bg-gray-300 flex justify-between items-center py-2 px-3">
          <p className="col-span-2"> Mon Compte</p>
          <div
            className="lscreen:hidden mr-2"
            onClick={() => setDisplayedNavBar(!displayedNavBar)}
          >
            <FaEllipsisH />
          </div>
        </div>

        <div
          className={`lscreen:grid lscreen:grid-cols-12 bg-gray-300 lscreen:flex`}
        >
          <div
            className={`col-span-2 bg-gray-200 ${
              displayedNavBar ? "display" : "hidden"
            }`}
          >
            <ul>
              {navSideItems.map((item, itemIndex) => {
                return (
                  <NavSideItem
                    key={itemIndex}
                    url={item.url}
                    label={item.label}
                  />
                );
              })}
            </ul>
            {authUser?.roles.includes(ROLE_ADMIN) && (
              <ul>
                <NavSideItem url={URL_FRONT_ADMIN_HOME} label="Panneau Admin" />
              </ul>
            )}
            <ul>
              <li
                className="block p-2 hover:bg-blue-200 cursor-pointer"
                onClick={confirmLogout}
              >
                Déconnexion
              </li>
            </ul>
          </div>
          <div className="col-span-10 bg-gray-100 p-2 overflow-y-auto max-h-[calc(100vh-200px)]">
            {children}
          </div>
        </div>
      </div>

      <PopUp
        isOpen={showLogoutConfirm}
        onClose={handleCancelLogout}
        title="Déconnexion"
        showCloseButton={true}
      >
        <div className="space-y-4">
          <p className="text-center text-gray-700">
            Êtes-vous sûr de vouloir vous déconnecter ?
          </p>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={handleCancelLogout}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors duration-200 font-medium"
            >
              Annuler
            </button>
            <button
              onClick={handleConfirmLogout}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors duration-200 font-medium"
            >
              Se déconnecter
            </button>
          </div>
        </div>
      </PopUp>
    </>
  );
};

export default ProfilTemplate;
