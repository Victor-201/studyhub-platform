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

    // Nếu logout => xóa
    if (!access && !refresh) {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      setAccessToken(null);
      setRefreshToken(null);
    }
  };

  // ===== Convert role array -> string =====
  const normalizeRole = (role) => {
    if (Array.isArray(role)) return role[0];
    return role;
  };

  // ===== Refresh tokens =====
  const refreshTokens = useCallback(async () => {
    if (!refreshToken || isRefreshing) return null;

    setIsRefreshing(true);

    try {
      const res = await authService.refreshToken({
        refresh_token: refreshToken,
      });

      const data = res?.data ?? res;

      const newAccess = data?.access_token;
      const newRefresh = data?.refresh_token;

      persistTokens(newAccess, newRefresh);

      const decoded = decodeJWT(newAccess);
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
    const res = await authService.login(payload);
    const data = res?.data ?? res;

    persistTokens(data.access_token, data.refresh_token);

    setUser({
      ...data.user,
      role: normalizeRole(data.user.role),
    });

    return data;
  };

  const register = async (payload) => {
    const res = await authService.register(payload);
    return res?.data ?? res;
  };

  // ===== LOGOUT =====
  const logout = async () => {
    try {
      await authService.logout().catch(() => {});
    } finally {
      persistTokens(null, null);
      setUser(null);
    }
  };

  // ===== Auto load user when reload =====
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
