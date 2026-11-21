import { NavLink } from "react-router-dom";
import { navLinks } from "../data/navLinks.js";

const primaryLinks = navLinks.slice(0, 5);

const BottomNavigation = () => (
  <nav
    className="fixed inset-x-0 bottom-0 z-40 border-t border-[#ebebeb] bg-[#fcf9f8]/90 pb-[env(safe-area-inset-bottom)] shadow-[0_-2px_12px_rgba(34,34,34,0.04)] backdrop-blur-xl dark:border-[#393333] dark:bg-[#1b1c1c]/95 dark:shadow-black/20 lg:hidden"
    aria-label="Mobile navigation"
  >
    <div className="mx-auto flex h-16 max-w-xl items-center justify-around px-1">
      {primaryLinks.map(({ id, label, path, icon: Icon, end }) => (
        <NavLink
          key={id}
          to={path}
          end={end}
          className={({ isActive }) =>
            `flex h-14 min-w-0 flex-1 flex-col items-center justify-center gap-1 transition ${
              isActive
                ? "font-semibold text-[#b52330] dark:text-[#ff5a5f]"
                : "text-[#717171] hover:text-[#1b1c1c] dark:text-[#aaa09f] dark:hover:text-white"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <Icon
                className={`text-xl ${isActive ? "text-[#b52330] dark:text-[#ff5a5f]" : ""}`}
                aria-hidden="true"
              />
              <span className="max-w-full truncate text-[11px] leading-none">
                {label}
              </span>
            </>
          )}
        </NavLink>
      ))}
    </div>
  </nav>
);

export default BottomNavigation;
