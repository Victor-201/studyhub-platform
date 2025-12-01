export default class UserSocialLinks {
  #id;
  #user_id;
  #platform;
  #url;
  #created_at;
  #updated_at;

  constructor(row = {}) {
    this.#id = row.id;
    this.#user_id = row.user_id;
    this.#platform = row.platform;
    this.#url = row.url;
    this.#created_at = row.created_at;
    this.#updated_at = row.updated_at;
  }

  get id() { return this.#id; }
  get user_id() { return this.#user_id; }
  get platform() { return this.#platform; }
  get url() { return this.#url; }
  get created_at() { return this.#created_at; }
  get updated_at() { return this.#updated_at; }

  toJSON() {
    return {
      id: this.#id,
      user_id: this.#user_id,
      platform: this.#platform,
      url: this.#url,
      created_at: this.#created_at,
      updated_at: this.#updated_at,
    };
  }
}
