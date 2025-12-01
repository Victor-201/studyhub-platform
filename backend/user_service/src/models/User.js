export default class User {
  #id;
  #display_name;
  #full_name;
  #avatar_url;
  #status;

  constructor(row = {}) {
    this.#id = row.id;
    this.#display_name = row.display_name;
    this.#full_name = row.full_name;
    this.#avatar_url = row.avatar_url;
    this.#status = row.status;
  }

  get id() { return this.#id; }
  get display_name() { return this.#display_name; }
  get full_name() { return this.#full_name; }
  get avatar_url() { return this.#avatar_url; }
  get status() { return this.#status; }

  set display_name(val) { this.#display_name = val; }
  set full_name(val) { this.#full_name = val; }
  set avatar_url(val) { this.#avatar_url = val; }
  set status(val) { this.#status = val; }

  toJSON() {
    return {
      id: this.#id,
      display_name: this.#display_name,
      full_name: this.#full_name,
      avatar_url: this.#avatar_url,
      status: this.#status,
    };
  }
}
