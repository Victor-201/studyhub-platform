export default class UserDeletion {
  #id;
  #user_id;
  #deleted_by;
  #reason;
  #created_at;
  #restored_at;
  #restored_by;

  constructor(row = {}) {
    this.#id = row.id;
    this.#user_id = row.user_id;
    this.#deleted_by = row.deleted_by;
    this.#reason = row.reason;
    this.#created_at = row.created_at ? new Date(row.created_at) : null;
    this.#restored_at = row.restored_at ? new Date(row.restored_at) : null;
    this.#restored_by = row.restored_by;
  }

  get id() { return this.#id; }
  get user_id() { return this.#user_id; }
  get deleted_by() { return this.#deleted_by; }
  get reason() { return this.#reason; }
  get created_at() { return this.#created_at; }
  get restored_at() { return this.#restored_at; }
  get restored_by() { return this.#restored_by; }
}
