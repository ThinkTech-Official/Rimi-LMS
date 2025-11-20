import React, { type ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAdminContext } from "../context/AdminContext";
import { useTranslation } from "react-i18next";
import AuthLoader from "./loaders/AuthLoader";

interface RequireAdminProps {
  children: ReactNode;
}

export const RequireAdmin: React.FC<RequireAdminProps> = ({ children }) => {
  const { admin, loading, error } = useAdminContext();
  const location = useLocation();
  const { t } = useTranslation();

  //  can show a spinner or nothing
  if (loading) {
    return (
      <div className="fixed flex flex-col gap-2 items-center justify-center top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-nowrap">
        <AuthLoader />
        <p>{t("Authenticating")}...</p>
      </div>
    );
  }

  // If theres no admin, kick them back to the login page
  if (error || !admin) {
    return <Navigate to="/adminlogin" state={{ from: location }} replace />;
  }

  // Otherwise render whatever child route is active
  //   return <Outlet />;
  return <>{children}</>;
};
