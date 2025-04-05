import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { URL_FRONT_HOME, URL_FRONT_MY_PROFIL } from "../../../constant/urlsFront";
import AuthContext from "../../../context/AuthContext";

const AdminHeader = ({ displayedNavbar, setDisplayedNavbar, adminName }) => {

  const {authUser} = useContext(AuthContext)

  return (
    <div className="flex items-center h-20 px-6 tablet:px-10 bg-white">
      <div
        className="mr-8 cursor-pointer"
        onClick={() => setDisplayedNavbar(!displayedNavbar)}
      >
        <svg
          className="w-8 h-8"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </div>
      <div className="flex flex-shrink-0 items-center ml-auto">
        <button className="relative inline-flex items-center p-2 hover:bg-gray-100 focus:bg-gray-100 rounded-lg">
          <div className="hidden sscreen:flex sscreen:flex-col sscreen:items-end sscreen:leading-tight">
            <span className="font-semibold">{authUser.username}</span>
            <span className="text-sm text-gray-600">Administrateur</span>
          </div>
        </button>
        <div className="border-l pl-3 ml-3 space-x-1">
          <Link to={URL_FRONT_MY_PROFIL}>
            <button className="relative p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 focus:bg-gray-100 focus:text-gray-600 rounded-full">
              <svg
                aria-hidden="true"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;
