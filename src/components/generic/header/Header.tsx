import { memo, useState } from "react";
import { BsPerson } from "react-icons/bs";
import { Link, useLocation } from "react-router-dom";
import { FaTimes, FaBars } from "react-icons/fa";
import { useSelector } from "react-redux";
import { URL_FRONT_ABOUT, URL_FRONT_ARCHETYPES, URL_FRONT_BANLIST,URL_FRONT_ROAD_MAP, URL_FRONT_HOME, URL_FRONT_LOGIN, URL_FRONT_MY_PROFILE} from "../../../constant/urlsFront";
import type { RootState } from "../../../types";

const HeaderMemo = memo(function Header() {
  const [displayNav, setDisplayNav] = useState<boolean>(false);
  const location = useLocation();
  const authUser = useSelector((state: RootState) => state.user);

  const navBarComponent = [
    {
      title: "Concept",
      url: URL_FRONT_ABOUT,
    },
    {
      title: "Archetypes",
      url: URL_FRONT_ARCHETYPES,
    },
    {
      title: "Banlist",
      url: URL_FRONT_BANLIST,
    },
    {
      title: "RoadMap",
      url: URL_FRONT_ROAD_MAP,
    },
  ];

  const url = location.pathname;

  return (
    <div className="flex flex-col justify-center">
      <div className="flex flex-row justify-between items-center h-[50px] lscreen:h-[60px] px-2 w-full lscreen:m-auto lscreen:max-w-containerSize">
        <div className="flex flex-row items-center">
          <Link className="block lscreen:pr-5" to={URL_FRONT_HOME}>
            <div>
              <img
                src={`${import.meta.env.BASE_URL}assets/archetype_battle.png`}
                alt=""
                className="w-1/2"
              />
            </div>
          </Link>
          <ul className="hidden lscreen:flex flex-row justify-start px-3 font-bold text-md">
            {navBarComponent.map((component, index) => {
              return (
                <Link
                  key={index}
                  className={`${
                    url.includes(component.url)
                      ? "text-red-400"
                      : "text-gray-600"
                  }`}
                  style={{ paddingRight: "2rem" }}
                  to={component.url}
                >
                  <li>{component.title}</li>{" "}
                </Link>
              );
            })}
          </ul>
        </div>
        <div className="hidden lscreen:flex lscreen:justify-end">
          <Link
            to={
              authUser.isAuthenticated ? URL_FRONT_MY_PROFILE : URL_FRONT_LOGIN
            }
          >
            <button className="flex justify-center items-center lscreen:shadow p-2 lscreen:p-3 lscreen:rounded-lg lscreen:bg-white font-medium">
              <BsPerson className="h-4 w-auto flex-shrink-0 text-red-400" />
              <p className="lscreen:pl-2">
                {authUser.isAuthenticated ? `${authUser.username}` : "Connexion"}
              </p>
            </button>
          </Link>
        </div>
        <div
          className="flex lscreen:hidden"
          onClick={() => {
            setDisplayNav(!displayNav);
          }}
        >
          {displayNav ? <FaTimes /> : <FaBars />}
        </div>
      </div>
      {displayNav && (
        <div className="flex flex-col shadow-md lscreen:hidden lscreen:max-w-containerSize">
          <ul className="flex flex-col">
            {navBarComponent.map((component) => {
              return (
                <Link
                  key={component.url}
                  className={`${
                    url.includes(component.url)
                      ? "text-red-400"
                      : "text-gray-600"
                  } my-2 px-2`}
                  style={{ paddingRight: "2rem" }}
                  to={component.url}
                >
                  <li>{component.title}</li>{" "}
                </Link>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
});

export default HeaderMemo;
