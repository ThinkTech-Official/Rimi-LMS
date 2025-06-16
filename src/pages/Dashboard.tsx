import React, { useState } from "react";
import {
  HomeIcon,
  BookOpenIcon,
  CheckBadgeIcon,
  ClipboardDocumentListIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import AdminHome from "../components/AdminHome";
import AllCourses from "../components/AllCourses";
import Certificates from "../components/Certificates";
import AllTests from "../components/AllTests";
import { UserManagement } from "../components/UserManagement";

const Dashboard: React.FC = () => {
  const [active, setActive] = useState<
    "home" | "courses" | "certificates" | "tests" | "users"
  >("home");

  const menuItems = [
    { label: "Home", icon: HomeIcon, key: "home" },
    { label: "All Courses", icon: BookOpenIcon, key: "courses" },
    { label: "Certificates", icon: CheckBadgeIcon, key: "certificates" },
    { label: "All Tests", icon: ClipboardDocumentListIcon, key: "tests" },
    { label: "Users Management", icon: UserGroupIcon, key: "users" },
  ] as const;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r">
        <div className="h-16 flex items-center justify-center border-b">
          <img src="/rimilogo.png" alt="RIMI" className="h-10 w-auto" />
        </div>
        <nav className="mt-6">
          <ul>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = active === item.key;
              return (
                <li
                  key={item.key}
                  onClick={() => setActive(item.key)}
                  className={`px-4 py-2 flex items-center gap-2 cursor-pointer ${
                    isActive
                      ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-auto">
        {active === "home" && <AdminHome />}
        {active === "courses" && <AllCourses />}
        {active === "certificates" && <Certificates />}
        {active === "tests" && <AllTests />}
        {active === "users" && <UserManagement />}
      </main>
    </div>
  );
};

export default Dashboard;
