import React, { useState, useRef, useLayoutEffect, useMemo } from "react";
import { FaEllipsisH } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import NavSideItem from "../../components/pages/userProfil/NavSideItem";
import { useNavigate } from "react-router-dom";
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
  const [displayedNavBar, setDisplayedNavBar] = useState<boolean>(true);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState<boolean>(false);
  const [userProfilLayoutHeight, setUserProfilLayoutHeight] = useState<number>(0);
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

  const navSideItems = useMemo(
    () => [
      { url: URL_FRONT_MY_PROFILE, label: t("profile.myProfile") },
      { url: URL_FRONT_MY_DECKS, label: t("profile.myDecks") },
      { url: URL_FRONT_MY_TOURNAMENTS, label: t("profile.myTournaments") },
    ],
    [t]
  );

  return (
    <>
      <div className="flex flex-col">
        <div ref={headerRef}>
          <Header />
        </div>
        <div ref={navbarRef}>
          <Navbar />
        </div>
        <div
          id="userProfilLayout"
          className="relative w-full max-w-containerSize mx-auto overflow-hidden"
          style={{ height: userProfilLayoutHeight > 0 ? `${userProfilLayoutHeight - 10}px` : "calc(100vh - 120px)" }}
        >
          <div className="relative h-full w-full grid-cols-12">
            <div
              className="lscreen:hidden mr-2"
              onClick={() => setDisplayedNavBar(!displayedNavBar)}
            >
              <FaEllipsisH />
            </div>

            <div
              className={`h-full lscreen:grid lscreen:grid-cols-12 bg-gray-300 lscreen:flex`}
            >
              <div
                className={`col-span-1 bg-gray-200 flex flex-col justify-between ${displayedNavBar ? "display" : "hidden"
                  }`}
              >
                <div>
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
                  {(authUser?.roles ?? []).includes(ROLE_ADMIN) && (
                    <ul>
                      <NavSideItem url={URL_FRONT_ADMIN_HOME} label={t("profile.adminPanel")} />
                    </ul>
                  )}
                </div>
                <span
                  className="block w-full p-2 hover:bg-blue-200 cursor-pointer border-l-4 border-transparent"
                  onClick={confirmLogout}
                >
                  {t("common.logout")}
                </span>
              </div>

              <div className="col-span-11 bg-gray-100 p-2 overflow-y-auto min-h-0 h-full">
                {children}
              </div>
            </div>
          </div>
        </div>
      </div >

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
