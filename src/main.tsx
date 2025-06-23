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
// import Dashboard from "./pages/Dashboard.tsx";
import ClientDashboard from "./components/client/ClientDashboard.tsx";
import CoursePlay from "./components/client/CoursePlay.tsx";
import Certificate from "./components/Certificate.tsx";
import { AdminLayout } from "./components/AdminLayout.tsx";
import ClientLayout from "./components/client/ClientLayout.tsx";
import AdminHome from "./components/AdminHome.tsx";
import Courses from "./components/Courses.tsx";
// import Quiz from './components/client/Quiz.tsx';
 
const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* Public / Login */}
      <Route path="/" element={<LoginAdmin />} />
 
      {/* Admin-only routes */}
      <Route path="/admin" element={<AdminLayout />}>
        {/* /admindashboard */}
        <Route index element={<AdminHome />} />
        <Route path="/admin/all-courses" element={<Courses />} />

       
        {/* <Route path="users" element={<UserList />} /> */}
      </Route>
 
      {/* Client routes */}
      <Route path="/client" element={<ClientLayout />}>
        {/* /client */}
        <Route index element={<ClientDashboard />} />
        {/* /client/play/:id */}
        <Route path="play/:id" element={<CoursePlay />} />
        {/* /client/certificates */}
        <Route path="certificates" element={<Certificate />} />
       
      </Route>
    </>
  )
);
 
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);