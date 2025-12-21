import apiClient from "@/api/apiClient";

const base = "/user";

const userService = {
  // ===================
  // PROFILE
  // ===================
  getInfo(user_id) {
    return apiClient.get(`${base}/profile/${user_id}`);
  },

  getProfile(user_id) {
    return apiClient.get(`${base}/profile/detail/${user_id}`);
  },

  updateProfile(user_id, data) {
    return apiClient.put(`${base}/profile/${user_id}`, data);
  },

  updateAvatar(user_id, file) {
    const form = new FormData();
    form.append("avatar", file);
    return apiClient.put(`${base}/profile/${user_id}/avatar`, form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  // ===================
  // PRIVACY
  // ===================
  getPrivacy(user_id) {
    return apiClient.get(`${base}/profile/${user_id}/privacy`);
  },

  updatePrivacy(user_id, data) {
    return apiClient.put(`${base}/profile/${user_id}/privacy`, data);
  },

  // ===================
  // SOCIAL LINKS
  // ===================
  addSocial(user_id, platform, url) {
    return apiClient.post(`${base}/profile/${user_id}/social`, {
      platform,
      url,
    });
  },

  removeSocial(id) {
    return apiClient.delete(`${base}/profile/social/${id}`);
  },

  // ===================
  // INTERESTS
  // ===================
  addInterest(user_id, interest) {
    return apiClient.post(`${base}/profile/${user_id}/interest`, { interest });
  },

  removeInterest(user_id, interest) {
    return apiClient.delete(`${base}/profile/${user_id}/interest`, {
      data: { interest },
    });
  },

  // ===================
  // FOLLOW SYSTEM
  // ===================
  follow(follower_id, target_user_id) {
    return apiClient.post(`${base}/follow/follow`, {
      follower_id,
      target_user_id,
    });
  },

  unfollow(follower_id, target_user_id) {
    return apiClient.post(`${base}/follow/unfollow`, {
      follower_id,
      target_user_id,
    });
  },

  getFollowCounts(user_id) {
    return apiClient.get(`${base}/follow/${user_id}/counts`);
  },

  getFriends(user_id) {
    return apiClient.get(`${base}/follow/${user_id}/friends`);
  },

  isFollowing(follower_id, target_user_id) {
    return apiClient.get(
      `${base}/follow/is-following?follower_id=${follower_id}&target_user_id=${target_user_id}`
    );
  },

  isFriend(user_a, user_b) {
    return apiClient.get(
      `${base}/follow/is-friend?user_a=${user_a}&user_b=${user_b}`
    );
  },

  getFollowers(user_id) {
    return apiClient.get(`${base}/follow/${user_id}/followers`);
  },

  getFollowing(user_id) {
    return apiClient.get(`${base}/follow/${user_id}/following`);
  },

  searchUsers(query) {
    const params = new URLSearchParams(query).toString();
    return apiClient.get(`${base}/profile?${params}`);
  },
};

export default userService;
