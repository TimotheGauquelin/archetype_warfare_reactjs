import React, { useState, useRef, useLayoutEffect, useMemo } from "react";
import {
  FaCog,
  FaLayerGroup,
  FaSignOutAlt,
  FaTrophy,
  FaUser,
} from "react-icons/fa";
import { useTranslation } from "react-i18next";
import NavSideItem from "../../components/pages/userProfil/NavSideItem";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  URL_FRONT_ADMIN_HOME,
  URL_FRONT_MY_DECKS,
  URL_FRONT_MY_PROFILE,
  URL_FRONT_MY_TOURNAMENTS,
} from "../../constant/urlsFront";
import { ROLE_ADMIN } from "../../utils/const/rolesConst";
import { logOut } from "../../services/auth";
import { useDispatch, useSelector } from "react-redux";
import PopUp from "../../components/generic/PopUp";
import type { RootState } from "../../types";
import Header from "../../components/generic/header/Header";
import Navbar from "../../components/pages/userProfil/Navbar";

interface UserProfilLayoutProps {
  children: React.ReactNode;
}

const UserProfilLayout: React.FC<UserProfilLayoutProps> = ({ children }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [userProfilLayoutHeight, setUserProfilLayoutHeight] = useState(0);
  const headerRef = useRef<HTMLDivElement>(null);
  const navbarRef = useRef<HTMLDivElement>(null);
  const authUser = useSelector((state: RootState) => state.user);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useLayoutEffect(() => {
    const headerEl = headerRef.current;
    const navbarEl = navbarRef.current;
    if (!headerEl || !navbarEl) return;

    const updateHeight = () => {
      const totalAbove = headerEl.offsetHeight + navbarEl.offsetHeight;
      setUserProfilLayoutHeight(window.innerHeight - totalAbove);
    };

    updateHeight();

    const resizeObserver = new ResizeObserver(updateHeight);
    resizeObserver.observe(headerEl);
    resizeObserver.observe(navbarEl);
    window.addEventListener("resize", updateHeight);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateHeight);
    };
  }, []);

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

  const isAdmin = (authUser?.roles ?? []).includes(ROLE_ADMIN);

  const navSideItems = useMemo(
    () => [
      { url: URL_FRONT_MY_PROFILE, label: t("profile.myProfile") },
      { url: URL_FRONT_MY_DECKS, label: t("profile.myDecks") },
      { url: URL_FRONT_MY_TOURNAMENTS, label: t("profile.myTournaments") },
    ],
    [t]
  );

  const mobileTabItems = useMemo(
    () => [
      {
        url: URL_FRONT_MY_PROFILE,
        label: t("profile.myProfile"),
        icon: FaUser,
      },
      {
        url: URL_FRONT_MY_DECKS,
        label: t("profile.myDecks"),
        icon: FaLayerGroup,
      },
      {
        url: URL_FRONT_MY_TOURNAMENTS,
        label: t("profile.myTournaments"),
        icon: FaTrophy,
      },
      ...(isAdmin
        ? [
            {
              url: URL_FRONT_ADMIN_HOME,
              label: t("profile.adminPanel"),
              icon: FaCog,
            },
          ]
        : []),
    ],
    [t, isAdmin]
  );

  const sideNavContent = (
    <>
      <div className="flex-1 overflow-y-auto">
        <ul>
          {navSideItems.map((item) => (
            <NavSideItem key={item.url} url={item.url} label={item.label} />
          ))}
        </ul>
        {isAdmin && (
          <ul>
            <NavSideItem
              url={URL_FRONT_ADMIN_HOME}
              label={t("profile.adminPanel")}
            />
          </ul>
        )}
      </div>
      <span
        className="block w-full p-2 hover:bg-blue-200 cursor-pointer border-l-4 border-transparent"
        onClick={confirmLogout}
      >
        {t("common.logout")}
      </span>
    </>
  );

  return (
    <>
      <div className="flex flex-col">
        <div ref={headerRef} className="relative z-30">
          <Header />
        </div>
        <div ref={navbarRef} className="relative z-20">
          <Navbar />
        </div>
        <div
          id="userProfilLayout"
          className="relative w-full max-w-containerSize mx-auto overflow-hidden"
          style={{
            height:
              userProfilLayoutHeight > 0
                ? `${userProfilLayoutHeight - 10}px`
                : "calc(100vh - 120px)",
          }}
        >
          <div className="relative h-full w-full flex flex-col lscreen:grid lscreen:grid-cols-12 bg-gray-300">
            {/* Nav desktop */}
            <aside className="hidden lscreen:flex lscreen:col-span-2 lscreen:flex-col lscreen:justify-between bg-gray-200">
              {sideNavContent}
            </aside>

            <div className="flex-1 min-h-0 lscreen:col-span-10 bg-gray-100 p-2 overflow-y-auto">
              {children}
            </div>

            {/* Nav mobile — barre d’onglets fixe en bas */}
            <nav
              className="lscreen:hidden shrink-0 z-20 flex items-stretch justify-around border-t border-gray-200 bg-white pt-1 pb-[max(0.25rem,env(safe-area-inset-bottom))] shadow-[0_-2px_8px_rgba(0,0,0,0.06)]"
              aria-label={t("profile.myProfile")}
            >
              {mobileTabItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname.includes(item.url);
                return (
                  <Link
                    key={item.url}
                    to={item.url}
                    className={`flex flex-1 flex-col items-center justify-center gap-0.5 min-w-0 px-1 py-1.5 text-[10px] leading-tight ${
                      isActive
                        ? "text-indigo-600 font-semibold"
                        : "text-gray-500"
                    }`}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <Icon className="w-5 h-5 shrink-0" aria-hidden />
                    <span className="truncate max-w-full">{item.label}</span>
                  </Link>
                );
              })}
              <button
                type="button"
                className="flex flex-1 flex-col items-center justify-center gap-0.5 min-w-0 px-1 py-1.5 text-[10px] leading-tight text-gray-500"
                onClick={confirmLogout}
                aria-label={t("common.logout")}
              >
                <FaSignOutAlt className="w-5 h-5 shrink-0" aria-hidden />
                <span className="truncate max-w-full">{t("common.logout")}</span>
              </button>
            </nav>
          </div>
        </div>
      </div>

      <PopUp
        isOpen={showLogoutConfirm}
        onClose={handleCancelLogout}
        title={t("profile.logoutConfirmTitle")}
        showCloseButton={true}
      >
        <div className="space-y-4">
          <p className="text-center text-gray-700">
            {t("profile.logoutConfirmMessage")}
          </p>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={handleCancelLogout}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors duration-200 font-medium"
            >
              {t("common.cancel")}
            </button>
            <button
              onClick={handleConfirmLogout}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors duration-200 font-medium"
            >
              {t("common.confirmLogout")}
            </button>
          </div>
        </div>
      </PopUp>
    </>
  );
};

export default UserProfilLayout;
