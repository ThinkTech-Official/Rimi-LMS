import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useProfile } from '../../hooks/useProfile';
import AuthLoader from '../loaders/AuthLoader';

export const RequireAuth: React.FC = () => {
  const { profile, loading, error } = useProfile();
  const location = useLocation();

  if (loading) {
    return <div className="fixed flex flex-col gap-2 items-center justify-center top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"><AuthLoader /><p>Authenticating...</p></div>;
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



// ===================================================================


// import React from 'react';
// import { Navigate, Outlet, useLocation } from 'react-router-dom';
// import { useProfile } from '../../hooks/useProfile';
// import AuthLoader from '../AuthLoader';
// import { useAuth } from '../../context/AuthContext';

// export const RequireAuth: React.FC = () => {
//   const { user, loading, error } = useAuth();
//   const location = useLocation();

//   if (loading) {
//     return <div className="fixed flex flex-col gap-2 items-center justify-center top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"><AuthLoader /><p>Authenticating...</p></div>;
//   }

//   // if error or no profile, send them back to login
//   if (error || !user) {
//     return (
//       <Navigate
//         to="/"
//         state={{ from: location }}
//         replace
//       />
//     );
//   }

//   // authenticated! render nested routes:
//   return <Outlet />;
// };