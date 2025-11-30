export default class RolePermission {
  #roleId;
  #permissionId;

  constructor(row = {}) {
    this.#roleId = row.role_id;
    this.#permissionId = row.permission_id;
  }

  get roleId() { return this.#roleId; }
  get permissionId() { return this.#permissionId; }
}
