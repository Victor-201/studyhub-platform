export default class Permission {
  #id;
  #name;
  #description;
  #created_at;

  constructor(row = {}) {
    this.#id = row.id;
    this.#name = row.name;
    this.#description = row.description;
    this.#created_at = row.created_at ? new Date(row.created_at) : null;
  }

  get id() { return this.#id; }
  get name() { return this.#name; }
  get description() { return this.#description; }
  get created_at() { return this.#created_at; }

  toJSON() {
    return {
      id: this.#id,
      name: this.#name,
      description: this.#description,
      created_at: this.#created_at,
    };
  }
}
