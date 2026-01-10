import { useContext, useCallback } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import authService from "@/services/authService";

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");

  // ===== User API =====
  const getProfile = useCallback(() => authService.getUserProfile(), []);
  const updateProfile = useCallback(
    (data) => authService.updateUserProfile(data),
    []
  );
  const listEmails = useCallback(() => authService.listUserEmails(), []);
  const addEmail = useCallback((email) => authService.addUserEmail(email), []);
  const setPrimaryEmail = useCallback(
    (emailId) => authService.setPrimaryUserEmail(emailId),
    []
  );

  // ===== Admin API =====
  const countAccounts = useCallback(() => authService.countAccounts(), []);
  const listUsers = useCallback(() => authService.listUsers(), []);
  const lockUser = useCallback((id) => authService.lockUser(id), []);
  const unlockUser = useCallback((id) => authService.unlockUser(id), []);
  const checkIfUserBlocked = useCallback(
    (id) => authService.isUserBlocked(id),
    []
  );

  const blockUser = useCallback((id, reason, duration = null) => {
    if (duration) {
      return authService.temporaryBlockUser(id, reason, duration);
    }
    return authService.permanentBlockUser(id, reason);
  }, []);
  const unblockUser = useCallback((id) => authService.unblockUser(id), []);
  const softDeleteUser = useCallback(
    (id, reason) => authService.softDeleteUser(id, reason),
    []
  );
  const restoreUser = useCallback((id) => authService.restoreUser(id), []);
  const updateUserRole = useCallback(
    (id, role_name) => authService.updateUserRole(id, role_name),
    []
  );
  const getAuditLogs = useCallback(() => authService.getAuditLogs(), []);
  const getAuditLogsByActor = useCallback(
    (id) => authService.getAuditLogsByActor(id),
    []
  );
  const getAuditLogsByTarget = useCallback(
    (id) => authService.getAuditLogsByTarget(id),
    []
  );

  return {
    ...ctx,
    getProfile,
    updateProfile,
    listEmails,
    addEmail,
    setPrimaryEmail,
    countAccounts,
    listUsers,
    lockUser,
    unlockUser,
    checkIfUserBlocked,
    blockUser,
    unblockUser,
    softDeleteUser,
    restoreUser,
    updateUserRole,
    getAuditLogs,
    getAuditLogsByActor,
    getAuditLogsByTarget,
  };
};

export default useAuth;
