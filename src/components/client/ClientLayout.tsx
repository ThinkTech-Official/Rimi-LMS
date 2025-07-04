import { useEffect, useState } from "react";
import { type View } from "./Sidebar";
import { Outlet, useNavigate } from "react-router-dom";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  HomeIcon,
} from "@heroicons/react/24/outline";
import ClientHeader from "./ClientHeader";
import { PiCertificateLight } from "react-icons/pi";
import { useTranslation } from "react-i18next";

const menuItems = [
  { label: "home", icon: HomeIcon, key: "home", url: "/client" },
  {
    label: "certificates",
    icon: PiCertificateLight,
    key: "certificates",
    url: "/client/certificates",
  },
];

const ClientLayout: React.FC = () => {
  const [active, setActive] = useState<View>("home");
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const {t} = useTranslation()

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

  const handleLinkClick = (key: any) => {
    setActive(key);
    navigate(menuItems.find((item) => item.key === key)?.url || "/");
  };
  return (
    <>
      <div className="flex">
        {/* Sidebar */}
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

          {!isSidebarOpen && (
            <div className="w-full h-[1px] bg-[#d0cece]"></div>
          )}

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
                    {isSidebarOpen && <span className="capitalize">{t(item.label)}</span>}
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
        <div
          className={`${
            isSidebarOpen ? "w-[calc(100vw-270px)]" : "w-[calc(100vw-50px)]"
          }`}
        >
          <ClientHeader />
          <main>
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
};

export default ClientLayout;
