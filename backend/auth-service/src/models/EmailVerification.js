export default class EmailVerification {
  #id;
  #userId;
  #tokenHash;
  #expiresAt;
  #usedAt;
  #ip;
  #userAgent;
  #createdAt;

  constructor(row = {}) {
    this.#id = row.id;
    this.#userId = row.user_id;
    this.#tokenHash = row.token_hash;
    this.#expiresAt = new Date(row.expires_at);
    this.#usedAt = row.used_at ? new Date(row.used_at) : null;
    this.#ip = row.ip;
    this.#userAgent = row.user_agent;
    this.#createdAt = row.created_at ? new Date(row.created_at) : null;
  }

  get id() { return this.#id; }
  get userId() { return this.#userId; }
  get tokenHash() { return this.#tokenHash; }
  get expiresAt() { return this.#expiresAt; }
  get usedAt() { return this.#usedAt; }
  get ip() { return this.#ip; }
  get userAgent() { return this.#userAgent; }
  get createdAt() { return this.#createdAt; }
}
