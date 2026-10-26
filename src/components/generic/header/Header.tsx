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
  const accountHref = authUser.isAuthenticated
    ? URL_FRONT_MY_PROFILE
    : URL_FRONT_LOGIN;
  const accountLabel = authUser.isAuthenticated
    ? authUser.username
    : t("nav.login");

  return (
    <div className="relative z-30 bg-white">
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
          <Link to={accountHref}>
            <button
              type="button"
              className="flex justify-center items-center shadow p-3 rounded-lg bg-white font-medium"
            >
              <BsPerson className="h-4 w-auto flex-shrink-0 text-red-400" />
              <p className="pl-2">{accountLabel}</p>
            </button>
          </Link>
        </div>
        <div className="flex items-center gap-2 lscreen:hidden">
          <LanguageSwitch />
          <button
            type="button"
            className="relative z-40 flex items-center justify-center p-2 rounded-md bg-white shadow border border-gray-100"
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
        <div className="absolute left-0 right-0 top-full z-40 flex flex-col shadow-md lscreen:hidden bg-white border-b border-gray-100">
          <ul className="flex flex-col max-w-containerSize mx-auto w-full">
            {navBarComponent.map((component) => {
              return (
                <li
                  key={component.url}
                  className="my-2 px-2"
                  style={{ paddingRight: "2rem" }}
                >
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
            <li className="my-2 px-2 border-t border-gray-100 pt-3 pb-2">
              <Link
                to={accountHref}
                onClick={() => setDisplayNav(false)}
                className="flex items-center justify-center gap-2 w-full shadow rounded-lg bg-white border border-gray-100 px-3 py-2.5 font-medium text-gray-800"
                aria-label={
                  authUser.isAuthenticated
                    ? authUser.username ?? undefined
                    : t("nav.login")
                }
              >
                <BsPerson className="h-4 w-auto flex-shrink-0 text-red-400" />
                <span className="truncate">{accountLabel}</span>
              </Link>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
});

export default HeaderMemo;
