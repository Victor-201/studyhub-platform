import React, { useState, useEffect, useCallback } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import authService from "@/services/authService";
import apiClient from "@/api/apiClient";

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

// ===== JWT Decode =====
const decodeJWT = (token) => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (err) {
    console.error("Decode JWT error:", err);
    return null;
  }
};

const extractTokens = (data) => ({
  access: data.access_token || data.accessToken,
  refresh: data.refresh_token || data.refreshToken,
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const [accessToken, setAccessToken] = useState(
    localStorage.getItem(ACCESS_TOKEN_KEY)
  );
  const [refreshToken, setRefreshToken] = useState(
    localStorage.getItem(REFRESH_TOKEN_KEY)
  );

  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // ===== Save tokens =====
  const persistTokens = (access, refresh) => {
    if (access) {
      localStorage.setItem(ACCESS_TOKEN_KEY, access);
      setAccessToken(access);
    }

    if (refresh) {
      localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
      setRefreshToken(refresh);
    }

    if (!access && !refresh) {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      setAccessToken(null);
      setRefreshToken(null);
    }
  };

  const normalizeRole = (role) => (Array.isArray(role) ? role[0] : role);

  // ===== Refresh tokens =====
  const refreshTokens = useCallback(async () => {
    if (!refreshToken || isRefreshing) return null;

    setIsRefreshing(true);
    try {
      const res = await authService.refreshToken({
        refresh_token: refreshToken,
      });

      const data = res?.data ?? res;
      persistTokens(data.access_token, data.refresh_token);

      const decoded = decodeJWT(data.access_token);
      if (decoded) {
        setUser({
          id: decoded.id,
          role: normalizeRole(decoded.role),
          primary_email: decoded.primary_email,
          user_name: decoded.name,
        });
      }

      return data;
    } catch (err) {
      persistTokens(null, null);
      setUser(null);
      return null;
    } finally {
      setIsRefreshing(false);
    }
  }, [refreshToken, isRefreshing]);

  // ===== LOGIN =====
  const login = async (payload) => {
    try {
      const res = await authService.login(payload);
      const data = res?.data ?? res;

      persistTokens(data.access_token, data.refresh_token);
      setUser({
        ...data.user,
        role: normalizeRole(data.user.role),
      });

      return data;
    } catch (err) {
      throw err;
    }
  };

  // ===== OAUTH LOGIN =====
  const oauthLogin = async (payload) => {
    try {
      const res = await authService.oauthLogin(payload);
      const data = res?.data ?? res;

      const { access, refresh } = extractTokens(data);
      persistTokens(access, refresh);

      setUser({
        ...data.user,
        role: normalizeRole(data.user.role),
      });

      return data;
    } catch (err) {
      throw err;
    }
  };

  // ===== REGISTER (FIX CHÍNH) =====
  const register = async (payload) => {
    try {
      const res = await authService.register(payload);
      return res?.data ?? res;
    } catch (err) {
      throw err;
    }
  };

  const logout = async () => {
    try {
      const refresh_token = localStorage.getItem("refresh_token");
      if (refresh_token) {
        await authService.logout(refresh_token);
      }
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      persistTokens(null, null);
      setUser(null);
      localStorage.removeItem("refresh_token");
    }
  };

  // ===== Auto load user =====
  useEffect(() => {
    if (accessToken) {
      const decoded = decodeJWT(accessToken);
      if (decoded) {
        setUser({
          id: decoded.id,
          role: normalizeRole(decoded.role),
          primary_email: decoded.primary_email,
          user_name: decoded.name,
        });
      }
    }
    setLoading(false);
  }, []);

  // ===== Axios Interceptors =====
  useEffect(() => {
    const req = apiClient.interceptors.request.use((config) => {
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    });

    const res = apiClient.interceptors.response.use(
      (response) => response,
      async (error) => {
        const original = error.config;

        if (error.response?.status === 401 && !original._retry) {
          original._retry = true;
          const rt = await refreshTokens();

          if (rt?.access_token) {
            original.headers.Authorization = `Bearer ${rt.access_token}`;
            return apiClient(original);
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      apiClient.interceptors.request.eject(req);
      apiClient.interceptors.response.eject(res);
    };
  }, [accessToken, refreshTokens]);

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        refreshToken,
        loading,
        login,
        oauthLogin,
        register,
        logout,
        refreshTokens,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
