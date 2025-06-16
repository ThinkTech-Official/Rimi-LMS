import { useState } from 'react'
import { Outlet } from "react-router-dom"
import AdminDashboard from './pages/Dashboard'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    {/* <LoginAdmin /> */}
    {/* <AdminDashboard /> */}
    <main>
      <Outlet />
    </main>
    </>
  )
}

export default App
