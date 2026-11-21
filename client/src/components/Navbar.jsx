import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  LuBell,
  LuBookOpen,
  LuFlame,
  LuLogOut,
  LuMoon,
  LuSearch,
  LuSun,
} from "react-icons/lu";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { brand, navLinks } from "../data/navLinks.js";
import { logout as clearAuth } from "../redux/slices/authSlice.js";
import { toggleTheme } from "../redux/slices/themeSlice.js";
import axiosInstance from "../utils/axiosInstance.js";

const primaryLinks = navLinks.slice(0, 5);

const linkClass = ({ isActive }) =>
  `whitespace-nowrap rounded-full px-3 py-2 text-sm font-medium transition ${
    isActive
      ? "bg-[#ffdad8] text-[#b52330] dark:bg-[#3a2526] dark:text-[#ffb3b0]"
      : "text-[#5a403f] hover:bg-[#f6f3f2] hover:text-[#1b1c1c] dark:text-[#d3c4c3] dark:hover:bg-[#303030] dark:hover:text-white"
  }`;

const Navbar = () => {
  const user = useSelector((state) => state.auth.user);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const themeMode = useSelector((state) => state.theme.mode);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const nameParts = (user?.name || "").trim().split(/\s+/).filter(Boolean);
  const userInitials =
    nameParts.length > 1
      ? `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase()
      : (nameParts[0] || "US").slice(0, 2).toUpperCase();

  const handleLogout = async () => {
    try {
      const response = await axiosInstance.post("/api/v1/users/logout");
      dispatch(clearAuth());
      toast.success(response.data.message || "Logged out successfully.");
      navigate("/register", { replace: true });
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to log out. Please try again.",
      );
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-[#ebebeb] bg-[#fcf9f8]/90 text-[#1b1c1c] shadow-[0_1px_8px_rgba(34,34,34,0.04)] backdrop-blur-xl dark:border-[#393333] dark:bg-[#1b1c1c]/95 dark:text-[#fcf9f8] dark:shadow-black/20">
      <nav
        className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6"
        aria-label="Main navigation"
      >
        <Link
          to={brand.path}
          className="flex shrink-0 items-center gap-2 font-bold tracking-tight"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#ffdad8] text-[#b52330] dark:bg-[#3a2526] dark:text-[#ffb3b0]">
            <LuBookOpen className="text-xl" aria-hidden="true" />
          </span>
          <span className="hidden text-lg sm:inline">{brand.name}</span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {primaryLinks.map(({ id, label, path, end }) => (
            <NavLink key={id} to={path} className={linkClass} end={end}>
              {label}
            </NavLink>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          <div className="mr-1 inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1.5 text-sm font-bold text-amber-800">
            <LuFlame aria-hidden="true" />
            <span>7d</span>
          </div>
          <button
            type="button"
            aria-label={
              themeMode === "dark" ? "Switch to light mode" : "Switch to dark mode"
            }
            title={
              themeMode === "dark" ? "Switch to light mode" : "Switch to dark mode"
            }
            onClick={() => dispatch(toggleTheme())}
            className="flex h-10 w-10 items-center justify-center rounded-full text-[#5a403f] transition hover:bg-[#f0eded] hover:text-[#1b1c1c] dark:text-[#d3c4c3] dark:hover:bg-[#303030] dark:hover:text-white"
          >
            {themeMode === "dark" ? (
              <LuSun className="text-xl" aria-hidden="true" />
            ) : (
              <LuMoon className="text-xl" aria-hidden="true" />
            )}
          </button>
          <button
            type="button"
            aria-label="Search"
            className="flex h-10 w-10 items-center justify-center rounded-full text-[#5a403f] transition hover:bg-[#f0eded] hover:text-[#1b1c1c] dark:text-[#d3c4c3] dark:hover:bg-[#303030] dark:hover:text-white"
          >
            <LuSearch className="text-xl" aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="Notifications"
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-[#5a403f] transition hover:bg-[#f0eded] hover:text-[#1b1c1c] dark:text-[#d3c4c3] dark:hover:bg-[#303030] dark:hover:text-white"
          >
            <LuBell className="text-xl" aria-hidden="true" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#ff5a5f] ring-2 ring-[#fcf9f8] dark:ring-[#1b1c1c]" />
          </button>
          {isAuthenticated ? (
            <>
              <button
                type="button"
                aria-label={`Profile: ${user?.name || "Profile"}`}
                title={user?.name || "Profile"}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#ffdad8] text-xs font-bold text-[#b52330] ring-2 ring-[#e2bebc] transition hover:bg-[#f4dddd] dark:bg-[#3a2526] dark:text-[#ffb3b0] dark:ring-[#5a403f] dark:hover:bg-[#493031]"
              >
                {userInitials}
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-full border border-[#e2bebc] px-3 py-2 text-sm font-semibold text-[#5a403f] transition hover:border-[#ff5a5f] hover:bg-[#ffdad8] hover:text-[#b52330] dark:border-[#5a403f] dark:text-[#d3c4c3] dark:hover:bg-[#3a2526] dark:hover:text-[#ffb3b0]"
              >
                <LuLogOut aria-hidden="true" />
                <span>Log out</span>
              </button>
            </>
          ) : (
            <Link
              to="/register"
              className="rounded-lg bg-[#ff5a5f] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#b52330]"
            >
              Sign up
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
