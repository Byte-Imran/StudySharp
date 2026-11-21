import {
  LuHouse,
  LuCircleHelp,
  LuLayoutDashboard,
  LuMessageCircle,
  LuNewspaper,
  LuTrendingUp,
  LuLogIn,
  LuUserPlus,
} from "react-icons/lu";

export const navLinks = [
  { id: 1, label: "Home", path: "/", icon: LuHouse, end: true },
  { id: 2, label: "Doubt", path: "/doubt", icon: LuCircleHelp },
  { id: 3, label: "Dashboard", path: "/dashboard", icon: LuLayoutDashboard },
  { id: 4, label: "Chat", path: "/chat", icon: LuMessageCircle },
  { id: 5, label: "News", path: "/news", icon: LuNewspaper },
  { id: 6, label: "Trading", path: "/trading", icon: LuTrendingUp },
  { id: 7, label: "Login", path: "/login", icon: LuLogIn },
  { id: 8, label: "Register", path: "/register", icon: LuUserPlus },
];

export const brand = {
  name: "StudySharp",
  path: "/",
};
