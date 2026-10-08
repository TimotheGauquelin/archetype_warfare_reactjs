import React, { lazy, Suspense, useEffect, useState } from "react";
import { useAuthAutoLogout } from "./hooks/useAuthAutoLogout";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import I18nLocaleSync from "./components/I18nLocaleSync";
import Home from "./pages/Home";
import {
  URL_FRONT_ABOUT,
  URL_FRONT_ADMIN_ARCHETYPE_ADD_FORM,
  URL_FRONT_ADMIN_ARCHETYPE_UPDATE_FORM,
  URL_FRONT_ADMIN_ARCHETYPES,
  URL_FRONT_ADMIN_BANLISTS,
  URL_FRONT_ADMIN_CARDS,
  URL_FRONT_ADMIN_FILES,
  URL_FRONT_ADMIN_HOME,
  URL_FRONT_ADMIN_USER_ADD,
  URL_FRONT_ADMIN_USERS,
  URL_FRONT_ARCHETYPES,
  URL_FRONT_BANLIST,
  URL_FRONT_HOME,
  URL_FRONT_LOGIN,
  URL_FRONT_REGISTER,
  URL_FRONT_TERMS_AND_CONDITIONS,
  URL_FRONT_MY_PROFILE,
  URL_FRONT_PASSWORD_LOST,
  URL_FRONT_PASSWORD_RESET,
  URL_FRONT_ADMIN_USER_UPDATE,
  URL_FRONT_ADMIN_BANLIST_UPDATE,
  URL_FRONT_ADMIN_BANLIST_ADD,
  URL_FRONT_MY_DECKS,
  URL_FRONT_MY_DECK_ADD,
  URL_FRONT_MY_DECK_UPDATE,
  URL_FRONT_ADMIN_FILES_ARCHETYPES_INTRODUCTION_CARD,
  URL_FRONT_ADMIN_FILES_ARCHETYPES_JUMBOTRON,
  URL_FRONT_ROAD_MAP,
  URL_FRONT_ADMIN_OPTIONS,
  URL_FRONT_MY_PROFILE_EDIT,
  URL_FRONT_TOURNAMENTS,
  URL_FRONT_MY_TOURNAMENTS,
  URL_FRONT_ADMIN_TOURNAMENTS,
  URL_FRONT_ADMIN_TOURNAMENT_ADD,
  URL_FRONT_ADMIN_TOURNAMENT_UPDATE,
  URL_FRONT_ADMIN_TOURNAMENT_MANAGE,
  URL_FRONT_ADMIN_CARD_DETAIL,
} from "./constant/urlsFront";
import PrivateRoute from "./components/generic/PrivateRoute";
import { ROLE_ADMIN } from "./utils/const/rolesConst";
import ScrollToTop from "./utils/scroll/ScrollToTop";
import StreamBar from "./components/generic/header/StreamBar";
import FreeHostingBanner from "./components/generic/header/FreeHostingBanner";
import { getConfig } from "./services/websiteactions";
import type { SiteConfig } from "./types";
import PopUp from "./components/generic/PopUp";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "./redux/store";
import { logOut } from "./services/auth";

const LoginPage = lazy(() => import("./pages/auth/login/LoginPage"));
const RegisterPage = lazy(() => import("./pages/auth/register/RegisterPage"));
const TermsAndConditions = lazy(() => import("./pages/TermsAndConditions"));
const PasswordLostPage = lazy(() => import("./pages/auth/passwordLost/PasswordLostPage"));
const PasswordReset = lazy(() => import("./pages/auth/passwordReset/PasswordResetPage"));
const ConceptPage = lazy(() => import("./pages/user/ConceptPage"));
const BanlistPage = lazy(() => import("./pages/user/banlist/BanlistPage"));
const RoadMapPage = lazy(() => import("./pages/user/RoadMapPage"));
const ArchetypesPage = lazy(() => import("./pages/user/archetypesPage/ArchetypesPage"));
const ArchetypePage = lazy(() => import("./pages/user/archetypePage/ArchetypePage"));
const TournamentsPage = lazy(() => import("./pages/user/tournaments/TournamentsPage"));
const TournamentDetailPage = lazy(() => import("./pages/user/tournamentDetail/TournamentDetailPage"));

const MyProfilePage = lazy(() => import("./pages/userProfil/myProfile/myProfileMain/MyProfilePage"));
const UpdateMyProfilePage = lazy(() => import("./pages/userProfil/myProfile/updateMyProfile/UpdateMyProfilePage"));
const MyDecksPage = lazy(() => import("./pages/userProfil/myDecks/myDecksMain/MyDecksPage"));
const MyDeckAdd = lazy(() => import("./pages/userProfil/myDecks/createADeck/MyDeckAddPage"));
const UpdateMyDeckPage = lazy(() => import("./pages/userProfil/myDecks/updateADeck/UpdateMyDeckPage"));
const AllMyTournamentsPage = lazy(() => import("./pages/userProfil/myTournaments/myTournamentsMain/AllMyTournamentsPage"));
const MyTournamentDetail = lazy(() => import("./pages/userProfil/myTournaments/myTournamentDetail/MyTournamentDetail"));

