// src/pages/Home.jsx
import { useEffect, useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import useDocument from "@/hooks/useDocument";
import CreateDocument from "@/components/common/CreateDocument";
import FeedList from "@/components/user/document/FeedList";

export default function Home() {
  const { currentUser, authUser } = useOutletContext();
  const isLoggedIn = !!authUser?.id;

  const { getHomeFeed, getPublicFeed } = useDocument();

  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchedRef = useRef(false);

  const loadFeed = async () => {
    try {
      setLoading(true);
      setError("");

      const res = isLoggedIn
        ? await getHomeFeed()
        : await getPublicFeed();

      setFeed(res?.data || []);
    } catch (e) {
      console.error(e);
      setError("Không thể tải dữ liệu.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (fetchedRef.current) return;

    fetchedRef.current = true;
    loadFeed();
  }, [isLoggedIn]);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Toaster position="top-right" />

      {isLoggedIn && (
        <CreateDocument
          currentUser={currentUser}
          onSuccess={loadFeed}
        />
      )}

      <FeedList
        loading={loading}
        error={error}
        feed={feed}
        currentUser={currentUser}
        authUser={authUser}
      />
    </div>
  );
}
