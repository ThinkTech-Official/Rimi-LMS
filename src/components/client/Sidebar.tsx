
import { type FC, type Dispatch, type SetStateAction } from "react";
import { HomeIcon, CheckBadgeIcon } from "@heroicons/react/24/outline";

export type View = "home" | "certificates" | "play";

interface SidebarProps {
  active: View;
  setActive: Dispatch<SetStateAction<View>>;
}

const Sidebar: FC<SidebarProps> = ({ active, setActive }) => (
  <aside className="w-72 bg-neutral-100 p-6">
    <img src="/rimilogo.png" alt="RIMI logo" className="w-24 h-11 mb-8 object-contain" />
    <nav className="space-y-2">
      <button
        onClick={() => setActive("home")}
        className={`flex items-center space-x-2 w-full text-left px-4 py-2 rounded ${
          active === "home"
            ? "bg-indigo-600 text-white"
            : "text-gray-500 hover:text-gray-700 hover:bg-gray-200"
        }`}
      >
        <HomeIcon className="h-5 w-5" />
        <span>Home</span>
      </button>

      <button
        onClick={() => setActive("certificates")}
        className={`flex items-center space-x-2 w-full text-left px-4 py-2 rounded ${
          active === "certificates"
            ? "bg-indigo-600 text-white"
            : "text-gray-500 hover:text-gray-700 hover:bg-gray-200"
        }`}
      >
        <CheckBadgeIcon className="h-5 w-5" />
        <span>Certificates</span>
      </button>
    </nav>
  </aside>
);

export default Sidebar;
