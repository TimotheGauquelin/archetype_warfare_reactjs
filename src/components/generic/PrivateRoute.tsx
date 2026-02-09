import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { URL_FRONT_HOME } from "../../constant/urlsFront";
import { useSelector } from "react-redux";
import type { RootState } from "../../types";

interface PrivateRouteProps {
  allowedRoles: string[];
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ allowedRoles }) => {
  const authUser = useSelector((state: RootState) => state.user);

  const hasRoles = authUser?.roles?.some((role) => {
    const roleLabel = typeof role === 'string' ? role : role.label;
    return allowedRoles.includes(roleLabel);
  });

  return hasRoles ? <Outlet /> : <Navigate to={URL_FRONT_HOME} />;
};

export default PrivateRoute;
