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
  async getProfile(user_id) {
    if (!user_id) throw new Error("userId required");
    return this.userRepo.findById(user_id);
  }

  /**
   * Update user profile fields (allowed only)
   * @param {string} userId
   * @param {Object} fields
   * @returns {Promise<Object>} updated user
   */
  async updateProfile(user_id, fields) {
    if (!user_id) throw new Error("userId required");
    const allowed = ["userName", "bio", "avatarUrl"];
    const payload = {};
    for (const key of allowed) if (key in fields) payload[key] = fields[key];

    await this.userRepo.updateById(user_id, payload);
    const updated_user = await this.userRepo.findById(user_id);

    await this.auditRepo.logAction({ actor_user_id: user_id, action: "UPDATE_PROFILE", target_user_id: user_id, created_at: new Date() });
    return updated_user;
  }

  /**
   * List all emails of a user
   * @param {string} userId
   * @returns {Promise<Array>}
   */
  async listEmails(user_id) {
    if (!user_id) throw new Error("userId required");
    return this.userEmailRepo.getUserEmails(user_id);
  }

  /**
   * Add a secondary email to user
   * @param {string} userId
   * @param {string} email
   * @returns {Promise<Object>} created email record
   */
  async addEmail(user_id, email) {
    if (!user_id || !email) throw new Error("Missing parameters");

    const existing_email = await this.userEmailRepo.findByEmail(email);
    if (existing_email) throw new Error("Email already in use");

    const created_email = await this.userEmailRepo.create({
      id: uuidv4(),
      user_id,
      email,
      type: "secondary",
      is_verified: 0,
      created_at: new Date(),
    });

    await this.auditRepo.logAction({ actor_user_id: user_id, action: "ADD_EMAIL", target_user_id: user_id, created_at: new Date() });
    return created_email;
  }

  /**
   * Set one email as primary
   * @param {string} userId
   * @param {string} emailId
   * @returns {Promise<Object>} updated email
   */
  async setPrimaryEmail(user_id, email_id) {
    if (!user_id || !email_id) throw new Error("Missing parameters");

    const updated_email = await this.userEmailRepo.markPrimary(email_id, user_id);
    await this.auditRepo.logAction({ actor_user_id: user_id, action: "SET_PRIMARY_EMAIL", target_user_id: user_id, created_at: new Date() });
    return updated_email;
  }

  /**
   * List roles and permissions for a user
   * @param {string} userId
   * @returns {Promise<Array>} Array of roles with permissions
   */
  async listRolesAndPermissions(user_id) {
    if (!user_id) throw new Error("userId required");

    const user_roles = await this.userRoleRepo.findByUserId(user_id);
    const result = [];

    for (const ur of user_roles) {
      const role = await this.roleRepo.findById(ur.role_id);
      if (!role) continue;

      const role_perms = await this.rolePermissionRepo.findByRoleId(role.id);
      const permissions = [];
      for (const rp of role_perms) {
        const perm = await this.permissionRepo.findById(rp.permission_id);
        if (perm) permissions.push(perm.name);
      }

      result.push({ role: role.name, permissions });
    }

    return result;
  }
}
