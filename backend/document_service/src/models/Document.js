export default class Document {
  #id;
  #owner_id;
  #title;
  #description;
  #visibility;
  #storage_path;
  #created_at;
  #updated_at;

  constructor(row = {}) {
    this.#id = row.id;
    this.#owner_id = row.owner_id;
    this.#title = row.title;
    this.#description = row.description;
    this.#visibility = row.visibility;
    this.#storage_path = row.storage_path;
    this.#created_at = row.created_at ? new Date(row.created_at) : null;
    this.#updated_at = row.updated_at ? new Date(row.updated_at) : null;
  }

  get id() { return this.#id; }
  get owner_id() { return this.#owner_id; }
  get title() { return this.#title; }
  get description() { return this.#description; }
  get visibility() { return this.#visibility; }
  get storage_path() { return this.#storage_path; }
  get created_at() { return this.#created_at; }
  get updated_at() { return this.#updated_at; }

  toJSON() {
    return {
      id: this.#id,
      owner_id: this.#owner_id,
      title: this.#title,
      description: this.#description,
      visibility: this.#visibility,
      storage_path: this.#storage_path,
      created_at: this.#created_at,
      updated_at: this.#updated_at,
    };
  }
}
