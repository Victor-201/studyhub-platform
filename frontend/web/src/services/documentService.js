import apiClient from "@/api/apiClient";

const BASE = "/document";
const INTERACT = "/document/interactions";

const documentService = {
  upload(formData) {
    return apiClient.post(`${BASE}/`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  getPublicFeed(params) {
    return apiClient.get(`${BASE}/feed/public`, { params });
  },

  getHomeFeed(params) {
    return apiClient.get(`${BASE}/feed/home`, { params });
  },

  getMyDocuments() {
    return apiClient.get(`${BASE}/me`);
  },

  getUserPublicDocuments(userId) {
    return apiClient.get(`${BASE}/user/${userId}/public`);
  },

  getGroupApproved(groupId) {
    return apiClient.get(`${BASE}/group/${groupId}/approved`);
  },

  getGroupPending(groupId) {
    return apiClient.get(`${BASE}/group/${groupId}/pending`);
  },

  searchDocuments(query, limit = 10, offset = 0) {
    return apiClient.get(`${BASE}/search`, {
      params: { query, limit, offset },
    });
  },

  getAllTags() {
    return apiClient.get(`${BASE}/tags`);
  },

  getDocument(id) {
    return apiClient.get(`${BASE}/${id}`);
  },

  previewDocument(id) {
    return apiClient.get(`${BASE}/${id}/preview`);
  },

  update(id, payload) {
    return apiClient.patch(`${BASE}/${id}`, payload);
  },

  remove(id) {
    return apiClient.delete(`${BASE}/${id}`);
  },

  countDocuments() {
    return apiClient.get(`${BASE}/admin/countDocuments`);
  },

  countComments() {
    return apiClient.get(`${BASE}/admin/countComments`);
  },

  getApprovedDocuments(params = { limit: 50, offset: 0 }) {
    return apiClient.get(`${BASE}/admin/approved`, { params });
  },

  getAllComments(params) {
    return apiClient.get(`${BASE}/admin/comments`, { params });
  },

  isBookmarked(id) {
    return apiClient.get(`${INTERACT}/${id}/bookmark`);
  },

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
    return apiClient.get(`${BASE}/${id}/comments`, { params });
  },

  deleteComment(commentId) {
    return apiClient.delete(`${INTERACT}/comments/${commentId}`);
  },

  download(id) {
    return apiClient
      .get(`${INTERACT}/${id}/download`, {
        responseType: "blob",
      })
      .then((res) => {
        const fileName = decodeURIComponent(
          res.headers["x-filename"] || "download"
        );

        const url = window.URL.createObjectURL(res.data);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();

        a.remove();
        window.URL.revokeObjectURL(url);
      })
      .catch((err) => {
        console.error("Download error:", err);
      });
  },

  approve(documentId, groupId) {
    return apiClient.post(`${INTERACT}/${documentId}/approve`, {
      group_id: groupId,
    });
  },

  reject(documentId, groupId) {
    return apiClient.post(`${INTERACT}/${documentId}/reject`, {
      group_id: groupId,
    });
  },
};

export default documentService;
