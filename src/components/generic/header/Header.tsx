import { memo, useMemo, useState } from "react";
import { BsPerson } from "react-icons/bs";
import { Link, useLocation } from "react-router-dom";
import { FaTimes, FaBars } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  URL_FRONT_ABOUT,
  URL_FRONT_ARCHETYPES,
  URL_FRONT_BANLIST,
  URL_FRONT_ROAD_MAP,
  URL_FRONT_HOME,
  URL_FRONT_LOGIN,
  URL_FRONT_MY_PROFILE,
  URL_FRONT_TOURNAMENTS,
  URL_FRONT_QUIZ,
} from "../../../constant/urlsFront";
import type { RootState } from "../../../types";
import LanguageSwitch from "./LanguageSwitch";

const HeaderMemo = memo(function Header() {
  const [displayNav, setDisplayNav] = useState<boolean>(false);
  const location = useLocation();
  const authUser = useSelector((state: RootState) => state.user);
  const { t } = useTranslation();

  const navBarComponent = useMemo(
    () => [
      { titleKey: "nav.concept", url: URL_FRONT_ABOUT },
      { titleKey: "nav.archetypes", url: URL_FRONT_ARCHETYPES },
      { titleKey: "nav.banlist", url: URL_FRONT_BANLIST },
      { titleKey: "nav.tournaments", url: URL_FRONT_TOURNAMENTS },
      { titleKey: "nav.quiz", url: URL_FRONT_QUIZ },
      { titleKey: "nav.roadmap", url: URL_FRONT_ROAD_MAP },
    ],
    []
  );

  const url = location.pathname;

  return (
    <div className="flex flex-col justify-center">
      <div className="flex flex-row justify-between items-center h-[50px] lscreen:h-[60px] px-2 w-full lscreen:m-auto lscreen:max-w-containerSize">
        <div className="flex flex-row items-center">
          <Link
            className="block lscreen:pr-5"
            to={URL_FRONT_HOME}
            aria-label={t("nav.home")}
          >
            <div>
              <picture>
                <source
                  srcSet={`${import.meta.env.BASE_URL}assets/archetype_battle.webp`}
                  type="image/webp"
                />
                <img
                  src={`${import.meta.env.BASE_URL}assets/archetype_battle.png`}
                  alt="Archetype Battle"
                  width={130}
                  height={21}
                  decoding="async"
                  className="w-1/2"
                />
              </picture>
            </div>
          </Link>
          <ul className="hidden lscreen:flex flex-row justify-start px-3 font-bold text-md">
            {navBarComponent.map((component, index) => {
              return (
                <li key={index} style={{ paddingRight: "2rem" }}>
                  <Link
                    className={
                      url.includes(component.url)
                        ? "text-red-400"
                        : "text-gray-600"
                    }
                    to={component.url}
                  >
                    {t(component.titleKey)}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="hidden lscreen:flex lscreen:items-center lscreen:gap-3 lscreen:justify-end">
          <LanguageSwitch />
          <Link
            to={
              authUser.isAuthenticated ? URL_FRONT_MY_PROFILE : URL_FRONT_LOGIN
            }
          >
            <button className="flex justify-center items-center lscreen:shadow p-2 lscreen:p-3 lscreen:rounded-lg lscreen:bg-white font-medium">
              <BsPerson className="h-4 w-auto flex-shrink-0 text-red-400" />
              <p className="lscreen:pl-2">
                {authUser.isAuthenticated
                  ? `${authUser.username}`
                  : t("nav.login")}
              </p>
            </button>
          </Link>
        </div>
        <div className="flex items-center gap-2 lscreen:hidden">
          <LanguageSwitch />
          <Link
            to={
              authUser.isAuthenticated ? URL_FRONT_MY_PROFILE : URL_FRONT_LOGIN
            }
            className="flex items-center gap-1 rounded-md px-2 py-1.5 text-sm font-medium text-gray-700"
            aria-label={
              authUser.isAuthenticated
                ? authUser.username ?? undefined
                : t("nav.login")
            }
          >
            <BsPerson className="h-4 w-auto flex-shrink-0 text-red-400" />
            <span className="max-w-[7rem] truncate">
              {authUser.isAuthenticated
                ? authUser.username
                : t("nav.login")}
            </span>
          </Link>
          <button
            type="button"
            className="p-1"
            aria-expanded={displayNav}
            aria-label={displayNav ? t("nav.closeMenu") : t("nav.openMenu")}
            onClick={() => {
              setDisplayNav(!displayNav);
            }}
          >
            {displayNav ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>
      {displayNav && (
        <div className="flex flex-col shadow-md lscreen:hidden lscreen:max-w-containerSize">
          <ul className="flex flex-col">
            {navBarComponent.map((component) => {
              return (
                <li key={component.url} className="my-2 px-2" style={{ paddingRight: "2rem" }}>
                  <Link
                    className={
                      url.includes(component.url)
                        ? "text-red-400"
                        : "text-gray-600"
                    }
                    to={component.url}
                    onClick={() => setDisplayNav(false)}
                  >
                    {t(component.titleKey)}
                  </Link>
                </li>
              );
            })}
            <li className="my-2 px-2 border-t border-gray-100 pt-3">
              <Link
                className={
                  url.includes(
                    authUser.isAuthenticated
                      ? URL_FRONT_MY_PROFILE
                      : URL_FRONT_LOGIN
                  )
                    ? "text-red-400"
                    : "text-gray-600"
                }
                to={
                  authUser.isAuthenticated
                    ? URL_FRONT_MY_PROFILE
                    : URL_FRONT_LOGIN
                }
                onClick={() => setDisplayNav(false)}
              >
                {authUser.isAuthenticated
                  ? authUser.username
                  : t("nav.login")}
              </Link>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
});

export default HeaderMemo;
