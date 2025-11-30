export default class UserEmail {
  #id;
  #userId;
  #email;
  #type;
  #isVerified;
  #createdAt;
  #updatedAt;

  constructor(row = {}) {
    this.#id = row.id;
    this.#userId = row.user_id;
    this.#email = row.email;
    this.#type = row.type;
    this.#isVerified = row.is_verified;
    this.#createdAt = row.created_at ? new Date(row.created_at) : null;
    this.#updatedAt = row.updated_at ? new Date(row.updated_at) : null;
  }

  get id() { return this.#id; }
  get userId() { return this.#userId; }
  get email() { return this.#email; }
  get type() { return this.#type; }
  get isVerified() { return this.#isVerified; }
  get createdAt() { return this.#createdAt; }
  get updatedAt() { return this.#updatedAt; }
}
