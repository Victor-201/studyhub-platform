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
      const { user_id } = req.params;
      const admin_id = req.user.id;
      await this.adminService.lockUser(user_id, admin_id);
      res.json({ success: true });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  /** Unlock a user */
  async unlockUser(req, res) {
    try {
      const { user_id } = req.params;
      const admin_id = req.user.id;
      await this.adminService.unlockUser(user_id, admin_id);
      res.json({ success: true });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  /** Block a user permanently or temporarily */
  async blockUser(req, res) {
    try {
      const { user_id } = req.params;
      const { reason } = req.body;
      const admin_id = req.user.id;
      await this.adminService.blockUser(user_id, reason, admin_id);
      res.json({ success: true });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  /** Soft delete a user */
  async softDeleteUser(req, res) {
    try {
      const { user_id } = req.params;
      const { reason } = req.body;
      const admin_id = req.user.id;
      await this.adminService.softDelete(user_id, admin_id, reason);
      res.json({ success: true });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  /** Restore a soft-deleted user */
  async restoreUser(req, res) {
    try {
      const { user_id } = req.params;
      const admin_id = req.user.id;
      await this.adminService.restoreUser(user_id, admin_id);
      res.json({ success: true });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  /** Update a user's role */
  async updateRole(req, res) {
    try {
      const { user_id } = req.params;
      const { role_name } = req.body;
      const admin_id = req.user.id;
      await this.adminService.updateRole(user_id, role_name, admin_id);
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
      const { actor_user_id } = req.params;
      const logs = await this.adminService.getAuditLogsByActor(actor_user_id);
      res.json(logs);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  /** Get audit logs filtered by target */
  async getAuditLogsByTarget(req, res) {
    try {
      const { target_user_id } = req.params;
      const logs = await this.adminService.getAuditLogsByTarget(target_user_id);
      res.json(logs);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
}
