export default class OAuthAccount {
  #id;
  #userId;
  #provider;
  #providerUserId;
  #providerData;
  #createdAt;

  constructor(row = {}) {
    this.#id = row.id;
    this.#userId = row.user_id;
    this.#provider = row.provider;
    this.#providerUserId = row.provider_user_id;
    this.#providerData = row.provider_data;
    this.#createdAt = row.created_at ? new Date(row.created_at) : null;
  }

  get id() { return this.#id; }
  get userId() { return this.#userId; }
  get provider() { return this.#provider; }
  get providerUserId() { return this.#providerUserId; }
  get providerData() { return this.#providerData; }
  get createdAt() { return this.#createdAt; }
}
