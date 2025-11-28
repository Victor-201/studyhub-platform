export default class UserEmail {
  #id;
  #userId;
  #email;
  #isPrimary;
  #isVerified;
  #createdAt;

  constructor(row = {}) {
    this.#id = row.id;
    this.#userId = row.user_id;
    this.#email = row.email;
    this.#isPrimary = Boolean(row.is_primary);
    this.#isVerified = Boolean(row.is_verified);
    this.#createdAt = row.created_at ? new Date(row.created_at) : null;
  }

  get id() { return this.#id; }
  get userId() { return this.#userId; }
  get email() { return this.#email; }
  get isPrimary() { return this.#isPrimary; }
  get isVerified() { return this.#isVerified; }
  get createdAt() { return this.#createdAt; }
}
