export class AuthController {
  /**
   * @param {Object} deps
   * @param {import("../services/AuthService.js").AuthService} deps.authService
   */
  constructor({ authService }) {
    this.authService = authService;
  }

  /** Register a new user */
  async register({ body, headers, ip }, res) {
    try {
      const { user_name, email, password, display_name } = body;

      const { user, verification_token } = await this.authService.register({
        user_name,
        email,
        password,
        display_name,
        user_agent: headers["user-agent"],
        ip,
      });

      res.status(201).json({
        user,
        verificationToken: verification_token,
      });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  /** Verify email with token */
  async verifyEmail({ query }, res) {
    try {
      const token = query.token;
      await this.authService.verifyEmail(token);
      res.json({ success: true });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  /** Login user with email or username */
  async login({ body, headers, ip }, res) {
    try {
      const { email, user_name, password } = body;
      const { user, access_token, refresh_token } =
        await this.authService.login({
          email,
          user_name,
          password,
          user_agent: headers["user-agent"],
          ip,
        });
      res.json({ user, access_token, refresh_token });
    } catch (err) {
      res.status(401).json({ error: err.message });
    }
  }

  /** Refresh access token using refresh token */
  async refresh({ body }, res) {
    try {
      const { refresh_token } = body;
      const data = await this.authService.refreshToken(refresh_token);
      res.json(data);
    } catch (err) {
      res.status(401).json({ error: err.message });
    }
  }

  /** Change user password */
  async changePassword({ user, body }, res) {
    try {
      const { old_password, new_password } = body;
      await this.authService.changePassword(
        user.id,
        old_password,
        new_password
      );
      res.json({ success: true });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  /** Request password reset */
  async forgotPassword({ body, headers, ip }, res) {
    try {
      const { email } = body;
      const token = await this.authService.forgotPassword(
        email,
        headers["user-agent"],
        ip
      );
      res.json({ token });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  /** Reset password using token */
  async resetPassword({ body }, res) {
    try {
      const { token, new_password } = body;
      await this.authService.resetPassword(token, new_password);
      res.json({ success: true });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  /** Logout user by revoking refresh token */
  async logout(req, res) {
    try {
      const { refresh_token } = req.body;
      await this.authService.logout(refresh_token);
      res.json({ success: true });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  /** Get logged-in user info */
  async me({ user }, res) {
    try {
      const currentUser = await this.authService.getMe(user.id);
      res.json({ user: currentUser });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
}