const AdminHome = lazy(() => import("./pages/admin/AdminHome"));
const AdminArchetype = lazy(() => import("./pages/admin/adminArchetypes/AdminArchetype"));
const AdminArchetypeAdd = lazy(() => import("./pages/admin/adminArchetypes/AdminArchetypeAdd"));
const AdminArchetypeUpdatePage = lazy(() => import("./pages/admin/adminArchetypes/AdminArchetypeUpdatePage"));
const AdminBanlist = lazy(() => import("./pages/admin/adminBanlists/AdminBanlist"));
const AdminAddBanlist = lazy(() => import("./pages/admin/adminBanlists/AdminAddBanlist"));
const AdminUpdateBanlist = lazy(() => import("./pages/admin/adminBanlists/AdminUpdateBanlist"));
const AdminUsers = lazy(() => import("./pages/admin/adminUsers/AdminUsers"));
const AdminUserAdd = lazy(() => import("./pages/admin/adminUsers/AdminUserAdd"));
const AdminUserUpdate = lazy(() => import("./pages/admin/adminUsers/AdminUserUpdate"));
const AdminFiles = lazy(() => import("./pages/admin/adminFiles/AdminFiles"));
const AdminFilesJumbotron = lazy(() => import("./pages/admin/adminFiles/AdminFilesJumbotron"));
const AdminFilesIntroductionCard = lazy(() => import("./pages/admin/adminFiles/ArchetypeFileIntroductionCard"));
const AdminCards = lazy(() => import("./pages/admin/adminCards/AdminCards"));
const AdminCardDetail = lazy(() => import("./pages/admin/adminCards/AdminCardDetail"));
const AdminOptions = lazy(() => import("./pages/admin/adminOptions/AdminOptions"));
const AdminTournaments = lazy(() => import("./pages/admin/adminTournaments/adminAllTournaments/AdminTournaments"));
const AdminAddTournament = lazy(() => import("./pages/admin/adminTournaments/adminAddTournament/AdminAddTournament"));
const AdminUpdateTournament = lazy(() => import("./pages/admin/adminTournaments/adminUpdateTournament/AdminUpdateTournament"));
const AdminManageTournament = lazy(() => import("./pages/admin/adminTournaments/adminManageTournement/AdminManageTournament"));

const AuthAutoLogout: React.FC = () => {
  const isExpired = useAuthAutoLogout();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (isExpired) {
      setOpen(true);
    }
  }, [isExpired]);

  const handleClose = () => {
    setOpen(false);
    logOut(dispatch, navigate);
  };

  return (
    <PopUp
      isOpen={open}
      onClose={handleClose}
      title="Session expirée"
      showCloseButton={false}
      closeOnBackdropClick={false}
    >
      <p className="text-gray-700 mb-3">
        Votre session a expiré. Vous allez être déconnecté et devrez vous reconnecter pour continuer.
      </p>
      <button
        type="button"
        onClick={handleClose}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm"
      >
        OK
      </button>
    </PopUp>
  );
};

const RouteFallback = () => (
  <div className="min-h-[40vh] flex items-center justify-center text-gray-600 text-sm" aria-busy="true">
    Chargement…
  </div>
);

