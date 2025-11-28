export class OAuthController {
  constructor({ oauthService }) {
    this.oauthService = oauthService;
  }

  async login(req, res) {
    try {
      const { provider, providerUserId, email } = req.body;
      const user = await this.oauthService.loginOrRegister({ provider, providerUserId, email });
      res.json(user);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
}
