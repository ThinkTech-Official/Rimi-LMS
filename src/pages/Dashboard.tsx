// import React, { useEffect, useState } from "react";
// import {
//   HomeIcon,
//   BookOpenIcon,
//   CheckBadgeIcon,
//   ClipboardDocumentListIcon,
//   UserGroupIcon,
//   ChevronRightIcon,
//   ChevronLeftIcon,
// } from "@heroicons/react/24/outline";
// import AdminHome from "../components/AdminHome";
// import Certificates from "../components/Certificates";
// import AllTests from "../components/AllTests";
// import { UserManagement } from "../components/UserManagement";
// import Header from "../components/Header";
// import Courses from "../components/Courses";
// import AdminProfile from "../components/AdminProfile";

// const Dashboard: React.FC = () => {
//   const [active, setActive] = useState<
//     "home" | "courses" | "certificates" | "tests" | "users"
//   >("home");
//   const [isSidebarOpen, setSidebarOpen] = useState(true);
//   const [showProfile, setShowProfile] = useState(false);

//   useEffect(() => {
//     const handleResize = () => {
//       if (window.innerWidth < 768 && isSidebarOpen) {
//         setSidebarOpen(false);
//       }
//     };

//     handleResize();
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   const menuItems = [
//     { label: "Home", icon: HomeIcon, key: "home" },
//     { label: "All Courses", icon: BookOpenIcon, key: "courses" },
//     { label: "Certificates", icon: CheckBadgeIcon, key: "certificates" },
//     { label: "All Tests", icon: ClipboardDocumentListIcon, key: "tests" },
//     { label: "Users Management", icon: UserGroupIcon, key: "users" },
//   ] as const;

//   return (
//     <div className="flex min-h-screen">
//       {/* Sidebar */}
//       <aside
//         className={`bg-[#F6F6F6] min-h-screen transition-all duration-300 ${
//           isSidebarOpen ? "w-64 z-10" : "w-12"
//         }`}
//       >
//         <div
//           className={`${
//             isSidebarOpen ? "h-16" : "h-14"
//           } flex items-center justify-between px-2`}
//         >
//           {isSidebarOpen ? (
//             <>
//               <img
//                 src="/rimilogo.png"
//                 alt="RIMI"
//                 className="h-11 w-[100px] ml-4 mt-[10px]"
//               />
//               <ChevronLeftIcon
//                 className="h-8 mr-2 text-primary cursor-pointer"
//                 onClick={() => setSidebarOpen(false)}
//               />
//             </>
//           ) : (
//             <ChevronRightIcon
//               className="h-8 w-full text-primary cursor-pointer"
//               onClick={() => setSidebarOpen(true)}
//             />
//           )}
//         </div>

//         {!isSidebarOpen && <div className="w-full h-[1px] bg-[#d0cece]"></div>}

//         <nav className="mt-6"   onClick={() => setShowProfile(false)}>
//           <ul className="py-2 space-y-2">
//             {menuItems.map((item) => {
//               const Icon = item.icon;
//               const isActive = active === item.key;
//               return (
//                 <li
//                   key={item.key}
//                   onClick={() => setActive(item.key)}
//                   className={`group relative flex items-center cursor-pointer text-[16px] 2xl:text-xl px-3 py-2 gap-2 transition-all ${
//                     isActive && !showProfile
//                       ? "bg-[#ECEDF1] text-[#2B00B7]"
//                       : "text-gray-500 hover:text-gray-700 hover:bg-[#ECEDF1]"
//                   }`}
//                 >
//                   <Icon className="h-5 w-5 2xl:h-6 2xl:w-6" />
//                   {isSidebarOpen && <span>{item.label}</span>}
//                   {!isSidebarOpen && (
//                     <span className="absolute left-full top-1/2 -translate-y-1/2 ml-1 z-50 bg-[#393939] text-white text-xs px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
//                       {item.label}
//                     </span>
//                   )}
//                 </li>
//               );
//             })}
//           </ul>
//         </nav>
//       </aside>

//       <div className="w-full">
//         <Header setShowProfile={setShowProfile} />
//         {/* Profile */}
//         {showProfile && (
//           <div className={`w-full flex-1 overflow-auto`}>
//             <AdminProfile />
//           </div>
//         )}

//         {/* Main Content */}
//         {!showProfile && (
//           <main className={`w-full flex-1 overflow-auto`}>
//             {active === "home" && <AdminHome isSidebarOpen={isSidebarOpen} />}
//             {active === "courses" && <Courses />}
//             {active === "certificates" && <Certificates />}
//             {active === "tests" && <AllTests />}
//             {active === "users" && <UserManagement />}
//           </main>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Dashboard;
