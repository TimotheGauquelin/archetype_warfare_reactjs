import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  FaCog,
  FaCrown,
  FaEdit,
  FaLayerGroup,
  FaSignOutAlt,
  FaTrophy,
  FaUser,
} from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  getArchetypePublicPath,
  URL_FRONT_ADMIN_HOME,
  URL_FRONT_MY_DECKS,
  URL_FRONT_MY_PROFILE,
  URL_FRONT_MY_PROFILE_EDIT,
  URL_FRONT_MY_TOURNAMENTS,
} from "../../constant/urlsFront";
import { ROLE_ADMIN } from "../../utils/const/rolesConst";
import { logOut } from "../../services/auth";
import { useDispatch, useSelector } from "react-redux";
import PopUp from "../../components/generic/PopUp";
import type { RootState, User } from "../../types";
import Header from "../../components/generic/header/Header";
import { getCountryFlagUrl, getCountryName } from "@/utils/country";
import { getUserById } from "@/services/user";
import { updateUser } from "@/redux/slice/userSlice";

interface UserProfilLayoutProps {
  children: React.ReactNode;
}

const UserProfilLayout: React.FC<UserProfilLayoutProps> = ({ children }) => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [userProfilLayoutHeight, setUserProfilLayoutHeight] = useState(0);
  const chromeRef = useRef<HTMLDivElement>(null);
  const authUser = useSelector((state: RootState) => state.user);
  const { id, username, roles, country, loved_archetype, profile_picture_url } =
    authUser;

  const [profileCountry, setProfileCountry] = useState(country || "");
  const [favoriteArchetype, setFavoriteArchetype] = useState(
    loved_archetype ?? null
  );
  const [profilePictureUrl, setProfilePictureUrl] = useState(
    profile_picture_url || ""
  );
  const [memberSince, setMemberSince] = useState<string | null>(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useLayoutEffect(() => {
    const chromeEl = chromeRef.current;
    if (!chromeEl) return;

    const updateHeight = () => {
      const remaining =
        window.innerHeight - chromeEl.getBoundingClientRect().bottom;
      setUserProfilLayoutHeight(Math.max(0, remaining));
    };

    updateHeight();

    const resizeObserver = new ResizeObserver(updateHeight);
    resizeObserver.observe(chromeEl);
    resizeObserver.observe(document.body);
    window.addEventListener("resize", updateHeight);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateHeight);
    };
  }, []);

  useEffect(() => {
    setProfilePictureUrl(profile_picture_url || "");
  }, [profile_picture_url]);

  useEffect(() => {
    if (!id) return;
    getUserById(id, (userData) => {
      const user = userData as User;
      setProfileCountry(user.country || "");
      setFavoriteArchetype(user.loved_archetype ?? null);
      setProfilePictureUrl(user.profile_picture_url || "");
      setMemberSince(user.created_at ?? null);
      dispatch(
        updateUser({
          biography: user.biography ?? null,
          country: user.country ?? null,
          profile_picture_url: user.profile_picture_url ?? null,
          loved_archetype_id: user.loved_archetype_id ?? null,
          loved_archetype: user.loved_archetype ?? null,
          quiz_points: user.quiz_points ?? 0,
        })
      );
    });
  }, [id, dispatch]);

  const confirmLogout = () => setShowLogoutConfirm(true);
  const handleCancelLogout = () => setShowLogoutConfirm(false);
  const handleConfirmLogout = () => {
    logOut(dispatch, navigate);
    setShowLogoutConfirm(false);
  };

  const isAdmin = (roles ?? []).includes(ROLE_ADMIN);

  const sectionTabs = useMemo(
    () => [
      {
        url: URL_FRONT_MY_PROFILE,
        label: t("profile.myProfile"),
        icon: FaUser,
        match: (path: string) => path.startsWith(URL_FRONT_MY_PROFILE),
      },
      {
        url: URL_FRONT_MY_DECKS,
        label: t("profile.myDecks"),
        icon: FaLayerGroup,
        match: (path: string) => path.startsWith(URL_FRONT_MY_DECKS),
      },
      {
        url: URL_FRONT_MY_TOURNAMENTS,
        label: t("profile.myTournaments"),
        icon: FaTrophy,
        match: (path: string) => path.startsWith(URL_FRONT_MY_TOURNAMENTS),
      },
    ],
    [t]
  );

  const initials = useMemo(() => {
    const name = (username || "?").trim();
    return name.slice(0, 1).toUpperCase();
  }, [username]);

  const memberSinceLabel = useMemo(() => {
    if (!memberSince) return null;
    try {
      return new Date(memberSince).toLocaleDateString(i18n.language, {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch {
      return null;
    }
  }, [memberSince, i18n.language]);

  const favoriteArchetypePath = favoriteArchetype
    ? getArchetypePublicPath(favoriteArchetype)
    : null;

  const actionBtnClass =
    "inline-flex items-center justify-center gap-1.5 text-xs tablet:text-sm font-semibold px-2.5 tablet:px-3 py-1.5 rounded transition-colors";

  return (
    <>
      <div className="flex flex-col overflow-hidden">
        <div ref={chromeRef} className="relative z-30 shrink-0">
          <Header />
        </div>

        <div
          id="userProfilLayout"
          className="relative w-full max-w-containerSize mx-auto overflow-hidden bg-slate-100"
          style={{
            height:
              userProfilLayoutHeight > 0
                ? `${userProfilLayoutHeight}px`
                : "calc(100dvh - 5rem)",
          }}
        >
          <div className="h-full min-h-0 overflow-y-auto p-2 tablet:p-3 space-y-3">
            {/* En-tête partagé (profil / decks / tournois) */}
            <header className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
              <div className="relative h-24 tablet:h-32 bg-gradient-to-br from-slate-800 via-slate-700 to-blue-900">
                <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_20%_20%,#94a3b8,transparent_45%),radial-gradient(circle_at_80%_0%,#60a5fa,transparent_40%)]" />
                <div className="absolute top-2 right-2 tablet:top-3 tablet:right-3 flex flex-wrap justify-end gap-1.5 z-10">
                  <Link
                    to={URL_FRONT_MY_PROFILE_EDIT}
                    className={`${actionBtnClass} bg-white/90 text-slate-800 hover:bg-white`}
                  >
                    <FaEdit className="w-3.5 h-3.5" aria-hidden />
                    <span className="hidden tablet:inline">
                      {t("profile.editProfile")}
                    </span>
                  </Link>
                  {isAdmin && (
                    <Link
                      to={URL_FRONT_ADMIN_HOME}
                      className={`${actionBtnClass} bg-amber-400 text-slate-900 hover:bg-amber-300`}
                    >
                      <FaCog className="w-3.5 h-3.5" aria-hidden />
                      <span className="hidden tablet:inline">
                        {t("profile.adminPanel")}
                      </span>
                      <span className="tablet:hidden">Admin</span>
                    </Link>
                  )}
                  <button
                    type="button"
                    onClick={confirmLogout}
                    className={`${actionBtnClass} bg-red-500 text-white hover:bg-red-600`}
                  >
                    <FaSignOutAlt className="w-3.5 h-3.5" aria-hidden />
                    <span className="hidden tablet:inline">
                      {t("common.logout")}
                    </span>
                  </button>
                </div>
                <div className="absolute -bottom-8 left-4 tablet:left-6 flex items-end gap-3">
                  <div className="w-16 h-16 tablet:w-20 tablet:h-20 rounded-full border-4 border-white bg-slate-200 text-slate-700 flex items-center justify-center text-2xl tablet:text-3xl font-bold shadow-md shrink-0 overflow-hidden">
                    {profilePictureUrl ? (
                      <img
                        src={profilePictureUrl}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      initials
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-10 tablet:pt-12 px-4 tablet:px-6 pb-3">
                <h1 className="text-xl tablet:text-2xl font-bold text-slate-900 truncate">
                  {username}
                </h1>
                <div className="mt-1 flex flex-wrap items-center gap-1.5">
                  {(roles ?? []).map((role: string, index: number) => (
                    <span
                      key={index}
                      className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold text-white rounded-md ${
                        role?.toLowerCase() === "admin"
                          ? "bg-red-500"
                          : "bg-emerald-600"
                      }`}
                    >
                      {role?.toLowerCase() === "admin" && (
                        <FaCrown className="text-[10px]" aria-hidden />
                      )}
                      {role}
                    </span>
                  ))}
                </div>
                <p className="mt-2 text-sm text-slate-600 flex flex-wrap gap-x-3 gap-y-1">
                  {memberSinceLabel && (
                    <span>
                      {t("profile.memberSince", { date: memberSinceLabel })}
                    </span>
                  )}
                  {profileCountry ? (
                    <span className="inline-flex items-center gap-1.5">
                      <img
                        src={getCountryFlagUrl(profileCountry)}
                        alt=""
                        className="w-5 h-3.5 object-cover rounded-sm"
                        width={20}
                        height={14}
                      />
                      {getCountryName(profileCountry, i18n.language) ??
                        profileCountry}
                    </span>
                  ) : null}
                  <span>
                    {t("profile.favoriteArchetypeShort")}:{" "}
                    {favoriteArchetypePath && favoriteArchetype?.name ? (
                      <Link
                        to={favoriteArchetypePath}
                        className="font-semibold text-blue-700 hover:underline"
                      >
                        {favoriteArchetype.name}
                      </Link>
                    ) : (
                      <strong className="font-semibold text-slate-800">
                        {favoriteArchetype?.name ||
                          t("profile.noFavoriteArchetype")}
                      </strong>
                    )}
                  </span>
                </p>
              </div>

              {/* Navigation sections */}
              <nav
                className="flex border-t border-slate-200 bg-white overflow-x-auto"
                aria-label={t("profile.myProfile")}
              >
                {sectionTabs.map((tab) => {
                  const Icon = tab.icon;
                  const active = tab.match(location.pathname);
                  return (
                    <Link
                      key={tab.url}
                      to={tab.url}
                      className={`flex items-center gap-1.5 px-3 tablet:px-4 py-2.5 text-sm font-semibold border-b-2 whitespace-nowrap ${
                        active
                          ? "border-slate-800 text-slate-900 bg-slate-50"
                          : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                      }`}
                      aria-current={active ? "page" : undefined}
                    >
                      <Icon className="w-3.5 h-3.5 shrink-0" aria-hidden />
                      {tab.label}
                    </Link>
                  );
                })}
              </nav>
            </header>

            {/* Contenu de la page (profil / decks / tournois) */}
            <div className="pb-4">{children}</div>
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
              type="button"
              onClick={handleCancelLogout}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors duration-200 font-medium"
            >
              {t("common.cancel")}
            </button>
            <button
              type="button"
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
