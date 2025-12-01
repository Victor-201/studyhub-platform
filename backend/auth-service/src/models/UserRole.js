export default class UserRole {
  #id;
  #user_id;
  #role_id;
  #assigned_at;
  #revoked_at;

  constructor(row = {}) {
    this.#id = row.id;
    this.#user_id = row.user_id;
    this.#role_id = row.role_id;
    this.#assigned_at = row.assigned_at ? new Date(row.assigned_at) : null;
    this.#revoked_at = row.revoked_at ? new Date(row.revoked_at) : null;
  }

  get id() { return this.#id; }
  get user_id() { return this.#user_id; }
  get role_id() { return this.#role_id; }
  get assigned_at() { return this.#assigned_at; }
  get revoked_at() { return this.#revoked_at; }
}
