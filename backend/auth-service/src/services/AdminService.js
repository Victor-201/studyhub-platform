import crypto from "crypto";

export class AdminService {
  /**
   * @param {Object} deps - Dependency injection
   * @param {import("../repos/UserRepository.js").UserRepository} deps.userRepo
   * @param {import("../repos/UserRoleRepository.js").UserRoleRepository} deps.userRoleRepo
   * @param {import("../repos/UserBlockRepository.js").UserBlockRepository} deps.userBlockRepo
   * @param {import("../repos/UserDeletionRepository.js").UserDeletionRepository} deps.userDeletionRepo
   * @param {import("../repos/AuditLogRepository.js").AuditLogRepository} deps.auditRepo
   * @param {import("../repos/RoleRepository.js").RoleRepository} deps.roleRepo
   * @param {import("../repos/RolePermissionRepository.js").RolePermissionRepository} deps.rolePermissionRepo
   * @param {import("../repos/PermissionRepository.js").PermissionRepository} deps.permissionRepo
   * @param {import("../repos/UserEmailRepository.js").UserEmailRepository} deps.userEmailRepo
   * @param {import("../repos/EmailTemplateRepository.js").EmailTemplateRepository} deps.emailTemplateRepo
   */
  constructor({
    userRepo,
    userRoleRepo,
    userBlockRepo,
    userDeletionRepo,
    auditRepo,
    roleRepo,
    rolePermissionRepo,
    permissionRepo,
    userEmailRepo,
    emailTemplateRepo,
  }) {
    this.userRepo = userRepo;
    this.userRoleRepo = userRoleRepo;
    this.userBlockRepo = userBlockRepo;
    this.userDeletionRepo = userDeletionRepo;
    this.auditRepo = auditRepo;
    this.roleRepo = roleRepo;
    this.rolePermissionRepo = rolePermissionRepo;
    this.permissionRepo = permissionRepo;
    this.userEmailRepo = userEmailRepo;
    this.emailTemplateRepo = emailTemplateRepo;
  }

  /**
   * List all users
   * @returns {Promise<Array>} List of users
   */
  async listUsers() {
    return this.userRepo.findAll();
  }

  /**
   * Lock a user account
   * @param {string} id - User ID
   * @param {string} adminId - Admin performing the action
   * @returns {Promise<boolean>}
   */
  async lockUser(id, adminId) {
    if (!id || !adminId) throw new Error("Missing parameters");
    await this.userRepo.updateById(id, { status: "blocked" });
    await this.auditRepo.logAction({
      actor_user_id: adminId,
      target_user_id: id,
      action: "LOCK_USER",
      created_at: new Date(),
    });
    return true;
  }

  /**
   * Unlock a user account
   * @param {string} id - User ID
   * @param {string} adminId - Admin performing the action
   * @returns {Promise<boolean>}
   */
  async unlockUser(id, adminId) {
    if (!id || !adminId) throw new Error("Missing parameters");
    await this.userRepo.updateById(id, { status: "active" });
    await this.auditRepo.logAction({
      actor_user_id: adminId,
      target_user_id: id,
      action: "UNLOCK_USER",
      created_at: new Date(),
    });
    return true;
  }

  /**
   * Block a user
   * @param {string} id - User ID
   * @param {string} reason - Reason for blocking
   * @param {string} adminId - Admin performing the action
   * @returns {Promise<boolean>}
   */
  async blockUser(id, reason, adminId) {
    if (!id || !reason || !adminId) throw new Error("Missing parameters");
    await this.userBlockRepo.blockUser({
      id: crypto.randomUUID(),
      user_id: id,
      blocked_by: adminId,
      reason,
      created_at: new Date(),
      is_permanent: false,
    });
    await this.auditRepo.logAction({
      actor_user_id: adminId,
      target_user_id: id,
      action: "BLOCK_USER",
      created_at: new Date(),
    });
    return true;
  }

