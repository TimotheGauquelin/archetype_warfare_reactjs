import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Home from "./pages/Home";
import MyProfilePage from "./pages/userProfil/myProfile/myProfileMain/MyProfilePage";
import LoginPage from "./pages/auth/login/LoginPage";
import RegisterPage from "./pages/auth/register/RegisterPage";
import TermsAndConditions from "./pages/TermsAndConditions";
import AdminHome from "./pages/admin/AdminHome";
import ConceptPage from "./pages/user/ConceptPage";
import BanlistPage from "./pages/user/banlist/BanlistPage";
import AdminArchetype from "./pages/admin/adminArchetypes/AdminArchetype";
import AdminBanlist from "./pages/admin/adminBanlists/AdminBanlist";
import PasswordLostPage from "./pages/auth/passwordLost/PasswordLostPage";
import AdminUsers from "./pages/admin/adminUsers/AdminUsers";
import AdminCards from "./pages/admin/adminCards/AdminCards";
import AdminFiles from "./pages/admin/adminFiles/AdminFiles";
import AdminFilesJumbotron from "./pages/admin/adminFiles/AdminFilesJumbotron";
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
} from "./constant/urlsFront";
import AdminOptions from "./pages/admin/adminOptions/AdminOptions";
import AdminArchetypeUpdatePage from "./pages/admin/adminArchetypes/AdminArchetypeUpdatePage";
import AdminArchetypeAdd from "./pages/admin/adminArchetypes/AdminArchetypeAdd";
import AdminUserAdd from "./pages/admin/adminUsers/AdminUserAdd";
import PasswordReset from "./pages/auth/passwordReset/PasswordResetPage";
import PrivateRoute from "./components/generic/PrivateRoute";
import { ROLE_ADMIN } from "./utils/const/rolesConst";
import AdminUserUpdate from "./pages/admin/adminUsers/AdminUserUpdate";
import AdminUpdateBanlist from "./pages/admin/adminBanlists/AdminUpdateBanlist";
import UpdateMyProfilePage from "./pages/userProfil/myProfile/updateMyProfile/UpdateMyProfilePage";
import MyDecksPage from "./pages/userProfil/myDecks/myDecksMain/MyDecksPage";
import MyDeckAdd from "./pages/userProfil/myDecks/createADeck/MyDeckAddPage";
import AdminAddBanlist from "./pages/admin/adminBanlists/AdminAddBanlist";
import RoadMapPage from "./pages/user/RoadMapPage";
import AdminFilesIntroductionCard from "./pages/admin/adminFiles/ArchetypeFileIntroductionCard";
import ScrollToTop from "./utils/scroll/ScrollToTop";
import StreamBar from "./components/generic/header/StreamBar";
import { getConfig } from "./services/websiteactions";
import type { SiteConfig } from "./types";
import ArchetypesPage from "./pages/user/archetypesPage/ArchetypesPage";
import ArchetypePage from "./pages/user/archetypePage/ArchetypePage";
import UpdateMyDeckPage from "./pages/userProfil/myDecks/updateADeck/UpdateMyDeckPage";
import TournamentsPage from "./pages/user/tournaments/TournamentsPage";
import TournamentDetailPage from "./pages/user/tournamentDetail/TournamentDetailPage";

