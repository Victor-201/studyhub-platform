export default class User {
  #id;
  #userName;
  #passwordHash;
  #status;
  #lastLoginAt;
  #createdAt;
  #updatedAt;

  constructor(row = {}) {
    this.#id = row.id;
    this.#userName = row.user_name;
    this.#passwordHash = row.password_hash;
    this.#status = row.status;
    this.#lastLoginAt = row.last_login_at ? new Date(row.last_login_at) : null;
    this.#createdAt = row.created_at ? new Date(row.created_at) : null;
    this.#updatedAt = row.updated_at ? new Date(row.updated_at) : null;
  }

  get id() { return this.#id; }
  get userName() { return this.#userName; }
  get passwordHash() { return this.#passwordHash; }
  get status() { return this.#status; }
  get lastLoginAt() { return this.#lastLoginAt; }
  get createdAt() { return this.#createdAt; }
  get updatedAt() { return this.#updatedAt; }
}
