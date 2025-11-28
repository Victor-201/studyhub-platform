// File: src/services/AuthService.js
import { v4 as uuidv4 } from "uuid";
import crypto from "crypto";
import bcrypt from "bcrypt";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.js";
import { hashToken } from "../utils/tokenHash.js";

/**
 * AuthService
 * Handles authentication: register, login, email verification, password reset, token refresh, change password, get profile
 */
export class AuthService {
  /**
   * @param {Object} deps - dependencies
   * @param {import("../repos/UserRepository.js").UserRepository} deps.userRepo
   * @param {import("../repos/UserEmailRepository.js").UserEmailRepository} deps.userEmailRepo
   * @param {import("../repos/SessionRepository.js").SessionRepository} deps.sessionRepo
   * @param {import("../repos/PasswordResetRepository.js").PasswordResetRepository} deps.passwordResetRepo
   * @param {import("../repos/EmailVerificationRepository.js").EmailVerificationRepository} deps.emailVerificationRepo
   * @param {import("../repos/AuditLogRepository.js").AuditLogRepository} deps.auditRepo
   */
  constructor({ userRepo, userEmailRepo, sessionRepo, passwordResetRepo, emailVerificationRepo, auditRepo }) {
    this.userRepo = userRepo;
    this.userEmailRepo = userEmailRepo;
    this.sessionRepo = sessionRepo;
    this.passwordResetRepo = passwordResetRepo;
    this.emailVerificationRepo = emailVerificationRepo;
    this.auditRepo = auditRepo;
    this.SALT_ROUNDS = 10;
  }

  /**
   * Register a new user and create a primary email with verification token
   * @param {{name?:string,email:string,password:string,userAgent?:string,ip?:string}} payload
   * @returns {Promise<{user:Object, verificationToken:string}>} created user and verification token
   */
async register({ userName, email, password, userAgent = null, ip = null }) {
  if (!userName || !email || !password) throw new Error("Username, email and password are required");

  const existingUserName = await this.userRepo.findByUserName(userName);
  if (existingUserName) throw new Error("Username already exists");

  const existingEmail = await this.userEmailRepo.findByEmail(email);
  if (existingEmail) throw new Error("Email already exists");

  const hashed = await bcrypt.hash(password, this.SALT_ROUNDS);

  const createdUser = await this.userRepo.create({
    id: uuidv4(),
    user_name: userName,
    password_hash: hashed,
    is_active: 1,
    created_at: new Date(),
  });

  const userId = createdUser.id || createdUser.insertId;
  const user = await this.userRepo.findById(userId);

  await this.userEmailRepo.create({
    id: uuidv4(),
    user_id: user.id,
    email,
    is_primary: 1,
    is_verified: 0,
    created_at: new Date(),
  });

  const token = crypto.randomBytes(32).toString("hex");
  await this.emailVerificationRepo.create({
    id: uuidv4(),
    user_id: user.id,
    token_hash: hashToken(token),
    expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24h
    ip,
    user_agent: userAgent,
    created_at: new Date(),
  });

  await this.auditRepo.logAction({
    actor_user_id: user.id,
    action: "REGISTER",
    created_at: new Date(),
  });

  return { user, verificationToken: token };
}

  /**
   * Verify email using token
   * @param {string} token - plain token from email
   * @returns {Promise<boolean>} true if verified
   */
  async verifyEmail(token) {
    if (!token) throw new Error("Token required");

    const tokenHash = hashToken(token);
    const row = await this.emailVerificationRepo.findByHash(tokenHash);
    if (!row) throw new Error("Invalid token");
    if (row.used_at) throw new Error("Token already used");
    if (new Date() > new Date(row.expires_at)) throw new Error("Token expired");

    await this.userEmailRepo.updateByUserId(row.user_id, { is_verified: 1 });
    await this.emailVerificationRepo.markUsed(row.id);

    await this.auditRepo.logAction({
      actor_user_id: row.user_id,
      action: "EMAIL_VERIFIED",
      created_at: new Date(),
    });

    return true;
  }

/**
 * Login using email or userName + password, create refresh token session
 * @param {{email?:string,userName?:string,password:string,userAgent?:string,ip?:string}} payload
 * @returns {Promise<{user:Object, accessToken:string, refreshToken:string}>}
 */
async login({ email, userName, password, userAgent = null, ip = null }) {
  if ((!email && !userName) || !password) throw new Error("Email or username and password are required");

  let user;
  let emailRow;

  if (email) {
    emailRow = await this.userEmailRepo.findByEmail(email);
    if (!emailRow) throw new Error("Invalid credentials");
    if (!emailRow.is_verified) throw new Error("Email not verified");

    user = await this.userRepo.findById(emailRow.user_id);
    if (!user) throw new Error("Invalid credentials");
  } else if (userName) {
    user = await this.userRepo.findByUserName(userName);
    if (!user) throw new Error("Invalid credentials");

    emailRow = await this.userEmailRepo.findByUserId(user.id);
    if (!emailRow || !emailRow.is_verified) throw new Error("Email not verified");
  }

  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) throw new Error("Invalid credentials");

