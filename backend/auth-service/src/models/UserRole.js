export default class UserRole {
  #id;
  #userId;
  #roleId;
  #createdAt;

  constructor(row = {}) {
    this.#id = row.id;
    this.#userId = row.user_id;
    this.#roleId = row.role_id;
    this.#createdAt = row.created_at ? new Date(row.created_at) : null;
  }

  get id() { return this.#id; }
  get userId() { return this.#userId; }
  get roleId() { return this.#roleId; }
  get createdAt() { return this.#createdAt; }
}
