import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  LuBell,
  LuBookOpen,
  LuFlame,
  LuLogOut,
  LuMoon,
  LuSearch,
  LuSun,
  LuUserRound,
  LuChevronDown,
} from "react-icons/lu";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { brand, navLinks } from "../data/navLinks.js";
import { logout as clearAuth } from "../redux/slices/authSlice.js";
import { toggleTheme } from "../redux/slices/themeSlice.js";
import axiosInstance from "../utils/axiosInstance.js";
import LazyImage from "./LazyImage.jsx";

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
  const profileRef = useRef(null);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const nameParts = (user?.name || "").trim().split(/\s+/).filter(Boolean);
  const userInitials =
    nameParts.length > 1
      ? `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase()
      : (nameParts[0] || "US").slice(0, 2).toUpperCase();

  useEffect(() => {
    const closeMenu = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileMenuOpen(false);
      }
    };
    const closeWithEscape = (event) => {
      if (event.key === "Escape") setProfileMenuOpen(false);
    };

    document.addEventListener("mousedown", closeMenu);
    document.addEventListener("keydown", closeWithEscape);
    return () => {
      document.removeEventListener("mousedown", closeMenu);
      document.removeEventListener("keydown", closeWithEscape);
    };
  }, []);

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
            <div className="relative" ref={profileRef}>
              <button
                type="button"
                onClick={() => setProfileMenuOpen((open) => !open)}
                aria-label={`Profile: ${user?.name || "Profile"}`}
                title={user?.name || "Profile"}
                aria-haspopup="menu"
                aria-expanded={profileMenuOpen}
                className="flex h-10 items-center gap-1.5 rounded-full border border-[#e2bebc] bg-[#ffdad8] p-1 pr-2 text-[#b52330] transition hover:bg-[#f4dddd] dark:border-[#5a403f] dark:bg-[#3a2526] dark:text-[#ffb3b0] dark:hover:bg-[#493031]"
              >
                {user?.img ? (
                  <LazyImage
                    src={user.img}
                    alt={user.name || "Profile"}
                    width={36}
                    height={36}
                    className="h-8 w-8 rounded-full object-cover"
                    threshold={50}
                  />
                ) : (
                  <span className="flex h-8 w-8 items-center justify-center text-xs font-bold">
                    {userInitials}
                  </span>
                )}
                <LuChevronDown
                  className={`text-sm transition ${profileMenuOpen ? "rotate-180" : ""}`}
                  aria-hidden="true"
                />
              </button>
              {profileMenuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 top-12 w-60 overflow-hidden rounded-2xl border border-[#ebebeb] bg-white p-2 shadow-[0_12px_32px_rgba(34,34,34,0.14)] dark:border-[#393333] dark:bg-[#242323]"
                >
                  <div className="px-3 py-2">
                    <p className="truncate text-sm font-bold text-[#1b1c1c] dark:text-[#fcf9f8]">
                      {user?.name || "Profile"}
                    </p>
                    <p className="truncate text-xs text-[#717171] dark:text-[#c7bdbb]">
                      {user?.email || ""}
                    </p>
                  </div>
                  <div className="my-1 h-px bg-[#ebebeb] dark:bg-[#393333]" />
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setProfileMenuOpen(false);
                      navigate("/profile");
                    }}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-[#1b1c1c] transition hover:bg-[#f6f3f2] dark:text-[#f3f0ef] dark:hover:bg-[#303030]"
                  >
                    <LuUserRound aria-hidden="true" />
                    View profile
                  </button>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-[#b52330] transition hover:bg-[#ffdad8] dark:text-[#ffb3b0] dark:hover:bg-[#3a2526]"
                  >
                    <LuLogOut aria-hidden="true" />
                    Log out
                  </button>
                </div>
              )}
            </div>
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
