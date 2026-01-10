import apiClient from "@/api/apiClient";

const BASE_URL = "/chat";

const chatService = {
  getConversations(params = { limit: 50, offset: 0 }) {
    return apiClient.get(`${BASE_URL}/conversations`, { params });
  },

  getConversation(conversationId) {
    return apiClient.get(`${BASE_URL}/conversations/${conversationId}`);
  },

  createConversation(payload) {
    return apiClient.post(`${BASE_URL}/conversations`, payload);
  },

  getMessages(conversationId, params = { limit: 50, before: null }) {
    return apiClient.get(`${BASE_URL}/conversations/${conversationId}/messages`, {
      params,
    });
  },

  sendMessage(payload) {
    return apiClient.post(`${BASE_URL}/messages`, payload);
  },

  sendDirectMessage(payload) {
    return apiClient.post(`${BASE_URL}/messages/direct`, payload);
  },

  deleteMessage(messageId) {
    return apiClient.delete(`${BASE_URL}/messages/${messageId}`);
  },
};

export default chatService;
