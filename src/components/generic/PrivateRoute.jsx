import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { URL_FRONT_HOME } from "../../constant/urlsFront";
import { useSelector } from "react-redux";

const PrivateRoute = ({allowedRoles}) => {
  const authUser = useSelector((state) => state.user);

  const hasRoles = authUser?.roles?.some((role) => allowedRoles.includes(role));

  return hasRoles ? <Outlet /> : <Navigate to={URL_FRONT_HOME} />;
};

export default PrivateRoute;
