import React, { type ReactNode } from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAdminContext } from '../context/AdminContext';



interface RequireAdminProps {
  children: ReactNode;
}

export const RequireAdmin: React.FC<RequireAdminProps> = ({ children }) => {
  const { admin, loading } = useAdminContext();
  const location = useLocation();

  //  can show a spinner or nothing
  if (loading) {
    return <div>Loading…</div>;
  }

  // If theres no admin, kick them back to the login page
  if (!admin) {
    return <Navigate to="/adminlogin" state={{ from: location }} replace />;
  }

  // Otherwise render whatever child route is active
//   return <Outlet />;
return <>{children}</>
};