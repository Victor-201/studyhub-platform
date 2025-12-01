export default class RolePermission {
  #role_id;
  #permission_id;

  constructor(row = {}) {
    this.#role_id = row.role_id;
    this.#permission_id = row.permission_id;
  }

  get role_id() { return this.#role_id; }
  get permission_id() { return this.#permission_id; }
}
