export class AdminController {
  /**
   * @param {Object} deps
   * @param {import("../services/AdminService.js").AdminService} deps.adminService
   */
  constructor({ adminService }) {
    this.adminService = adminService;
  }

  /** List all users */
  async listUsers(req, res) {
    try {
      const users = await this.adminService.listUsers();
      res.json(users);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  /** Lock a user */
  async lockUser(req, res) {
    try {
      const { userId } = req.params;
      const adminId = req.user.id;
      await this.adminService.lockUser(userId, adminId);
      res.json({ success: true });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  /** Unlock a user */
  async unlockUser(req, res) {
    try {
      const { userId } = req.params;
      const adminId = req.user.id;
      await this.adminService.unlockUser(userId, adminId);
      res.json({ success: true });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  /** Block a user permanently or temporarily */
  async blockUser(req, res) {
    try {
      const { userId } = req.params;
      const { reason } = req.body;
      const adminId = req.user.id;
      await this.adminService.blockUser(userId, reason, adminId);
      res.json({ success: true });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  /** Soft delete a user */
  async softDeleteUser(req, res) {
    try {
      const { userId } = req.params;
      const { reason } = req.body;
      const adminId = req.user.id;
      await this.adminService.softDelete(userId, adminId, reason);
      res.json({ success: true });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  /** Restore a soft-deleted user */
  async restoreUser(req, res) {
    try {
      const { userId } = req.params;
      const adminId = req.user.id;
      await this.adminService.restoreUser(userId, adminId);
      res.json({ success: true });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  /** Update a user's role */
  async updateRole(req, res) {
    try {
      const { userId } = req.params;
      const { roleName } = req.body;
      const adminId = req.user.id;
      await this.adminService.updateRole(userId, roleName, adminId);
      res.json({ success: true });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  /** Get all audit logs */
  async getAuditLogs(req, res) {
    try {
      const logs = await this.adminService.getAuditLogs();
      res.json(logs);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  /** Get audit logs filtered by actor */
  async getAuditLogsByActor(req, res) {
    try {
      const { actorUserId } = req.params;
      const logs = await this.adminService.getAuditLogsByActor(actorUserId);
      res.json(logs);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  /** Get audit logs filtered by target */
  async getAuditLogsByTarget(req, res) {
    try {
      const { targetUserId } = req.params;
      const logs = await this.adminService.getAuditLogsByTarget(targetUserId);
      res.json(logs);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
}
