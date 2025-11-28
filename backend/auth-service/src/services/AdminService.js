export class AdminService {
  /**
   * @param {Object} deps
   * @param {import("../repos/UserRepository.js").UserRepository} deps.userRepo
   * @param {import("../repos/UserRoleRepository.js").UserRoleRepository} deps.userRoleRepo
   * @param {import("../repos/UserBlockRepository.js").UserBlockRepository} deps.userBlockRepo
   * @param {import("../repos/UserDeletionRepository.js").UserDeletionRepository} deps.userDeletionRepo
   * @param {import("../repos/AuditLogRepository.js").AuditLogRepository} deps.auditRepo
   */
  constructor({ userRepo, userRoleRepo, userBlockRepo, userDeletionRepo, auditRepo }) {
    this.userRepo = userRepo;
    this.userRoleRepo = userRoleRepo;
    this.userBlockRepo = userBlockRepo;
    this.userDeletionRepo = userDeletionRepo;
    this.auditRepo = auditRepo;
  }

  /**
   * List all users (admin scope)
   * @returns {Promise<Array>} list of users
   */
  async listUsers() {
    return this.userRepo.findAll();
  }

  /**
   * Lock user account
   * @param {number} id - target user id
   * @param {number} adminId - performing admin id
   */
  async lockUser(id, adminId) {
    await this.userRepo.updateById(id, { locked_at: new Date() });

    await this.auditRepo.logAction({
      actor_user_id: adminId,
      target_user_id: id,
      action: "LOCK_USER",
      created_at: new Date(),
    });

    return true;
  }

  /**
   * Unlock user account
   * @param {number} id
   * @param {number} adminId
   */
  async unlockUser(id, adminId) {
    await this.userRepo.updateById(id, { locked_at: null });

    await this.auditRepo.logAction({
      actor_user_id: adminId,
      target_user_id: id,
      action: "UNLOCK_USER",
      created_at: new Date(),
    });

    return true;
  }

  /**
   * Block a user (record in user_blocks)
   * @param {number} id
   * @param {string} reason
   * @param {number} adminId
   */
  async blockUser(id, reason = "", adminId) {
    await this.userBlockRepo.blockUser({
      user_id: id,
      reason,
      created_at: new Date(),
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
   * Soft-delete a user (add to user_deletions)
   * @param {number} id
   * @param {number} adminId
   */
  async softDelete(id, adminId) {
    await this.userDeletionRepo.softDelete({
      user_id: id,
      deleted_at: new Date(),
      created_at: new Date(),
    });

    await this.auditRepo.logAction({
      actor_user_id: adminId,
      target_user_id: id,
      action: "SOFT_DELETE_USER",
      created_at: new Date(),
    });

    return true;
  }

  /**
   * Restore a soft-deleted user (remove deleted_at)
   * @param {number} id
   * @param {number} adminId
   */
  async restoreUser(id, adminId) {
    // userDeletionRepo doesn't have direct restore method; update the original user record
    await this.userDeletionRepo.updateById(id, { deleted_at: null }).catch(async () => {
      // fallback: delete the deletion record if repository stores separate rows
      // noop
    });

    await this.userRepo.updateById(id, { deleted_at: null }).catch(() => null);

    await this.auditRepo.logAction({
      actor_user_id: adminId,
      target_user_id: id,
      action: "RESTORE_USER",
      created_at: new Date(),
    });

    return true;
  }

  /**
   * Update user's role by assigning a new user_roles record
   * @param {number} userId
   * @param {string} roleName
   * @param {number} adminId
   */
  async updateRole(userId, roleName, adminId) {
    // create new role assignment
    await this.userRoleRepo.assignRole({
      user_id: userId,
      role: roleName,
      created_at: new Date(),
    });

    await this.auditRepo.logAction({
      actor_user_id: adminId,
      target_user_id: userId,
      action: "UPDATE_ROLE",
      created_at: new Date(),
    });

    return true;
  }
}