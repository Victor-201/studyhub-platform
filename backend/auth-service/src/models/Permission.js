export default class Permission {
  #id;
  #permName;
  #createdAt;

  constructor(row = {}) {
    this.#id = row.id;
    this.#permName = row.permission_name;
    this.#createdAt = row.created_at ? new Date(row.created_at) : null;
  }

  get id() { return this.#id; }
  get permName() { return this.#permName; }
  get createdAt() { return this.#createdAt; }
}
