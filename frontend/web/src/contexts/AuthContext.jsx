// src/contexts/AuthContext.jsx
import { createContext } from "react";

export const AuthContext = createContext({
  user: null,
  accessToken: null,
  refreshToken: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
  register: async () => {},
  verify: async () => {},
  refreshTokens: async () => {},
  getMe: async () => {},
  setUser: () => {},
});