  const accessToken = generateAccessToken({ id: user.id, name: user.name });
  const refreshToken = generateRefreshToken({ id: user.id });

  await this.sessionRepo.create({
    id: uuidv4(),
    user_id: user.id,
    refresh_token_hash: hashToken(refreshToken),
    created_at: new Date(),
    expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    ip_address: ip,
    user_agent: userAgent,
  });

  await this.auditRepo.logAction({
    actor_user_id: user.id,
    action: "LOGIN",
    created_at: new Date(),
  });

  return { user, accessToken, refreshToken };
}

  /**
   * Refresh access token using refresh token
   * @param {string} refreshToken
   * @returns {Promise<{accessToken:string}>}
   */
  async refreshToken(refreshToken) {
    if (!refreshToken) throw new Error("Refresh token required");

    const hash = hashToken(refreshToken);
    const session = await this.sessionRepo.findByRefreshTokenHash(hash);
    if (!session) throw new Error("Invalid refresh token");
    if (session.revoked_at) throw new Error("Refresh token revoked");

    const user = await this.userRepo.findById(session.user_id);
    if (!user) throw new Error("User not found");

    const accessToken = generateAccessToken({ id: user.id, name: user.name });

    await this.auditRepo.logAction({
      actor_user_id: user.id,
      action: "REFRESH_TOKEN",
      created_at: new Date(),
    });

    return { accessToken };
  }

  /**
   * Change password for logged-in user
   * @param {string} userId
   * @param {string} oldPassword
   * @param {string} newPassword
   * @returns {Promise<boolean>}
   */
  async changePassword(userId, oldPassword, newPassword) {
    if (!userId || !oldPassword || !newPassword) throw new Error("Missing parameters");

    const user = await this.userRepo.findById(userId);
    if (!user) throw new Error("User not found");

    const match = await bcrypt.compare(oldPassword, user.password_hash);
    if (!match) throw new Error("Old password incorrect");

    const hashed = await bcrypt.hash(newPassword, this.SALT_ROUNDS);
    await this.userRepo.updateById(userId, { password_hash: hashed });

    await this.auditRepo.logAction({
      actor_user_id: userId,
      action: "CHANGE_PASSWORD",
      created_at: new Date(),
    });

    return true;
  }

  /**
   * Forgot password: create password reset token
   * @param {string} email
   * @param {string} userAgent
   * @param {string} ip
   * @returns {Promise<string|null>} token to send via email
   */
  async forgotPassword(email, userAgent = null, ip = null) {
    if (!email) throw new Error("Email required");

    const emailRow = await this.userEmailRepo.findByEmail(email);
    if (!emailRow) return null;

    const token = crypto.randomBytes(32).toString("hex");
    const tokenHash = hashToken(token);

    await this.passwordResetRepo.create({
      id: uuidv4(),
      user_id: emailRow.user_id,
      token_hash: tokenHash,
      expires_at: new Date(Date.now() + 60 * 60 * 1000), // 1h
      ip,
      user_agent: userAgent,
      created_at: new Date(),
    });

    await this.auditRepo.logAction({
      actor_user_id: emailRow.user_id,
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

    const tokenHash = hashToken(token);
    const resetRow = await this.passwordResetRepo.findByHash(tokenHash);
    if (!resetRow) throw new Error("Invalid or used token");
    if (resetRow.used_at) throw new Error("Token already used");
    if (new Date() > new Date(resetRow.expires_at)) throw new Error("Token expired");

    const hashed = await bcrypt.hash(newPassword, this.SALT_ROUNDS);
    await this.userRepo.updateById(resetRow.user_id, { password_hash: hashed });
    await this.passwordResetRepo.markUsed(resetRow.id);

    await this.auditRepo.logAction({
      actor_user_id: resetRow.user_id,
      action: "RESET_PASSWORD",
      created_at: new Date(),
    });

    return true;
  }

  /**
   * Get current user profile
   * @param {string} userId
   * @returns {Promise<Object|null>}
   */
  async getMe(userId) {
    return this.userRepo.findById(userId);
  }
}
