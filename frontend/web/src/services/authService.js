import apiClient from "@/api/apiClient";

const BASE_URL = "/auth";

const authService = {
  // ===== Auth =====
  register(payload) {
    return apiClient.post(`${BASE_URL}/register`, payload);
  },

  verifyEmail(token) {
    return apiClient.post(`${BASE_URL}/verify-email?token=${token}`);
  },

  login(payload) {
    return apiClient.post(`${BASE_URL}/login`, payload);
  },

  oauthLogin: (data) => apiClient.post(`${BASE_URL}/oauth/login`, data),

  refreshToken(refresh_token) {
    return apiClient.post(`${BASE_URL}/refresh`, { refresh_token });
  },

  forgotPassword(email) {
    return apiClient.post(`${BASE_URL}/forgot-password`, { email });
  },

  resetPassword(token, new_password) {
    return apiClient.post(`${BASE_URL}/reset-password`, {
      token,
      new_password,
    });
  },

  me() {
    return apiClient.get(`${BASE_URL}/me`);
  },

  oauthLogin(provider_name, provider_user) {
    return apiClient.post(`${BASE_URL}/oauth/login`, {
      provider_name,
      provider_user,
    });
  },

  logout(refresh_token) {
    return apiClient.post(`${BASE_URL}/logout`, { refresh_token });
  },

  // ===== User API =====
  getUserProfile() {
    return apiClient.get(`${BASE_URL}/user/profile`);
  },

  updateUserProfile(data) {
    return apiClient.patch(`${BASE_URL}/user/profile`, data);
  },

  listUserEmails() {
    return apiClient.get(`${BASE_URL}/user/emails`);
  },

  addUserEmail(email) {
    return apiClient.post(`${BASE_URL}/user/emails`, { email });
  },

  setPrimaryUserEmail(emailId) {
    return apiClient.patch(`${BASE_URL}/user/emails/primary`, { emailId });
  },

  // ===== Admin API =====
  countAccounts() {
    return apiClient.get(`${BASE_URL}/admin/count/accounts`);
  },

  listUsers() {
    return apiClient.get(`${BASE_URL}/admin/users`);
  },

  lockUser(userId) {
    return apiClient.post(`${BASE_URL}/admin/users/${userId}/lock`);
  },

  unlockUser(userId) {
    return apiClient.post(`${BASE_URL}/admin/users/${userId}/unlock`);
  },

  isUserBlocked(userId) {
    return apiClient.get(`${BASE_URL}/admin/users/${userId}/is_blocked`);
  },

  permanentBlockUser(userId, reason) {
    return apiClient.post(`${BASE_URL}/admin/users/${userId}/block`, {
      reason,
    });
  },

  temporaryBlockUser(userId, reason, duration) {
    return apiClient.post(`${BASE_URL}/admin/users/${userId}/block`, {
      reason,
      duration,
    });
  },

  unblockUser(userId) {
    return apiClient.post(`${BASE_URL}/admin/users/${userId}/unblock`);
  },

  softDeleteUser(userId, reason) {
    return apiClient.delete(`${BASE_URL}/admin/users/${userId}`, {
      data: { reason },
    });
  },

  restoreUser(userId) {
    return apiClient.post(`${BASE_URL}/admin/users/${userId}/restore`);
  },

  updateUserRole(userId, role_name) {
    return apiClient.patch(`${BASE_URL}/admin/users/${userId}/role`, {
      role_name,
    });
  },

  getAuditLogs() {
    return apiClient.get(`${BASE_URL}/admin/audit/logs`);
  },

  getAuditLogsByActor(actorUserId) {
    return apiClient.get(`${BASE_URL}/admin/audit/logs/actor/${actorUserId}`);
  },

  getAuditLogsByTarget(targetUserId) {
    return apiClient.get(`${BASE_URL}/admin/audit/logs/target/${targetUserId}`);
  },
};

export default authService;
