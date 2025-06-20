import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import LoginAdmin from "./pages/LoginAdmin.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import ClientDashboard from "./components/client/ClientDashboard.tsx";
import CoursePlay from "./components/client/CoursePlay.tsx";
import Certificate from "./components/Certificate.tsx";
// import Quiz from './components/client/Quiz.tsx';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="/" element={<LoginAdmin />} />
      <Route path="/admindashboard" element={<Dashboard />} />
      <Route path="/client" element={<ClientDashboard />} />
      <Route path="/play/:id" element={<CoursePlay />} />
      <Route path="/certificates" element={<Certificate />} />
      {/* <Route path='/quiz' element={<Quiz />} /> */}
    </Route>
  )
);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
