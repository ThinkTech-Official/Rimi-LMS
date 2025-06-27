import { Outlet } from "react-router-dom";
import useNotification from "./hooks/useNotification";

function App() {
  const {NotificationComponent} = useNotification("top-right");
  return (
    <>
      {/* <LoginAdmin /> */}
      {/* <AdminDashboard /> */}
      <main>
        <Outlet />
        {NotificationComponent}
      </main>
    </>
  );
}

export default App;
