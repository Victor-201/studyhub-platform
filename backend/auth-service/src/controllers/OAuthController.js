export class OAuthController {
  /**
   * @param {Object} deps
   * @param {import("../services/OAuthService.js").OAuthService} deps.oauthService
   * @param {import("../services/AuthService.js").AuthService} deps.authService
   */
  constructor({ oauthService, authService }) {
    this.oauthService = oauthService;
    this.authService = authService;
  }

  /**
   * Login or register using OAuth provider
   * @returns {Promise<Object>} user and tokens
   */
  async login(req, res) {
    try {
      const { providerName, providerUser } = req.body;
      const user = await this.oauthService.login(providerName, providerUser);

      // Generate JWT for OAuth users
      const accessToken = require("../utils/jwt.js").signAccessToken({ id: user.id, name: user.user_name || user.name });
      const refreshToken = require("../utils/jwt.js").signRefreshToken({ id: user.id });

      res.json({ user, accessToken, refreshToken });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
}
