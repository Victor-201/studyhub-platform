export default class Session {
  #id;
  #userId;
  #refreshTokenHash;
  #createdAt;
  #lastUsedAt;
  #expiresAt;
  #revokedAt;
  #ip;
  #userAgent;
  #deviceInfo;

  constructor(row = {}) {
    this.#id = row.id;
    this.#userId = row.user_id;
    this.#refreshTokenHash = row.refresh_token_hash;
    this.#createdAt = row.created_at ? new Date(row.created_at) : null;
    this.#lastUsedAt = row.last_used_at ? new Date(row.last_used_at) : null;
    this.#expiresAt = row.expires_at ? new Date(row.expires_at) : null;
    this.#revokedAt = row.revoked_at ? new Date(row.revoked_at) : null;
    this.#ip = row.ip;
    this.#userAgent = row.user_agent;
    this.#deviceInfo = row.device_info;
  }

  get id() { return this.#id; }
  get userId() { return this.#userId; }
  get refreshTokenHash() { return this.#refreshTokenHash; }
  get createdAt() { return this.#createdAt; }
  get lastUsedAt() { return this.#lastUsedAt; }
  get expiresAt() { return this.#expiresAt; }
  get revokedAt() { return this.#revokedAt; }
  get ip() { return this.#ip; }
  get userAgent() { return this.#userAgent; }
  get deviceInfo() { return this.#deviceInfo; }
}
