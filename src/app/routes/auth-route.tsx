import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { UserRole } from "../../shared/types/user";
import { useAuth } from "../contexts/auth-context";

interface IAuthRouteProps {
  permissions?: UserRole[];
}

export const AuthRoute = ({
  children,
}: React.PropsWithChildren<IAuthRouteProps>) => {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (user && !loading) return <Navigate to={{ pathname: "/" }} replace />;

  return children ? <div>{children}</div> : <Outlet />;
};

export default AuthRoute;
