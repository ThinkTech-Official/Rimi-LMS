import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import "./index.css";
import LoginAdmin from "./pages/LoginAdmin.tsx";
import CoursePlay from "./components/client/CoursePlay.tsx";
import { AdminLayout } from "./components/AdminLayout.tsx";
import ClientLayout from "./components/client/ClientLayout.tsx";
import AdminHome from "./components/AdminHome.tsx";
import Courses from "./components/Courses.tsx";
import Certificates from "./components/Certificates.tsx";
import AllTests from "./components/AllTests.tsx";
import { UserManagement } from "./components/UserManagement.tsx";
import AdminProfile from "./components/AdminProfile.tsx";
import ClientCertificates from "./components/client/ClientCertificates.tsx";
import ClientHome from "./components/client/ClientHome.tsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* Public / Login */}
      <Route path="/" element={<LoginAdmin />} />

      {/* Admin-only routes */}
      <Route path="/admin" element={<AdminLayout />}>
        {/* Admin Routes */}
        <Route index element={<AdminHome />} />
        <Route path="/admin/profile" element={<AdminProfile />} />
        <Route path="/admin/all-courses" element={<Courses />} />
        <Route path="/admin/certificates" element={<Certificates />} />
        <Route path="/admin/tests" element={<AllTests />} />
        <Route path="/admin/users" element={<UserManagement />} />

        {/* <Route path="users" element={<UserList />} /> */}
      </Route>

      {/* Client routes */}
      <Route path="/client" element={<ClientLayout />}>
        {/* /client */}
        <Route index element={<ClientHome />} />
        <Route path="certificates" element={<ClientCertificates />} />
        {/* /client/play/:id */}
        <Route path="play/:id" element={<CoursePlay />} />
      </Route>
    </>
  )
);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
