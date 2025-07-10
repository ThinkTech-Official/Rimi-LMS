import { Outlet } from "react-router-dom";

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
