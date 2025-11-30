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
   * @param {string} payload.userName
   * @param {string} payload.email
   * @param {string} payload.password
   * @param {string} [payload.userAgent]
   * @param {string} [payload.ip]
   * @returns {Promise<{user:Object, verificationToken:string}>}
   */
  async register({ userName, email, password, userAgent = null, ip = null }) {
    if (!userName || !email || !password)
      throw new Error("Username, email and password are required");

    const existingUser = await this.userRepo.findByUserName(userName);
    if (existingUser) throw new Error("Username already exists");

    const existingEmail = await this.userEmailRepo.findByEmail(email);
    if (existingEmail) throw new Error("Email already exists");

    const hashedPassword = await bcrypt.hash(password, this.SALT_ROUNDS);

    const newUser = await this.userRepo.create({
      id: uuidv4(),
      user_name: userName,
      password_hash: hashedPassword,
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
      user_agent: userAgent,
      created_at: new Date(),
    });

    await this.emailService.sendEmail({
      to: email,
      subject: "Verify your StudyHub account",
      html: `<p>Hello ${userName},</p>
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

    return { user: newUser, verificationToken: token };
  }
  /**
   * Verify email token
   * @param {string} token
   * @returns {Promise<boolean>}
   */
  async verifyEmail(token) {
    if (!token) throw new Error("Token required");

    const tokenHash = createTokenHash(token);
    const verification = await this.emailVerificationRepo.findByHash(tokenHash);
    if (!verification) throw new Error("Invalid token");
    if (verification.usedAt) throw new Error("Token already used");
    if (new Date() > verification.expiresAt) throw new Error("Token expired");

    await this.userEmailRepo.updateById(verification.userEmailId, {
      is_verified: 1,
    });
    await this.emailVerificationRepo.markUsed(verification.id);

    const userEmail = await this.userEmailRepo.findById(
      verification.userEmailId
    );
    await this.auditRepo.logAction({
      id: uuidv4(),
      actor_user_id: userEmail.userId,
      action: "EMAIL_VERIFIED",
      created_at: new Date(),
    });

    return true;
  }

  /**
   * Login user using email or username
   * @param {Object} payload
   * @param {string} [payload.email]
   * @param {string} [payload.userName]
   * @param {string} payload.password
   * @param {string} [payload.userAgent]
   * @param {string} [payload.ip]
   * @returns {Promise<{user:Object, accessToken:string, refreshToken:string}>}
   */
  async login({ email, userName, password, userAgent = null, ip = null }) {
    if ((!email && !userName) || !password)
      throw new Error("Email or username and password required");

    let user;
    let emailRow;

    if (email) {
      emailRow = await this.userEmailRepo.findByEmail(email);
      if (!emailRow) throw new Error("Invalid credentials");
      if (emailRow.isVerified === 0) throw new Error("Email not verified");

      user = await this.userRepo.findById(emailRow.userId);
      if (!user) throw new Error("Invalid credentials");
    } else {
      user = await this.userRepo.findByUserName(userName);
      if (!user) throw new Error("Invalid credentials");
      const emails = await this.userEmailRepo.getUserEmails(user.id);
      emailRow = emails.find((e) => e.isVerified === 1);
      if (!emailRow) throw new Error("Email not verified");
    }

    console.log("User found:", user.id, user.userName, user.status);

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) throw new Error("Invalid credentials");

    const accessToken = signAccessToken({ id: user.id, name: user.userName });
    const refreshToken = signRefreshToken({ id: user.id });

    await this.sessionRepo.create({
      id: uuidv4(),
      user_id: user.id,
      refresh_token_hash: createTokenHash(refreshToken),
      created_at: new Date(),
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      ip,
      user_agent: userAgent,
    });

    await this.auditRepo.logAction({
      id: uuidv4(),
      actor_user_id: user.id,
      action: "LOGIN",
      created_at: new Date(),
    });

    return { user, accessToken, refreshToken };
  }

  /**
   * Refresh access token
   * @param {string} refreshToken
   * @returns {Promise<{accessToken:string}>}
   */
  async refreshToken(refreshToken) {
    if (!refreshToken) throw new Error("Refresh token required");

    const hash = createTokenHash(refreshToken);
    const session = await this.sessionRepo.findByRefreshTokenHash(hash);
    if (!session) throw new Error("Invalid refresh token");
    if (session.revokedAt) throw new Error("Refresh token revoked");

    const user = await this.userRepo.findById(session.userId);
    if (!user) throw new Error("User not found");

    const accessToken = signAccessToken({ id: user.id, name: user.userName });
    await this.auditRepo.logAction({
      id: uuidv4(),
      actor_user_id: user.id,
      action: "REFRESH_TOKEN",
      created_at: new Date(),
    });

    return { accessToken };
  }

  /**
   * Change user password
   * @param {string} userId
   * @param {string} oldPassword
   * @param {string} newPassword
   * @returns {Promise<boolean>}
   */
  async changePassword(userId, oldPassword, newPassword) {
    if (!userId || !oldPassword || !newPassword)
      throw new Error("Missing parameters");

    const user = await this.userRepo.findById(userId);
    if (!user) throw new Error("User not found");

    const match = await bcrypt.compare(oldPassword, user.password_hash);
    if (!match) throw new Error("Old password incorrect");

    const hashed = await bcrypt.hash(newPassword, this.SALT_ROUNDS);
    await this.userRepo.updateById(userId, { password_hash: hashed });
    await this.auditRepo.logAction({
      id: uuidv4(),
      actor_user_id: userId,
      action: "CHANGE_PASSWORD",
      created_at: new Date(),
    });

    return true;
  }

  /**
   * Request password reset token
   * @param {string} email
   * @param {string} [userAgent]
   * @param {string} [ip]
   * @returns {Promise<string|null>} Password reset token
   */
  async forgotPassword(email, userAgent = null, ip = null) {
    if (!email) throw new Error("Email required");

    const emailRow = await this.userEmailRepo.findByEmail(email);
    if (!emailRow) return null;

    const token = crypto.randomBytes(32).toString("hex");
    await this.passwordResetRepo.create({
      id: uuidv4(),
      user_id: emailRow.userId,
      token_hash: createTokenHash(token),
      expires_at: new Date(Date.now() + 60 * 60 * 1000),
      ip,
      user_agent: userAgent,
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
      actor_user_id: emailRow.userId,
      action: "FORGOT_PASSWORD_REQUEST",
      created_at: new Date(),
    });

    return token;
  }

  /**
   * Reset password using token
   * @param {string} token
   * @param {string} newPassword
   * @returns {Promise<boolean>}
   */
  async resetPassword(token, newPassword) {
    if (!token || !newPassword) throw new Error("Missing parameters");

    const tokenHash = createTokenHash(token);
    const resetRow = await this.passwordResetRepo.findByHash(tokenHash);
    if (!resetRow || resetRow.usedAt) throw new Error("Invalid or used token");

    const hashed = await bcrypt.hash(newPassword, this.SALT_ROUNDS);
    await this.userRepo.updateById(resetRow.userId, { password_hash: hashed });
    await this.passwordResetRepo.markUsed(resetRow.id);
    await this.auditRepo.logAction({
      id: uuidv4(),
      actor_user_id: resetRow.userId,
      action: "RESET_PASSWORD",
      created_at: new Date(),
    });

    return true;
  }

  /**
   * Get current user by ID
   * @param {string} userId
   * @returns {Promise<Object>}
   */
  async getMe(userId) {
    return this.userRepo.findById(userId);
  }
}
