import { Outlet } from "react-router-dom";
import Footer from "./components/Footer";

function App() {
  return (
    <>
      {/* <LoginAdmin /> */}
      {/* <AdminDashboard /> */}
      <main>
        <Outlet />
      </main>
    </>
  );
}

export default App;
