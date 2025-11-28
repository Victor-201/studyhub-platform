export default class Session {
  #id;
  #userId;
  #refreshTokenHash;
  #expiresAt;
  #revokedAt;
  #lastUsedAt;
  #ip;
  #userAgent;
  #deviceInfo;
  #createdAt;

  constructor(row = {}) {
    this.#id = row.id || null;
    this.#userId = row.user_id || null;
    this.#refreshTokenHash = row.refresh_token_hash || null;
    this.#expiresAt = row.expires_at ? new Date(row.expires_at) : null;
    this.#revokedAt = row.revoked_at ? new Date(row.revoked_at) : null;
    this.#lastUsedAt = row.last_used_at ? new Date(row.last_used_at) : null;
    this.#ip = row.ip || null;
    this.#userAgent = row.user_agent || null;
    this.#deviceInfo = row.device_info || null;
    this.#createdAt = row.created_at ? new Date(row.created_at) : null;
  }

  get id() { return this.#id; }
  get userId() { return this.#userId; }
  get refreshTokenHash() { return this.#refreshTokenHash; }
  get expiresAt() { return this.#expiresAt; }
  get revokedAt() { return this.#revokedAt; }
  get lastUsedAt() { return this.#lastUsedAt; }
  get ip() { return this.#ip; }
  get userAgent() { return this.#userAgent; }
  get deviceInfo() { return this.#deviceInfo; }
  get createdAt() { return this.#createdAt; }
}
