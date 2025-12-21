import { useEffect, useState } from "react";
import { useParams, useOutletContext } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { MapPin, Cake, User, Link as LinkIcon, Github } from "lucide-react";

import useUser from "@/hooks/useUser";
import useDocument from "@/hooks/useDocument";
import CreateDocument from "@/components/user/document/CreateDocument";
import ProfileTabs from "@/components/user/profile/ProfileTabs";

const Stat = ({ label, value }) => (
  <div>
    <div className="text-lg font-semibold">{value}</div>
    <div className="text-sm text-gray-500">{label}</div>
  </div>
);

const Card = ({ title, children }) => (
  <div className="bg-white rounded-xl shadow p-4">
    <h3 className="text-sm font-semibold mb-2">{title}</h3>
    {children}
  </div>
);

export default function Profile() {
  const { authUser, currentUser } = useOutletContext();
  const { user_id } = useParams();
  const isOwner = !!authUser && authUser.id === user_id;

  const [authReady, setAuthReady] = useState(false);
  const { profile, loadingProfile, errorProfile, loadProfile, getFollowCounts } = useUser();

  const [followCounts, setFollowCounts] = useState({ followers: 0, following: 0 });

  useEffect(() => { if (authUser !== undefined) setAuthReady(true); }, [authUser]);

  useEffect(() => {
    if (!user_id) return;
    loadProfile(user_id);
  }, [user_id]);

  useEffect(() => {
    if (!profile) return;
    getFollowCounts(user_id).then(setFollowCounts);
  }, [profile]);

  if (!authReady || loadingProfile) return <div className="p-6">Đang tải profile...</div>;
  if (errorProfile) return <div className="p-6 text-red-500">{errorProfile}</div>;
  if (!profile) return null;

  const p = profile;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <Toaster />

      {/* ROW 1: MAIN INFO */}
      <div className="bg-white rounded-2xl shadow p-6 flex gap-6">
        {(p.show_avatar ?? 1) === 1 && (
          <img src={p.avatar_url} className="w-32 h-32 rounded-full border" />
        )}
        <div className="flex-1">
          <div className="flex justify-between">
            <div>
              <h1 className="text-2xl font-bold">{p.display_name}</h1>
              <div className="text-gray-500">@{authUser.user_name}</div>
            </div>
          </div>

          <div className="flex gap-6 mt-4">
            <Stat label="Documents" value={p.documents_count || 0} />
            <Stat label="Followers" value={followCounts.followers} />
            <Stat label="Following" value={followCounts.following} />
          </div>
        </div>
      </div>

      {/* ROW 2: LEFT INFO & RIGHT TABS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-6">
          {/* INFO */}
          <Card title="Giới thiệu">
            <div className="space-y-2 text-sm text-gray-700">
              {p.full_name && <div><strong>Họ và tên:</strong> {p.full_name}</div>}
              {p.bio && <div><strong>Tiểu sử:</strong> {p.bio}</div>}
              {p.gender && <div><strong>Giới tính:</strong> {p.gender === "male" ? "Nam" : "Nữ"}</div>}
              {p.birthday && <div><strong>Ngày sinh:</strong> {new Date(p.birthday).toLocaleDateString("vi-VN")}</div>}
              {(p.city || p.country) && <div><strong>Địa chỉ:</strong> {[p.city, p.country].filter(Boolean).join(", ")}</div>}
            </div>
          </Card>
          {Array.isArray(p.interests) && p.interests.length > 0 && (
            <Card title="Sở thích">
              <div className="flex flex-wrap gap-2">
                {p.interests.map((i) => (
                  <span key={i} className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs">{i}</span>
                ))}
              </div>
            </Card>
          )}
          {Array.isArray(p.social_links) && p.social_links.length > 0 && (
            <Card title="Liên kết">
              <div className="space-y-2">
                {p.social_links.map((l) => (
                  <a key={l.id} href={l.url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-blue-600 hover:underline">
                    {l.platform === "github" ? <Github size={16} /> : <LinkIcon size={16} />}
                    {l.platform}
                  </a>
                ))}
              </div>
            </Card>
          )}
        </div>

        <div className="lg:col-span-2 space-y-6">
          {isOwner && (
            <div className="bg-white rounded-xl shadow p-4">
              <CreateDocument currentUser={currentUser} onSuccess={() => {}} />
            </div>
          )}
          {/* TABS COMPONENT */}
          <ProfileTabs authUser={authUser} currentUser={currentUser} isOwner={isOwner} user_id={user_id} />
        </div>
      </div>
    </div>
  );
}
