import { createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    lazy: async () => ({
      Component: (await import("./App.jsx")).default,
    }),
    children: [
      {
        index: true,
        lazy: async () => ({
          Component: (await import("./components/HomeRoute.jsx")).default,
        }),
      },
      {
        path: "login",
        lazy: async () => ({
          Component: (await import("./pages/Login.jsx")).default,
        }),
      },
      {
        path: "register",
        lazy: async () => ({
          Component: (await import("./pages/Register.jsx")).default,
        }),
      },
      {
        lazy: async () => ({
          Component: (await import("./components/ProtectedRoute.jsx")).default,
        }),
        children: [
          {
            path: "*",
            lazy: async () => ({
              Component: (await import("./pages/NotFound.jsx")).default,
            }),
          },
        ],
      },
    ],
  },
]);

export default router;