import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Home from "../pages/Home.jsx";

const HomeRoute = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const hasLoggedOut = useSelector((state) => state.auth.hasLoggedOut);

  return !isAuthenticated && hasLoggedOut ? (
    <Navigate to="/register" replace />
  ) : (
    <Home />
  );
};

export default HomeRoute;
