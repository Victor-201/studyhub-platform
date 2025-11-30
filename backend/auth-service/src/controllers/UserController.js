export class UserController {
  /**
   * @param {Object} deps
   * @param {import("../services/UserService.js").UserService} deps.userService
   */
  constructor({ userService }) {
    this.userService = userService;
  }

  /** Get logged-in user's profile */
  async getProfile(req, res) {
    try {
      const userId = req.user.id;
      const profile = await this.userService.getProfile(userId);
      res.json({ user: profile });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  /** Update logged-in user's profile */
  async updateProfile(req, res) {
    try {
      const userId = req.user.id;
      const fields = req.body;
      const updated = await this.userService.updateProfile(userId, fields);
      res.json({ user: updated });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  /** List all emails of logged-in user */
  async listEmails(req, res) {
    try {
      const userId = req.user.id;
      const emails = await this.userService.listEmails(userId);
      res.json({ emails });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  /** Add a secondary email */
  async addEmail(req, res) {
    try {
      const userId = req.user.id;
      const { email } = req.body;
      const row = await this.userService.addEmail(userId, email);
      res.status(201).json({ email: row });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  /** Set an email as primary */
  async setPrimaryEmail(req, res) {
    try {
      const userId = req.user.id;
      const { emailId } = req.body;
      const updated = await this.userService.setPrimaryEmail(userId, emailId);
      res.json({ email: updated });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
}
