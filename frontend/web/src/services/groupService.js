import apiClient from "@/api/apiClient";

const GROUPS = "/group";
const MEMBERS = "/group/members";

const groupService = {
  create(payload) {
    return apiClient.post(GROUPS, payload);
  },

  getGroup(groupId) {
    return apiClient.get(`${GROUPS}/${groupId}`);
  },

  update(groupId, payload) {
    return apiClient.patch(`${GROUPS}/${groupId}`, payload);
  },

  remove(groupId) {
    return apiClient.delete(`${GROUPS}/${groupId}`);
  },

  updateAvatar(groupId, formData) {
    return apiClient.patch(`${GROUPS}/${groupId}/avatar`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  checkMembership(groupId) {
    return apiClient.get(`${GROUPS}/${groupId}/membership`);
  },

  getJoinRequests(groupId, params = {}) {
    return apiClient.get(`${GROUPS}/${groupId}/requests`, { params });
  },

  getMyInvites(params = {}) {
    return apiClient.get(`${GROUPS}/my-invites`, { params });
  },

  join(groupId) {
    return apiClient.post(`${GROUPS}/${groupId}/join`);
  },

  cancelJoin(groupId) {
    return apiClient.delete(`${GROUPS}/${groupId}/join`);
  },

  approveJoin(requestId, groupId) {
    return apiClient.patch(`${GROUPS}/requests/${groupId}/${requestId}/approve`);
  },

  rejectJoin(requestId, groupId) {
    return apiClient.patch(`${GROUPS}/requests/${groupId}/${requestId}/reject`);
  },

  checkJoinPending(groupId) {
    return apiClient.get(`${GROUPS}/${groupId}/check-join`);
  },

  inviteMember(groupId, userId) {
    return apiClient.post(`${GROUPS}/${groupId}/invite`, { user_id: userId });
  },

  getUserGroups(userId) {
    return apiClient.get(`${GROUPS}/user/${userId}`);
  },

  getOwnedGroups() {
    return apiClient.get(`${GROUPS}/user/owned`);
  },

  findGroups(params = {}) {
    // params: { name, access, limit, offset }
    return apiClient.get(GROUPS, { params });
  },

  getGroupsNotJoined(params = {}) {
    return apiClient.get(`${GROUPS}/not-joined`, { params });
  },

  getAllGroups(params = {}) {
    return apiClient.get(`${GROUPS}/admin`, { params });
  },

  countGroups() {
    return apiClient.get(`${GROUPS}/admin/counts`);
  },

  getActivityLogs(groupId, params = {}) {
    return apiClient.get(`${GROUPS}/${groupId}/logs`, { params });
  },

  getGroupMembers(groupId, params = {}) {
    return apiClient.get(`${MEMBERS}/group/${groupId}`, { params });
  },

  leaveGroup(groupId) {
    return apiClient.delete(`${MEMBERS}/${groupId}/leave`);
  },

  removeMember(groupId, userId) {
    return apiClient.delete(`${MEMBERS}/${groupId}/user/${userId}`);
  },

  changeMemberRole(groupId, userId, role) {
    return apiClient.patch(`${MEMBERS}/${groupId}/user/${userId}/role`, {
      role,
    });
  },

  transferOwnership(groupId, newOwnerId) {
    return apiClient.patch(`${MEMBERS}/${groupId}/transfer/${newOwnerId}`);
  },
};

export default groupService;
