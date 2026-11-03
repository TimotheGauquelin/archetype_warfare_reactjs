import "../../../styles/components/page/admin/AdminSideBar.scss";

import React from "react";
import { FaHome } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  URL_FRONT_ADMIN_ARCHETYPES,
  URL_FRONT_ADMIN_BANLISTS,
  URL_FRONT_ADMIN_CARDS,
  URL_FRONT_ADMIN_FILES,
  URL_FRONT_ADMIN_HOME,
  URL_FRONT_ADMIN_OPTIONS,
  URL_FRONT_ADMIN_QUIZZES,
  URL_FRONT_ADMIN_TOURNAMENTS,
  URL_FRONT_ADMIN_USERS,
} from "../../../constant/urlsFront";

const sideBarCategories = [
  {
    title: "Accueil",
    icon: <FaHome className="h-5 w-5 flex-shrink-0 text-white" />,
    url: URL_FRONT_ADMIN_HOME,
  },
  {
    title: "Cartes",
    icon: <FaHome className="h-5 w-5 flex-shrink-0 text-white" />,
    url: URL_FRONT_ADMIN_CARDS,
  },
  {
    title: "Archetypes",
    icon: <FaHome className="h-5 w-5 flex-shrink-0 text-white" />,
    url: URL_FRONT_ADMIN_ARCHETYPES,
  },
  {
    title: "Banlists",
    icon: <FaHome className="h-5 w-5 flex-shrink-0 text-white" />,
    url: URL_FRONT_ADMIN_BANLISTS,
  },
  {
    title: "Utilisateurs",
    icon: <FaHome className="h-5 w-5 flex-shrink-0 text-white" />,
    url: URL_FRONT_ADMIN_USERS,
  },
  {
    title: "Tournois",
    icon: <FaHome className="h-5 w-5 flex-shrink-0 text-white" />,
    url: URL_FRONT_ADMIN_TOURNAMENTS,
  },
  {
    title: "Quizz",
    icon: <FaHome className="h-5 w-5 flex-shrink-0 text-white" />,
    url: URL_FRONT_ADMIN_QUIZZES,
  },
  {
    title: "Fichiers",
    icon: <FaHome className="h-5 w-5 flex-shrink-0 text-white" />,
    url: URL_FRONT_ADMIN_FILES,
  },
];

interface AdminSideBarProps {
  displayedNavbar: boolean;
  onNavigate?: () => void;
  contentHeight?: number;
  headerBottom?: number;
}

const AdminSideBar: React.FC<AdminSideBarProps> = ({
  displayedNavbar,
  onNavigate,
  contentHeight = 0,
  headerBottom = 56,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const url = location.pathname;

  const heightPx =
    contentHeight > 0 ? `${contentHeight}px` : "calc(100dvh - 5rem)";

  return (
    <aside
      className={`
        admin-sidebar fixed left-0 z-40 flex flex-col
        w-64 max-w-[85vw]
        transform transition-transform duration-200 ease-out
        sscreen:relative sscreen:z-auto sscreen:w-auto sscreen:max-w-none
        sscreen:col-span-3 lscreen:col-span-2 sscreen:transition-none
        ${
          displayedNavbar
            ? "translate-x-0"
            : "-translate-x-full pointer-events-none sscreen:hidden sscreen:pointer-events-auto sscreen:translate-x-0"
        }
      `}
      style={
        {
          height: heightPx,
          ["--admin-sidebar-top" as string]: `${headerBottom}px`,
        } as React.CSSProperties
      }
      aria-hidden={!displayedNavbar}
    >
      <div className="flex-grow flex flex-col justify-between text-gray-500 bg-gray-800 h-full min-h-0 shadow-xl sscreen:shadow-none">
        <nav className="flex flex-col mx-3 my-3 space-y-1 overflow-y-auto min-h-0">
          {sideBarCategories.map((category, index) => (
            <div key={index}>
              <Link
                to={category.url}
                onClick={onNavigate}
                className={`w-full ${
                  url.includes(category.url) && "bg-gray-600"
                } inline-flex items-center py-1.5 text-sm hover:text-gray-400 hover:bg-gray-500 focus:text-gray-400 focus:bg-gray-700 rounded-lg px-2`}
              >
                {category.icon}
                <span className="ml-2">{category.title}</span>
              </Link>
            </div>
          ))}
        </nav>
        <div
          className="flex justify-end shrink-0"
          onClick={() => {
            onNavigate?.();
            navigate(URL_FRONT_ADMIN_OPTIONS);
          }}
        >
          <button
            type="button"
            className="inline-flex items-center p-2 hover:text-gray-400 justify-center border-gray-700 w-full border-t hover:bg-gray-700 focus:text-gray-400 focus:bg-gray-700 px-2 text-sm"
          >
            <svg
              aria-hidden="true"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span className="ml-2">Options</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default AdminSideBar;
