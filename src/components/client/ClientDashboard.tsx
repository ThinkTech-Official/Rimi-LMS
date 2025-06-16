
import React, { type FC, useState } from "react";
import Sidebar, { type View } from "./Sidebar";
import ClientHome from "./ClientHome";
import ClientCertificates from "./ClientCertificates";
import CoursePlay from "./CoursePlay";

const ClientDashboard: FC = () => {
  
  const [active, setActive] = useState<View>("home");

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar active={active} setActive={setActive} />

      <main className="flex-1 p-6 overflow-auto">
        {active === "home" && <ClientHome />}
        {active === "certificates" && <ClientCertificates />}
        {active === "play" && <CoursePlay />}
      </main>
    </div>
  );
};

export default ClientDashboard;
