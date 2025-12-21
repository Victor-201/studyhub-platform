// src/store/index.js
import { configureStore, createSlice } from "@reduxjs/toolkit";

const initialAuth = {
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialAuth,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
    },
    clearUser(state) {
      state.user = null;
    },
  },
});

export const { setUser, clearUser } = authSlice.actions;

const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
  },
});

export default store;
