export default class OAuthProvider {
  #id;
  #name;
  #clientId;
  #clientSecret;
  #createdAt;

  constructor(row = {}) {
    this.#id = row.id;
    this.#name = row.name;
    this.#clientId = row.client_id;
    this.#clientSecret = row.client_secret;
    this.#createdAt = row.created_at ? new Date(row.created_at) : null;
  }

  get id() { return this.#id; }
  get name() { return this.#name; }
  get clientId() { return this.#clientId; }
  get clientSecret() { return this.#clientSecret; }
  get createdAt() { return this.#createdAt; }
}
