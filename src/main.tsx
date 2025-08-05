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
import EditCourse from "./components/EditCourse.tsx";
import CreateTest from "./components/CreateTest.tsx";
import LoginClient from "./pages/ClientLogin.tsx";
import ClientHome from "./components/client/ClientHome.tsx";
import ClientCertificates from "./components/client/ClientCertificates.tsx";
import EditTest from "./components/EditTest.tsx";
import ClientProfile from "./components/client/ClientProfile.tsx";
import { GenerateCertificatePage } from "./pages/GenerateCertificatePage.tsx";
import { RequireAuth } from "./components/client/RequireAuth.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";

import { AdminProvider } from "./context/AdminContext.tsx";

import { RequireAdmin } from "./components/RequireAdmin.tsx";

// import Quiz from './components/client/Quiz.tsx';
import i18n from "./i18n/i18.ts";
// import AdminCategory from "./components/Admin/AdminCategoryManager.tsx";
import AdminCreateUser from "./components/Admin/AdminCreateUser.tsx";
import AdminCategoryManager from "./components/Admin/AdminCategoryManager.tsx";
import UserProfile from "./components/UserProfile.tsx";
import AdminTrackCertificate from "./components/Admin/AdminTrackCertificate.tsx";
import NotFound from "./components/PageNotFound.tsx";
import TestCertificate from "./pages/TestCertificate.tsx";
import AdminError from "./components/Admin/AdminError.tsx";
import ClientError from "./components/client/ClientError.tsx";
import AdminCreateAdmin from "./components/Admin/AdminCreateAdmin.tsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* Public / Login */}
      <Route path="/" element={<LoginClient />} />
      <Route path="/adminlogin" element={<LoginAdmin />} />

      {/* Admin-only routes */}
      <Route
        path="/admin"
        element={
          <AdminProvider>
            <RequireAdmin>
              <AdminLayout />
            </RequireAdmin>
          </AdminProvider>
        }
        errorElement={<AdminError />}
      >
        {/* Admin Routes */}
        {/* <Route index element={<AdminHome />} /> */}
        <Route path="/admin/home" element={<AdminHome />} />
        <Route path="/admin/category" element={<AdminCategoryManager />} />
        <Route path="/admin/add-user" element={<AdminCreateUser />} />
        <Route path="/admin/add-admin" element={<AdminCreateAdmin />} />
        <Route path="/admin/profile" element={<AdminProfile />} />
        <Route path="/admin/all-courses" element={<Courses />} />
        <Route path="/admin/certificates" element={<Certificates />} />
        <Route
          path="/admin/track-certificate"
          element={<AdminTrackCertificate />}
        />
        <Route path="/admin/tests" element={<AllTests />} />
        <Route path="/admin/users" element={<UserManagement />} />
        <Route path="/admin/users/:id" element={<UserProfile />} />
        <Route path="/admin/edit-course/:courseId" element={<EditCourse />} />
        <Route
          path="/admin/edit-course/:courseId/create-test"
          element={<CreateTest />}
        />
        <Route
          path="/admin/edit-course/:courseId/edit-test/:testId"
          element={<EditTest />}
        />
        {/* This is Test Route for Testig Certificate gen  */}
        <Route path="/admin/test-cert" element={<TestCertificate />} />

        {/*  */}

        {/* <Route path="users" element={<UserList />} /> */}
      </Route>

      {/* Client routes */}
      <Route 
      element={
        <AuthProvider>
        <RequireAuth />
        </AuthProvider>
        }
        errorElement={<ClientError />}
        >
        <Route path="/client" element={<ClientLayout />}>
          {/* /client */}
          <Route index element={<ClientHome />} />
          <Route path="certificates" element={<ClientCertificates />} />
          {/* /client/play/:id */}
          <Route path="play/:id" element={<CoursePlay />} />
          <Route path="profile" element={<ClientProfile />} />
          <Route
            path="certificate/generate/:courseId"
            element={<GenerateCertificatePage />}
          />
        </Route>
      </Route>
      <Route path="*" element={<NotFound />} />
    </>
  )
);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* <AuthProvider> */}
      <RouterProvider router={router} />
    {/* </AuthProvider> */}
  </StrictMode>
);