  /**
   * Soft-delete a user
   * @param {string} id - User ID
   * @param {string} adminId - Admin performing the action
   * @param {string} reason - Reason for deletion
   * @returns {Promise<boolean>}
   */
  async softDelete(id, adminId, reason) {
    if (!id || !adminId || !reason) throw new Error("Missing parameters");
    await this.userDeletionRepo.softDelete({
      id: crypto.randomUUID(),
      user_id: id,
      deleted_by: adminId,
      reason,
      created_at: new Date(),
    });
    await this.userRepo.updateById(id, { status: "deleted" });
    await this.auditRepo.logAction({
      actor_user_id: adminId,
      target_user_id: id,
      action: "SOFT_DELETE_USER",
      created_at: new Date(),
    });
    return true;
  }

  /**
   * Restore a soft-deleted user
   * @param {string} id - User ID
   * @param {string} adminId - Admin performing the action
   * @returns {Promise<boolean>}
   */
  async restoreUser(id, adminId) {
    if (!id || !adminId) throw new Error("Missing parameters");
    const deletions = await this.userDeletionRepo.findByUserId(id);
    for (const del of deletions) {
      await this.userDeletionRepo.updateById(del.id, {
        restored_at: new Date(),
        restored_by: adminId,
      });
    }
    await this.userRepo.updateById(id, { status: "active" });
    await this.auditRepo.logAction({
      actor_user_id: adminId,
      target_user_id: id,
      action: "RESTORE_USER",
      created_at: new Date(),
    });
    return true;
  }

  /**
   * Update a user's role
   * @param {string} userId - User ID
   * @param {string} roleName - Role name
   * @param {string} adminId - Admin performing the action
   * @returns {Promise<boolean>}
   */
  async updateRole(userId, roleName, adminId) {
    if (!userId || !roleName || !adminId) throw new Error("Missing parameters");
    const role = await this.roleRepo.findByName(roleName);
    if (!role) throw new Error("Role not found");
    await this.userRoleRepo.assignRole({
      id: crypto.randomUUID(),
      user_id: userId,
      role_id: role.id,
      assigned_at: new Date(),
    });
    await this.auditRepo.logAction({
      actor_user_id: adminId,
      target_user_id: userId,
      action: "UPDATE_ROLE",
      created_at: new Date(),
    });
    return true;
  }

  /**
   * Add permission to a role
   * @param {string} roleName - Role name
   * @param {string} permissionName - Permission name
   * @returns {Promise<boolean>}
   */
  async addPermissionToRole(roleName, permissionName) {
    if (!roleName || !permissionName) throw new Error("Missing parameters");
    const role = await this.roleRepo.findByName(roleName);
    const permission = await this.permissionRepo.findByName(permissionName);
    if (!role || !permission) throw new Error("Role or Permission not found");
    await this.rolePermissionRepo.assignPermission({
      id: crypto.randomUUID(),
      role_id: role.id,
      permission_id: permission.id,
      assigned_at: new Date(),
    });
    return true;
  }

  /**
   * List all audit logs
   * @returns {Promise<Array>}
   */
  async getAuditLogs() {
    return this.auditRepo.findAll();
  }

  /**
   * Get audit logs by actor user ID
   * @param {string} actorUserId
   * @returns {Promise<Array>}
   */
  async getAuditLogsByActor(actorUserId) {
    if (!actorUserId) throw new Error("actorUserId required");
    return this.auditRepo.findByActor(actorUserId);
  }

  /**
   * Get audit logs by target user ID
   * @param {string} targetUserId
   * @returns {Promise<Array>}
   */
  async getAuditLogsByTarget(targetUserId) {
    if (!targetUserId) throw new Error("targetUserId required");
    return this.auditRepo.findByTarget(targetUserId);
  }

  /**
   * List all email templates
   * @returns {Promise<Array>}
   */
  async listEmailTemplates() {
    return this.emailTemplateRepo.findAll();
  }
}
