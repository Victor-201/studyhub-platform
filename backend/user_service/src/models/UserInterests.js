export default class UserInterests {
  #id;
  #user_id;
  #interest;
  #created_at;

  constructor(row = {}) {
    this.#id = row.id;
    this.#user_id = row.user_id;
    this.#interest = row.interest;
    this.#created_at = row.created_at;
  }

  get id() { return this.#id; }
  get user_id() { return this.#user_id; }
  get interest() { return this.#interest; }
  get created_at() { return this.#created_at; }

  toJSON() {
    return {
      id: this.#id,
      user_id: this.#user_id,
      interest: this.#interest,
      created_at: this.#created_at,
    };
  }
}
