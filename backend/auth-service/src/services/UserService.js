import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";

export class UserService {
  constructor({ userRepo, roleRepo, userRoleRepo }) {
    this.userRepo = userRepo;
    this.roleRepo = roleRepo;
    this.userRoleRepo = userRoleRepo;
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
      is_active: 0, // Chưa active
      is_blocked: 0,
      is_email_verified: 0,
    });

    // gán role default
    const defaultRole = await this.roleRepo.findByName("user");
    if (defaultRole) {
      await this.userRoleRepo.create({
        id: uuidv4(),
        user_id: user.id,
        role_id: defaultRole.id,
      });
    }

    return user;
  }

  async markEmailVerified(userId) {
    await this.userRepo.updateById(userId, { is_email_verified: 1, is_active: 1 });
  }

  async changePassword(userId, oldPassword, newPassword) {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new Error("User not found");

    if (oldPassword) {
      const valid = await bcrypt.compare(oldPassword, user.password_hash);
      if (!valid) throw new Error("Old password is incorrect");
    }

    const newHash = await bcrypt.hash(newPassword, 10);
    await this.userRepo.updateById(userId, { password_hash: newHash });
    return true;
  }

  async getByEmail(email) {
    return this.userRepo.findByEmail(email);
  }

  async getUserRoles(userId) {
    return this.userRoleRepo.findByUserId(userId);
  }
}
