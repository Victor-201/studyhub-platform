import { v4 as uuidv4 } from "uuid";
import crypto from "crypto";
import bcrypt from "bcrypt";
import { signAccessToken, signRefreshToken } from "../utils/jwt.js";
import { createTokenHash } from "../utils/tokenHash.js";

export class AuthService {
  /**
   * @param {Object} deps - Dependency injection
   * @param {import("../repos/UserRepository.js").UserRepository} deps.userRepo
   * @param {import("../repos/UserEmailRepository.js").UserEmailRepository} deps.userEmailRepo
   * @param {import("../repos/SessionRepository.js").SessionRepository} deps.sessionRepo
   * @param {import("../repos/PasswordResetRepository.js").PasswordResetRepository} deps.passwordResetRepo
   * @param {import("../repos/EmailVerificationRepository.js").EmailVerificationRepository} deps.emailVerificationRepo
   * @param {import("../repos/AuditLogRepository.js").AuditLogRepository} deps.auditRepo
   * @param {import("../repos/UserRoleRepository.js").UserRoleRepository} deps.userRoleRepo
   * @param {import("../repos/RoleRepository.js").RoleRepository} deps.roleRepo
   * @param {import("../services/EmailService.js").EmailService} deps.emailService
   */
  constructor({
    userRepo,
    userEmailRepo,
    sessionRepo,
    passwordResetRepo,
    emailVerificationRepo,
    auditRepo,
    userRoleRepo,
    roleRepo,
    emailService,
  }) {
    this.emailService = emailService;
    this.userRepo = userRepo;
    this.userEmailRepo = userEmailRepo;
    this.sessionRepo = sessionRepo;
    this.passwordResetRepo = passwordResetRepo;
    this.emailVerificationRepo = emailVerificationRepo;
    this.auditRepo = auditRepo;
    this.userRoleRepo = userRoleRepo;
    this.roleRepo = roleRepo;
    this.SALT_ROUNDS = 10;
  }

  /**
   * Register a new user and send verification email
   * @param {Object} payload
   * @param {string} payload.user_name
   * @param {string} payload.email
   * @param {string} payload.password
   * @param {string} [payload.user_agent]
   * @param {string} [payload.ip]
   * @returns {Promise<{user:Object, verification_token:string}>}
   */
  async register({ user_name, email, password, user_agent = null, ip = null }) {
    if (!user_name || !email || !password)
      throw new Error("Username, email and password are required");

    const existingUser = await this.userRepo.findByUserName(user_name);
    if (existingUser) throw new Error("Username already exists");

    const existingEmail = await this.userEmailRepo.findByEmail(email);
    if (existingEmail) throw new Error("Email already exists");

    const hashed_password = await bcrypt.hash(password, this.SALT_ROUNDS);

    const newUser = await this.userRepo.create({
      id: uuidv4(),
      user_name,
      password_hash: hashed_password,
      status: "active",
      created_at: new Date(),
    });

    const userEmail = await this.userEmailRepo.create({
      id: uuidv4(),
      user_id: newUser.id,
      email,
      type: "primary",
      is_verified: 0,
      created_at: new Date(),
    });

    const token = crypto.randomBytes(32).toString("hex");
    await this.emailVerificationRepo.create({
      id: uuidv4(),
      user_email_id: userEmail.id,
      token_hash: createTokenHash(token),
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000),
      ip,
      user_agent,
      created_at: new Date(),
    });

    await this.emailService.sendEmail({
      to: email,
      subject: "Verify your StudyHub account",
      html: `<p>Hello ${user_name},</p>
             <p>Please verify your email by clicking the link below:</p>
             <a href="${process.env.FRONTEND_URL}/verify-email?token=${token}">Verify Email</a>
             <p>This link will expire in 24 hours.</p>`,
      from: "StudyHub <no-reply@studyhub.com>",
    });

    const defaultRole = await this.roleRepo.findByName("user");
    if (defaultRole) {
      await this.userRoleRepo.assignRole({
        id: uuidv4(),
        user_id: newUser.id,
        role_id: defaultRole.id,
        assigned_at: new Date(),
      });
    }

    await this.auditRepo.logAction({
      id: uuidv4(),
      actor_user_id: newUser.id,
      action: "REGISTER",
      created_at: new Date(),
    });

