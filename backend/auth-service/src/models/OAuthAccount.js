export default class OAuthAccount {
  #id;
  #userId;
  #provider;
  #providerAccountId;
  #createdAt;

  constructor(row = {}) {
    this.#id = row.id;
    this.#userId = row.user_id;
    this.#provider = row.provider;
    this.#providerAccountId = row.provider_account_id;
    this.#createdAt = row.created_at ? new Date(row.created_at) : null;
  }

  get id() { return this.#id; }
  get userId() { return this.#userId; }
  get provider() { return this.#provider; }
  get providerAccountId() { return this.#providerAccountId; }
  get createdAt() { return this.#createdAt; }
}
