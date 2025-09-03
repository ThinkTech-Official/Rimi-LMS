import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useProfile } from "../../hooks/useProfile";
import AuthLoader from "../loaders/AuthLoader";
import { useTranslation } from "react-i18next";

export const RequireAuth: React.FC = () => {
  const { profile, loading, error } = useProfile();
  const location = useLocation();
  const { t } = useTranslation();

  if (loading) {
    return (
      <div className="fixed flex flex-col gap-2 items-center justify-center top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <AuthLoader />
        <p>{t("Authenticating")}...</p>
      </div>
    );
  }

  // if error or no profile, send them back to login
  if (error || !profile) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // authenticated! render nested routes:
  return <Outlet />;
};
