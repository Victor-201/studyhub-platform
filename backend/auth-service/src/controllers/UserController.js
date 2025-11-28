export class UserController {
  /**
   * @param {Object} deps
   * @param {import("../services/UserService.js").UserService} deps.userService
   */
  constructor({ userService }) {
    this.userService = userService;
  }

  async getProfile(req, res) {
    try {
      const userId = req.user.id;
      const profile = await this.userService.getProfile(userId);
      res.json(profile);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async updateProfile(req, res) {
    try {
      const userId = req.user.id;
      const updated = await this.userService.updateProfile(userId, req.body);
      res.json(updated);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async listEmails(req, res) {
    try {
      const userId = req.user.id;
      const emails = await this.userService.listEmails(userId);
      res.json(emails);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async addEmail(req, res) {
    try {
      const userId = req.user.id;
      const { email } = req.body;
      const row = await this.userService.addEmail(userId, email);
      res.status(201).json(row);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async setPrimaryEmail(req, res) {
    try {
      const userId = req.user.id;
      const { emailId } = req.body;
      const updated = await this.userService.setPrimaryEmail(userId, emailId);
      res.json(updated);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
}
