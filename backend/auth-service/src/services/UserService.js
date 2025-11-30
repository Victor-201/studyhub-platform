import { v4 as uuidv4 } from "uuid";

export class UserService {
  /**
   * @param {Object} deps
   * @param {import("../repos/UserRepository.js").UserRepository} deps.userRepo
   * @param {import("../repos/UserEmailRepository.js").UserEmailRepository} deps.userEmailRepo
   * @param {import("../repos/AuditLogRepository.js").AuditLogRepository} deps.auditRepo
   * @param {import("../repos/UserRoleRepository.js").UserRoleRepository} deps.userRoleRepo
   * @param {import("../repos/RoleRepository.js").RoleRepository} deps.roleRepo
   * @param {import("../repos/RolePermissionRepository.js").RolePermissionRepository} deps.rolePermissionRepo
   * @param {import("../repos/PermissionRepository.js").PermissionRepository} deps.permissionRepo
   */
  constructor({ userRepo, userEmailRepo, auditRepo, userRoleRepo, roleRepo, rolePermissionRepo, permissionRepo }) {
    this.userRepo = userRepo;
    this.userEmailRepo = userEmailRepo;
    this.auditRepo = auditRepo;
    this.userRoleRepo = userRoleRepo;
    this.roleRepo = roleRepo;
    this.rolePermissionRepo = rolePermissionRepo;
    this.permissionRepo = permissionRepo;
  }

  /**
   * Get user profile by ID
   * @param {string} userId
   * @returns {Promise<Object|null>}
   */
  async getProfile(userId) {
    if (!userId) throw new Error("userId required");
    return this.userRepo.findById(userId);
  }

  /**
   * Update user profile fields (allowed only)
   * @param {string} userId
   * @param {Object} fields
   * @returns {Promise<Object>} updated user
   */
  async updateProfile(userId, fields) {
    if (!userId) throw new Error("userId required");
    const allowed = ["userName", "bio", "avatarUrl"];
    const payload = {};
    for (const key of allowed) if (key in fields) payload[key] = fields[key];

    await this.userRepo.updateById(userId, payload);
    const updated = await this.userRepo.findById(userId);

    await this.auditRepo.logAction({ actor_user_id: userId, action: "UPDATE_PROFILE", target_user_id: userId, created_at: new Date() });
    return updated;
  }

  /**
   * List all emails of a user
   * @param {string} userId
   * @returns {Promise<Array>}
   */
  async listEmails(userId) {
    if (!userId) throw new Error("userId required");
    return this.userEmailRepo.getUserEmails(userId);
  }

  /**
   * Add a secondary email to user
   * @param {string} userId
   * @param {string} email
   * @returns {Promise<Object>} created email record
   */
  async addEmail(userId, email) {
    if (!userId || !email) throw new Error("Missing parameters");

    const existing = await this.userEmailRepo.findByEmail(email);
    if (existing) throw new Error("Email already in use");

    const createdEmail = await this.userEmailRepo.create({
      id: uuidv4(),
      user_id: userId,
      email,
      type: "secondary",
      is_verified: 0,
      created_at: new Date(),
    });

    await this.auditRepo.logAction({ actor_user_id: userId, action: "ADD_EMAIL", target_user_id: userId, created_at: new Date() });
    return createdEmail;
  }

  /**
   * Set one email as primary
   * @param {string} userId
   * @param {string} emailId
   * @returns {Promise<Object>} updated email
   */
  async setPrimaryEmail(userId, emailId) {
    if (!userId || !emailId) throw new Error("Missing parameters");

    const updated = await this.userEmailRepo.markPrimary(emailId, userId);
    await this.auditRepo.logAction({ actor_user_id: userId, action: "SET_PRIMARY_EMAIL", target_user_id: userId, created_at: new Date() });
    return updated;
  }

  /**
   * List roles and permissions for a user
   * @param {string} userId
   * @returns {Promise<Array>} Array of roles with permissions
   */
  async listRolesAndPermissions(userId) {
    if (!userId) throw new Error("userId required");

    const userRoles = await this.userRoleRepo.findByUserId(userId);
    const result = [];

    for (const ur of userRoles) {
      const role = await this.roleRepo.findById(ur.role_id);
      if (!role) continue;

      const rolePerms = await this.rolePermissionRepo.findByRoleId(role.id);
      const permissions = [];
      for (const rp of rolePerms) {
        const perm = await this.permissionRepo.findById(rp.permission_id);
        if (perm) permissions.push(perm.name);
      }

      result.push({ role: role.name, permissions });
    }

    return result;
  }
}
