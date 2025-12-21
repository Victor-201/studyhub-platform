import apiClient from "@/api/apiClient";

const BASE = "/document";
const INTERACT = "/document/interactions";

const documentService = {
  // =========================
  // CREATE
  // =========================
  upload(formData) {
    return apiClient.post(`${BASE}/`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  // =========================
  // FEEDS
  // =========================
  getPublicFeed(params) {
    return apiClient.get(`${BASE}/feed/public`, { params });
  },

  getHomeFeed(params) {
    return apiClient.get(`${BASE}/feed/home`, { params });
  },

  // =========================
  // USER DOCUMENTS
  // =========================
  getMyDocuments() {
    return apiClient.get(`${BASE}/me`);
  },

  getUserPublicDocuments(userId) {
    return apiClient.get(`${BASE}/user/${userId}/public`);
  },

  // =========================
  // GROUP DOCUMENTS
  // =========================
  getGroupApproved(groupId) {
    return apiClient.get(`${BASE}/group/${groupId}/approved`);
  },

  getGroupPending(groupId) {
    return apiClient.get(`${BASE}/group/${groupId}/pending`);
  },

  // =========================
  // SEARCH
  // =========================
  search(params) {
    return apiClient.get(`${BASE}/search`, { params });
  },

  // =========================
  // TAGS
  // =========================
  getAllTags() {
    return apiClient.get(`${BASE}/tags`);
  },

  // =========================
  // DETAIL
  // =========================
  getDocument(id) {
    return apiClient.get(`${BASE}/${id}`);
  },

  update(id, payload) {
    return apiClient.patch(`${BASE}/${id}`, payload);
  },

  remove(id) {
    return apiClient.delete(`${BASE}/${id}`);
  },

  // =========================
  // ADMIN
  // =========================
  counts() {
    return apiClient.get(`${BASE}/admin/counts`);
  },

  getApprovedDocuments(params = { limit: 50, offset: 0 }) {
    return apiClient.get(`${BASE}/admin/approved`, { params });
  },

  getAllComments(params = { limit: 50, offset: 0 }) {
    return apiClient.get(`${INTERACT}/admin/comments`, { params });
  },

  // =========================
  // INTERACTIONS
  // =========================
  toggleBookmark(id) {
    return apiClient.post(`${INTERACT}/${id}/bookmark`);
  },

  addComment(id, content, parentId = null) {
    return apiClient.post(`${INTERACT}/${id}/comments`, {
      content,
      parent_comment_id: parentId,
    });
  },

  getCommentsByDocument(id, params = { limit: 50, offset: 0 }) {
    return apiClient.get(`${INTERACT}/${id}/comments`, { params });
  },

  deleteComment(commentId) {
    return apiClient.delete(`${INTERACT}/comments/${commentId}`);
  },

  download(id) {
    return apiClient.post(`${INTERACT}/${id}/download`);
  },
};

export default documentService;
