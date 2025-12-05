export default class Group {
  #id;
  #name;
  #avatar_url;
  #description;
  #access;
  #auto_approve_docs;
  #created_at;
  #updated_at;

  constructor(row = {}) {
    this.#id = row.id;
    this.#name = row.name;
    this.#avatar_url = row.avatar_url;
    this.#description = row.description;
    this.#access = row.access;
    this.#auto_approve_docs = row.auto_approve_docs;
    this.#created_at = row.created_at;
    this.#updated_at = row.updated_at;
  }

  get id() { return this.#id; }
  get name() { return this.#name; }
  get avatar_url() { return this.#avatar_url; }
  get description() { return this.#description; }
  get access() { return this.#access; }
  get auto_approve_docs() { return this.#auto_approve_docs; }
  get created_at() { return this.#created_at; }
  get updated_at() { return this.#updated_at; }

  toJSON() {
    return {
      id: this.#id,
      name: this.#name,
      avatar_url: this.#avatar_url,
      description: this.#description,
      access: this.#access,
      auto_approve_docs: this.#auto_approve_docs,
      created_at: this.#created_at,
      updated_at: this.#updated_at,
    };
  }
}
