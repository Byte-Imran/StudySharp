import { useEffect, useRef } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import BottomNavigation from "./components/BottomNavigation.jsx";
import Footer from "./components/Footer.jsx";
import Navbar from "./components/Navbar.jsx";
import { setUser } from "./redux/slices/authSlice.js";
import axiosInstance from "./utils/axiosInstance.js";

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const oauthHandled = useRef(false);
  const { pathname } = location;
  const isAuthPage = ["/login", "/register"].includes(pathname);
  const themeMode = useSelector((state) => state.theme.mode);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const oauthError = searchParams.get("error");

    if (oauthError === "oauth_failed" && !oauthHandled.current) {
      oauthHandled.current = true;
      toast.error("OAuth sign-in failed. Please try again.");
      searchParams.delete("error");
      navigate(
        {
          pathname,
          search: searchParams.toString(),
          hash: location.hash,
        },
        { replace: true },
      );
      return;
    }

    if (
      searchParams.get("oauth") !== "success" ||
      oauthHandled.current
    ) {
      return;
    }

    oauthHandled.current = true;
    axiosInstance
      .get("/api/v1/auth/me")
      .then((response) => {
        const user = response.data?.data?.user;
        if (!user) {
          throw new Error("The current user response did not include a user.");
        }

        dispatch(setUser(user));
        toast.success("Signed in successfully.");
      })
      .catch((error) => {
        toast.error(
          error.response?.data?.message ||
            "Unable to complete Google sign-in. Please try again.",
        );
      })
      .finally(() => {
        searchParams.delete("oauth");
        navigate(
          {
            pathname,
            search: searchParams.toString(),
            hash: location.hash,
          },
          { replace: true },
        );
      });
  }, [dispatch, location.hash, location.search, navigate, pathname]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", themeMode === "dark");
    document.documentElement.style.colorScheme = themeMode;
  }, [themeMode]);

  return (
    <div className="flex min-h-screen flex-col bg-[#fcf9f8] text-[#1b1c1c] dark:bg-[#1b1c1c] dark:text-[#fcf9f8]">
      {!isAuthPage && <Navbar />}
      <main
        className={`flex flex-1 flex-col ${
          isAuthPage ? "" : "pb-20 lg:pb-0"
        }`}
      >
        <Outlet />
      </main>
      {!isAuthPage && <Footer />}
      {!isAuthPage && <BottomNavigation />}
      <Toaster position="top-right" />
    </div>
  );
};

export default App;
