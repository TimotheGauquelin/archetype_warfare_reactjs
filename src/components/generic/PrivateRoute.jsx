import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import { URL_FRONT_HOME } from "../../constant/urlsFront";

const PrivateRoute = ({allowedRoles}) => {
  const { authUser } = useContext(AuthContext)
  const hasRoles = authUser?.roles?.some((role) => allowedRoles.includes(role));

  return hasRoles ? <Outlet /> : <Navigate to={URL_FRONT_HOME} />;
};

export default PrivateRoute;
