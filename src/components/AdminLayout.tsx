import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import {
  HomeIcon,
  BookOpenIcon,
  CheckBadgeIcon,
  ClipboardDocumentListIcon,
  UserGroupIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
} from "@heroicons/react/24/outline";
import Header from "./Header";

export const AdminLayout: React.FC = () => {
  const [active, setActive] = useState<
    "home" | "courses" | "certificates" | "tests" | "users"
  >("home");
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768 && isSidebarOpen) {
        setSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const menuItems = [
    { label: "Home", icon: HomeIcon, key: "home", url: "/admin" },
    {
      label: "All Courses",
      icon: BookOpenIcon,
      key: "courses",
      url: "/admin/all-courses",
    },
    {
      label: "Certificates",
      icon: CheckBadgeIcon,
      key: "certificates",
      url: "/admin/certificates",
    },
    {
      label: "All Tests",
      icon: ClipboardDocumentListIcon,
      key: "tests",
      url: "/admin/tests",
    },
    {
      label: "Users Management",
      icon: UserGroupIcon,
      key: "users",
      url: "/admin/users",
    },
  ] as const;

  const handleLinkClick = (key: any) => {
    setActive(key);
    navigate(menuItems.find((item) => item.key === key)?.url || "/");
  };

  return (
    <div className="flex">
      {/* Sidebar  */}
      <aside
        className={`bg-[#F6F6F6] min-h-screen transition-all duration-300 ${
          isSidebarOpen ? "w-64 z-10" : "w-12"
        }`}
      >
        <div
          className={`${
            isSidebarOpen ? "h-16" : "h-14"
          } flex items-center justify-between px-2`}
        >
          {isSidebarOpen ? (
            <>
              <img
                src="/rimilogo.png"
                alt="RIMI"
                className="h-11 w-[100px] ml-4 mt-[10px]"
              />
              <ChevronLeftIcon
                className="h-8 mr-2 text-primary cursor-pointer"
                onClick={() => setSidebarOpen(false)}
              />
            </>
          ) : (
            <ChevronRightIcon
              className="h-8 w-full text-primary cursor-pointer"
              onClick={() => setSidebarOpen(true)}
            />
          )}
        </div>

        {!isSidebarOpen && <div className="w-full h-[1px] bg-[#d0cece]"></div>}

        <nav className="mt-6">
          <ul className="py-2 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = active === item.key;
              return (
                <li
                  key={item.key}
                  onClick={() => handleLinkClick(item.key)}
                  className={`group relative flex items-center cursor-pointer text-[16px] 2xl:text-xl px-3 py-2 gap-2 transition-all ${
                    isActive
                      ? "bg-[#ECEDF1] text-[#2B00B7]"
                      : "text-gray-500 hover:text-gray-700 hover:bg-[#ECEDF1]"
                  }`}
                >
                  <Icon className="h-5 w-5 2xl:h-6 2xl:w-6" />
                  {isSidebarOpen && <span>{item.label}</span>}
                  {!isSidebarOpen && (
                    <span className="absolute left-full top-1/2 -translate-y-1/2 ml-1 z-50 bg-[#393939] text-white text-xs px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                      {item.label}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
      <div className={`${
            isSidebarOpen ? "w-[calc(100vw-300px)]" : "w-[calc(100vw-65px)]"
          }`}>
        <Header />
        <main
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};
