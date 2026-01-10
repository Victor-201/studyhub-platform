import { useEffect, useState } from "react";
import { useParams, useOutletContext } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { MoreHorizontal } from "lucide-react";

import useUser from "@/hooks/useUser";
import useDocument from "@/hooks/useDocument";
import CreateDocument from "@/components/common/CreateDocument";
import ProfileTabs from "@/components/user/profile/ProfileTabs";
import AvatarUploadModal from "@/components/user/profile/AvatarUploadModal";
import ProfileHeader from "@/components/user/profile/ProfileHeader";
import ProfileInfoSection from "@/components/user/profile/ProfileInfoSection";
import ProfilePrivacySettings from "@/components/user/profile/ProfilePrivacySettings";
import ProfileInterests from "@/components/user/profile/ProfileInterests";
import ProfileSocialLinks from "@/components/user/profile/ProfileSocialLinks";
import toast from "react-hot-toast";

export default function Profile({ userId = null }) {
  const { authUser, currentUser } = useOutletContext();
  const params = useParams();
  const effectiveUserId = params.user_id || userId;
  const isOwner = !!authUser && authUser.id === effectiveUserId;

  const [authReady, setAuthReady] = useState(false);
  const [following, setFollowing] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [editingPrivacy, setEditingPrivacy] = useState(false);

  // Loading states for actions
  const [savingInfo, setSavingInfo] = useState(false);
  const [addingInterest, setAddingInterest] = useState(false);
  const [removingInterest, setRemovingInterest] = useState(false);
  const [addingSocial, setAddingSocial] = useState(false);
  const [removingSocial, setRemovingSocial] = useState(false);
  const [savingPrivacy, setSavingPrivacy] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [followingUser, setFollowingUser] = useState(false);
  const [reportingUser, setReportingUser] = useState(false);

  const {
    profile,
    loadingProfile,
    errorProfile,
    loadProfile,
    getFollowCounts,
    follow,
    unfollow,
    isFollowing,
    reportUser,
    updateProfile,
    updateAvatar,
    updatePrivacy,
    addInterest,
    removeInterest,
    addSocial,
    removeSocial,
  } = useUser();

  const [followCounts, setFollowCounts] = useState({
    followers: 0,
    following: 0,
  });

  // Per-section edit states
  const [editingInfo, setEditingInfo] = useState(false);
  const [editingInterests, setEditingInterests] = useState(false);
  const [editingSocial, setEditingSocial] = useState(false);

  // Edit form state
  const [editData, setEditData] = useState({
    display_name: "",
    full_name: "",
    bio: "",
    gender: "",
    birthday: "",
    country: "",
    city: "",
  });

  // Privacy settings state
  const [privacySettings, setPrivacySettings] = useState({
    show_full_name: true,
    show_bio: true,
    show_gender: true,
    show_birthday: false,
    show_location: true,
    show_avatar: true,
    show_profile: true,
    allow_messages: "everyone",
    allow_tagging: true,
  });

  useEffect(() => {
    if (authUser !== undefined) setAuthReady(true);
  }, [authUser]);

  useEffect(() => {
    if (!effectiveUserId) return;
    loadProfile(effectiveUserId);
  }, [effectiveUserId]);

  useEffect(() => {
    if (!profile || !effectiveUserId) return;
    getFollowCounts(effectiveUserId).then(setFollowCounts);
  }, [profile, effectiveUserId]);

  // Kiểm tra đã follow hay chưa
  useEffect(() => {
    if (!isOwner && authUser?.id) {
      isFollowing(effectiveUserId).then(setFollowing);
    }
  }, [effectiveUserId, authUser?.id]);

  // Initialize edit data when profile loads
  useEffect(() => {
    if (profile && isOwner) {
      const birthdayDate = profile.birthday 
        ? new Date(profile.birthday).toISOString().split('T')[0]
        : "";
      
      setEditData({
        display_name: profile.display_name || "",
        full_name: profile.full_name || "",
        bio: profile.bio || "",
        gender: profile.gender || "",
        birthday: birthdayDate,
        country: profile.country || "",
        city: profile.city || "",
      });

      setPrivacySettings({
        show_full_name: (profile.show_full_name ?? 1) === 1,
        show_bio: (profile.show_bio ?? 1) === 1,
        show_gender: (profile.show_gender ?? 1) === 1,
        show_birthday: (profile.show_birthday ?? 0) === 1,
        show_location: (profile.show_location ?? 1) === 1,
        show_avatar: (profile.show_avatar ?? 1) === 1,
        show_profile: (profile.show_profile ?? 1) === 1,
        allow_messages: profile.allow_messages || "everyone",
        allow_tagging: (profile.allow_tagging ?? 1) === 1,
      });
    }
  }, [profile, isOwner]);

  // Section save handlers
  const handleSaveInfo = async (data) => {
    setSavingInfo(true);
    try {
      await updateProfile(data);
      // Convert boolean to 0/1 for API
      const privacyData = {
        show_full_name: privacySettings.show_full_name ? 1 : 0,
        show_bio: privacySettings.show_bio ? 1 : 0,
        show_gender: privacySettings.show_gender ? 1 : 0,
        show_birthday: privacySettings.show_birthday ? 1 : 0,
        show_location: privacySettings.show_location ? 1 : 0,
        show_avatar: privacySettings.show_avatar ? 1 : 0,
        show_profile: privacySettings.show_profile ? 1 : 0,
        allow_messages: privacySettings.allow_messages || "everyone",
        allow_tagging: privacySettings.allow_tagging ? 1 : 0,
      };
      await updatePrivacy(privacyData);
      setEditingInfo(false);
      toast.success("Cập nhật giới thiệu thành công");
    } catch (err) {
      console.error(err);
      toast.error("Cập nhật giới thiệu thất bại");
    } finally {
      setSavingInfo(false);
    }
  };

  const handleAddInterest = async (interest) => {
    setAddingInterest(true);
    try {
      await addInterest(interest);
      toast.success("Thêm sở thích thành công");
    } catch (err) {
      console.error(err);
      toast.error("Thêm sở thích thất bại");
    } finally {
      setAddingInterest(false);
    }
  };

  const handleRemoveInterest = async (interest) => {
    setRemovingInterest(true);
    try {
      await removeInterest(interest);
      toast.success("Xóa sở thích thành công");
      // Close editing if no interests left
      if (profile?.interests?.length <= 1) {
        setEditingInterests(false);
      }
    } catch (err) {
      console.error(err);
      toast.error("Xóa sở thích thất bại");
    } finally {
      setRemovingInterest(false);
    }
  };

  const handleAddSocial = async (url) => {
    setAddingSocial(true);
    try {
      await addSocial(url);
      toast.success("Thêm liên kết thành công");
    } catch (err) {
      console.error(err);
      toast.error("Thêm liên kết thất bại");
    } finally {
      setAddingSocial(false);
    }
  };

  const handleRemoveSocial = async (id) => {
    setRemovingSocial(true);
    try {
      await removeSocial(id);
      toast.success("Xóa liên kết thành công");
      // Close editing if no links left
      if (profile?.social_links?.length <= 1) {
        setEditingSocial(false);
      }
    } catch (err) {
      console.error(err);
      toast.error("Xóa liên kết thất bại");
    } finally {
      setRemovingSocial(false);
    }
  };

  const toggleFollow = async () => {
    setFollowingUser(true);
    try {
      if (following) {
        await unfollow(effectiveUserId);
        setFollowing(false);
        toast.success("Đã hủy theo dõi");
      } else {
        await follow(effectiveUserId);
        setFollowing(true);
        toast.success("Đã theo dõi");
      }
    } catch (err) {
      console.error(err);
      toast.error("Thao tác theo dõi thất bại");
    } finally {
      setFollowingUser(false);
    }
  };

  const handleReport = async () => {
    setReportingUser(true);
    try {
      await reportUser(effectiveUserId);
      toast.success("Đã gửi báo cáo");
      setShowMenu(false);
    } catch (err) {
      console.error(err);
      toast.error("Báo cáo thất bại");
    } finally {
      setReportingUser(false);
    }
  };

  const handleOpenFullEdit = () => {
    setIsEditMode(true);
    setEditingInfo(true);
    setEditingInterests(true);
    setEditingSocial(true);
    setShowMenu(false);
  };

  const handleOpenPrivacyModal = () => {
    setEditingPrivacy(true);
    setShowMenu(false);
  };

  const handleSavePrivacy = async () => {
    setSavingPrivacy(true);
    try {
      // Convert boolean to 0/1 for API
      const privacyData = {
        show_full_name: privacySettings.show_full_name ? 1 : 0,
        show_bio: privacySettings.show_bio ? 1 : 0,
        show_gender: privacySettings.show_gender ? 1 : 0,
        show_birthday: privacySettings.show_birthday ? 1 : 0,
        show_location: privacySettings.show_location ? 1 : 0,
        show_avatar: privacySettings.show_avatar ? 1 : 0,
        show_profile: privacySettings.show_profile ? 1 : 0,
        allow_messages: privacySettings.allow_messages || "everyone",
        allow_tagging: privacySettings.allow_tagging ? 1 : 0,
      };
      await updatePrivacy(privacyData);
      setEditingPrivacy(false);
      toast.success("Cập nhật quyền riêng tư thành công");
    } catch (err) {
      console.error(err);
      toast.error("Cập nhật quyền riêng tư thất bại");
    } finally {
      setSavingPrivacy(false);
    }
  };

  const handleEditChange = (field, value) => {
    setEditData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePrivacyChange = (field, value) => {
    // Convert 0/1 to boolean for internal state
    const boolValue = value === 1 || value === true;
    setPrivacySettings((prev) => ({
      ...prev,
      [field]: boolValue,
    }));
  };

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    try {
      // Format data for update
      const profileData = {
        display_name: editData.display_name || "",
        full_name: editData.full_name || "",
        bio: editData.bio || "",
        gender: editData.gender || null,
        birthday: editData.birthday ? new Date(editData.birthday).toISOString().split('T')[0] : null,
        country: editData.country || "",
        city: editData.city || "",
      };

      const privacyData = {
        show_full_name: privacySettings.show_full_name ? 1 : 0,
        show_bio: privacySettings.show_bio ? 1 : 0,
        show_gender: privacySettings.show_gender ? 1 : 0,
        show_birthday: privacySettings.show_birthday ? 1 : 0,
        show_location: privacySettings.show_location ? 1 : 0,
        show_avatar: privacySettings.show_avatar ? 1 : 0,
        show_profile: privacySettings.show_profile ? 1 : 0,
        allow_messages: privacySettings.allow_messages || "everyone",
        allow_tagging: privacySettings.allow_tagging ? 1 : 0,
      };

      // Validate required fields
      if (!profileData.display_name.trim()) {
        toast.error("Tên hiển thị không được để trống");
        return;
      }

      await updateProfile(profileData);
      await updatePrivacy(privacyData);
      setIsEditMode(false);
      setEditingInfo(false);
      setEditingInterests(false);
      setEditingSocial(false);
      toast.success("Cập nhật profile thành công");
    } catch (err) {
      console.error("Profile update error:", err);
      toast.error(err.message || "Cập nhật profile thất bại");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleAvatarUpload = async (file) => {
    setUploadingAvatar(true);
    try {
      await updateAvatar(file);
      // Success handled in modal
    } catch (err) {
      console.error(err);
      throw err; // Let modal handle the error display
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    setEditingInfo(false);
    setEditingInterests(false);
    setEditingSocial(false);
    if (profile) {
      const birthdayDate = profile.birthday 
        ? new Date(profile.birthday).toISOString().split('T')[0]
        : "";
      
      setEditData({
        display_name: profile.display_name || "",
        full_name: profile.full_name || "",
        bio: profile.bio || "",
        gender: profile.gender || "",
        birthday: birthdayDate,
        country: profile.country || "",
        city: profile.city || "",
      });
    }
  };

  // Cancel a local section edit. If 'info' is cancelled, close all sections.
  const handleCancelLocal = (section) => {
    if (section === "info") {
      setIsEditMode(false);
      setEditingInfo(false);
      setEditingInterests(false);
      setEditingSocial(false);
      // reset edit data to original profile
      if (profile) {
        const birthdayDate = profile.birthday ? new Date(profile.birthday).toISOString().split('T')[0] : "";
        setEditData({
          display_name: profile.display_name || "",
          full_name: profile.full_name || "",
          bio: profile.bio || "",
          gender: profile.gender || "",
          birthday: birthdayDate,
          country: profile.country || "",
          city: profile.city || "",
        });
      }
    } else if (section === "interests") {
      setEditingInterests(false);
    } else if (section === "social") {
      setEditingSocial(false);
    }
  };

  if (!authReady)
    return null;
  if (!profile) return null;

  const p = profile;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <Toaster />
      <AvatarUploadModal
        isOpen={showAvatarModal}
        onClose={() => setShowAvatarModal(false)}
        onUpload={handleAvatarUpload}
        uploadingAvatar={uploadingAvatar}
      />

      {/* ROW 1: MAIN INFO - Using ProfileHeader Component */}
      <ProfileHeader
        profile={p}
        isOwner={isOwner}
        isEditMode={isEditMode}
        editData={editData}
        setShowAvatarModal={setShowAvatarModal}
        onEditChange={handleEditChange}
        onSave={handleSaveProfile}
        onCancel={handleCancelEdit}
        following={following}
        authUser={authUser}
        onFollowClick={toggleFollow}
        onReportClick={handleReport}
        showMenu={showMenu}
        setShowMenu={setShowMenu}
        onOpenFullEdit={handleOpenFullEdit}
        onOpenPrivacyModal={handleOpenPrivacyModal}
        followCounts={followCounts}
        followingUser={followingUser}
        savingProfile={savingProfile}
        reportingUser={reportingUser}
      />


      {/* ROW 2: LEFT INFO & RIGHT TABS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-6">
          {/* Privacy Settings Card */}
          {editingPrivacy && isOwner && (
            <div className="bg-white rounded-xl shadow p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold">Quyền riêng tư</h3>
                <button
                  data-plain
                  onClick={() => setEditingPrivacy(false)}
                  className="text-gray-500 hover:text-gray-700 text-lg"
                >
                  ✕
                </button>
              </div>
              <ProfilePrivacySettings
                privacySettings={privacySettings}
                onPrivacyChange={handlePrivacyChange}
              />
              <div className="flex gap-2 mt-4">
                <button
                  onClick={handleSavePrivacy}
                  disabled={savingPrivacy}
                  className="flex-1 px-3 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 disabled:opacity-50 transition"
                >
                  Lưu
                </button>
                <button
                  onClick={() => setEditingPrivacy(false)}
                  disabled={savingPrivacy}
                  className="flex-1 px-3 py-2 bg-gray-300 text-sm font-medium rounded-lg hover:bg-gray-400 disabled:opacity-50 transition"
                >
                  Hủy
                </button>
              </div>
            </div>
          )}

          {/* Profile Info Section */}
          <ProfileInfoSection
            profile={p}
            isEditMode={isEditMode}
            editData={editData}
            onEditChange={handleEditChange}
            isOwner={isOwner}
            localEditing={editingInfo}
            setLocalEditing={setEditingInfo}
            onSaveLocal={handleSaveInfo}
            onCancelLocal={handleCancelLocal}
            privacySettings={privacySettings}
            onPrivacyChange={handlePrivacyChange}
            savingInfo={savingInfo}
          />

          {/* Interests Section */}
          <ProfileInterests
            interests={p.interests}
            isOwner={isOwner}
            localEditing={editingInterests}
            setLocalEditing={setEditingInterests}
            onAddInterest={handleAddInterest}
            onRemoveInterest={handleRemoveInterest}
            addingInterest={addingInterest}
            removingInterest={removingInterest}
          />

          {/* Social Links Section */}
          <ProfileSocialLinks
            socialLinks={p.social_links}
            isOwner={isOwner}
            localEditing={editingSocial}
            setLocalEditing={setEditingSocial}
            onAddSocial={handleAddSocial}
            onRemoveSocial={handleRemoveSocial}
            addingSocial={addingSocial}
            removingSocial={removingSocial}
          />
        </div>

        <div className="lg:col-span-2 space-y-6">
          {isOwner && (
            <div className="bg-white rounded-xl shadow p-4">
              <CreateDocument currentUser={currentUser} onSuccess={() => {}} />
            </div>
          )}
          {/* TABS COMPONENT */}
          <ProfileTabs
            authUser={authUser}
            currentUser={currentUser}
            isOwner={isOwner}
            user_id={effectiveUserId}
          />
        </div>
      </div>
    </div>
  );
}
