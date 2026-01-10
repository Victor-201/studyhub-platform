import { useState, useEffect } from "react";
import FeedList from "@/components/user/document/FeedList";
import UserItem from "@/components/user/UserItem";
import useDocument from "@/hooks/useDocument";
import useUser from "@/hooks/useUser";
import Tab from "@/components/common/Tab";

export default function ProfileTabs({
  authUser,
  currentUser,
  isOwner,
  user_id,
}) {
  const [activeTab, setActiveTab] = useState("documents");
  const [loadingTab, setLoadingTab] = useState(null);
  const [errorTab, setErrorTab] = useState(null);

  const [feedCache, setFeedCache] = useState({
    documents: [],
    followers: [],
    following: [],
  });

  const { getMyDocuments, getUserPublicDocuments } = useDocument();
  const { getFollowers, getFollowing } = useUser();

  // ======================
  // LOAD FUNCTIONS
  // ======================
  const loadDocuments = async () => {
    setLoadingTab("documents");
    setErrorTab(null);
    try {
      const res = isOwner
        ? await getMyDocuments()
        : await getUserPublicDocuments(user_id);

      setFeedCache((prev) => ({
        ...prev,
        documents: res?.data || [],
      }));
    } catch (err) {
      console.error("Error loading documents:", err);
      setErrorTab("Không thể tải tài liệu.");
      setFeedCache((prev) => ({ ...prev, documents: [] }));
    } finally {
      setLoadingTab(null);
    }
  };

  const loadFollowers = async () => {
    setLoadingTab("followers");
    setErrorTab(null);
    try {
      const data = await getFollowers(user_id);
      setFeedCache((prev) => ({ ...prev, followers: data || [] }));
    } catch (err) {
      console.error("Error loading followers:", err);
      setErrorTab("Không thể tải người theo dõi.");
      setFeedCache((prev) => ({ ...prev, followers: [] }));
    } finally {
      setLoadingTab(null);
    }
  };

  const loadFollowing = async () => {
    setLoadingTab("following");
    setErrorTab(null);
    try {
      const data = await getFollowing(user_id);
      setFeedCache((prev) => ({ ...prev, following: data || [] }));
    } catch (err) {
      console.error("Error loading following:", err);
      setErrorTab("Không thể tải danh sách đang theo dõi.");
      setFeedCache((prev) => ({ ...prev, following: [] }));
    } finally {
      setLoadingTab(null);
    }
  };

  // ======================
  // EFFECT: LOAD DATA BY TAB
  // ======================
  useEffect(() => {
    if (activeTab === "documents" && feedCache.documents.length === 0) {
      loadDocuments();
    }
    if (activeTab === "followers" && feedCache.followers.length === 0) {
      loadFollowers();
    }
    if (activeTab === "following" && feedCache.following.length === 0) {
      loadFollowing();
    }
  }, [activeTab, user_id]);

  // ======================
  // RENDER
  // ======================
  return (
    <>
      {/* TABS */}
      <div className="flex gap-6 border-b mb-4">
        <Tab
          label="Documents"
          value="documents"
          activeTab={activeTab}
          onChange={setActiveTab}
        />
        <Tab
          label="Followers"
          value="followers"
          activeTab={activeTab}
          onChange={setActiveTab}
        />
        <Tab
          label="Following"
          value="following"
          activeTab={activeTab}
          onChange={setActiveTab}
        />
      </div>

      {/* DOCUMENTS */}
      {activeTab === "documents" && (
        <FeedList
          loading={loadingTab === "documents"}
          error={errorTab}
          feed={feedCache.documents}
          currentUser={currentUser}
          authUser={authUser}
        />
      )}

      {/* FOLLOWERS */}
      {activeTab === "followers" && (
        <>
          {loadingTab === "followers" ? (
            <p className="text-center py-6">Loading followers...</p>
          ) : errorTab ? (
            <div className="bg-red-100 text-red-700 p-3 rounded-lg text-center">
              {errorTab}
            </div>
          ) : feedCache.followers.length === 0 ? (
            <p className="text-gray-500 text-center py-6">Chưa có người theo dõi.</p>
          ) : (
            <div className="bg-white dark:bg-[var(--color-surface)] rounded-xl shadow divide-y">
              {feedCache.followers.map((u) => (
                <UserItem key={u.id} user={u} authUser={authUser} />
              ))}
            </div>
          )}
        </>
      )}

      {/* FOLLOWING */}
      {activeTab === "following" && (
        <>
          {loadingTab === "following" ? (
            <p className="text-center py-6">Loading following...</p>
          ) : errorTab ? (
            <div className="bg-red-100 text-red-700 p-3 rounded-lg text-center">
              {errorTab}
            </div>
          ) : feedCache.following.length === 0 ? (
            <p className="text-gray-500 text-center py-6">Chưa theo dõi ai.</p>
          ) : (
            <div className="bg-white dark:bg-[var(--color-surface)] rounded-xl shadow divide-y">
              {feedCache.following.map((u) => (
                <UserItem key={u.id} user={u} authUser={authUser} />
              ))}
            </div>
          )}
        </>
      )}
    </>
  );
}
