import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useProfile } from '../../hooks/useProfile';

export const RequireAuth: React.FC = () => {
  const { profile, loading, error } = useProfile();
  const location = useLocation();

  if (loading) {
    return <div className="p-4">Checking authentication…</div>;
  }

  // if error or no profile, send them back to login
  if (error || !profile) {
    return (
      <Navigate
        to="/"
        state={{ from: location }}
        replace
      />
    );
  }

  // authenticated! render nested routes:
  return <Outlet />;
};