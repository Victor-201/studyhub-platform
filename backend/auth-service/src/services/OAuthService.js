export class OAuthService {
  /**
   * @param {Object} deps
   * @param {import("../repos/OAuthProviderRepository.js").OAuthProviderRepository} deps.oAuthProviderRepo
   * @param {import("../repos/OAuthAccountRepository.js").OAuthAccountRepository} deps.oAuthAccountRepo
   * @param {import("../repos/UserRepository.js").UserRepository} deps.userRepo
   * @param {import("../repos/UserEmailRepository.js").UserEmailRepository} deps.userEmailRepo
   * @param {import("../repos/SessionRepository.js").SessionRepository} deps.sessionRepo
   * @param {import("../repos/AuditLogRepository.js").AuditLogRepository} deps.auditRepo
   */
  constructor({ oAuthProviderRepo, oAuthAccountRepo, userRepo, userEmailRepo, sessionRepo, auditRepo }) {
    this.oAuthProviderRepo = oAuthProviderRepo;
    this.oAuthAccountRepo = oAuthAccountRepo;
    this.userRepo = userRepo;
    this.userEmailRepo = userEmailRepo;
    this.sessionRepo = sessionRepo;
    this.auditRepo = auditRepo;
  }

  /**
   * Login or register using OAuth provider data
   * @param {string} providerName
   * @param {{id:string,name?:string,email?:string}} providerUser
   * @returns {Promise<Object>} user
   */
  async login(providerName, providerUser) {
    if (!providerName || !providerUser || !providerUser.id) throw new Error("Invalid provider payload");

    const provider = await this.oAuthProviderRepo.findByName(providerName);
    if (!provider) throw new Error("Provider not supported");

    // check if oauth account exists
    const existing = await this.oAuthAccountRepo.find(providerName, providerUser.id);
    if (existing) {
      const user = await this.userRepo.findById(existing.user_id);

      await this.auditRepo.logAction({
        actor_user_id: user.id,
        action: "OAUTH_LOGIN",
        created_at: new Date(),
      });

      return user;
    }

    // create a new user if email exists attach, otherwise create user
    const newUser = await this.userRepo.create({
      name: providerUser.name || null,
      status: "active",
      created_at: new Date(),
    });

    // create email if provided
    if (providerUser.email) {
      await this.userEmailRepo.create({
        user_id: newUser.id,
        email: providerUser.email,
        is_primary: 1,
        created_at: new Date(),
      });
    }

    // link oauth account
    await this.oAuthAccountRepo.linkAccount({
      user_id: newUser.id,
      provider: providerName,
      provider_user_id: providerUser.id,
      created_at: new Date(),
    });

    await this.auditRepo.logAction({
      actor_user_id: newUser.id,
      action: "OAUTH_REGISTER",
      created_at: new Date(),
    });

    return newUser;
  }
}