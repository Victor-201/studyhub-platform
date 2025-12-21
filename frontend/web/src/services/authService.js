// src/services/authService.js
import apiClient from "@/api/apiClient";

const authService = {
  // ===== Auth =====
  register(payload) {
    return apiClient.post("/auth/register", payload);
  },

  verifyEmail(token) {
    return apiClient.get(`/auth/verify-email?token=${token}`);
  },

  login(payload) {
    return apiClient.post("/auth/login", payload);
  },

  refreshToken(refresh_token) {
    return apiClient.post("/auth/refresh", { refresh_token });
  },

  forgotPassword(email) {
    return apiClient.post("/auth/forgot-password", { email });
  },

  resetPassword(token, new_password) {
    return apiClient.post("/auth/reset-password", {
      token,
      new_password,
    });
  },

  me() {
    return apiClient.get("/auth/me");
  },

  oauthLogin(provider_name, provider_user) {
    return apiClient.post("/oauth/login", {
      provider_name,
      provider_user,
    });
  },

  // ===== User API =====
  getUserProfile() {
    return apiClient.get("/user/profile");
  },

  updateUserProfile(data) {
    return apiClient.patch("/user/profile", data);
  },

  listUserEmails() {
    return apiClient.get("/user/emails");
  },

  addUserEmail(email) {
    return apiClient.post("/user/emails", { email });
  },

  setPrimaryUserEmail(emailId) {
    return apiClient.patch("/user/emails/primary", { emailId });
  },

  // ===== Admin API =====
  countAccounts() {
    return apiClient.get("/auth/admin/count/accounts");
  },

  listUsers() {
    return apiClient.get("/admin/users");
  },

  lockUser(userId) {
    return apiClient.post(`/admin/users/${userId}/lock`);
  },

  unlockUser(userId) {
    return apiClient.post(`/admin/users/${userId}/unlock`);
  },

  blockUser(userId, reason) {
    return apiClient.post(`/admin/users/${userId}/block`, { reason });
  },

  softDeleteUser(userId, reason) {
    return apiClient.delete(`/admin/users/${userId}`, { data: { reason } });
  },

  restoreUser(userId) {
    return apiClient.post(`/admin/users/${userId}/restore`);
  },

  updateUserRole(userId, role_name) {
    return apiClient.patch(`/admin/users/${userId}/role`, { role_name });
  },

  getAuditLogs() {
    return apiClient.get("/admin/audit/logs");
  },

  getAuditLogsByActor(actorUserId) {
    return apiClient.get(`/admin/audit/logs/actor/${actorUserId}`);
  },

  getAuditLogsByTarget(targetUserId) {
    return apiClient.get(`/admin/audit/logs/target/${targetUserId}`);
  },
};

export default authService;
