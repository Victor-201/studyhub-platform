import { v4 as uuidv4 } from "uuid";
import { createTokenHash } from "../utils/tokenHash.js";
import { signAccessToken, signRefreshToken } from "../utils/jwt.js";

export class OAuthService {
  /**
   * @param {Object} deps - Dependency injection
   * @param {import("../repos/OAuthProviderRepository.js").OAuthProviderRepository} deps.oAuthProviderRepo
   * @param {import("../repos/OAuthAccountRepository.js").OAuthAccountRepository} deps.oAuthAccountRepo
   * @param {import("../repos/UserRepository.js").UserRepository} deps.userRepo
   * @param {import("../repos/UserEmailRepository.js").UserEmailRepository} deps.userEmailRepo
   * @param {import("../repos/SessionRepository.js").SessionRepository} deps.sessionRepo
   * @param {import("../repos/AuditLogRepository.js").AuditLogRepository} deps.auditRepo
   * @param {import("../repos/UserRoleRepository.js").UserRoleRepository} deps.userRoleRepo
   * @param {import("../repos/RoleRepository.js").RoleRepository} deps.roleRepo
   */
  constructor({
    oAuthProviderRepo,
    oAuthAccountRepo,
    userRepo,
    userEmailRepo,
    sessionRepo,
    auditRepo,
    userRoleRepo,
    roleRepo,
  }) {
    this.oAuthProviderRepo = oAuthProviderRepo;
    this.oAuthAccountRepo = oAuthAccountRepo;
    this.userRepo = userRepo;
    this.userEmailRepo = userEmailRepo;
    this.sessionRepo = sessionRepo;
    this.auditRepo = auditRepo;
    this.userRoleRepo = userRoleRepo;
    this.roleRepo = roleRepo;
  }

  /**
   * Login or register using OAuth provider
   * @param {string} providerName - OAuth provider name (e.g., google, github)
   * @param {Object} providerUser - Provider user info
   * @param {string} providerUser.id - Provider user ID
   * @param {string} [providerUser.name] - User name
   * @param {string} [providerUser.email] - User email
   * @param {string} [providerUser.userAgent]
   * @param {string} [providerUser.ip]
   * @returns {Promise<Object>} user
   */
  async login(providerName, providerUser) {
    if (!providerName || !providerUser || !providerUser.id)
      throw new Error("Invalid provider payload");

    // Find OAuth provider
    const provider = await this.oAuthProviderRepo.findByName(providerName);
    if (!provider) throw new Error("Provider not supported");

    // Check if OAuth account already exists
    const existingAccount = await this.oAuthAccountRepo.find(
      providerName,
      providerUser.id
    );
    if (existingAccount) {
      const user = await this.userRepo.findById(existingAccount.user_id);
      await this.auditRepo.logAction({
        actor_user_id: user.id,
        action: "OAUTH_LOGIN",
        created_at: new Date(),
      });
      return user;
    }

    // If email exists, link account; otherwise create new user
    let newUser;
    if (providerUser.email) {
      const existingEmail = await this.userEmailRepo.findByEmail(
        providerUser.email
      );
      if (existingEmail) {
        newUser = await this.userRepo.findById(existingEmail.user_id);
      } else {
        // Create new user
        newUser = await this.userRepo.create({
          id: uuidv4(),
          user_name: providerUser.name || providerUser.email.split("@")[0],
          password_hash: null,
          status: "active",
          created_at: new Date(),
        });

        // Create primary email
        await this.userEmailRepo.create({
          id: uuidv4(),
          user_id: newUser.id,
          email: providerUser.email,
          type: "primary",
          is_verified: 1,
          created_at: new Date(),
        });
      }
    } else {
      // User without email
      newUser = await this.userRepo.create({
        id: uuidv4(),
        user_name: providerUser.name || `user_${Date.now()}`,
        password_hash: null,
        status: "active",
        created_at: new Date(),
      });
    }

    // Assign default role
    const defaultRole = await this.roleRepo.findByName("user");
    if (defaultRole) {
      await this.userRoleRepo.assignRole({
        id: uuidv4(),
        user_id: newUser.id,
        role_id: defaultRole.id,
        assigned_at: new Date(),
      });
    }

    // Link OAuth account
    await this.oAuthAccountRepo.linkAccount({
      id: uuidv4(),
      user_id: newUser.id,
      provider: providerName,
      provider_user_id: providerUser.id,
      created_at: new Date(),
    });

    // Create session tokens
    const accessToken = signAccessToken({
      id: newUser.id,
      name: newUser.user_name,
    });
    const refreshToken = signRefreshToken({ id: newUser.id });

    await this.sessionRepo.create({
      id: uuidv4(),
      user_id: newUser.id,
      refresh_token_hash: createTokenHash(refreshToken),
      created_at: new Date(),
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      ip: providerUser.ip || null,
      user_agent: providerUser.userAgent || null,
    });

    await this.auditRepo.logAction({
      actor_user_id: newUser.id,
      action: "OAUTH_REGISTER",
      created_at: new Date(),
    });

    return newUser;
  }
}
