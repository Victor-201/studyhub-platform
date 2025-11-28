export class OAuthController {
  /**
   * @param {Object} deps
   * @param {import("../services/OAuthService.js").OAuthService} deps.oauthService
   */
  constructor({ oauthService }) {
    this.oauthService = oauthService;
  }

  async login(req, res) {
    try {
      const { providerName, providerUser } = req.body;
      const user = await this.oauthService.login(providerName, providerUser);
      res.json(user);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
}
