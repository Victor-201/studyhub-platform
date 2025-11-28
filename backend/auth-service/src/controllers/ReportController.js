export class ReportController {
  /**
   * @param {Object} deps
   * @param {import("../services/AuditService.js").AuditService} deps.auditService
   */
  constructor({ auditService }) {
    this.auditService = auditService;
  }

  async getLogsByActor(req, res) {
    try {
      const { actorUserId } = req.params;
      const logs = await this.auditService.getLogsByActor(actorUserId);
      res.json(logs);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async getLogsByTarget(req, res) {
    try {
      const { targetUserId } = req.params;
      const logs = await this.auditService.getLogsByTarget(targetUserId);
      res.json(logs);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async getAllLogs(req, res) {
    try {
      const logs = await this.auditService.auditRepo.findAll();
      res.json(logs);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
}
