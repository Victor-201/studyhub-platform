export class AuthController {
  /**
   * @param {Object} deps
   * @param {import("../services/AuthService.js").AuthService} deps.authService
   */
  constructor({ authService }) {
    this.authService = authService;
  }

  async register(req, res) {
    try {
      const { name, email, password } = req.body;
      const { user, verificationToken } = await this.authService.register({ name, email, password, userAgent: req.headers['user-agent'], ip: req.ip });
      res.status(201).json({ user, verificationToken });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async verifyEmail(req, res) {
    try {
      const { token } = req.body;
      await this.authService.verifyEmail(token);
      res.json({ success: true });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const { user, accessToken, refreshToken } = await this.authService.login({ email, password, userAgent: req.headers['user-agent'], ip: req.ip });
      res.json({ user, accessToken, refreshToken });
    } catch (err) {
      res.status(401).json({ error: err.message });
    }
  }

  async refresh(req, res) {
    try {
      const { refreshToken } = req.body;
      const data = await this.authService.refreshToken(refreshToken);
      res.json(data);
    } catch (err) {
      res.status(401).json({ error: err.message });
    }
  }

  async changePassword(req, res) {
    try {
      const userId = req.user.id;
      const { oldPassword, newPassword } = req.body;
      await this.authService.changePassword(userId, oldPassword, newPassword);
      res.json({ success: true });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async forgotPassword(req, res) {
    try {
      const { email } = req.body;
      const token = await this.authService.forgotPassword(email, req.headers['user-agent'], req.ip);
      res.json({ token }); // controller should email it in real app
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async resetPassword(req, res) {
    try {
      const { token, newPassword } = req.body;
      await this.authService.resetPassword(token, newPassword);
      res.json({ success: true });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async me(req, res) {
    try {
      const userId = req.user.id;
      const user = await this.authService.getMe(userId);
      res.json({ user });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
}
