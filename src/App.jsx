import React, { Suspense, lazy } from "react";

import Home from "./pages/Home";
import MyProfil from "./pages/userProfil/MyProfil";
import Login from "./pages/Login";
import Register from "./pages/Register";
import TermsAndConditions from "./pages/TermsAndConditions";
import AdminHome from "./pages/admin/AdminHome";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Concept from "./pages/Concept";
import Banlist from "./pages/Banlist";
import AdminArchetype from "./pages/admin/adminArchetypes/AdminArchetype";
import AdminBanlist from "./pages/admin/adminBanlists/AdminBanlist";
import PasswordLost from "./pages/PasswordLost";
import AccountConfirmation from "./pages/AccountConfirmation";
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
  URL_FRONT_DISCORD_CALLBACK,
  URL_FRONT_HOME,
  URL_FRONT_LOGIN,
  URL_FRONT_REGISTER,
  URL_FRONT_TERMS_AND_CONDITIONS,
  URL_FRONT_MY_PROFIL,
  URL_FRONT_PASSWORD_LOST,
  URL_FRONT_PASSWORD_RESET,
  URL_FRONT_ADMIN_USER_UPDATE,
  URL_FRONT_ADMIN_BANLIST_UPDATE,
} from "./constant/urlsFront";
import Loader from "./components/generic/Loader";
import AdminArchetypeUpdatePage from "./pages/admin/adminArchetypes/AdminArchetypeUpdatePage";
import AdminArchetypeAdd from "./pages/admin/adminArchetypes/AdminArchetypeAdd";
import AdminUserAdd from "./pages/admin/adminUsers/AdminUserAdd";
import PasswordReset from "./pages/PasswordReset";
import PrivateRoute from "./components/generic/PrivateRoute";
import { ROLE_ADMIN } from "./utils/const/rolesConst";
import DiscordLoginSuccesful from "./pages/DiscordLoginSuccesful";
import AdminUserUpdate from "./pages/admin/adminUsers/AdminUserUpdate";
import AdminUpdateBanlist from "./pages/admin/adminBanlists/AdminUpdateBanlist";
import UpdateMyProfil from "./pages/userProfil/UpdateMyProfil";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Archetype = lazy(() => import("./pages/Archetype"));
const Archetypes = lazy(() => import("./pages/Archetypes"));

const AppContent = () => {  
  return (
    <div className="relative">
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <Routes>
          <Route
            path={URL_FRONT_HOME}
            element={
              <Suspense fallback={<Loader />}>
                <Home />
              </Suspense>
            }
          />
          <Route exact path={URL_FRONT_LOGIN} element={<Login />} />
          <Route exact path={URL_FRONT_REGISTER} element={<Register />} />
          <Route exact path={URL_FRONT_TERMS_AND_CONDITIONS} element={<TermsAndConditions />} />
          <Route
            exact
            path={URL_FRONT_DISCORD_CALLBACK}
            element={<DiscordLoginSuccesful />}
          />
          <Route
            path={URL_FRONT_ARCHETYPES}
            element={
              <Suspense fallback={<Loader />}>
                <Archetypes />
              </Suspense>
            }
          />
          <Route
            path="/archetype/:id"
            element={
              <Suspense fallback={<Loader />}>
                <Archetype />
              </Suspense>
            }
          />
          <Route path={URL_FRONT_ABOUT} element={<Concept />} />
          <Route path={URL_FRONT_BANLIST} element={<Banlist />} />
          <Route path={URL_FRONT_PASSWORD_LOST} element={<PasswordLost />} />
          <Route
            path={URL_FRONT_PASSWORD_RESET}
            element={<PasswordReset />}
          />
          <Route
            path="/account-confirmation/:token"
            element={<AccountConfirmation />}
          />
          <Route path="*" element={<Navigate to={URL_FRONT_HOME} />} />

          {/* User Profil*/}
          <Route exact path={URL_FRONT_MY_PROFIL} element={<MyProfil />} />
          <Route path="/my-profil/edit" element={<UpdateMyProfil />} />
          {/* <Route exact path={URL_FRONT_MY_DECKS} element={<MyDecks />} /> */}

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
            path="/admin/files/:archetypefile"
            element={<AdminFilesJumbotron />}
          />
          <Route element={<PrivateRoute allowedRoles={[ROLE_ADMIN]} />}>
            <Route path={URL_FRONT_ADMIN_CARDS} element={<AdminCards />} />
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
