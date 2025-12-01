export default class UserEmail {
  #id;
  #user_id;
  #email;
  #type;
  #is_verified;
  #created_at;
  #updated_at;

  constructor(row = {}) {
    this.#id = row.id;
    this.#user_id = row.user_id;
    this.#email = row.email;
    this.#type = row.type;
    this.#is_verified = row.is_verified;
    this.#created_at = row.created_at ? new Date(row.created_at) : null;
    this.#updated_at = row.updated_at ? new Date(row.updated_at) : null;
  }

  get id() { return this.#id; }
  get user_id() { return this.#user_id; }
  get email() { return this.#email; }
  get type() { return this.#type; }
  get is_verified() { return this.#is_verified; }
  get created_at() { return this.#created_at; }
  get updated_at() { return this.#updated_at; }
}
