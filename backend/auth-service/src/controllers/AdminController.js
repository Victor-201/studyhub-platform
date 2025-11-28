export class AdminController {
  /**
   * @param {Object} deps
   * @param {import("../services/AdminService.js").AdminService} deps.adminService
   */
  constructor({ adminService }) {
    this.adminService = adminService;
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
      const { userId } = req.params;
      await this.adminService.lockUser(userId, req.user.id);
      res.json({ success: true });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async unlockUser(req, res) {
    try {
      const { userId } = req.params;
      await this.adminService.unlockUser(userId, req.user.id);
      res.json({ success: true });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async blockUser(req, res) {
    try {
      const { userId } = req.params;
      const { reason } = req.body;
      await this.adminService.blockUser(userId, reason, req.user.id);
      res.json({ success: true });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async softDeleteUser(req, res) {
    try {
      const { userId } = req.params;
      await this.adminService.softDelete(userId, req.user.id);
      res.json({ success: true });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async restoreUser(req, res) {
    try {
      const { userId } = req.params;
      await this.adminService.restoreUser(userId, req.user.id);
      res.json({ success: true });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async updateRole(req, res) {
    try {
      const { userId } = req.params;
      const { roleName } = req.body;
      await this.adminService.updateRole(userId, roleName, req.user.id);
      res.json({ success: true });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
}
