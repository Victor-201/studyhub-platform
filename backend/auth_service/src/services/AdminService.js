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
   * Count accounts by status
   * @returns {Promise<Object>} Counts of accounts
   */
  async countAccounts() {
    const active = await this.userRepo.countByStatus("active");
    const blocked = await this.userRepo.countByStatus("blocked");
    const deleted = await this.userRepo.countByStatus("deleted");
    return { active, blocked, deleted };
  }

  /**
   * Lock a user account
   * @param {string} user_id - User ID
   * @param {string} admin_id - Admin performing the action
   * @returns {Promise<boolean>}
   */
  async lockUser(user_id, admin_id) {
    if (!user_id || !admin_id) throw new Error("Missing parameters");
    await this.userRepo.updateById(user_id, { status: "blocked" });
    await this.auditRepo.logAction({
      actor_user_id: admin_id,
      target_user_id: user_id,
      action: "LOCK_USER",
      created_at: new Date(),
    });
    return true;
  }

  /**
   * Unlock a user account
   * @param {string} user_id - User ID
   * @param {string} admin_id - Admin performing the action
   * @returns {Promise<boolean>}
   */
  async unlockUser(user_id, admin_id) {
    if (!user_id || !admin_id) throw new Error("Missing parameters");
    await this.userRepo.updateById(user_id, { status: "active" });
    await this.auditRepo.logAction({
      actor_user_id: admin_id,
      target_user_id: user_id,
      action: "UNLOCK_USER",
      created_at: new Date(),
    });
    return true;
  }

  /**
   * Block a user
   * @param {string} user_id - User ID
   * @param {string} reason - Reason for blocking
   * @param {string} admin_id - Admin performing the action
   * @returns {Promise<boolean>}
   */
  async blockUser(user_id, reason, admin_id) {
    if (!user_id || !reason || !admin_id) throw new Error("Missing parameters");
    await this.userBlockRepo.blockUser({
      id: crypto.randomUUID(),
      user_id,
      blocked_by: admin_id,
      reason,
      created_at: new Date(),
      is_permanent: false,
    });
    await this.auditRepo.logAction({
      actor_user_id: admin_id,
      target_user_id: user_id,
      action: "BLOCK_USER",
      created_at: new Date(),
    });
    return true;
  }

  /**
   * Soft-delete a user
   * @param {string} user_id - User ID
   * @param {string} admin_id - Admin performing the action
   * @param {string} reason - Reason for deletion
   * @returns {Promise<boolean>}
   */
  async softDelete(user_id, admin_id, reason) {
    if (!user_id || !admin_id || !reason) throw new Error("Missing parameters");
    await this.userDeletionRepo.softDelete({
      id: crypto.randomUUID(),
      user_id,
      deleted_by: admin_id,
      reason,
      created_at: new Date(),
    });
    await this.userRepo.updateById(user_id, { status: "deleted" });
    await this.auditRepo.logAction({
      actor_user_id: admin_id,
      target_user_id: user_id,
      action: "SOFT_DELETE_USER",
      created_at: new Date(),
    });
    return true;
  }

  /**
   * Restore a soft-deleted user
   * @param {string} user_id - User ID
   * @param {string} admin_id - Admin performing the action
   * @returns {Promise<boolean>}
   */
  async restoreUser(user_id, admin_id) {
    if (!user_id || !admin_id) throw new Error("Missing parameters");
    const deletions = await this.userDeletionRepo.findByUserId(user_id);
    for (const del of deletions) {
      await this.userDeletionRepo.updateById(del.id, {
        restored_at: new Date(),
        restored_by: admin_id,
      });
    }
    await this.userRepo.updateById(user_id, { status: "active" });
    await this.auditRepo.logAction({
      actor_user_id: admin_id,
      target_user_id: user_id,
      action: "RESTORE_USER",
      created_at: new Date(),
    });
    return true;
  }

  /**
   * Update a user's role
   * @param {string} user_id - User ID
   * @param {string} role_name - Role name
   * @param {string} admin_id - Admin performing the action
   * @returns {Promise<boolean>}
   */
  async updateRole(user_id, role_name, admin_id) {
    if (!user_id || !role_name || !admin_id)
      throw new Error("Missing parameters");
    const role = await this.roleRepo.findByName(role_name);
    if (!role) throw new Error("Role not found");
    await this.userRoleRepo.assignRole({
      id: crypto.randomUUID(),
      user_id,
      role_id: role.id,
      assigned_at: new Date(),
    });
    await this.auditRepo.logAction({
      actor_user_id: admin_id,
      target_user_id: user_id,
      action: "UPDATE_ROLE",
      created_at: new Date(),
    });
    return true;
  }

  /**
   * Add permission to a role
   * @param {string} role_name - Role name
   * @param {string} permission_name - Permission name
   * @returns {Promise<boolean>}
   */
  async addPermissionToRole(role_name, permission_name) {
    if (!role_name || !permission_name) throw new Error("Missing parameters");
    const role = await this.roleRepo.findByName(role_name);
    const permission = await this.permissionRepo.findByName(permission_name);
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
   * @param {string} actor_user_id
   * @returns {Promise<Array>}
   */
  async getAuditLogsByActor(actor_user_id) {
    if (!actor_user_id) throw new Error("actorUserId required");
    return this.auditRepo.findByActor(actor_user_id);
  }

  /**
   * Get audit logs by target user ID
   * @param {string} target_user_id
   * @returns {Promise<Array>}
   */
  async getAuditLogsByTarget(target_user_id) {
    if (!target_user_id) throw new Error("targetUserId required");
    return this.auditRepo.findByTarget(target_user_id);
  }

  /**
   * List all email templates
   * @returns {Promise<Array>}
   */
  async listEmailTemplates() {
    return this.emailTemplateRepo.findAll();
  }
}
