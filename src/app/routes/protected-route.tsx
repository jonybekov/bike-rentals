import { Center } from "@mantine/core";
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import ThreeDots from "../../shared/components/three-dots";
import { UserRole } from "../../shared/types/user";
import { useAuth } from "../contexts/auth-context";

interface IProtectedRouteProps {
  redirectPath?: string;
  allowTo?: UserRole[];
}

export const ProtectedRoute = ({
  redirectPath = "/access-denied",
  children,
  allowTo,
}: React.PropsWithChildren<IProtectedRouteProps>) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Center style={{ width: "100%" }}>
        <ThreeDots width={200} />
      </Center>
    );
  }

  if (user === null && !loading)
    return (
      <Navigate
        to={{ pathname: "/login", search: `redirect=${location.pathname}` }}
        replace
      />
    );

  if (user && !allowTo?.includes(user.role.name)) {
    return <Navigate to={redirectPath} replace />;
  }

  return children ? <div>{children}</div> : <Outlet />;
};

export default ProtectedRoute;
