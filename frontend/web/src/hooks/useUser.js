import { useState } from "react";
import userService from "@/services/userService";
import { useAuth } from "./useAuth";

export default function useUser() {
  const { user } = useAuth();

  const [info, setInfo] = useState(null);
  const [profile, setProfile] = useState(null);

  const [loadingInfo, setLoadingInfo] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);

  const [errorInfo, setErrorInfo] = useState("");
  const [errorProfile, setErrorProfile] = useState("");

  // ===================
  // LOAD INFO
  // ===================
  const loadInfo = async (user_id) => {
    if (!user_id) return null;
    setLoadingInfo(true);
    setErrorInfo("");
    try {
      const res = await userService.getInfo(user_id);
      setInfo(res.data);
      return res.data;
    } catch (err) {
      setErrorInfo("Không thể tải thông tin cơ bản.");
      return null;
    } finally {
      setLoadingInfo(false);
    }
  };

  // ===================
  // LOAD PROFILE
  // ===================
  const loadProfile = async (user_id) => {
    if (!user_id) return null;
    setLoadingProfile(true);
    setErrorProfile("");
    try {
      const res = await userService.getProfile(user_id);
      const p = res.data?.profile;
      if (!p) throw new Error("Không có profile");

      const normalizedProfile = {
        id: p.id || p.user_id,
        display_name: p.display_name || "",
        full_name: p.full_name || "",
        avatar_url: p.avatar_url || "",
        status: p.status || "offline",
        bio: p.bio || "",
        gender: p.gender || "",
        birthday: p.birthday || null,
        country: p.country || "",
        city: p.city || "",
        show_full_name: p.show_full_name ?? 1,
        show_bio: p.show_bio ?? 1,
        show_gender: p.show_gender ?? 1,
        show_birthday: p.show_birthday ?? 0,
        show_location: p.show_location ?? 1,
        show_avatar: p.show_avatar ?? 1,
        show_profile: p.show_profile ?? 1,
        social_links: p.social_links || [],
        interests: p.interests || [],
        created_at: p.created_at || null,
        updated_at: p.updated_at || null,
      };
      setProfile(normalizedProfile);
      return normalizedProfile;
    } catch (err) {
      setErrorProfile("Không thể tải profile.");
      return null;
    } finally {
      setLoadingProfile(false);
    }
  };

  // ===================
  // UPDATE PROFILE
  // ===================
  const updateProfile = async (data) => {
    if (!user?.id) throw new Error("No authenticated user");
    setLoadingProfile(true);
    try {
      const res = await userService.updateProfile(user.id, data);
      await loadProfile(user.id);
      return res.data?.profile || null;
    } catch (err) {
      setErrorProfile("Không thể cập nhật profile.");
      return null;
    } finally {
      setLoadingProfile(false);
    }
  };

  const updateAvatar = async (file) => {
    if (!user?.id) throw new Error("No authenticated user");
    setLoadingProfile(true);
    try {
      const res = await userService.updateAvatar(user.id, file);
      await loadProfile(user.id);
      return res.data?.profile || null;
    } catch (err) {
      setErrorProfile("Không thể cập nhật avatar.");
      return null;
    } finally {
      setLoadingProfile(false);
    }
  };

  const updatePrivacy = async (data) => {
    if (!user?.id) throw new Error("No authenticated user");
    setLoadingProfile(true);
    try {
      const res = await userService.updatePrivacy(user.id, data);
      await loadProfile(user.id);
      return res.data?.profile || null;
    } catch (err) {
      setErrorProfile("Không thể cập nhật quyền riêng tư.");
      return null;
    } finally {
      setLoadingProfile(false);
    }
  };

  // ===================
  // SOCIAL LINKS
  // ===================
  const addSocial = async (platform, url) => {
    if (!user?.id) throw new Error("No authenticated user");
    setLoadingProfile(true);
    try {
      await userService.addSocial(user.id, platform, url);
      await loadProfile(user.id);
      return true;
    } catch (err) {
      setErrorProfile("Không thể thêm social link.");
      return false;
    } finally {
      setLoadingProfile(false);
    }
  };

  const removeSocial = async (id) => {
    setLoadingProfile(true);
    try {
      await userService.removeSocial(id);
      await loadProfile(user.id);
      return true;
    } catch (err) {
      setErrorProfile("Không thể xóa social link.");
      return false;
    } finally {
      setLoadingProfile(false);
    }
  };

  // ===================
  // INTERESTS
  // ===================
  const addInterest = async (interest) => {
    if (!user?.id) throw new Error("No authenticated user");
    setLoadingProfile(true);
    try {
      await userService.addInterest(user.id, interest);
      await loadProfile(user.id);
      return true;
    } catch (err) {
      setErrorProfile("Không thể thêm interest.");
      return false;
    } finally {
      setLoadingProfile(false);
    }
  };

  const removeInterest = async (interest) => {
    if (!user?.id) throw new Error("No authenticated user");
    setLoadingProfile(true);
    try {
      await userService.removeInterest(user.id, interest);
      await loadProfile(user.id);
      return true;
    } catch (err) {
      setErrorProfile("Không thể xóa interest.");
      return false;
    } finally {
      setLoadingProfile(false);
    }
  };

  // ===================
  // FOLLOW SYSTEM
  // ===================
  const follow = async (target_user_id) => {
    if (!user?.id) throw new Error("No authenticated user");
    try {
      await userService.follow(user.id, target_user_id);
      return true;
    } catch (err) {
      console.error("Follow failed:", err);
      return false;
    }
  };

  const unfollow = async (target_user_id) => {
    if (!user?.id) throw new Error("No authenticated user");
    try {
      await userService.unfollow(user.id, target_user_id);
      return true;
    } catch (err) {
      console.error("Unfollow failed:", err);
      return false;
    }
  };

  const getFollowCounts = async (user_id) => {
    try {
      const res = await userService.getFollowCounts(user_id);
      return res.data || { followers: 0, following: 0 };
    } catch (err) {
      console.error("Cannot get follow counts:", err);
      return { followers: 0, following: 0 };
    }
  };

  const isFollowing = async (target_user_id) => {
    if (!user?.id) return false;
    try {
      const res = await userService.isFollowing(user.id, target_user_id);
      return res.data?.isFollowing || false;
    } catch (err) {
      return false;
    }
  };

  const getFriends = async (user_id) => {
    try {
      const res = await userService.getFriends(user_id);
      return res.data || [];
    } catch (err) {
      return [];
    }
  };

  const getFollowers = async (user_id) => {
    if (!user_id) return [];
    try {
      const res = await userService.getFollowers(user_id);
      return res.data || [];
    } catch (err) {
      console.error("Cannot get followers:", err);
      return [];
    }
  };

  const getFollowing = async (user_id) => {
    if (!user_id) return [];
    try {
      const res = await userService.getFollowing(user_id);
      return res.data || [];
    } catch (err) {
      console.error("Cannot get following:", err);
      return [];
    }
  };

  const isFriend = async (user_b) => {
    if (!user?.id) return false;
    try {
      const res = await userService.isFriend(user.id, user_b);
      return res.data?.isFriend || false;
    } catch (err) {
      return false;
    }
  };

  // ===================
  // SEARCH USERS
  // ===================
  const searchUsers = async (query) => {
    try {
      const res = await userService.searchUsers(query);
      return res.data || [];
    } catch (err) {
      return [];
    }
  };

  return {
    info,
    profile,
    loadingInfo,
    loadingProfile,
    errorInfo,
    errorProfile,
    loadInfo,
    loadProfile,
    updateProfile,
    updateAvatar,
    updatePrivacy,
    addSocial,
    removeSocial,
    addInterest,
    removeInterest,
    follow,
    unfollow,
    getFollowCounts,
    isFollowing,
    getFriends,
    getFollowers,
    getFollowing,
    isFriend,
    searchUsers,
  };
}
