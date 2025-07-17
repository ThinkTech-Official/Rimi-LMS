import React, { type ReactNode } from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAdminContext } from '../context/AdminContext';
import Spinner from './loaders/Spinner';



interface RequireAdminProps {
  children: ReactNode;
}

export const RequireAdmin: React.FC<RequireAdminProps> = ({ children }) => {
  const { admin, loading, error } = useAdminContext();
  const location = useLocation();

  //  can show a spinner or nothing
  if (loading) {
    return <div className="flex flex-col justify-center items-center gap-3 fixed top-1/2 left-1/2"><Spinner className="w-10 h-10" /><p>Loading...</p></div>;;
  }

  // If theres no admin, kick them back to the login page
  if (error || !admin) {
    return <Navigate to="/adminlogin" state={{ from: location }} replace />;
  }

  // Otherwise render whatever child route is active
//   return <Outlet />;
return <>{children}</>
};