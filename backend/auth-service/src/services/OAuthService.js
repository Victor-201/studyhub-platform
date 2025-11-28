import { v4 as uuidv4 } from "uuid";

export class OAuthService {
  constructor({ oauthAccountRepo, userRepo }) {
    this.oauthAccountRepo = oauthAccountRepo;
    this.userRepo = userRepo;
  }

  async loginOrRegister({ provider, providerUserId, email }) {
    let account = await this.oauthAccountRepo.find(provider, providerUserId);

    if (account) {
      return this.userRepo.findById(account.user_id);
    }

    // tạo user mới
    const userId = uuidv4();
    const user = await this.userRepo.create({
      id: userId,
      email,
      password_hash: "",
      is_active: 1,
      is_blocked: 0,
    });

    await this.oauthAccountRepo.linkAccount({
      id: uuidv4(),
      user_id: user.id,
      provider,
      provider_user_id: providerUserId,
      provider_data: {},
    });

    return user;
  }
}
