import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

export class AuthService {
    constructor({ userRepo, sessionRepo, emailVerificationRepo, passwordResetRepo, oauthAccountRepo }) {
        this.userRepo = userRepo;
        this.sessionRepo = sessionRepo;
        this.emailVerificationRepo = emailVerificationRepo;
        this.passwordResetRepo = passwordResetRepo;
        this.oauthAccountRepo = oauthAccountRepo;
    }

    async register({ email, password }) {
        const existingUser = await this.userRepo.findByEmail(email);
        if (existingUser) throw new Error("Email already exists");

        const userId = uuidv4();
        const passwordHash = await bcrypt.hash(password, 10);

        const user = await this.userRepo.create({
            id: userId,
            email,
            password_hash: passwordHash,
            is_active: 0,
            is_blocked: 0
        });

        // Tạo token xác thực email
        const token = uuidv4();
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
        await this.emailVerificationRepo.create({
            id: uuidv4(),
            user_id: user.id,
            token_hash: token,
            expires_at: expiresAt
        });

        // Gửi email
        await this.emailService.sendVerificationEmail(email, token);

        // Ghi log vào audit
        if (this.auditService) {
            await this.auditService.log({
                actorUserId: user.id,
                action: "register",
                resourceType: "user",
                resourceId: user.id,
                meta: { email }
            });
        }

        return user;
    }

    async verifyEmail(tokenHash) {
        const record = await this.emailVerificationRepo.findByToken(tokenHash);
        if (!record) throw new Error("Invalid or expired token");

        await this.userRepo.updateById(record.user_id, { is_active: 1 });
        await this.emailVerificationRepo.markUsed(record.id);

        if (this.auditService) {
            await this.auditService.log({
                actorUserId: record.user_id,
                action: "verify_email",
                resourceType: "email_verification",
                resourceId: record.id
            });
        }

        return true;
    }

    async forgotPassword(email) {
        const user = await this.userRepo.findByEmail(email);
        if (!user) throw new Error("User not found");

        const token = uuidv4();
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
        const resetRecord = await this.passwordResetRepo.create({
            id: uuidv4(),
            user_id: user.id,
            token_hash: token,
            expires_at: expiresAt
        });

        await this.emailService.sendResetPasswordEmail(email, token);

        if (this.auditService) {
            await this.auditService.log({
                actorUserId: user.id,
                action: "forgot_password",
                resourceType: "password_reset",
                resourceId: resetRecord.id
            });
        }

        return token;
    }

    async resetPassword(tokenHash, newPassword) {
        const reset = await this.passwordResetRepo.findByHash(tokenHash);
        if (!reset) throw new Error("Invalid or expired token");

        const hash = await bcrypt.hash(newPassword, 10);
        await this.userRepo.updateById(reset.user_id, { password_hash: hash });
        await this.passwordResetRepo.markUsed(reset.id);

        if (this.auditService) {
            await this.auditService.log({
                actorUserId: reset.user_id,
                action: "reset_password",
                resourceType: "password_reset",
                resourceId: reset.id
            });
        }

        return true;
    }
}
