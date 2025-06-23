import { useState } from 'react'
import Sidebar, { type View } from "./Sidebar";
import { Outlet } from 'react-router-dom';
 
const ClientLayout: React.FC = () => {
 
    const [active, setActive] = useState<View>("home");
  return (
    <>
   
 
     <div className="flex flex-col min-h-screen">
    <Sidebar active={active} setActive={setActive} />
    <main className="flex-1 p-4">
      <Outlet />
    </main>
  </div>
    </>
  )
}
 
export default ClientLayout