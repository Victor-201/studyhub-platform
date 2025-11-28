import crypto from "crypto";
import { hashToken } from "../utils/tokenHash.js";

export class PasswordResetService {
  constructor({ passwordResetRepo, userService }) {
    this.repo = passwordResetRepo;
    this.userService = userService;
  }

  async createToken(email) {
    const user = await this.userService.getByEmail(email);
    if (!user) throw new Error("User not found");

    const token = crypto.randomBytes(32).toString("hex");
    const tokenHash = hashToken(token);

    await this.repo.create({
      user_id: user.id,
      token_hash: tokenHash,
      created_at: new Date(),
      used: 0,
    });
    return token;
  }

  async resetPassword(token, newPassword) {
    const tokenHash = hashToken(token);
    const record = await this.repo.findByHash(tokenHash);
    if (!record || record.used) throw new Error("Invalid or expired token");

    await this.userService.changePassword(record.user_id, null, newPassword);
    await this.repo.markUsed(record.id);
  }
}
