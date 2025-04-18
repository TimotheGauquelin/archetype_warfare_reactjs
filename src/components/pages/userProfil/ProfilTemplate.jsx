import React, { useContext, useState } from "react";
import { FaEllipsisH } from "react-icons/fa";
import NavSideItem from "./NavSideItem";
import { useNavigate } from "react-router-dom";
import { logout } from "../../../redux/apiCall/user";
import {
  URL_FRONT_ADMIN_HOME,
  URL_FRONT_MY_PROFIL,
  URL_FRONT_MY_TOURNAMENTS,
} from "../../../constant/urlsFront";
import AuthContext from "../../../context/AuthContext";
import { ROLE_ADMIN } from "../../../utils/const/rolesConst";

const ProfilTemplate = ({ children }) => {
  const [displayedNavBar, setDisplayedNavBar] = useState(true);
  const { authUser } = useContext(AuthContext);

  const navigate = useNavigate();

  // const unlog = () => {
  //   logout(dispatch, navigate);
  // };

  const navSideItems = [
    {
      url: URL_FRONT_MY_PROFIL,
      label: "Mon Profil",
    },
    // {
    //   url: URL_FRONT_MY_TOURNAMENTS,
    //   label: "Mes Tournois",
    // },
    // {
    //   url: "/my-decks",
    //   label: "Mes Decks",
    // },
  ];

  return (
    <div className="relative grid-cols-12 py-4 bg-gray-400 max-w-containerSize my-3 mx-auto px-2">
      <div className="bg-gray-300 flex justify-between items-center">
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
          className={`col-span-2 bg-gray-200 py-2 ${
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
          <ul
          // onClick={() => {
          //   unlog();
          // }}
          >
            <NavSideItem url="/deconnexion" label="Deconnexion" />
          </ul>
        </div>
        <div className="col-span-10 bg-gray-100 p-2">{children}</div>
      </div>
    </div>
  );
};

export default ProfilTemplate;
