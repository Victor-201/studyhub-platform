export default class Role {
  #id;
  #name;
  #description;
  #createdAt;

  constructor(row = {}) {
    this.#id = row.id;
    this.#name = row.name;
    this.#description = row.description;
    this.#createdAt = row.created_at ? new Date(row.created_at) : null;
  }

  get id() { return this.#id; }
  get name() { return this.#name; }
  get description() { return this.#description; }
  get createdAt() { return this.#createdAt; }
}
