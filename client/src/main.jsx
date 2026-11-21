import React from "react";
import ReactDOM from "react-dom/client";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import { persistor, store } from "./redux/store.js";
import router from "./router.jsx";
import PageLoader from "./components/PageLoader.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <RouterProvider router={router} fallbackElement={<PageLoader />} />
      </PersistGate>
    </Provider>
  </React.StrictMode>,
);
