export default class User {
  #id;
  #user_name;
  #password_hash;
  #status;
  #last_login_at;
  #created_at;
  #updated_at;

  constructor(row = {}) {
    this.#id = row.id;
    this.#user_name = row.user_name;
    this.#password_hash = row.password_hash;
    this.#status = row.status;
    this.#last_login_at = row.last_login_at ? new Date(row.last_login_at) : null;
    this.#created_at = row.created_at ? new Date(row.created_at) : null;
    this.#updated_at = row.updated_at ? new Date(row.updated_at) : null;
  }

  get id() { return this.#id; }
  get user_name() { return this.#user_name; }
  get password_hash() { return this.#password_hash; }
  get status() { return this.#status; }
  get last_login_at() { return this.#last_login_at; }
  get created_at() { return this.#created_at; }
  get updated_at() { return this.#updated_at; }
}
