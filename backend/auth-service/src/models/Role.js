export default class Role {
  #id;
  #roleName;
  #createdAt;

  constructor(row = {}) {
    this.#id = row.id;
    this.#roleName = row.role_name;
    this.#createdAt = row.created_at ? new Date(row.created_at) : null;
  }

  get id() { return this.#id; }
  get roleName() { return this.#roleName; }
  get createdAt() { return this.#createdAt; }
}
