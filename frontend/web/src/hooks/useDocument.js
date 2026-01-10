import { useEffect, useState } from "react";
import documentService from "@/services/documentService";

export default function useDocument(documentId = null) {
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(false);
  const [allTags, setAllTags] = useState([]);
  const [tagsLoaded, setTagsLoaded] = useState(false);
  const [previewCache, setPreviewCache] = useState({});

  const [bookmarking, setBookmarking] = useState(false);
  const [downloading, setDownloading] = useState(false);

  // =========================
  // LOAD DETAIL
  // =========================
  const loadDocument = async (id = documentId) => {
    if (!id) return null;

    setLoading(true);
    try {
      const res = await documentService.getDocument(id);
      const doc = res.data;

      setDocument(doc);
      return doc;
    } catch (err) {
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const loadDocumentPreview = async (id = documentId) => {
    if (!id) return null;

    if (previewCache[id]) {
      return previewCache[id];
    }

    try {
      const res = await documentService.previewDocument(id);
      const url = res.data?.preview_url || null;

      if (url) {
        setPreviewCache((prev) => ({
          ...prev,
          [id]: url,
        }));
      }

      return url;
    } catch {
      return null;
    }
  };

  // =========================
  // CRUD
  // =========================
  const uploadDocument = async (formData) => {
    setLoading(true);
    try {
      const res = await documentService.upload(formData);
      return res.data;
    } finally {
      setLoading(false);
    }
  };

  const updateDocument = async (payload) => {
    if (!documentId) return;
    setLoading(true);
    try {
      const res = await documentService.update(documentId, payload);
      await loadDocument();
      return res.data;
    } finally {
      setLoading(false);
    }
  };

  const deleteDocument = async (id) => {
    if (!id) return;
    setLoading(true);
    try {
      await documentService.remove(id);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // FEEDS
  // =========================
  const getPublicFeed = (params) => documentService.getPublicFeed(params);

  const getHomeFeed = (params) => documentService.getHomeFeed(params);

  const getMyDocuments = () => documentService.getMyDocuments();

  const getUserPublicDocuments = (userId) =>
    documentService.getUserPublicDocuments(userId);

  // =========================
  // GROUP
  // =========================
  const getGroupApproved = (groupId) =>
    documentService.getGroupApproved(groupId);

  const getGroupPending = (groupId) => documentService.getGroupPending(groupId);

  // =========================
  // SEARCH
  // =========================
  const searchDocuments = async (query, limit = 5, offset = 0) => {
    if (!query) return [];
    const res = await documentService.searchDocuments(query, limit, offset);
    return res.data || [];
  };

  // =========================
  // TAGS
  // =========================
  const loadAllTags = async () => {
    if (tagsLoaded) return allTags;

    const res = await documentService.getAllTags();
    const tags = res.data || [];

    setAllTags(tags);
    setTagsLoaded(true);

    return tags;
  };

  const getDocumentCount = async () => {
    try {
      const res = await documentService.countDocuments();
      return res.data?.countDocuments ?? 0;
    } catch (err) {
      console.error("Lỗi lấy số lượng tài liệu:", err);
      return 0;
    }
  };

  const getCommentCount = async () => {
    try {
      const res = await documentService.countComments();
      return res.data?.countComments ?? 0;
    } catch (err) {
      console.error("Lỗi lấy số lượng bình luận:", err);
      return 0;
    }
  };

  const getApprovedDocuments = (params = { limit: 50, offset: 0 }) =>
    documentService.getApprovedDocuments(params);

  const getCommentsByDocument = async (
    id,
    params = { limit: 50, offset: 0 }
  ) => {
    if (!id) return [];
    const res = await documentService.getCommentsByDocument(id, params);
    return res.data || [];
  };

  const getAllComments = (params) => documentService.getAllComments(params);

  // =========================
  // INTERACTIONS
  // =========================
  const checkBookmarked = async () => {
    if (!documentId) return false;
    const res = await documentService.isBookmarked(documentId);
    return !!res.data?.bookmarked;
  };

  const toggleBookmark = async () => {
    if (!documentId || bookmarking) return;
    setBookmarking(true);
    try {
      await documentService.toggleBookmark(documentId);
    } finally {
      setBookmarking(false);
    }
  };

  const addComment = async (content, parentId = null) => {
    if (!documentId) return;
    return documentService.addComment(documentId, content, parentId);
  };

  const deleteComment = async (commentId) => {
    await documentService.deleteComment(commentId);

    setDocument((prev) => ({
      ...prev,
      stats: {
        ...prev.stats,
        comments: Math.max(0, prev.stats.comments - 1),
      },
    }));
  };

  const download = async () => {
    if (!documentId || downloading) return;
    setDownloading(true);
    try {
      await documentService.download(documentId);
    } finally {
      setDownloading(false);
    }
  };

  const approve = async (documentId, groupId) => {
    await documentService.approve(documentId, groupId);
  };

  const reject = async (documentId, groupId) => {
    await documentService.reject(documentId, groupId);
  };

  return {
    loading,
    document,

    bookmarking,
    downloading,

    // detail
    loadDocument,
    loadDocumentPreview,

    // CRUD
    uploadDocument,
    updateDocument,
    deleteDocument,

    // feed
    getPublicFeed,
    getHomeFeed,
    getMyDocuments,
    getUserPublicDocuments,
    getCommentsByDocument,

    // group
    getGroupApproved,
    getGroupPending,

    // search
    searchDocuments,

    // tags
    loadAllTags,
    allTags,

    // admin
    getDocumentCount,
    getCommentCount,
    getApprovedDocuments,
    getAllComments,

    // interactions
    checkBookmarked,
    toggleBookmark,
    addComment,
    deleteComment,
    download,
    approve,
    reject,
  };
}
