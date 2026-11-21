import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    isAuthenticated: false,
    loading: false,
    hasLoggedOut: false,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = Boolean(action.payload);
      state.loading = false;
      state.hasLoggedOut = false;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.hasLoggedOut = true;
    },
  },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;
