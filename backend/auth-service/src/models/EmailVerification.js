export default class EmailVerification {
  #id;
  #userEmailId;
  #tokenHash;
  #expiresAt;
  #usedAt;
  #ip;
  #userAgent;
  #createdAt;

  constructor(row = {}) {
    this.#id = row.id;
    this.#userEmailId = row.user_email_id;
    this.#tokenHash = row.token_hash;
    this.#expiresAt = row.expires_at ? new Date(row.expires_at) : null;
    this.#usedAt = row.used_at ? new Date(row.used_at) : null;
    this.#ip = row.ip;
    this.#userAgent = row.user_agent;
    this.#createdAt = row.created_at ? new Date(row.created_at) : null;
  }

  get id() { return this.#id; }
  get userEmailId() { return this.#userEmailId; }
  get tokenHash() { return this.#tokenHash; }
  get expiresAt() { return this.#expiresAt; }
  get usedAt() { return this.#usedAt; }
  get ip() { return this.#ip; }
  get userAgent() { return this.#userAgent; }
  get createdAt() { return this.#createdAt; }
}
