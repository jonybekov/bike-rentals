import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Navigate, Outlet } from "react-router-dom";
import { UserRole } from "../../shared/types/user";
import { useAuth } from "../contexts/auth-context";
import { auth } from "../services/firebase";

interface IProtectedRouteProps {
  redirectPath?: string;
  permissions?: UserRole[];
}

export const ProtectedRoute = ({
  redirectPath = "/access-denied",
  children,
  permissions,
}: React.PropsWithChildren<IProtectedRouteProps>) => {
  const { session, user, loading } = useAuth();

  // console.log(user, isLoading);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (user === null && !loading)
    return (
      <Navigate
        to={{ pathname: "/login", search: `redirect=${location.pathname}` }}
        replace
      />
    );

  // const hasPermission = permissions?.some((permission) => role === permission);

  // if (!hasPermission) {
  //   return <Navigate to={redirectPath} replace />;
  // }

  return children ? <div>{children}</div> : <Outlet />;
};

export default ProtectedRoute;
