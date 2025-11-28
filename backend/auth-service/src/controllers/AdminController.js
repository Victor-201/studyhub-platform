export class AdminController {
  constructor({ adminService, auditService }) {
    this.adminService = adminService;
    this.auditService = auditService;
  }

  async listUsers(req, res) {
    try {
      const users = await this.adminService.listUsers();
      res.json(users);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async lockUser(req, res) {
    try {
      const { id } = req.params;
      await this.adminService.lockUser(id);
      await this.auditService.log({
        actorUserId: req.user.userId,
        targetUserId: id,
        action: "lock_user"
      });
      res.json({ success: true });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async unlockUser(req, res) {
    try {
      const { id } = req.params;
      await this.adminService.unlockUser(id);
      await this.auditService.log({
        actorUserId: req.user.userId,
        targetUserId: id,
        action: "unlock_user"
      });
      res.json({ success: true });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async softDeleteUser(req, res) {
    try {
      const { id } = req.params;
      await this.adminService.softDeleteUser(id, req.user.userId);
      await this.auditService.log({
        actorUserId: req.user.userId,
        targetUserId: id,
        action: "soft_delete_user"
      });
      res.json({ success: true });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async restoreUser(req, res) {
    try {
      const { id } = req.params;
      await this.adminService.restoreUser(id, req.user.userId);
      await this.auditService.log({
        actorUserId: req.user.userId,
        targetUserId: id,
        action: "restore_user"
      });
      res.json({ success: true });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async updateRole(req, res) {
    try {
      const { id } = req.params;
      const { role } = req.body;
      await this.adminService.updateRole(id, role);
      await this.auditService.log({
        actorUserId: req.user.userId,
        targetUserId: id,
        action: "update_role",
        meta: { role }
      });
      res.json({ success: true });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async blockUser(req, res) {
    try {
      const { id } = req.params;
      const { reason, blockedUntil, isPermanent } = req.body;
      await this.adminService.blockUser(id, req.user.userId, reason, blockedUntil, isPermanent);
      await this.auditService.log({
        actorUserId: req.user.userId,
        targetUserId: id,
        action: "block_user",
        meta: { reason, blockedUntil, isPermanent }
      });
      res.json({ success: true });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
}
