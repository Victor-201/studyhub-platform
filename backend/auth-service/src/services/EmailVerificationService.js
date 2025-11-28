import { hashToken } from "../utils/tokenHash.js";

export class EmailVerificationService {
  constructor({ emailVerificationRepo }) {
    this.repo = emailVerificationRepo;
  }

  async createToken(userId, token) {
    const tokenHash = hashToken(token);
    await this.repo.create({
      user_id: userId,
      token_hash: tokenHash,
      created_at: new Date(),
      used: 0,
    });
  }

  async verifyToken(token) {
    const tokenHash = hashToken(token);
    const record = await this.repo.findByHash(tokenHash);
    if (!record || record.used) throw new Error("Invalid or expired token");
    await this.repo.markUsed(record.id);
    return record.user_id;
  }
}
