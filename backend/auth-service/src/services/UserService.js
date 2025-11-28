export class UserService {
  /**
   * @param {Object} deps
   * @param {import("../repos/UserRepository.js").UserRepository} deps.userRepo
   * @param {import("../repos/UserEmailRepository.js").UserEmailRepository} deps.userEmailRepo
   * @param {import("../repos/AuditLogRepository.js").AuditLogRepository} deps.auditRepo
   */
  constructor({ userRepo, userEmailRepo, auditRepo }) {
    this.userRepo = userRepo;
    this.userEmailRepo = userEmailRepo;
    this.auditRepo = auditRepo;
  }

  /**
   * Get user profile by id
   * @param {number} id
   * @returns {Promise<Object|null>}
   */
  async getProfile(id) {
    return this.userRepo.findById(id);
  }

  /**
   * Update user profile fields (only allowed fields)
   * @param {number} id
   * @param {Object} fields
   * @returns {Promise<Object>} updated user
   */
  async updateProfile(id, fields) {
    // Only allow certain fields to be updated
    const allowed = ["name", "bio", "avatar_url"];
    const payload = {};
    for (const k of allowed) if (k in fields) payload[k] = fields[k];

    await this.userRepo.updateById(id, payload);
    const updated = await this.userRepo.findById(id);

    await this.auditRepo.logAction({
      actor_user_id: id,
      action: "UPDATE_PROFILE",
      created_at: new Date(),
    });

    return updated;
  }

  /**
   * List user emails
   * @param {number} userId
   * @returns {Promise<Array>} list of UserEmail instances
   */
  async listEmails(userId) {
    return this.userEmailRepo.getUserEmails(userId);
  }

  /**
   * Add an email to a user
   * @param {number} userId
   * @param {string} email
   * @returns {Promise<Object>} created UserEmail
   */
  async addEmail(userId, email) {
    const existing = await this.userEmailRepo.findByEmail(email);
    if (existing) throw new Error("Email already in use");

    const row = await this.userEmailRepo.create({
      user_id: userId,
      email,
      is_primary: 0,
      created_at: new Date(),
    });

    await this.auditRepo.logAction({
      actor_user_id: userId,
      action: "ADD_EMAIL",
      target_user_id: userId,
      created_at: new Date(),
    });

    return row;
  }

  /**
   * Mark one of user's emails as primary
   * @param {number} userId
   * @param {number} emailId
   * @returns {Promise<Object>} updated email
   */
  async setPrimaryEmail(userId, emailId) {
    // markPrimary handles setting others to non-primary
    const updated = await this.userEmailRepo.markPrimary(emailId, userId);

    await this.auditRepo.logAction({
      actor_user_id: userId,
      action: "SET_PRIMARY_EMAIL",
      target_user_id: userId,
      created_at: new Date(),
    });

    return updated;
  }
}
