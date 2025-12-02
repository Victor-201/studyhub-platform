export default class OAuthProvider {
  #id;
  #name;
  #client_id;
  #client_secret;
  #created_at;

  constructor(row = {}) {
    this.#id = row.id;
    this.#name = row.name;
    this.#client_id = row.client_id;
    this.#client_secret = row.client_secret;
    this.#created_at = row.created_at ? new Date(row.created_at) : null;
  }

  get id() { return this.#id; }
  get name() { return this.#name; }
  get client_id() { return this.#client_id; }
  get client_secret() { return this.#client_secret; }
  get created_at() { return this.#created_at; }

  toJSON() {
    return {
      id: this.#id,
      name: this.#name,
      client_id: this.#client_id,
      client_secret: this.#client_secret,
      created_at: this.#created_at,
    };
  }
}