const AppContent: React.FC = () => {
  const [config, setConfig] = useState<SiteConfig>({});

  useEffect(() => {
    getConfig(setConfig);
  }, []);

  return (
    <div className="relative text-base">
      {
        config?.stream_banner_enabled && config?.stream_banner_enabled === true && <StreamBar />
      }
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <ScrollToTop />
        <Routes>
          <Route
            path={URL_FRONT_HOME}
            element={
              <Home />
            }
          />
          <Route path={URL_FRONT_ROAD_MAP} element={<RoadMapPage />} />
          <Route path={URL_FRONT_LOGIN} element={<LoginPage />} />
          <Route path={URL_FRONT_REGISTER} element={config?.registration_enabled ? <RegisterPage /> : <Navigate to={URL_FRONT_HOME} />} />
          <Route path={URL_FRONT_TERMS_AND_CONDITIONS} element={<TermsAndConditions />} />
          <Route
            path={URL_FRONT_ARCHETYPES}
            element={
              <ArchetypesPage />
            }
          />
          <Route
            path="/archetype/:id"
            element={
              <ArchetypePage />
            }
          />
          <Route path={URL_FRONT_ABOUT} element={<ConceptPage />} />
          <Route path={URL_FRONT_BANLIST} element={<BanlistPage />} />
          <Route path={URL_FRONT_TOURNAMENTS} element={<TournamentsPage />} />
          <Route path="/tournaments/:id" element={<TournamentDetailPage />} />
          <Route path={URL_FRONT_PASSWORD_LOST} element={<PasswordLostPage />} />
          <Route
            path={URL_FRONT_PASSWORD_RESET}
            element={<PasswordReset />}
          />
          <Route path="*" element={<Navigate to={URL_FRONT_HOME} />} />

          {/* User Profil*/}
          <Route path={URL_FRONT_MY_PROFILE} element={<MyProfilePage />} />
          <Route path={URL_FRONT_MY_PROFILE_EDIT} element={<UpdateMyProfilePage />} />
          <Route path={URL_FRONT_MY_DECKS} element={<MyDecksPage />} />
          <Route path={URL_FRONT_MY_DECK_ADD} element={<MyDeckAdd />} />
          <Route path={URL_FRONT_MY_DECK_UPDATE} element={<UpdateMyDeckPage />} />

          {/* Admin */}
          <Route element={<PrivateRoute allowedRoles={[ROLE_ADMIN]} />}>
            <Route path={URL_FRONT_ADMIN_HOME} element={<AdminHome />} />
          </Route>

          <Route element={<PrivateRoute allowedRoles={[ROLE_ADMIN]} />}>
            <Route
              path={URL_FRONT_ADMIN_ARCHETYPES}
              element={<AdminArchetype />}
            />
          </Route>
          <Route element={<PrivateRoute allowedRoles={[ROLE_ADMIN]} />}>
            <Route
              path={URL_FRONT_ADMIN_ARCHETYPE_ADD_FORM}
              element={<AdminArchetypeAdd />}
            />
          </Route>
          <Route element={<PrivateRoute allowedRoles={[ROLE_ADMIN]} />}>
            <Route
              path={URL_FRONT_ADMIN_ARCHETYPE_UPDATE_FORM}
              element={<AdminArchetypeUpdatePage />}
            />
          </Route>
          <Route element={<PrivateRoute allowedRoles={[ROLE_ADMIN]} />}>
            <Route
              path={URL_FRONT_ADMIN_BANLISTS}
              element={<AdminBanlist />}
            />
          </Route>
          <Route element={<PrivateRoute allowedRoles={[ROLE_ADMIN]} />}>
            <Route
              path={URL_FRONT_ADMIN_BANLIST_ADD}
              element={<AdminAddBanlist />}
            />
          </Route>
          <Route element={<PrivateRoute allowedRoles={[ROLE_ADMIN]} />}>
            <Route
              path={URL_FRONT_ADMIN_BANLIST_UPDATE}
              element={<AdminUpdateBanlist />}
            />
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
          <Route
            path={URL_FRONT_ADMIN_FILES_ARCHETYPES_JUMBOTRON}
            element={<AdminFilesJumbotron />}
          />
          <Route
            path={URL_FRONT_ADMIN_FILES_ARCHETYPES_INTRODUCTION_CARD}
            element={<AdminFilesIntroductionCard />}
          />
          <Route element={<PrivateRoute allowedRoles={[ROLE_ADMIN]} />}>
            <Route path={URL_FRONT_ADMIN_CARDS} element={<AdminCards />} />
          </Route>
          <Route element={<PrivateRoute allowedRoles={[ROLE_ADMIN]} />}>
            <Route path={URL_FRONT_ADMIN_OPTIONS} element={<AdminOptions />} />
          </Route>
        </Routes>
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
