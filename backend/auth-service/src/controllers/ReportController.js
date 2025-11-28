export class ReportController {
  constructor({ adminService }) {
    this.adminService = adminService;
  }

  async summaryReport(req, res) {
    try {
      const users = await this.adminService.listUsers();
      const active = users.filter(u => u.is_active).length;
      const blocked = users.filter(u => u.is_blocked).length;
      res.json({ total: users.length, active, blocked });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async exportReport(req, res) {
    try {
      const users = await this.adminService.listUsers();
      // Export CSV JSON for simplicity
      res.json(users);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
}
