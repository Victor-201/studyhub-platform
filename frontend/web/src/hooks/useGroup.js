import { useState, useCallback } from "react";
import groupService from "@/services/groupService";

const toArray = (input) => (Array.isArray(input) ? input : []);

export default function useGroup() {
  /* ======================
   * STATE
   * ====================== */
  const [groups, setGroups] = useState([]);
  const [currentGroup, setCurrentGroup] = useState(null);

  const [loading, setLoading] = useState({
    list: false,
    detail: false,
    action: false,
  });

  const setLoadingState = (key, value) => {
    setLoading((prev) => ({ ...prev, [key]: value }));
  };

  /* ======================
   * LOAD GROUP LIST
   * ====================== */
  const loadUserGroups = useCallback(async (userId) => {
    if (!userId) {
      setGroups([]);
      return [];
    }

    setLoadingState("list", true);
    try {
      const res = await groupService.getUserGroups(userId);
      const data = toArray(res?.data?.data);
      setGroups(data);
      return data;
    } catch (err) {
      console.error("loadUserGroups error:", err);
      setGroups([]);
      return [];
    } finally {
      setLoadingState("list", false);
    }
  }, []);

  const loadOwnedGroups = useCallback(async () => {
    setLoadingState("list", true);
    try {
      const res = await groupService.getOwnedGroups();
      const data = toArray(res?.data?.data);
      setGroups(data);
      return data;
    } catch (err) {
      console.error("loadOwnedGroups error:", err);
      setGroups([]);
      return [];
    } finally {
      setLoadingState("list", false);
    }
  }, []);

  const findGroups = useCallback(async (params = {}) => {
    setLoadingState("list", true);
    try {
      const res = await groupService.findGroups(params);
      return toArray(res?.data?.data);
    } catch (err) {
      console.error("findGroups error:", err);
      return [];
    } finally {
      setLoadingState("list", false);
    }
  }, []);

  const getGroupsNotJoined = useCallback(async (params = {}) => {
    setLoadingState("list", true);
    try {
      const res = await groupService.getGroupsNotJoined(params);
      return toArray(res?.data?.data);
    } catch (err) {
      console.error("getGroupsNotJoined error:", err);
      return [];
    } finally {
      setLoadingState("list", false);
    }
  }, []);

  /* ======================
   * LOAD GROUP DETAIL
   * ====================== */
  const loadGroup = useCallback(async (groupId) => {
    if (!groupId) return null;

    setLoadingState("detail", true);
    try {
      const res = await groupService.getGroup(groupId);
      const data = res?.data?.data ?? null;
      setCurrentGroup(data);
      return data;
    } catch (err) {
      console.error("loadGroup error:", err);
      setCurrentGroup(null);
      return null;
    } finally {
      setLoadingState("detail", false);
    }
  }, []);

  /* ======================
   * CRUD
   * ====================== */
  const createGroup = useCallback(async (payload) => {
    setLoadingState("action", true);
    try {
      const res = await groupService.create(payload);
      return res?.data?.data;
    } finally {
      setLoadingState("action", false);
    }
  }, []);

  const updateGroup = useCallback(
    async (groupId, payload) => {
      if (!groupId) return null;
      setLoadingState("action", true);
      try {
        const res = await groupService.update(groupId, payload);
        await loadGroup(groupId);
        return res?.data?.data;
      } finally {
        setLoadingState("action", false);
      }
    },
    [loadGroup]
  );

  const deleteGroup = useCallback(async (groupId) => {
    if (!groupId) return null;

    setLoadingState("action", true);
    try {
      await groupService.remove(groupId);
      setGroups((prev) => prev.filter((g) => g.id !== groupId));
    } finally {
      setLoadingState("action", false);
    }
  }, []);

  const updateAvatar = useCallback(
    async (groupId, formData) => {
      if (!groupId) return null;
      setLoadingState("action", true);
      try {
        const res = await groupService.updateAvatar(groupId, formData);
        await loadGroup(groupId); // reload
        return res?.data?.data;
      } finally {
        setLoadingState("action", false);
      }
    },
    [loadGroup]
  );

  /* ======================
   * MEMBERSHIP
   * ====================== */
  const checkMembership = useCallback(async (groupId) => {
    if (!groupId) return null;

    try {
      const res = await groupService.checkMembership(groupId);
      return res?.data?.data || null;
    } catch {
      return null;
    }
  }, []);

  const joinGroup = useCallback(
    async (groupId) => {
      if (!groupId) return null;

      setLoadingState("action", true);
      try {
        const res = await groupService.join(groupId);
        const joinedGroup = res?.data?.data;

        if (joinedGroup) {
          await loadUserGroups(joinedGroup.user_id || authUser.id);
        }

        return joinedGroup;
      } finally {
        setLoadingState("action", false);
      }
    },
    [loadUserGroups]
  );

  const cancelJoin = useCallback(async (groupId) => {
    if (!groupId) return null;

    setLoadingState("action", true);
    try {
      const res = await groupService.cancelJoin(groupId);
      return res?.data?.data;
    } finally {
      setLoadingState("action", false);
    }
  }, []);

  const leaveGroup = useCallback(
    async (groupId, userId) => {
      if (!groupId || !userId) return null;

      setLoadingState("action", true);
      try {
        const res = await groupService.leaveGroup(groupId);
        await loadUserGroups(userId);
        return res?.data?.data;
      } finally {
        setLoadingState("action", false);
      }
    },
    [loadUserGroups]
  );

  /* ======================
   * MANAGER / MEMBERS
   * ====================== */

  const getJoinRequests = useCallback(
    async (groupId, params = { limit: 50, offset: 0 }) => {
      if (!groupId) {
        return {
          items: [],
          total: 0,
          limit: params.limit ?? 50,
          offset: params.offset ?? 0,
        };
      }

      setLoadingState("list", true);
      try {
        const res = await groupService.getJoinRequests(groupId, params);
        return (
          res?.data?.data ?? {
            items: [],
            total: 0,
            limit: params.limit ?? 50,
            offset: params.offset ?? 0,
          }
        );
      } catch (err) {
        console.error("getJoinRequests error:", err);
        return {
          items: [],
          total: 0,
          limit: params.limit ?? 50,
          offset: params.offset ?? 0,
        };
      } finally {
        setLoadingState("list", false);
      }
    },
    []
  );

  const getMyInvites = useCallback(
    async (params = { limit: 50, offset: 0 }) => {
      setLoadingState("list", true);
      try {
        const res = await groupService.getMyInvites(params);
        return (
          res?.data?.data ?? {
            items: [],
            total: 0,
            limit: params.limit ?? 50,
            offset: params.offset ?? 0,
          }
        );
      } catch (err) {
        console.error("getMyInvites error:", err);
        return {
          items: [],
          total: 0,
          limit: params.limit ?? 50,
          offset: params.offset ?? 0,
        };
      } finally {
        setLoadingState("list", false);
      }
    },
    []
  );

  const approveJoin = useCallback(async (requestId, groupId) => {
    if (!requestId) return null;

    setLoadingState("action", true);
    try {
      const res = await groupService.approveJoin(requestId, groupId);
      return res?.data?.data;
    } finally {
      setLoadingState("action", false);
    }
  }, []);

  const rejectJoin = useCallback(async (requestId, groupId) => {
    if (!requestId) return null;

    setLoadingState("action", true);
    try {
      const res = await groupService.rejectJoin(requestId, groupId);
      return res?.data?.data;
    } finally {
      setLoadingState("action", false);
    }
  }, []);

  const checkJoinPending = useCallback(async (groupId) => {
    if (!groupId) return null;

    try {
      const res = await groupService.checkJoinPending(groupId);
      return res?.data?.data?.is_pending || false;
    } catch {
      return false;
    }
  }, []);

  const getAllGroups = useCallback(async (params = {}) => {
    setLoadingState("list", true);
    try {
      const res = await groupService.getAllGroups(params);
      return toArray(res?.data?.data);
    } finally {
      setLoadingState("list", false);
    }
  }, []);

  const countGroups = useCallback(async () => {
    setLoadingState("list", true);
    try {
      const res = await groupService.countGroups();
      return res?.data?.data;
    } finally {
      setLoadingState("list", false);
    }
  }, []);

  const inviteMember = useCallback(async (groupId, userId) => {
    if (!groupId || !userId) return null;

    setLoadingState("action", true);
    try {
      const res = await groupService.inviteMember(groupId, userId);
      return res?.data?.data;
    } finally {
      setLoadingState("action", false);
    }
  }, []);

  const getGroupMembers = useCallback(async (groupId, params = {}) => {
    if (!groupId) return [];

    setLoadingState("list", true);
    try {
      const res = await groupService.getGroupMembers(groupId, params);
      return toArray(res?.data?.data);
    } finally {
      setLoadingState("list", false);
    }
  }, []);

  const removeMember = useCallback(async (groupId, userId) => {
    if (!groupId || !userId) return null;

    setLoadingState("action", true);
    try {
      const res = await groupService.removeMember(groupId, userId);
      return res?.data?.data;
    } finally {
      setLoadingState("action", false);
    }
  }, []);

  const changeMemberRole = useCallback(async (groupId, userId, role) => {
    if (!groupId || !userId) return null;

    setLoadingState("action", true);
    try {
      const res = await groupService.changeMemberRole(groupId, userId, role);
      return res?.data?.data;
    } finally {
      setLoadingState("action", false);
    }
  }, []);

  const transferOwnership = useCallback(async (groupId, newOwnerId) => {
    if (!groupId || !newOwnerId) return null;

    setLoadingState("action", true);
    try {
      const res = await groupService.transferOwnership(groupId, newOwnerId);
      return res?.data?.data;
    } finally {
      setLoadingState("action", false);
    }
  }, []);

  /* ======================
   * LOGS
   * ====================== */
  const getActivityLogs = useCallback(async (groupId, params = {}) => {
    if (!groupId) return [];

    setLoadingState("list", true);
    try {
      const res = await groupService.getActivityLogs(groupId, params);
      return toArray(res?.data?.data);
    } finally {
      setLoadingState("list", false);
    }
  }, []);

  /* ======================
   * EXPORT
   * ====================== */
  return {
    loading,

    groups,
    currentGroup,

    loadUserGroups,
    loadOwnedGroups,
    loadGroup,
    findGroups,
    getGroupsNotJoined,

    createGroup,
    updateGroup,
    deleteGroup,
    updateAvatar,

    checkMembership,
    joinGroup,
    cancelJoin,
    leaveGroup,

    getJoinRequests,
    getMyInvites,
    approveJoin,
    rejectJoin,
    checkJoinPending,

    getAllGroups,
    countGroups,

    inviteMember,
    getGroupMembers,
    removeMember,
    changeMemberRole,
    transferOwnership,

    getActivityLogs,
  };
}
