import { configureStore } from "@reduxjs/toolkit";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
  persistStore,
} from "redux-persist";
import storage from "redux-persist/es/storage";
import authReducer from "./slices/authSlice.js";
import themeReducer from "./slices/themeSlice.js";

const persistedAuthReducer = persistReducer(
  {
    key: "auth",
    storage,
    whitelist: ["user", "isAuthenticated", "hasLoggedOut"],
  },
  authReducer,
);
const persistedThemeReducer = persistReducer(
  {
    key: "theme",
    storage,
    whitelist: ["mode"],
  },
  themeReducer,
);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    theme: persistedThemeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
