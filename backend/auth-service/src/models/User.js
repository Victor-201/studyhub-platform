export default class User {
  #id;
  #email;
  #userName;
  #passwordHash;
  #isActive;
  #isBlocked;
  #deletedAt;
  #lastLoginAt;
  #createdAt;
  #updatedAt;

  constructor(row = {}) {
    this.#id = row.id || null;
    this.#email = row.email || "";
    this.#userName = row.user_name || "";
    this.#passwordHash = row.password_hash || null;
    this.#isActive = Boolean(row.is_active);
    this.#isBlocked = Boolean(row.is_blocked);
    this.#deletedAt = row.deleted_at ? new Date(row.deleted_at) : null;
    this.#lastLoginAt = row.last_login_at ? new Date(row.last_login_at) : null;
    this.#createdAt = row.created_at ? new Date(row.created_at) : null;
    this.#updatedAt = row.updated_at ? new Date(row.updated_at) : null;
  }

  get id() { return this.#id; }
  get email() { return this.#email; }
  get userName() { return this.#userName; }
  get passwordHash() { return this.#passwordHash; }
  get isActive() { return this.#isActive; }
  get isBlocked() { return this.#isBlocked; }
  get deletedAt() { return this.#deletedAt; }
  get lastLoginAt() { return this.#lastLoginAt; }
  get createdAt() { return this.#createdAt; }
  get updatedAt() { return this.#updatedAt; }
}
