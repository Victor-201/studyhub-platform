export default class UserRole {
  #id;
  #userId;
  #roleId;
  #assignedAt;
  #revokedAt;

  constructor(row = {}) {
    this.#id = row.id;
    this.#userId = row.user_id;
    this.#roleId = row.role_id;
    this.#assignedAt = row.assigned_at ? new Date(row.assigned_at) : null;
    this.#revokedAt = row.revoked_at ? new Date(row.revoked_at) : null;
  }

  get id() { return this.#id; }
  get userId() { return this.#userId; }
  get roleId() { return this.#roleId; }
  get assignedAt() { return this.#assignedAt; }
  get revokedAt() { return this.#revokedAt; }
}
