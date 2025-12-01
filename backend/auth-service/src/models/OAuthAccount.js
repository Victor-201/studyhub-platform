export default class OAuthAccount {
  #id;
  #user_id;
  #provider;
  #provider_user_id;
  #provider_data;
  #created_at;

  constructor(row = {}) {
    this.#id = row.id;
    this.#user_id = row.user_id;
    this.#provider = row.provider;
    this.#provider_user_id = row.provider_user_id;
    this.#provider_data = row.provider_data;
    this.#created_at = row.created_at ? new Date(row.created_at) : null;
  }

  get id() { return this.#id; }
  get user_id() { return this.#user_id; }
  get provider() { return this.#provider; }
  get provider_user_id() { return this.#provider_user_id; }
  get provider_data() { return this.#provider_data; }
  get created_at() { return this.#created_at; }
}