const AppContent: React.FC = () => {
  const [config, setConfig] = useState<SiteConfig>({});

  useEffect(() => {
    // Hors chemin critique LCP (banner stream / registration)
    const t = window.setTimeout(() => getConfig(setConfig), 4000);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <div className="relative text-base">
      <I18nLocaleSync />
      <FreeHostingBanner />
      {config?.stream_banner_enabled === true && <StreamBar />}
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <AuthAutoLogout />
        <ScrollToTop />
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path={URL_FRONT_HOME} element={<Home />} />
            <Route path={URL_FRONT_ROAD_MAP} element={<RoadMapPage />} />
            <Route path={URL_FRONT_LOGIN} element={<LoginPage />} />
            <Route
              path={URL_FRONT_REGISTER}
              element={
                config?.registration_enabled ? (
                  <RegisterPage />
                ) : (
                  <Navigate to={URL_FRONT_HOME} />
                )
              }
            />
            <Route path={URL_FRONT_TERMS_AND_CONDITIONS} element={<TermsAndConditions />} />
            <Route path={URL_FRONT_ARCHETYPES} element={<ArchetypesPage />} />
            <Route path="/archetype/:id" element={<ArchetypePage />} />
            <Route path={URL_FRONT_ABOUT} element={<ConceptPage />} />
            <Route path={URL_FRONT_BANLIST} element={<BanlistPage />} />
            <Route path={URL_FRONT_TOURNAMENTS} element={<TournamentsPage />} />
            <Route path="/tournaments/:id" element={<TournamentDetailPage />} />
            <Route path={URL_FRONT_PASSWORD_LOST} element={<PasswordLostPage />} />
            <Route path={URL_FRONT_PASSWORD_RESET} element={<PasswordReset />} />

            <Route path={URL_FRONT_MY_PROFILE} element={<MyProfilePage />} />
            <Route path={URL_FRONT_MY_PROFILE_EDIT} element={<UpdateMyProfilePage />} />
            <Route path={URL_FRONT_MY_DECKS} element={<MyDecksPage />} />
            <Route path={URL_FRONT_MY_DECK_ADD} element={<MyDeckAdd />} />
            <Route path={URL_FRONT_MY_DECK_UPDATE} element={<UpdateMyDeckPage />} />
            <Route path={URL_FRONT_MY_TOURNAMENTS} element={<AllMyTournamentsPage />} />
            <Route path="/my-tournaments/:tournamentId" element={<MyTournamentDetail />} />

            <Route element={<PrivateRoute allowedRoles={[ROLE_ADMIN]} />}>
              <Route path={URL_FRONT_ADMIN_HOME} element={<AdminHome />} />
            </Route>
            <Route element={<PrivateRoute allowedRoles={[ROLE_ADMIN]} />}>
              <Route path={URL_FRONT_ADMIN_ARCHETYPES} element={<AdminArchetype />} />
            </Route>
            <Route element={<PrivateRoute allowedRoles={[ROLE_ADMIN]} />}>
              <Route path={URL_FRONT_ADMIN_ARCHETYPE_ADD_FORM} element={<AdminArchetypeAdd />} />
            </Route>
            <Route element={<PrivateRoute allowedRoles={[ROLE_ADMIN]} />}>
              <Route path={URL_FRONT_ADMIN_ARCHETYPE_UPDATE_FORM} element={<AdminArchetypeUpdatePage />} />
            </Route>
            <Route element={<PrivateRoute allowedRoles={[ROLE_ADMIN]} />}>
              <Route path={URL_FRONT_ADMIN_BANLISTS} element={<AdminBanlist />} />
            </Route>
            <Route element={<PrivateRoute allowedRoles={[ROLE_ADMIN]} />}>
              <Route path={URL_FRONT_ADMIN_BANLIST_ADD} element={<AdminAddBanlist />} />
            </Route>
            <Route element={<PrivateRoute allowedRoles={[ROLE_ADMIN]} />}>
              <Route path={URL_FRONT_ADMIN_BANLIST_UPDATE} element={<AdminUpdateBanlist />} />
            </Route>
            <Route element={<PrivateRoute allowedRoles={[ROLE_ADMIN]} />}>
              <Route path={URL_FRONT_ADMIN_USERS} element={<AdminUsers />} />
            </Route>
            <Route element={<PrivateRoute allowedRoles={[ROLE_ADMIN]} />}>
              <Route path={URL_FRONT_ADMIN_USER_ADD} element={<AdminUserAdd />} />
            </Route>
            <Route element={<PrivateRoute allowedRoles={[ROLE_ADMIN]} />}>
              <Route path={URL_FRONT_ADMIN_USER_UPDATE} element={<AdminUserUpdate />} />
            </Route>
            <Route path={URL_FRONT_ADMIN_FILES} element={<AdminFiles />} />
            <Route path={URL_FRONT_ADMIN_FILES_ARCHETYPES_JUMBOTRON} element={<AdminFilesJumbotron />} />
            <Route
              path={URL_FRONT_ADMIN_FILES_ARCHETYPES_INTRODUCTION_CARD}
              element={<AdminFilesIntroductionCard />}
            />
            <Route element={<PrivateRoute allowedRoles={[ROLE_ADMIN]} />}>
              <Route path={URL_FRONT_ADMIN_CARDS} element={<AdminCards />} />
            </Route>
            <Route element={<PrivateRoute allowedRoles={[ROLE_ADMIN]} />}>
              <Route path={URL_FRONT_ADMIN_CARD_DETAIL} element={<AdminCardDetail />} />
            </Route>
            <Route element={<PrivateRoute allowedRoles={[ROLE_ADMIN]} />}>
              <Route path={URL_FRONT_ADMIN_OPTIONS} element={<AdminOptions />} />
            </Route>
            <Route element={<PrivateRoute allowedRoles={[ROLE_ADMIN]} />}>
              <Route path={URL_FRONT_ADMIN_TOURNAMENTS} element={<AdminTournaments />} />
            </Route>
            <Route element={<PrivateRoute allowedRoles={[ROLE_ADMIN]} />}>
              <Route path={URL_FRONT_ADMIN_TOURNAMENT_ADD} element={<AdminAddTournament />} />
            </Route>
            <Route element={<PrivateRoute allowedRoles={[ROLE_ADMIN]} />}>
              <Route path={URL_FRONT_ADMIN_TOURNAMENT_UPDATE} element={<AdminUpdateTournament />} />
            </Route>
            <Route element={<PrivateRoute allowedRoles={[ROLE_ADMIN]} />}>
              <Route path={URL_FRONT_ADMIN_TOURNAMENT_MANAGE} element={<AdminManageTournament />} />
            </Route>

            <Route path="*" element={<Navigate to={URL_FRONT_HOME} />} />
          </Routes>
        </Suspense>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          limit={1}
        />
      </BrowserRouter>
    </div>
  );
};

export default AppContent;