    return { user: newUser, verification_token: token };
  }

  /**
   * Verify email token
   * @param {string} token
   * @returns {Promise<boolean>}
   */
  async verifyEmail(token) {
    if (!token) throw new Error("Token required");

    const token_hash = createTokenHash(token);
    const verification = await this.emailVerificationRepo.findByHash(token_hash);
    if (!verification) throw new Error("Invalid token");
    if (verification.used_at) throw new Error("Token already used");
    if (new Date() > verification.expires_at) throw new Error("Token expired");

    await this.userEmailRepo.updateById(verification.user_email_id, {
      is_verified: 1,
    });
    await this.emailVerificationRepo.markUsed(verification.id);

    const userEmail = await this.userEmailRepo.findById(verification.user_email_id);
    await this.auditRepo.logAction({
      id: uuidv4(),
      actor_user_id: userEmail.user_id,
      action: "EMAIL_VERIFIED",
      created_at: new Date(),
    });

    return true;
  }

  /**
   * Login user using email or username
   * @param {Object} payload
   * @param {string} [payload.email]
   * @param {string} [payload.user_name]
   * @param {string} payload.password
   * @param {string} [payload.user_agent]
   * @param {string} [payload.ip]
   * @returns {Promise<{user:Object, access_token:string, refresh_token:string}>}
   */
  async login({ email, user_name, password, user_agent = null, ip = null }) {
    if ((!email && !user_name) || !password)
      throw new Error("Email or username and password required");

    let user;
    let emailRow;

    if (email) {
      emailRow = await this.userEmailRepo.findByEmail(email);
      if (!emailRow) throw new Error("Invalid credentials");
      if (emailRow.is_verified === 0) throw new Error("Email not verified");

      user = await this.userRepo.findById(emailRow.user_id);
      if (!user) throw new Error("Invalid credentials");
    } else {
      user = await this.userRepo.findByUserName(user_name);
      if (!user) throw new Error("Invalid credentials");
      const emails = await this.userEmailRepo.getUserEmails(user.id);
      emailRow = emails.find((e) => e.is_verified === 1);
      if (!emailRow) throw new Error("Email not verified");
    }

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) throw new Error("Invalid credentials");

    const access_token = signAccessToken({ id: user.id, name: user.user_name });
    const refresh_token = signRefreshToken({ id: user.id });

    await this.sessionRepo.create({
      id: uuidv4(),
      user_id: user.id,
      refresh_token_hash: createTokenHash(refresh_token),
      created_at: new Date(),
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      ip,
      user_agent,
    });

    await this.auditRepo.logAction({
      id: uuidv4(),
      actor_user_id: user.id,
      action: "LOGIN",
      created_at: new Date(),
    });

    return { user, access_token, refresh_token };
  }

  /**
   * Refresh access token
   * @param {string} refresh_token
   * @returns {Promise<{access_token:string}>}
   */
  async refreshToken(refresh_token) {
    if (!refresh_token) throw new Error("Refresh token required");

    const token_hash = createTokenHash(refresh_token);
    const session = await this.sessionRepo.findByRefreshTokenHash(token_hash);
    if (!session) throw new Error("Invalid refresh token");
    if (session.revoked_at) throw new Error("Refresh token revoked");

    const user = await this.userRepo.findById(session.user_id);
    if (!user) throw new Error("User not found");

    const access_token = signAccessToken({ id: user.id, name: user.user_name });
    await this.auditRepo.logAction({
      id: uuidv4(),
      actor_user_id: user.id,
      action: "REFRESH_TOKEN",
      created_at: new Date(),
    });

    return { access_token };
  }

  /**
   * Change user password
   * @param {string} user_id
   * @param {string} old_password
   * @param {string} new_password
   * @returns {Promise<boolean>}
   */
  async changePassword(user_id, old_password, new_password) {
    if (!user_id || !old_password || !new_password)
      throw new Error("Missing parameters");

    const user = await this.userRepo.findById(user_id);
    if (!user) throw new Error("User not found");

    const match = await bcrypt.compare(old_password, user.password_hash);
    if (!match) throw new Error("Old password incorrect");

    const hashed = await bcrypt.hash(new_password, this.SALT_ROUNDS);
    await this.userRepo.updateById(user_id, { password_hash: hashed });
    await this.auditRepo.logAction({
      id: uuidv4(),
      actor_user_id: user_id,
      action: "CHANGE_PASSWORD",
      created_at: new Date(),
    });

    return true;
  }

  /**
   * Request password reset token
   * @param {string} email
   * @param {string} [user_agent]
   * @param {string} [ip]
   * @returns {Promise<string|null>} Password reset token
   */
  async forgotPassword(email, user_agent = null, ip = null) {
    if (!email) throw new Error("Email required");

    const emailRow = await this.userEmailRepo.findByEmail(email);
    if (!emailRow) return null;

    const token = crypto.randomBytes(32).toString("hex");
    await this.passwordResetRepo.create({
      id: uuidv4(),
      user_id: emailRow.user_id,
      token_hash: createTokenHash(token),
      expires_at: new Date(Date.now() + 60 * 60 * 1000),
      ip,
      user_agent,
      created_at: new Date(),
    });

    await this.emailService.sendEmail({
      to: email,
      subject: "Reset your StudyHub password",
      html: `<p>Hello,</p>
             <p>You requested a password reset. Click the link below:</p>
             <a href="${process.env.FRONTEND_URL}/reset-password?token=${token}">Reset Password</a>
             <p>This link will expire in 1 hour.</p>`,
      from: "StudyHub <no-reply@studyhub.com>",
    });

    await this.auditRepo.logAction({
      id: uuidv4(),
      actor_user_id: emailRow.user_id,
      action: "FORGOT_PASSWORD_REQUEST",
      created_at: new Date(),
    });

    return token;
  }

  /**
   * Reset password using token
   * @param {string} token
   * @param {string} new_password
   * @returns {Promise<boolean>}
   */
  async resetPassword(token, new_password) {
    if (!token || !new_password) throw new Error("Missing parameters");

    const token_hash = createTokenHash(token);
    const resetRow = await this.passwordResetRepo.findByHash(token_hash);
    if (!resetRow || resetRow.used_at) throw new Error("Invalid or used token");

    const hashed = await bcrypt.hash(new_password, this.SALT_ROUNDS);
    await this.userRepo.updateById(resetRow.user_id, { password_hash: hashed });
    await this.passwordResetRepo.markUsed(resetRow.id);
    await this.auditRepo.logAction({
      id: uuidv4(),
      actor_user_id: resetRow.user_id,
      action: "RESET_PASSWORD",
      created_at: new Date(),
    });

    return true;
  }

  /**
   * Get current user by ID
   * @param {string} user_id
   * @returns {Promise<Object>}
   */
  async getMe(user_id) {
    return this.userRepo.findById(user_id);
  }
}
