import { v4 as uuidv4 } from "uuid";

export class AdminService {
  constructor({ userRepo, userRoleRepo, roleRepo, userBlockRepo, userDeletionRepo }) {
    this.userRepo = userRepo;
    this.userRoleRepo = userRoleRepo;
    this.roleRepo = roleRepo;
    this.userBlockRepo = userBlockRepo;
    this.userDeletionRepo = userDeletionRepo;
  }

  async listUsers() {
    return this.userRepo.findAll();
  }

  async lockUser(userId) {
    await this.userRepo.updateById(userId, { is_blocked: 1 });
  }

  async unlockUser(userId) {
    await this.userRepo.updateById(userId, { is_blocked: 0 });
  }

  async softDeleteUser(userId, deletedBy) {
    await this.userDeletionRepo.create({
      id: uuidv4(),
      user_id: userId,
      deleted_by: deletedBy,
    });
    await this.userRepo.updateById(userId, { is_active: 0 });
  }

  async restoreUser(userId, restoredBy) {
    const deletions = await this.userDeletionRepo.findAll({ user_id: userId });
    if (!deletions.length) throw new Error("User not deleted");

    const deletion = deletions[deletions.length - 1];
    await this.userDeletionRepo.updateById(deletion.id, { restored_at: new Date(), restored_by: restoredBy });
    await this.userRepo.updateById(userId, { is_active: 1 });
  }

  async updateRole(userId, roleName) {
    const role = await this.roleRepo.findByName(roleName);
    if (!role) throw new Error("Role not found");

    // xóa role cũ
    const roles = await this.userRoleRepo.findByUserId(userId);
    for (const r of roles) {
      await this.userRoleRepo.deleteById(r.id);
    }

    await this.userRoleRepo.create({
      id: uuidv4(),
      user_id: userId,
      role_id: role.id,
    });
  }

  async blockUser(userId, blockedBy, reason, blockedUntil = null, isPermanent = false) {
    await this.userBlockRepo.create({
      id: uuidv4(),
      user_id: userId,
      blocked_by: blockedBy,
      reason,
      blocked_until: blockedUntil,
      is_permanent: isPermanent ? 1 : 0,
    });

    await this.userRepo.updateById(userId, { is_blocked: 1 });
  }
}
