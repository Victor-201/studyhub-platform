import { useEffect, useState } from "react";
import documentService from "@/services/documentService";

export default function useDocument(documentId = null) {
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(false);
  const [allTags, setAllTags] = useState([]);
  const [tagsLoaded, setTagsLoaded] = useState(false);

  // =========================
  // LOAD DETAIL
  // =========================
  const loadDocument = async (id = documentId) => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await documentService.getDocument(id);
      setDocument(res.data);
    } finally {
      setLoading(false);
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

  const deleteDocument = async () => {
    if (!documentId) return;
    setLoading(true);
    try {
      await documentService.remove(documentId);
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
  const searchDocuments = (params) => documentService.search(params);

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

  // =========================
  // ADMIN
  // =========================
  const getCounts = async () => {
    const res = await documentService.counts();
    return {
      documents: res.data?.countDocuments ?? 0,
      comments: res.data?.countComments ?? 0,
    };
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

  const getAllComments = (params = { limit: 50, offset: 0 }) =>
    documentService.getAllComments(params);

  // =========================
  // INTERACTIONS
  // =========================
  const toggleBookmark = () => {
    if (!documentId) return;
    return documentService.toggleBookmark(documentId);
  };

  const addComment = (content, parentId = null) => {
    if (!documentId) return;
    return documentService.addComment(documentId, content, parentId);
  };

  const deleteComment = (commentId) => documentService.deleteComment(commentId);

  const download = () => {
    if (!documentId) return;
    documentService.download(documentId);
  };

  return {
    loading,
    document,

    // detail
    loadDocument,

    // CRUD
    uploadDocument,
    updateDocument,
    deleteDocument,

    // feed
    getPublicFeed,
    getHomeFeed,
    getMyDocuments,
    getUserPublicDocuments,

    // group
    getGroupApproved,
    getGroupPending,

    // search
    searchDocuments,

    // tags
    loadAllTags,
    allTags,

    // admin
    getCounts,
    getApprovedDocuments,
    getAllComments,

    // interactions
    toggleBookmark,
    addComment,
    deleteComment,
    download,
    getCommentsByDocument,
  };
}
