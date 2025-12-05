export class UserController {
  /**
   * @param {Object} deps
   * @param {import("../services/UserService.js").UserService} deps.userService
   */
  constructor({ userService }) {
    this.userService = userService;
  }

  /** Get logged-in user's profile */
  async getProfile({ user }, res) {
    try {
      const profile = await this.userService.getProfile(user.id);
      res.json({ user: profile });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  /** Update logged-in user's profile */
  async updateProfile({ user, body }, res) {
    try {
      const updated = await this.userService.updateProfile(user.id, body);
      res.json({ user: updated });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  /** List all emails of logged-in user */
  async listEmails({ user }, res) {
    try {
      const emails = await this.userService.listEmails(user.id);
      res.json({ emails });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  /** Add a secondary email */
  async addEmail({ user, body }, res) {
    try {
      const row = await this.userService.addEmail(user.id, body.email);
      res.status(201).json({ email: row });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  /** Set an email as primary */
  async setPrimaryEmail({ user, body }, res) {
    try {
      const updated = await this.userService.setPrimaryEmail(user.id, body.emailId);
      res.json({ email: updated });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
}
