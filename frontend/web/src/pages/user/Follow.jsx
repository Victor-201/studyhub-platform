import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import FollowTabs from "@/components/user/follow/FollowTabs";

export default function Follow() {
  const { authUser } = useOutletContext();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (authUser !== undefined) setReady(true);
  }, [authUser]);

  if (!ready) {
    return (
      <div className="flex justify-center items-center py-20 text-sm text-gray-500">
        Đang tải dữ liệu theo dõi...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-5">
      {/* HEADER */}
      <div className="card flex items-center justify-between">
        <h1 className="text-xl font-bold">Theo dõi</h1>
      </div>

      {/* CONTENT */}
      <FollowTabs authUser={authUser} />
    </div>
  );
}
